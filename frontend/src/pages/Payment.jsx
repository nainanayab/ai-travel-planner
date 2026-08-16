import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  FaArrowLeft,
  FaCreditCard,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";

function Payment() {
  const navigate = useNavigate();
  const { tripId } = useParams();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (
      !form.cardName ||
      !form.cardNumber ||
      !form.expiry ||
      !form.cvv
    ) {
      Swal.fire({
        title: "Incomplete Details",
        text: "Please fill in all payment details.",
        icon: "warning",
        confirmButtonColor: "#2563eb",
      });

      return;
    }

    setProcessing(true);

    // Demo payment processing
    setTimeout(() => {
      setProcessing(false);

      Swal.fire({
        title: "Payment Successful!",
        text: "Your trip payment has been completed successfully.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      }).then(() => {
        navigate(`/my-trips/${tripId}`);
      });
    }, 1500);
  };

  return (
    <div className="payment-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="payment-header">

        <div className="payment-header-inner">

          <button
            type="button"
            className="payment-back-btn"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            Back
          </button>

          <div className="payment-title">

            <div className="payment-title-icon">
              <FaCreditCard />
            </div>

            <div>
              <span>SECURE CHECKOUT</span>
              <h1>Trip Payment</h1>
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="payment-container">

        <div className="payment-grid">

          {/* =================================================
              PAYMENT FORM
          ================================================= */}

          <div className="payment-card">

            <div className="payment-card-heading">

              <div>
                <span>PAYMENT DETAILS</span>
                <h2>Choose Payment Method</h2>
              </div>

              <FaLock />

            </div>

            {/* METHODS */}

            <div className="payment-methods">

              <button
                type="button"
                className={
                  paymentMethod === "card"
                    ? "payment-method active"
                    : "payment-method"
                }
                onClick={() =>
                  setPaymentMethod("card")
                }
              >
                <FaCreditCard />

                <div>
                  <strong>Card Payment</strong>
                  <small>Visa / Mastercard</small>
                </div>
              </button>

            </div>

            {/* FORM */}

            <form onSubmit={handlePayment}>

              <div className="payment-form-group">

                <label>
                  Cardholder Name
                </label>

                <input
                  type="text"
                  name="cardName"
                  placeholder="Enter cardholder name"
                  value={form.cardName}
                  onChange={handleChange}
                />

              </div>

              <div className="payment-form-group">

                <label>
                  Card Number
                </label>

                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  value={form.cardNumber}
                  onChange={handleChange}
                />

              </div>

              <div className="payment-two-columns">

                <div className="payment-form-group">

                  <label>
                    Expiry Date
                  </label>

                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={form.expiry}
                    onChange={handleChange}
                  />

                </div>

                <div className="payment-form-group">

                  <label>
                    CVV
                  </label>

                  <input
                    type="password"
                    name="cvv"
                    placeholder="•••"
                    maxLength="4"
                    value={form.cvv}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <button
                type="submit"
                className="pay-now-btn"
                disabled={processing}
              >

                {processing ? (
                  <>
                    <span className="payment-button-spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Pay Securely
                  </>
                )}

              </button>

            </form>

            <div className="payment-security">

              <FaLock />

              <span>
                Your payment information is securely
                processed and protected.
              </span>

            </div>

          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div className="payment-summary">

            <div className="payment-summary-header">

              <span>ORDER SUMMARY</span>

              <FaCheckCircle />

            </div>

            <h2>Inside City Trip</h2>

            <div className="payment-summary-trip">

              <span>Trip ID</span>

              <strong>#{tripId}</strong>

            </div>

            <div className="payment-summary-line">
              <span>Place Tickets</span>
              <strong>Rs. 0</strong>
            </div>

            <div className="payment-summary-line">
              <span>Bus Ticket</span>
              <strong>Rs. 0</strong>
            </div>

            <div className="payment-summary-divider"></div>

            <div className="payment-summary-total">

              <span>Total Amount</span>

              <strong>
                Rs. 0
              </strong>

            </div>

            <div className="payment-note">

              <FaLock />

              <p>
                You are being redirected from your
                saved trip to secure checkout.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Payment;