import orderModel from "../models/orderModel.js";

// 🔒 Get all booked/locked date slots for a specific vehicle
export const getBikeBookedSlotsController = async (req, res) => {
  try {
    const { bikeId } = req.params;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Fetch all active orders for this bike where endDate >= today and status != 'Cancelled'
    const bookedOrders = await orderModel
      .find({
        bikes: bikeId,
        status: { $ne: "Cancelled" },
        endDate: { $gte: today },
      })
      .select("startDate endDate status");

    res.status(200).send({
      success: true,
      bookedSlots: bookedOrders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch vehicle availability slots",
      error: error.message,
    });
  }
};

// registering orders from users with concurrency & date overlap locking
export const makeOrderController = async (req, res) => {
  try {
    const { bikeId, totalAmt, startDate, endDate } = req.body;

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
    // Check if this bike is already booked during the requested date range
    // Overlap formula: (existing.startDate <= newEndDate) AND (existing.endDate >= newStartDate)
    const conflictingOrder = await orderModel.findOne({
      bikes: bikeId,
      status: { $ne: "Cancelled" },
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });

    if (conflictingOrder) {
      return res.status(409).send({
        success: false,
        alreadyBooked: true,
        message: `This vehicle is already booked and locked from ${conflictingOrder.startDate} to ${conflictingOrder.endDate}. Please choose different dates or select another vehicle.`,
      });
    }

    const order = new orderModel({
      renter: req.user._id,
      bikes: bikeId,
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
      .find({ renter: req.user._id })
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
      .find({})
      .populate("bikes", "-photo")
      .populate("renter", "name")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Fetched all orders successfully",
      orders,
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

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
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

    if (!orderId || !paymentId) {
      return res.status(400).send({
        success: false,
        message: "orderId and paymentId are required",
      });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status: "Delivered", paymentId },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Order payment verified and status updated",
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
