import React, { useState } from "react";
import styles from "../Pages.module.css";
function Payment(props) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Payment Details:", { cardNumber, expiryDate, cvv, amount });
    // Process the payment here
  };

  return (
    <div className={styles.paymentContainer}>
      <form onSubmit={handleSubmit} className={styles.paymentForm}>
        <h2>Payment</h2>
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Expiry Date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
}

export default Payment;
