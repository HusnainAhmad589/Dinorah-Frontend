import { apiFetch } from "./api";
import { Order, CheckoutFormData, OrderStatus } from "../types/order.types";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}

/**
 * Submit checkout to place a Cash on Delivery order
 */
export async function placeOrder(formData: CheckoutFormData): Promise<Order> {
  const response = await apiFetch<ApiResponse<Order>>("/orders", {
    method: "POST",
    data: formData,
  });
  return response.data;
}

/**
 * Fetch authenticated customer's own order history
 */
export async function fetchUserOrders(): Promise<Order[]> {
  const response = await apiFetch<ApiResponse<Order[]>>("/orders", {
    method: "GET",
  });
  return response.data;
}

/**
 * Fetch single order details (for customer or admin)
 */
export async function fetchOrderDetails(orderId: number): Promise<Order> {
  const response = await apiFetch<ApiResponse<Order>>(`/orders/${orderId}`, {
    method: "GET",
  });
  return response.data;
}

/**
 * Admin: Fetch all customer orders with optional status filter
 */
export async function fetchAdminOrders(statusFilter?: string): Promise<Order[]> {
  const query = statusFilter && statusFilter !== "all" ? `?status=${encodeURIComponent(statusFilter)}` : "";
  const response = await apiFetch<ApiResponse<Order[]>>(`/admin/orders${query}`, {
    method: "GET",
  });
  return response.data;
}

/**
 * Admin: Update order status
 */
export async function updateAdminOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
  const response = await apiFetch<ApiResponse<Order>>(`/admin/orders/${orderId}/status`, {
    method: "PUT",
    data: { status },
  });
  return response.data;
}
