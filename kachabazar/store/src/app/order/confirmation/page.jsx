"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const invoice = searchParams.get("invoice");
  const trackingId = searchParams.get("trackingId");

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4 bg-background">
      <div className="max-w-lg w-full bg-card rounded-2xl shadow-xl border border-border p-8 text-center">
        {/* Success Icon */}
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10">
          <svg
            className="w-10 h-10 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Order Confirmed! 🎉
        </h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your order. Your order has been placed successfully.
        </p>

        {/* Order Details */}
        <div className="bg-muted/50 rounded-xl p-5 mb-6 space-y-3">
          {invoice && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Invoice</span>
              <span className="text-sm font-semibold text-foreground">
                #{invoice}
              </span>
            </div>
          )}
          {trackingId && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tracking ID</span>
              <span className="text-sm font-mono font-semibold text-primary">
                {trackingId}
              </span>
            </div>
          )}
        </div>

        {trackingId && (
          <p className="text-xs text-muted-foreground mb-6">
            Save your tracking ID to check your order status anytime.
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Continue Shopping
          </Link>
          {trackingId && (
            <Link
              href={`/order/tracking?id=${trackingId}`}
              className="flex-1 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-sm font-medium text-primary-foreground transition-colors"
            >
              Track Order
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
