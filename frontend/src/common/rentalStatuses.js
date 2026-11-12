// Paid vehicle rental lifecycle statuses (orders only appear after payment succeeds)
export const RENTAL_STATUS_OPTIONS = [
  "Booked (Pending Approval)",
  "Approved",
  "Riding",
  "Returned",
  "Did Not Ride",
  "Rejected",
];

export const LEGACY_STATUS_MAP = {
  "Not Processed": "Booked (Pending Approval)",
  "Payment Pending": "Booked (Pending Approval)",
  Processing: "Booked (Pending Approval)",
  "In Process": "Booked (Pending Approval)",
  Shipped: "Riding",
  "Active Ride": "Riding",
  Delivered: "Returned",
  "Cancelled (Invalid Proof)": "Rejected",
  Cancelled: "Rejected",
};

export const RENTAL_STATUS_COLORS = {
  "Booked (Pending Approval)": "orange",
  Approved: "blue",
  Riding: "cyan",
  Returned: "green",
  "Did Not Ride": "purple",
  Rejected: "red",
};

export const normalizeRentalStatus = (status) => {
  if (!status) return "Booked (Pending Approval)";
  return LEGACY_STATUS_MAP[status] || status;
};
