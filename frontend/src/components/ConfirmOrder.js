import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AddOrder } from "../redux/features/Order/orderAction";
import { toast } from "react-hot-toast";
import queryString from "query-string";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Extract query params
  const { bikeId, from, to } = queryString.parse(location.search);

  useEffect(() => {
    if (!bikeId || !from || !to) {
      navigate("/");
      return;
    }

    const placeOrder = async () => {
      const formData = {
        bikeId,
        startDate: from,
        endDate: to,
      };
      const data = await dispatch(AddOrder(formData));
      if (data.error) {
        toast.error("Order failed!");
      } else {
        toast.success("Order placed successfully!");
        navigate("/");
      }
    };

    placeOrder();
  }, [bikeId, from, to]);

  return <h2 className="text-center">Placing your order...</h2>;
};

export default ConfirmOrder;
