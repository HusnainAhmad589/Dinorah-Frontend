import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/store";
import { clearCustomerCart } from "../store/slices/cartSlice";
import { useAuth } from "../hooks/useAuth";
import { placeOrder } from "../services/order.service";
import { CheckoutFormData, Order } from "../types/order.types";
import {
  LockOutlined,
  LocalShippingOutlined,
  VerifiedUserOutlined,
  CheckCircleOutlined,
  PaymentsOutlined,
  ArrowBackOutlined,
  ShoppingBagOutlined,
} from "@mui/icons-material";
import { CircularProgress, Alert, Dialog, DialogContent } from "@mui/material";

/* ─── tiny reusable input styles ─── */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  border: "1px solid #D5CBC0",
  backgroundColor: "#FFFFFF",
  fontSize: "14px",
  color: "#2B211D",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fontWeight: 600,
  color: "#61564F",
  marginBottom: "5px",
  display: "block",
};

const sectionCard: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #EAE2D7",
  borderRadius: "16px",
  padding: "28px 28px",
  boxShadow: "0 2px 12px rgba(43,33,29,0.04)",
};

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const cartItems = useAppSelector((state) => state.cart.items);
  const subtotal = useAppSelector((state) => state.cart.subtotal);
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!formData.name.trim() || formData.name.length < 2) {
      setError("Please provide a valid full name (min 2 characters).");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 6) {
      setError("Please provide a valid phone number.");
      return;
    }
    if (!formData.address.trim() || formData.address.length < 5) {
      setError("Please enter a complete street address.");
      return;
    }
    if (!formData.city.trim() || formData.city.length < 2) {
      setError("Please specify the delivery city.");
      return;
    }
    if (!formData.postalCode.trim() || formData.postalCode.length < 2) {
      setError("Please specify the postal / ZIP code.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const order = await placeOrder(formData);
      setPlacedOrder(order);
      setSuccessModalOpen(true);
      dispatch(clearCustomerCart());
    } catch (err: any) {
      setError(
        err.message || "Failed to place order. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── Empty cart guard ── */
  if (cartItems.length === 0 && !successModalOpen) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            backgroundColor: "#FFFFFF",
            border: "1px solid #EAE2D7",
            borderRadius: "24px",
            padding: "64px 40px",
            maxWidth: "480px",
            width: "100%",
            boxShadow: "0 8px 32px rgba(43,33,29,0.05)",
          }}
        >
          <ShoppingBagOutlined
            sx={{ fontSize: 56, color: "#C2BAAF", mb: 2 }}
          />
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "28px",
              color: "#2B211D",
              margin: "0 0 10px 0",
            }}
          >
            Your Cart is Empty
          </h2>
          <p
            style={{
              color: "#81766E",
              fontSize: "13px",
              marginBottom: "28px",
            }}
          >
            Explore our curated collections before checkout.
          </p>
          <button
            onClick={() => navigate("/products")}
            style={{
              backgroundColor: "#2B211D",
              color: "#F8F5F0",
              padding: "12px 32px",
              borderRadius: "9999px",
              border: "none",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Discover Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#F8F5F0",
        minHeight: "100vh",
        paddingBottom: "80px",
      }}
    >
      {/* ── Page container ── */}
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "32px 24px 0",
        }}
      >
        {/* Back link */}
        <button
          onClick={() => navigate("/cart")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: "#81766E",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            marginBottom: "20px",
            padding: 0,
            letterSpacing: "0.08em",
          }}
        >
          <ArrowBackOutlined sx={{ fontSize: 15 }} />
          Back to Shopping Cart
        </button>

        {/* Page header */}
        <div style={{ marginBottom: "28px" }}>
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#B4935A",
              fontWeight: 600,
              display: "block",
              marginBottom: "4px",
            }}
          >
            Secure Private Checkout
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "32px",
              color: "#2B211D",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Shipping & White-Glove Dispatch
          </h1>
        </div>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: "12px" }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* ── Main two-column grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "28px",
            alignItems: "start",
          }}
        >
          {/* ══ LEFT — Form ══ */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Section 1 — Recipient */}
            <div style={sectionCard}>
              <SectionTitle number={1} title="Recipient Information" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                }}
              >
                <Field label="Full Name *">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Maria De Luca"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Email Address *">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="e.g. maria@example.com"
                    style={inputStyle}
                  />
                </Field>
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Phone Number (for courier notification) *">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="e.g. +39 06 6987 4125"
                      style={inputStyle}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Section 2 — Address */}
            <div style={sectionCard}>
              <SectionTitle number={2} title="Shipping Destination" />
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <Field label="Street Address & Suite / Floor *">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Via Condotti 42, Piano 3, Apt 12"
                    style={inputStyle}
                  />
                </Field>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                  }}
                >
                  <Field label="City *">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Rome"
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Postal / ZIP Code *">
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 00187"
                      style={inputStyle}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Section 3 — Payment */}
            <div style={sectionCard}>
              <SectionTitle number={3} title="Payment Method" />
              <div
                style={{
                  border: "1.5px solid #B4935A",
                  backgroundColor: "#FBF7F0",
                  borderRadius: "12px",
                  padding: "18px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#FFF",
                    padding: "9px",
                    borderRadius: "9px",
                    color: "#B4935A",
                    flexShrink: 0,
                  }}
                >
                  <PaymentsOutlined sx={{ fontSize: 24 }} />
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{ fontSize: "14px", fontWeight: 600, color: "#2B211D" }}
                    >
                      Cash on Delivery (COD)
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        backgroundColor: "#E8F5E9",
                        color: "#2E7D32",
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        fontWeight: 700,
                      }}
                    >
                      Supported
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "12.5px",
                      color: "#81766E",
                      margin: 0,
                      lineHeight: 1.55,
                    }}
                  >
                    Pay safely in cash upon arrival. Our certified armored
                    courier will deliver your Dinorah piece in tamper-evident
                    luxury packaging.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Place Order CTA ── */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: "4px" }}>
              <button
                type="submit"
                disabled={loading || totalQuantity === 0}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  backgroundColor:
                    loading || totalQuantity === 0 ? "#B0A89F" : "#2B211D",
                  color: "#F8F5F0",
                  padding: "16px 48px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor:
                    loading || totalQuantity === 0 ? "not-allowed" : "pointer",
                  boxShadow:
                    loading || totalQuantity === 0
                      ? "none"
                      : "0 6px 24px rgba(43,33,29,0.22)",
                  transition: "all 0.25s ease",
                  minWidth: "320px",
                }}
                onMouseEnter={(e) => {
                  if (!loading && totalQuantity > 0) {
                    e.currentTarget.style.backgroundColor = "#3D2F28";
                    e.currentTarget.style.boxShadow =
                      "0 10px 32px rgba(43,33,29,0.32)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2B211D";
                  e.currentTarget.style.boxShadow =
                    "0 6px 24px rgba(43,33,29,0.22)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={16} sx={{ color: "#F8F5F0" }} />
                    <span>Securing Order...</span>
                  </>
                ) : (
                  <>
                    <LockOutlined sx={{ fontSize: 16 }} />
                    <span>
                      Place Order —{" "}
                      {subtotal.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                      })}{" "}
                      (COD)
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ══ RIGHT — Order Summary (sticky) ══ */}
          <div style={{ position: "sticky", top: "100px" }}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EAE2D7",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 2px 16px rgba(43,33,29,0.05)",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "20px",
                  color: "#2B211D",
                  margin: "0 0 16px 0",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #EAE2D7",
                  fontWeight: 500,
                }}
              >
                Order Review{" "}
                <span style={{ color: "#B4935A" }}>
                  ({totalQuantity} {totalQuantity === 1 ? "Piece" : "Pieces"})
                </span>
              </h3>

              {/* Items list */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  maxHeight: "280px",
                  overflowY: "auto",
                  marginBottom: "16px",
                }}
              >
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    style={{ display: "flex", gap: "12px", alignItems: "center" }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "52px",
                        height: "52px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #EAE2D7",
                        backgroundColor: "#F2EDE6",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#2B211D",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "#81766E", marginTop: "2px" }}>
                        Qty: {item.quantity} ×{" "}
                        {Number(item.price).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#2B211D",
                        flexShrink: 0,
                      }}
                    >
                      {(Number(item.price) * item.quantity).toLocaleString(
                        "en-US",
                        { style: "currency", currency: "USD", minimumFractionDigits: 2 }
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div
                style={{
                  borderTop: "1px solid #EAE2D7",
                  paddingTop: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <Row
                  label="Subtotal"
                  value={subtotal.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                  })}
                />
                <Row label="Courier Dispatch" value="Complimentary" green />
                <Row label="Payment" value="Cash on Delivery" />
              </div>

              {/* Total */}
              <div
                style={{
                  marginTop: "14px",
                  paddingTop: "14px",
                  borderTop: "1px solid #EAE2D7",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontSize: "10.5px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#2B211D",
                  }}
                >
                  Total Payable
                </span>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "24px",
                    fontWeight: 600,
                    color: "#2B211D",
                  }}
                >
                  {subtotal.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Trust badges */}
              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "14px",
                  borderTop: "1px solid #F0EAE3",
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                <TrustBadge icon={<VerifiedUserOutlined sx={{ fontSize: 14, color: "#B4935A" }} />}>
                  Certificate of Authenticity & Gemological Dossier
                </TrustBadge>
                <TrustBadge icon={<LocalShippingOutlined sx={{ fontSize: 14, color: "#B4935A" }} />}>
                  Insured White-Glove Armored Courier
                </TrustBadge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Success Dialog ── */}
      <Dialog
        open={successModalOpen}
        onClose={() => {}}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px",
              padding: "16px",
              backgroundColor: "#FCFAF8",
            },
          },
        }}
      >
        <DialogContent sx={{ textAlign: "center", py: 4 }}>
          <CheckCircleOutlined sx={{ fontSize: 60, color: "#2E7D32", mb: 1.5 }} />
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "30px",
              color: "#2B211D",
              margin: "0 0 8px 0",
            }}
          >
            Order Successfully Placed!
          </h2>
          <span
            style={{
              display: "inline-block",
              backgroundColor: "#F4EFEA",
              color: "#B4935A",
              padding: "5px 16px",
              borderRadius: "9999px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              marginBottom: "14px",
            }}
          >
            ORDER #DIN-{placedOrder?.id.toString().padStart(5, "0")}
          </span>
          <p
            style={{
              fontSize: "13.5px",
              color: "#61564F",
              lineHeight: 1.6,
              maxWidth: "420px",
              margin: "0 auto 20px auto",
            }}
          >
            Thank you, <strong>{placedOrder?.customerName}</strong>! Your order
            is registered under <strong>Cash on Delivery</strong>. Our atelier
            concierge will contact you at{" "}
            <strong>{placedOrder?.customerPhone}</strong> to confirm dispatch to{" "}
            {placedOrder?.city}.
          </p>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE2D7",
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "10px", color: "#81766E", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Total
              </div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#2B211D", marginTop: "3px" }}>
                {placedOrder?.totalAmount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "10px", color: "#81766E", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Status
              </div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#B4935A", marginTop: "3px", textTransform: "capitalize" }}>
                {placedOrder?.status}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "10px", color: "#81766E", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Payment
              </div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#2B211D", marginTop: "3px" }}>
                Cash on Delivery
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              onClick={() => {
                setSuccessModalOpen(false);
                navigate("/orders");
              }}
              style={{
                backgroundColor: "#2B211D",
                color: "#F8F5F0",
                padding: "12px 28px",
                borderRadius: "9999px",
                border: "none",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              View My Orders
            </button>
            <button
              onClick={() => {
                setSuccessModalOpen(false);
                navigate("/products");
              }}
              style={{
                backgroundColor: "transparent",
                color: "#2B211D",
                padding: "12px 24px",
                borderRadius: "9999px",
                border: "1px solid #D5CBC0",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Continue Shopping
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ─── small helper components ─── */
function SectionTitle({ number, title }: { number: number; title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "18px",
        paddingBottom: "12px",
        borderBottom: "1px solid #EAE2D7",
      }}
    >
      <span
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: "#2B211D",
          color: "#F8F5F0",
          fontSize: "11px",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {number}
      </span>
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "19px",
          color: "#2B211D",
          margin: 0,
          fontWeight: 500,
        }}
      >
        {title}
      </h3>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "12.5px",
        color: "#81766E",
      }}
    >
      <span>{label}</span>
      <span
        style={{
          color: green ? "#2E7D32" : "#2B211D",
          fontWeight: green ? 700 : 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function TrustBadge({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        fontSize: "11px",
        color: "#81766E",
      }}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
}
