import { apiFetch } from "./client";
import type { Wishlist } from "./types";

export function getWishlist(): Promise<Wishlist> {
  return apiFetch<Wishlist>("/api/wishlist", { auth: true });
}

export function addToWishlist(toyId: string): Promise<Wishlist> {
  return apiFetch<Wishlist>("/api/wishlist", {
    method: "POST",
    body: { toyId },
    auth: true,
  });
}

export function removeFromWishlist(itemId: string): Promise<void> {
  return apiFetch<void>(`/api/wishlist/${itemId}`, {
    method: "DELETE",
    auth: true,
  });
}

export interface SendWishlistPayload {
  parentName: string;
  parentEmail: string;
  message?: string;
}

export function sendWishlistToParent(payload: SendWishlistPayload): Promise<Wishlist> {
  return apiFetch<Wishlist>("/api/wishlist/send", {
    method: "POST",
    body: payload,
    auth: true,
  });
}
