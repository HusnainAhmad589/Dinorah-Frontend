import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders, fetchOrderDetails } from "../services/order.service";
import { Order, OrderStatus } from "../types/order.types";
import {
  LocalShippingOutlined,
  PaymentsOutlined,
  CheckCircleOutlined,
  ScheduleOutlined,
  HourglassEmptyOutlined,
  CancelOutlined,
  ArrowForwardOutlined,
  CloseOutlined,
  Inventory2Outlined,
  DiamondOutlined,
} from "@mui/icons-material";
import {
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

/* ─── Status config ─── */
const STATUS_CONFIG: Record<
  OrderStatus,
  { bg: string; color: string; dot: string; icon: React.ReactNode; label: string }
> = {
  pending: {
    bg: "#FFF8E1",
    color: "#B78103",
    dot: "#F9A825",
    icon: <HourglassEmptyOutlined sx={{ fontSize: 13 }} />,
    label: "Pending Confirmation",
  },
  confirmed: {
    bg: "#E3F2FD",
    color: "#1565C0",
    dot: "#1976D2",
    icon: <ScheduleOutlined sx={{ fontSize: 13 }} />,
    label: "Confirmed & In Preparation",
  },
  shipped: {
    bg: "#EDE7F6",
    color: "#5E35B1",
    dot: "#7B1FA2",
    icon: <LocalShippingOutlined sx={{ fontSize: 13 }} />,
    label: "Dispatched via Armored Courier",
  },
  delivered: {
    bg: "#E8F5E9",
    color: "#2E7D32",
    dot: "#43A047",
    icon: <CheckCircleOutlined sx={{ fontSize: 13 }} />,
    label: "Delivered & Signed",
  },
  cancelled: {
    bg: "#FFEBEE",
    color: "#C62828",
    dot: "#E53935",
    icon: <CancelOutlined sx={{ fontSize: 13 }} />,
    label: "Cancelled",
  },
};

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (orderId: number) => {
    try {
      setDetailsModalOpen(true);
      setLoadingDetails(true);
      const fullOrder = await fetchOrderDetails(orderId);
      setSelectedOrder(fullOrder);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve order details.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          backgroundColor: cfg.bg,
          color: cfg.color,
          padding: "4px 10px",
          borderRadius: "9999px",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.04em",
        }}
      >
        {cfg.icon}
        {cfg.label}
      </span>
    );
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
        }}
      >
        <CircularProgress sx={{ color: "#B4935A" }} size={36} />
        <p style={{ color: "#81766E", fontSize: "13px", margin: 0 }}>
          Retrieving your acquisitions…
        </p>
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
      <div
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          padding: "40px 24px 0",
        }}
      >
        {/* ── Header ── */}
        <div style={{ marginBottom: "32px" }}>
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
            Customer Portal
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "34px",
              color: "#2B211D",
              margin: "0 0 6px 0",
              fontWeight: 400,
            }}
          >
            My Orders & Acquisitions
          </h1>
          <p style={{ color: "#81766E", fontSize: "13px", margin: 0 }}>
            Track the status and details of your jewellery acquisitions.
          </p>
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

        {/* ── Empty state ── */}
        {orders.length === 0 ? (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE2D7",
              borderRadius: "20px",
              padding: "72px 32px",
              textAlign: "center",
              boxShadow: "0 2px 16px rgba(43,33,29,0.04)",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: "rgba(180,147,90,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto",
              }}
            >
              <Inventory2Outlined sx={{ fontSize: 36, color: "#B4935A" }} />
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "26px",
                color: "#2B211D",
                margin: "0 0 10px 0",
                fontWeight: 400,
              }}
            >
              No Orders Found
            </h2>
            <p
              style={{
                color: "#81766E",
                fontSize: "13px",
                maxWidth: "380px",
                margin: "0 auto 28px auto",
                lineHeight: 1.6,
              }}
            >
              You haven't placed any jewellery orders yet. Explore our
              handcrafted pieces to begin your collection.
            </p>
            <button
              onClick={() => navigate("/products")}
              style={{
                backgroundColor: "#2B211D",
                color: "#F8F5F0",
                padding: "13px 32px",
                borderRadius: "9999px",
                border: "none",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(43,33,29,0.18)",
              }}
            >
              Explore Collection
            </button>
          </div>
        ) : (
          /* ── Orders list ── */
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #EAE2D7",
                  borderRadius: "16px",
                  padding: "22px 24px",
                  boxShadow: "0 2px 12px rgba(43,33,29,0.04)",
                }}
              >
                {/* Top row: order number + status + total */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "10px",
                    paddingBottom: "14px",
                    borderBottom: "1px solid #F0EAE3",
                    marginBottom: "14px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: "19px",
                          fontWeight: 600,
                          color: "#2B211D",
                        }}
                      >
                        Order #DIN-{order.id.toString().padStart(5, "0")}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div
                      style={{
                        fontSize: "11.5px",
                        color: "#81766E",
                        marginTop: "4px",
                      }}
                    >
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#81766E",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        fontWeight: 600,
                        marginBottom: "2px",
                      }}
                    >
                      Total
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "22px",
                        fontWeight: 600,
                        color: "#2B211D",
                      }}
                    >
                      {order.totalAmount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>

                {/* Items preview + Details button */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "14px",
                  }}
                >
                  {/* Item thumbnails */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    {order.items.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          backgroundColor: "#F8F5F0",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "1px solid #EAE2D7",
                        }}
                      >
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            style={{
                              width: "30px",
                              height: "30px",
                              objectFit: "cover",
                              borderRadius: "5px",
                            }}
                          />
                        ) : (
                          <DiamondOutlined
                            sx={{ fontSize: 18, color: "#B4935A" }}
                          />
                        )}
                        <div>
                          <div
                            style={{
                              fontSize: "11.5px",
                              fontWeight: 500,
                              color: "#2B211D",
                              maxWidth: "140px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.productName}
                          </div>
                          <div style={{ fontSize: "10px", color: "#81766E" }}>
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#61564F",
                          fontWeight: 500,
                          backgroundColor: "#F0EAE3",
                          padding: "6px 10px",
                          borderRadius: "8px",
                        }}
                      >
                        +{order.items.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Details CTA */}
                  <button
                    onClick={() => handleOpenDetails(order.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#2B211D",
                      color: "#F8F5F0",
                      padding: "10px 20px",
                      borderRadius: "9999px",
                      border: "none",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      boxShadow: "0 3px 12px rgba(43,33,29,0.15)",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#3D2F28";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#2B211D";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Order Details
                    <ArrowForwardOutlined sx={{ fontSize: 13 }} />
                  </button>
                </div>

                {/* Footer: payment + shipping destination */}
                <div
                  style={{
                    paddingTop: "12px",
                    borderTop: "1px solid #F0EAE3",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                    fontSize: "11.5px",
                    color: "#81766E",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    <PaymentsOutlined sx={{ fontSize: 14, color: "#B4935A" }} />
                    <span>
                      Payment:{" "}
                      <strong style={{ color: "#2B211D" }}>
                        Cash on Delivery
                      </strong>
                    </span>
                  </div>
                  <div>
                    Ship to:{" "}
                    <strong style={{ color: "#2B211D" }}>{order.city}</strong>
                    {order.shippingAddress && (
                      <span>
                        {" "}
                        ({order.shippingAddress.slice(0, 28)}
                        {order.shippingAddress.length > 28 ? "…" : ""})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Order Details Modal ── */}
      <Dialog
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "18px",
              backgroundColor: "#FCFAF8",
              overflow: "hidden",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #EAE2D7",
            py: 2,
            px: 3,
            backgroundColor: "#FFFFFF",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#B4935A",
                fontWeight: 600,
                display: "block",
                marginBottom: "2px",
              }}
            >
              Acquisition Dossier
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "22px",
                color: "#2B211D",
                fontWeight: 600,
              }}
            >
              Order #DIN-
              {selectedOrder?.id.toString().padStart(5, "0") ?? "…"}
            </span>
          </div>
          <IconButton
            onClick={() => setDetailsModalOpen(false)}
            size="small"
            sx={{ color: "#81766E" }}
          >
            <CloseOutlined sx={{ fontSize: 18 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: 3, pb: 3 }}>
          {loadingDetails || !selectedOrder ? (
            <div
              style={{
                minHeight: "180px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress sx={{ color: "#B4935A" }} size={32} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Status + Payment + Total */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #EAE2D7",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#81766E",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                      marginBottom: "6px",
                    }}
                  >
                    Status
                  </div>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#81766E",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                      marginBottom: "6px",
                    }}
                  >
                    Payment
                  </div>
                  <div
                    style={{ fontSize: "13px", fontWeight: 600, color: "#2B211D" }}
                  >
                    Cash on Delivery
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#81766E",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    Total Payable
                  </div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#2B211D",
                    }}
                  >
                    {selectedOrder.totalAmount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>

              {/* Line items */}
              <div>
                <h4
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "18px",
                    color: "#2B211D",
                    margin: "0 0 10px 0",
                    fontWeight: 500,
                  }}
                >
                  Ordered Items ({selectedOrder.itemCount})
                </h4>
                <div
                  style={{
                    border: "1px solid #EAE2D7",
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "14px 18px",
                        borderBottom:
                          idx < selectedOrder.items.length - 1
                            ? "1px solid #F0EAE3"
                            : "none",
                      }}
                    >
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #EAE2D7",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "8px",
                            backgroundColor: "#F2EDE6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <DiamondOutlined sx={{ fontSize: 22, color: "#B4935A" }} />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{ fontSize: "13.5px", fontWeight: 600, color: "#2B211D" }}
                        >
                          {item.productName}
                        </div>
                        <div
                          style={{ fontSize: "11.5px", color: "#81766E", marginTop: "2px" }}
                        >
                          Unit:{" "}
                          {item.unitPrice.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                          })}{" "}
                          · Qty: {item.quantity}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 700,
                          color: "#2B211D",
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        {item.subtotal.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipient + Shipping */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #EAE2D7",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#81766E",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                      marginBottom: "6px",
                    }}
                  >
                    Recipient
                  </div>
                  <div
                    style={{ fontSize: "13.5px", fontWeight: 600, color: "#2B211D" }}
                  >
                    {selectedOrder.customerName}
                  </div>
                  <div style={{ fontSize: "12px", color: "#81766E", marginTop: "2px" }}>
                    {selectedOrder.customerEmail}
                  </div>
                  <div style={{ fontSize: "12px", color: "#81766E" }}>
                    {selectedOrder.customerPhone}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#81766E",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                      marginBottom: "6px",
                    }}
                  >
                    Delivery Destination
                  </div>
                  <div
                    style={{ fontSize: "13.5px", fontWeight: 600, color: "#2B211D" }}
                  >
                    {selectedOrder.shippingAddress}
                  </div>
                  <div style={{ fontSize: "12px", color: "#81766E", marginTop: "2px" }}>
                    {selectedOrder.city}
                    {selectedOrder.postalCode
                      ? `, ${selectedOrder.postalCode}`
                      : ""}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#2E7D32",
                      fontWeight: 600,
                      marginTop: "4px",
                    }}
                  >
                    Complimentary Armored Courier
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
