import React, { useEffect } from "react";
import { axiosInstance } from "./axios";
import globalState from "./globalState";

const CashfreePayment = ({ orderId, customerName, customerEmail, amount }) => {
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setLoggedInUser = globalState((state) => state.setLoggedInUser);
  const response = async () => {
    try {
      // setLoading(true);
      const result = await axiosInstance.get(`/user/getLoggedInuser`);
      setLoggedInUser(result.data.user);
      // setUser(result.data.user);
      // setLoading(false);
    } catch (err) {
      // navigate("/login");
    }
  };
  useEffect(() => {
    if (!loggedInUser) {
      response();
    }
  }, [loggedInUser]);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      const response = await axiosInstance.post("/payment/createOrder", { orderId: "4", customerName: loggedInUser.name, customerEmail: loggedInUser.email, amount: 1 });
      console.log("response.data: ", response);

      if (response.success) {
        window.Cashfree.pay({ paymentSessionId: response.paymentSessionId });
      } else {
        console.error("Error creating order:", response.message);
      }
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div>
      <h2>Pay with Cashfree</h2>
      <button onClick={handlePayment} className="pay-button bg-blue-500 w-[120px] h-[40px]">
        Pay ₹{amount}
      </button>
    </div>
  );
};

export default CashfreePayment;
