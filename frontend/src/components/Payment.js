// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Card, Button, Typography, Radio, message } from "antd";

// const { Title, Paragraph } = Typography;

// const Payment = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [paymentMethod, setPaymentMethod] = useState("credit_card");

//   const handlePayment = () => {
//     message.success("Payment Successful! ");
//     navigate("/"); // Redirect to homepage or order confirmation page
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//         backgroundColor: "#f5f5f5",
//         padding: "20px",
//       }}
//     >
//       <Card
//         title={<Title level={3} style={{ textAlign: "center" }}>Payment</Title>}
//         bordered={false}
//         style={{
//           maxWidth: 500,
//           width: "100%",
//           backgroundColor: "#fff",
//           boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//           borderRadius: 10,
//           padding: 24,
//         }}
//       >
//         <Paragraph style={{ textAlign: "center", fontSize: "16px" }}>
//           Total Amount: <strong>₹1500</strong>
//         </Paragraph>

//         <Radio.Group
//           onChange={(e) => setPaymentMethod(e.target.value)}
//           value={paymentMethod}
//           style={{ width: "100%", marginBottom: "20px" }}
//         >
//           <Radio value="credit_card">Credit/Debit Card</Radio>
//           <Radio value="upi">UPI</Radio>
//           <Radio value="net_banking">Net Banking</Radio>
//         </Radio.Group>

//         <Button
//           type="primary"
//           block
//           onClick={handlePayment}
//           style={{ backgroundColor: "#52c41a", color: "white", fontWeight: "bold" }}
//         >
//           Pay Now
//         </Button>
//       </Card>
//     </div>
//   );
// };

// export default Payment; //order is not shown




/*import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Typography, message } from "antd";

const { Title, Paragraph } = Typography;

const Payment = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(1500); // You can make this dynamic if needed

  useEffect(() => {
    // Razorpay script injection (in case it's not in public/index.html)
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      const res = await fetch("/api/payment/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }), // amount in rupees
      });

      const data = await res.json();

      if (!data.success) {
        message.error("Failed to create Razorpay order");
        return;
      }

      const options = {
        key: data.key, // your Razorpay public key
        amount: data.amount, // in paise (multiply by 100 on backend)
        currency: "INR",
        name: "Bike Rental",
        description: "Bike Rental Payment",
        order_id: data.orderId,
        handler: function (response) {
          message.success("Payment Successful!");
          navigate("/"); // redirect to home or success page
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#52c41a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      message.error("Payment initiation failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Card
        title={<Title level={3} style={{ textAlign: "center" }}>Payment</Title>}
        bordered={false}
        style={{
          maxWidth: 500,
          width: "100%",
          backgroundColor: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          borderRadius: 10,
          padding: 24,
        }}
      >
        <Paragraph style={{ textAlign: "center", fontSize: "16px" }}>
          Total Amount: <strong>₹{amount}</strong>
        </Paragraph>

        <Button
          type="primary"
          block
          onClick={handlePayment}
          style={{
            backgroundColor: "#52c41a",
            color: "white",
            fontWeight: "bold",
            marginTop: 20,
          }}
        >
          Pay with Razorpay
        </Button>
      </Card>
    </div>
  );
};

export default Payment; */
//razorPay frontend


import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Typography, Radio, message } from "antd";

const { Title, Paragraph } = Typography;

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  const handlePayment = () => {
    message.success("Payment Successful! ");
    navigate("/"); // Redirect to homepage or order confirmation page
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Card
        title={<Title level={3} style={{ textAlign: "center" }}>Payment</Title>}
        bordered={false}
        style={{
          maxWidth: 500,
          width: "100%",
          backgroundColor: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          borderRadius: 10,
          padding: 24,
        }}
      >
        <Paragraph style={{ textAlign: "center", fontSize: "16px" }}>
          Total Amount: <strong>₹1500</strong>
        </Paragraph>

        <Radio.Group
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
          style={{ width: "100%", marginBottom: "20px" }}
        >
          <Radio value="credit_card">Credit/Debit Card</Radio>
          <Radio value="upi">UPI</Radio>
          <Radio value="net_banking">Net Banking</Radio>
        </Radio.Group>

        <Button
          type="primary"
          block
          onClick={handlePayment}
          style={{ backgroundColor: "#52c41a", color: "white", fontWeight: "bold" }}
        >
          Pay Now
        </Button>
      </Card>
    </div>
  );
};

export default Payment;

