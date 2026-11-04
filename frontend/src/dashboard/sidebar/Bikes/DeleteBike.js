import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { deleteBike } from "../../../redux/features/Bikes/bikeAction";
import { clearFields } from "../../../redux/features/Bikes/bikeSlice";

export const DeleteBike = ({ setShowModal, id }) => {
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.bike);

  // Close modal when deletion is successful
  useEffect(() => {
    if (success) {
      toast.success("Bike deleted successfully");
      dispatch(clearFields());
      setTimeout(() => setShowModal(false), 500); // ✅ Ensures proper re-render
    }
  }, [success, dispatch, setShowModal]);

  return (
    <>
      {error && toast.error(error)}

      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Modal Box */}
        <div className="bg-white shadow-lg rounded-lg w-96 p-6 relative">
          <p className="text-lg text-gray-700 text-center">
            Are you sure you want to delete?
          </p>
          <div className="flex justify-center mt-4">
            {/* YES Button */}
            <button
              className="bg-red-500 text-white px-6 py-2 rounded mr-2"
              type="button"
              onClick={() => dispatch(deleteBike(id))}
            >
              Yes
            </button>

            {/* NO Button */}
            <button
              className="bg-green-500 text-white px-6 py-2 rounded"
              type="button"
              onClick={() => setShowModal(false)} // ✅ Now works properly
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black opacity-60 z-40"></div>
    </>
  );
};
