import { createAsyncThunk } from "@reduxjs/toolkit";
import Http from "../../../Helper/Http";

// Fetch all orders
export const AllOrder = createAsyncThunk(
  "order/all",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await Http.get("/api/v1/order/allorders");
      return data.orders; // Fixed response data structure
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch orders of a particular renter
export const GetOrder = createAsyncThunk(
  "order/get",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await Http.get("/api/v1/order/orders");
      return data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add a new order
export const AddOrder = createAsyncThunk(
  "order/add",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await Http.post("/api/v1/order/make-order", formData);
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update order status (admin)
export const updateStatus = createAsyncThunk(
  "order/update",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await Http.put(`/api/v1/order/order-status/${orderId}`, {
        status,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
