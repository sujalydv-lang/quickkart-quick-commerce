package com.blinkit.quickcommerce.entity;

public enum OrderStatus {
    PLACED,
    CONFIRMED,
    PACKED,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED;

    /** Statuses in which an order is still in progress. */
    public static boolean isActive(OrderStatus status) {
        return status == PLACED || status == CONFIRMED || status == PACKED || status == OUT_FOR_DELIVERY;
    }
}
