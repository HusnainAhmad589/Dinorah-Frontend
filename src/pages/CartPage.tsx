import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/store";
import { clearCustomerCart } from "../store/slices/cartSlice";
import { CartItem } from "../components/cart/CartItem";
import { CartSummary } from "../components/cart/CartSummary";
import {
  ArrowBackOutlined,
  DeleteSweepOutlined,
  DiamondOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import { Alert, Dialog, DialogContent } from "@mui/material";

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.cart.items);
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const error = useAppSelector((state) => state.cart.error);

  const [clearModalOpen, setClearModalOpen] = useState(false);

  const handleClearCart = () => setClearModalOpen(true);

  const confirmClear = () => {
    dispatch(clearCustomerCart());
    setClearModalOpen(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F8F5F0",
        paddingTop: "40px",
        paddingBottom: "100px",
      }}
    >
      <div style={{ maxWidth: "1380px", margin: "0 auto", padding: "0 24px" }}>
        {/* Navigation & Breadcrumbs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <button
            onClick={() => navigate("/products")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#81766E",
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
              padding: "6px 0",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2B211D")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#81766E")}
          >
            <ArrowBackOutlined sx={{ fontSize: 16 }} />
            Continue Browsing
          </button>

          <nav style={{ fontSize: "12px", color: "#81766E", letterSpacing: "0.08em" }}>
            <Link to="/" style={{ color: "#81766E", textDecoration: "none" }}>
              Home
            </Link>{" "}
            /{" "}
            <Link to="/products" style={{ color: "#81766E", textDecoration: "none" }}>
              Catalog
            </Link>{" "}
            /{" "}
            <span style={{ color: "#2B211D", fontWeight: 500 }}>Shopping Bag ({totalQuantity})</span>
          </nav>
        </div>

        {/* Page Title & Counter */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "36px",
            borderBottom: "1px solid #EAE2D7",
            paddingBottom: "20px",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "40px",
                fontWeight: 300,
                color: "#2B211D",
                margin: "0 0 6px 0",
              }}
            >
              Your Atelier <span style={{ fontStyle: "italic", color: "#B4935A" }}>Selection</span>
            </h1>
            <p style={{ fontSize: "13px", color: "#81766E", margin: 0 }}>
              Review your curated pieces before completing private reservation.
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "transparent",
                border: "1px solid #E2D9CE",
                borderRadius: "9999px",
                padding: "8px 16px",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#81766E",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#d32f2f";
                e.currentTarget.style.borderColor = "#d32f2f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#81766E";
                e.currentTarget.style.borderColor = "#E2D9CE";
              }}
            >
              <DeleteSweepOutlined sx={{ fontSize: 16 }} />
              Clear Selection
            </button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert severity="warning" sx={{ mb: 4, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {items.length === 0 ? (
          <div
            style={{
              backgroundColor: "#FCFAF8",
              borderRadius: "24px",
              border: "1px solid #EAE2D7",
              padding: "80px 24px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(43, 33, 29, 0.03)",
              maxWidth: "680px",
              margin: "40px auto",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "rgba(180, 147, 90, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px auto",
              }}
            >
              <DiamondOutlined sx={{ fontSize: 40, color: "#B4935A" }} />
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "32px",
                fontWeight: 400,
                color: "#2B211D",
                marginBottom: "12px",
              }}
            >
              Your Shopping Bag is Empty
            </h2>

            <p
              style={{
                fontSize: "14px",
                color: "#81766E",
                maxWidth: "440px",
                margin: "0 auto 32px auto",
                lineHeight: 1.6,
              }}
            >
              Discover handcrafted solitaire rings, diamond chandelier earrings, and high joaillerie colliers in our atelier catalog.
            </p>

            <button
              onClick={() => navigate("/products")}
              style={{
                backgroundColor: "#2B211D",
                color: "#F8F5F0",
                padding: "14px 32px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(43, 33, 29, 0.2)",
                transition: "all 0.2s ease",
              }}
            >
              Explore Collection
            </button>
          </div>
        ) : (
          /* Active Cart Grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "40px",
              alignItems: "start",
            }}
          >
            {/* Left Column: List of Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {items.map((item) => (
                <CartItem key={item.id || item.productId} item={item} />
              ))}
            </div>

            {/* Right Column: Order Summary & Checkout */}
            <div style={{ position: "sticky", top: "100px" }}>
              <CartSummary />
            </div>
          </div>
        )}
      </div>

      {/* ── Clear Selection Confirmation Modal ── */}
      <Dialog
        open={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px",
              backgroundColor: "#FCFAF8",
              boxShadow: "0 24px 60px rgba(43,33,29,0.18)",
              overflow: "hidden",
            },
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {/* Top accent bar */}
          <div
            style={{
              height: "4px",
              background: "linear-gradient(90deg, #B4935A, #D4AF72)",
            }}
          />

          <div style={{ padding: "32px 28px 28px" }}>
            {/* Icon */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: "#FFF3E0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto",
              }}
            >
              <WarningAmberOutlined sx={{ fontSize: 28, color: "#E65100" }} />
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "24px",
                color: "#2B211D",
                margin: "0 0 10px 0",
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              Clear Your Selection?
            </h2>

            {/* Body */}
            <p
              style={{
                fontSize: "13px",
                color: "#81766E",
                textAlign: "center",
                lineHeight: 1.65,
                margin: "0 0 28px 0",
              }}
            >
              This will remove all{" "}
              <strong style={{ color: "#2B211D" }}>
                {totalQuantity} {totalQuantity === 1 ? "piece" : "pieces"}
              </strong>{" "}
              from your shopping bag. This action cannot be undone.
            </p>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setClearModalOpen(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "9999px",
                  border: "1px solid #D5CBC0",
                  backgroundColor: "transparent",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#2B211D",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F2EDE6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Keep Items
              </button>
              <button
                onClick={confirmClear}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "9999px",
                  border: "none",
                  backgroundColor: "#C62828",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(198,40,40,0.25)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#B71C1C";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#C62828";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartPage;
