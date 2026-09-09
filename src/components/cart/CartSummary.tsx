import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import {
  LockOutlined,
  LocalShippingOutlined,
  VerifiedUserOutlined,
} from "@mui/icons-material";

export const CartSummary: React.FC = () => {
  const navigate = useNavigate();
  const subtotal = useAppSelector((state) => state.cart.subtotal);
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div
      style={{
        backgroundColor: "#FCFAF8",
        borderRadius: "20px",
        border: "1px solid #EAE2D7",
        padding: "32px",
        boxShadow: "0 10px 30px rgba(43, 33, 29, 0.04)",
      }}
    >
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "24px",
          fontWeight: 400,
          color: "#2B211D",
          margin: "0 0 20px 0",
          borderBottom: "1px solid #EAE2D7",
          paddingBottom: "16px",
        }}
      >
        Acquisition Summary
      </h3>

      {/* Breakdown Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#81766E" }}>
          <span>Selected Pieces ({totalQuantity})</span>
          <span style={{ color: "#2B211D", fontWeight: 500 }}>
            ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#81766E" }}>
          <span>Insured Armored Courier</span>
          <span style={{ color: "#2E7D32", fontWeight: 600 }}>COMPLIMENTARY</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#81766E" }}>
          <span>Estimated Sales Tax</span>
          <span style={{ color: "#2B211D" }}>Calculated at checkout</span>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #EAE2D7",
          paddingTop: "20px",
          marginBottom: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span style={{ fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: "#2B211D" }}>
          Estimated Total
        </span>
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "28px",
            fontWeight: 600,
            color: "#2B211D",
          }}
        >
          ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={totalQuantity === 0}
        style={{
          width: "100%",
          backgroundColor: totalQuantity === 0 ? "#C2BAAF" : "#2B211D",
          color: "#F8F5F0",
          padding: "16px",
          borderRadius: "9999px",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          border: "none",
          cursor: totalQuantity === 0 ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          boxShadow: totalQuantity > 0 ? "0 4px 18px rgba(43, 33, 29, 0.2)" : "none",
          transition: "all 0.25s ease",
        }}
      >
        <LockOutlined sx={{ fontSize: 16 }} />
        Proceed to Private Checkout
      </button>

      {/* Luxury Trust Indicators */}
      <div
        style={{
          marginTop: "24px",
          paddingTop: "20px",
          borderTop: "1px solid #EFEAE3",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#81766E" }}>
          <VerifiedUserOutlined sx={{ fontSize: 16, color: "#B4935A" }} />
          <span>Dinorah Certified Atelier Authenticity Guarantee</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#81766E" }}>
          <LocalShippingOutlined sx={{ fontSize: 16, color: "#B4935A" }} />
          <span>Complimentary 30-Day Atelier Returns & Resizing</span>
        </div>
      </div>
    </div>
  );
};

