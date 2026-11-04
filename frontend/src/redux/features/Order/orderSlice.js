import { createSlice } from "@reduxjs/toolkit";
import { AddOrder, AllOrder, GetOrder, updateStatus } from "./orderAction";

const initialState = {
  loading: false,
  error: null,
  success: false,
  orders: [],
  orderById: null,
  userOrders: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearFields: (state) => {
      state.success = false;
      state.loading = false;
      state.error = null;
      state.orderById = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Order
      .addCase(AddOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AddOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(AddOrder.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Get All Orders
      .addCase(AllOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AllOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.orders = payload;
      })
      .addCase(AllOrder.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Get Orders for a Specific Renter
      .addCase(GetOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userOrders = payload;
      })
      .addCase(GetOrder.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Update Order Status by Admin
      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        const updatedOrder = state.orders.find(
          (order) => order._id === payload._id
        );
        if (updatedOrder) {
          updatedOrder.status = payload.status;
        }
      })
      .addCase(updateStatus.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearFields } = orderSlice.actions;
export default orderSlice.reducer;
