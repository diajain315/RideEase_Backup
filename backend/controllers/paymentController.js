// import { instance } from "../server.js"
// export const processPayment = async (req, res) => {
//     try {
//       const options = {
//         amount: Number(req.body.amount * 100), // Razorpay expects amount in paise
//         currency: "INR"
//       };
  
//       const order = await instance.orders.create(options);
  
//       res.status(200).json({
//         success: true,
//         order
//       });
//     } catch (error) {
//       console.error("❌ Error in processPayment:", error);
//       res.status(500).json({
//         success: false,
//         message: "Payment processing failed",
//         error: error.message
//       });
//     }
//   };
  
  
//   export const getKey = async (req, res) => {
//     try {
//       res.status(200).json({
//         key: process.env.RAZORPAY_API_KEY
//       });
//     } catch (error) {
//       console.error("❌ Error in getKey:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to retrieve Razorpay key"
//       });
//     }
//   };
import { instance } from "../server.js"
export const processPayment = async (req, res) => {
    try {
      const rawAmount = Number(req.body.amount);
      const validAmount = isNaN(rawAmount) || rawAmount <= 0 ? 100 : rawAmount;
      const options = {
        amount: Math.round(validAmount * 100), // in paise
        currency: "INR"
      };    
  
      const order = await instance.orders.create(options);
  
      res.status(200).json({
        success: true,
        order
      });
    } catch (error) {
      console.error("❌ Error in processPayment:", error);
      res.status(500).json({
        success: false,
        message: "Payment processing failed",
        error: error.message
      });
    }
  };
  
  
  export const getKey = async (req, res) => {
    try {
      res.status(200).json({
        key: process.env.RAZORPAY_API_KEY
      });
    } catch (error) {
      console.error("❌ Error in getKey:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve Razorpay key"
      });
    }
  };
