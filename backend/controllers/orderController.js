import orderModel, {
  RENTAL_STATUSES,
  PENDING_CHECKOUT_STATUSES,
  ACTIVE_LOCKING_STATUSES,
} from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

// 🔒 Get all booked/locked date slots for a specific vehicle
export const getBikeBookedSlotsController = async (req, res) => {
  try {
    const { bikeId } = req.params;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const checkoutExpiryTime = new Date(Date.now() - 15 * 60 * 1000); // 15 mins ago

    // Attempt to extract logged in user id if token is provided
    let currentUserId = null;
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
        if (token) {
          const decode = JWT.verify(token, process.env.JWT_SECRET);
          if (decode?._id) {
            currentUserId = decode._id.toString();
          }
        }
      }
    } catch (_) {
      // Unauthenticated check is fine for public availability
    }

    // Active booked slots:
    // 1. Confirmed orders where endDate >= today
    // 2. In-progress checkouts created within last 15 minutes where endDate >= today
    const bookedOrders = await orderModel
      .find({
        bikes: bikeId,
        endDate: { $gte: today },
        $or: [
          { status: { $in: ACTIVE_LOCKING_STATUSES } },
          { status: { $in: PENDING_CHECKOUT_STATUSES }, createdAt: { $gte: checkoutExpiryTime } },
        ],
      })
      .select("startDate endDate status renter totalAmt createdAt");

    const slots = bookedOrders.map((order) => {
      const isPendingHold = PENDING_CHECKOUT_STATUSES.includes(order.status);
      const isOwnHold = Boolean(
        currentUserId &&
          isPendingHold &&
          order.renter &&
          order.renter.toString() === currentUserId
      );

      const holdExpiresAt = isPendingHold
        ? new Date(new Date(order.createdAt).getTime() + 15 * 60 * 1000).toISOString()
        : null;

      return {
        _id: order._id,
        startDate: order.startDate,
        endDate: order.endDate,
        status: order.status,
        totalAmt: order.totalAmt,
        createdAt: order.createdAt,
        isOwnHold,
        holdExpiresAt,
      };
    });

    res.status(200).send({
      success: true,
      bookedSlots: slots,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch vehicle availability slots",
      error: error.message,
    });
  }
};

// 🗑️ Cancel / Release temporary checkout hold early
export const cancelHoldController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?._id;

    if (!orderId) {
      return res.status(400).send({
        success: false,
        message: "Order ID is required to cancel hold",
      });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Booking hold not found or already released",
      });
    }

    // Ensure only the renter or admin can cancel an unconfirmed checkout hold
    if (order.renter?.toString() !== userId?.toString() && req.user?.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized to cancel this hold",
      });
    }

    // Only allow cancelling unconfirmed hold orders (not confirmed / paid bookings)
    if (!PENDING_CHECKOUT_STATUSES.includes(order.status)) {
      return res.status(400).send({
        success: false,
        message: "Only unconfirmed checkout holds can be released.",
      });
    }

    await orderModel.findByIdAndDelete(orderId);

    res.status(200).send({
      success: true,
      message: "Booking hold released and dates unlocked successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while releasing booking hold",
      error: error.message,
    });
  }
};

// registering orders from users with concurrency & date overlap locking
export const makeOrderController = async (req, res) => {
  try {
    const { bikeId, totalAmt, startDate, endDate } = req.body;

    // Verify user has an authentic Driving License on record
    const user = await userModel.findById(req.user._id);
    const hasLicense = Boolean(user && (user.licenseNumber || (user.licenseFile && user.licenseFile.data)));
    if (!hasLicense && req.user.role !== 1) {
      return res.status(403).send({
        success: false,
        requiresLicense: true,
        message: "You must have a verified Driving License uploaded to book a vehicle.",
      });
    }

    // Validations
    if (!bikeId || !totalAmt || !startDate || !endDate) {
      return res.status(400).send({
        success: false,
        message: "All fields are required (bikeId, totalAmt, startDate, endDate)",
      });
    }

    if (startDate > endDate) {
      return res.status(400).send({
        success: false,
        message: "Rental start date cannot be after end date",
      });
    }

    // 🛑 STRICT LOCK: Prevent simultaneous and overlapping bookings
    // Only lock dates if an order is confirmed (Processing, Shipped, Delivered)
    // OR if an active checkout session was started within the last 15 minutes.
    // Abandoned checkouts older than 15 minutes do not block bookings.
    const checkoutExpiryTime = new Date(Date.now() - 15 * 60 * 1000);

    const conflictingOrder = await orderModel.findOne({
      bikes: bikeId,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
      $or: [
        { status: { $in: ACTIVE_LOCKING_STATUSES } },
        { status: { $in: PENDING_CHECKOUT_STATUSES }, createdAt: { $gte: checkoutExpiryTime } },
      ],
    });

    if (conflictingOrder) {
      const isPendingHold = PENDING_CHECKOUT_STATUSES.includes(conflictingOrder.status);
      const isOwnHold = isPendingHold && conflictingOrder.renter?.toString() === req.user._id.toString();

      if (isOwnHold) {
        // Reuse & update the user's own active hold order
        conflictingOrder.totalAmt = totalAmt;
        conflictingOrder.startDate = startDate;
        conflictingOrder.endDate = endDate;
        conflictingOrder.createdAt = new Date();
        await conflictingOrder.save();

        return res.status(200).send({
          success: true,
          message: "Existing checkout hold resumed and updated successfully",
          order: conflictingOrder,
        });
      }

      // Conflict belongs to another user or confirmed booking
      return res.status(409).send({
        success: false,
        alreadyBooked: true,
        message: `This vehicle is already booked and locked from ${conflictingOrder.startDate} to ${conflictingOrder.endDate}. Please choose different dates or select another vehicle.`,
      });
    }

    const order = new orderModel({
      renter: req.user._id,
      bikes: bikeId,
      status: "Checkout Hold",
      totalAmt,
      startDate,
      endDate,
    });

    await order.save();

    res.status(201).send({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while creating the order",
      error: error.message,
    });
  }
};

// Order of a single user
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ renter: req.user._id, status: { $nin: PENDING_CHECKOUT_STATUSES } })
      .populate("bikes", "-photo")
      .populate("renter", "name");

    res.status(200).send({
      success: true,
      message: "Successfully fetched all orders of this user",
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while fetching user orders",
      error: error.message,
    });
  }
};

// All orders for admin dashboard
export const AllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ status: { $nin: PENDING_CHECKOUT_STATUSES } })
      .populate("bikes", "-photo")
      .populate("renter", "name email phone licenseNumber")
      .sort({ createdAt: -1 });

    const renterIds = orders
      .map((o) => o.renter?._id)
      .filter((id) => Boolean(id));

    // Find users who have either licenseFile.data or licenseNumber
    let licenseUserSet = new Set();
    if (renterIds.length > 0) {
      const usersWithLicense = await userModel
        .find(
          {
            _id: { $in: renterIds },
            $or: [
              { "licenseFile.data": { $exists: true, $ne: null } },
              { licenseNumber: { $exists: true, $ne: "" } },
            ],
          },
          "_id"
        )
        .lean();

      licenseUserSet = new Set(usersWithLicense.map((u) => u._id.toString()));
    }

    const ordersWithLicenseInfo = orders.map((order) => {
      const orderObj = order.toObject();
      if (orderObj.renter) {
        orderObj.renter.hasLicense = licenseUserSet.has(orderObj.renter._id.toString());
      }
      return orderObj;
    });

    res.status(200).send({
      success: true,
      message: "Fetched all orders successfully",
      orders: ordersWithLicenseInfo,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while fetching all orders",
      error: error.message,
    });
  }
};

// Update order status (admin)
export const updateStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).send({
        success: false,
        message: "Status field is required",
      });
    }

    if (!RENTAL_STATUSES.includes(status)) {
      return res.status(400).send({
        success: false,
        message: `Invalid rental status. Allowed values: ${RENTAL_STATUSES.join(", ")}`,
      });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Order status updated successfully",
      updatedOrder,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while updating order status",
      error: error.message,
    });
  }
};

// Razorpay payment success controller
export const razorpaySuccessController = async (req, res) => {
  try {
    const { orderId, paymentId } = req.body;
    const userId = req.user?._id;

    if (!orderId || !paymentId) {
      return res.status(400).send({
        success: false,
        message: "orderId and paymentId are required",
      });
    }

    if (!userId) {
      return res.status(401).send({
        success: false,
        message: "Authentication required to confirm payment",
      });
    }

    // Verify Driving License on record
    const user = await userModel.findById(userId);
    const hasLicense = Boolean(user && (user.licenseNumber || (user.licenseFile && user.licenseFile.data)));
    if (!hasLicense) {
      return res.status(403).send({
        success: false,
        noLicense: true,
        message: "Cannot confirm booking without a verified Driving License on record.",
      });
    }

    // Find order and verify ownership
    const existingOrder = await orderModel.findById(orderId);
    if (!existingOrder) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }

    if (existingOrder.renter.toString() !== userId.toString() && req.user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized to update this order",
      });
    }

    // Mark as confirmed booking in Processing state (awaiting pickup)
    // Mark as confirmed booking in "In Process" state (awaiting proof check & vehicle pickup)
    existingOrder.status = "Booked (Pending Approval)";
    existingOrder.paymentId = paymentId;
    const updatedOrder = await existingOrder.save();

    res.status(200).send({
      success: true,
      message: "Order payment verified and confirmed successfully",
      updatedOrder,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to update payment info",
      error: error.message,
    });
  }
};
