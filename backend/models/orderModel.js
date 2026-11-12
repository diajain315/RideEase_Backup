import mongoose from "mongoose";

// Paid vehicle rental lifecycle statuses exposed to Admin & Customer UI
export const RENTAL_STATUSES = [
  "Booked (Pending Approval)",
  "Approved",
  "Riding",
  "Returned",
  "Did Not Ride",
  "Rejected",
];

// Internal pre-payment checkout lock statuses (never exposed as paid bookings)
export const PENDING_CHECKOUT_STATUSES = [
  "Checkout Hold",
  "Payment Pending",
  "Not Processed",
];

export const ACTIVE_LOCKING_STATUSES = [
  "Booked (Pending Approval)",
  "Approved",
  "Riding",
  "In Process",
  "Active Ride",
  "Processing",
  "Shipped",
];

export const COMPLETED_OR_ACTIVE_RENTAL_STATUSES = [
  "Booked (Pending Approval)",
  "Approved",
  "Riding",
  "Returned",
  "In Process",
  "Active Ride",
  "Processing",
  "Shipped",
  "Delivered",
];

const orderSchema = new mongoose.Schema(
  {
    bikes: {
      type: mongoose.ObjectId,
      ref: "Bikes",
    },

    renter: {
      type: mongoose.ObjectId,
      ref: "Users",
    },
    status: {
      type: String,
      default: "Checkout Hold",
      enum: [
        ...RENTAL_STATUSES,
        ...PENDING_CHECKOUT_STATUSES,
        "In Process",
        "Active Ride",
        "Cancelled (Invalid Proof)",
        "Cancelled",
        "Processing",
        "Shipped",
        "Delivered",
      ],
    },
    paymentId: {
      type: String,
      default: "",
    },
    totalAmt: {
      type: Number,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Orders", orderSchema);
