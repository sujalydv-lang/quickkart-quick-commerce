package com.blinkit.quickcommerce.dto;

import com.blinkit.quickcommerce.entity.OrderStatus;
import com.blinkit.quickcommerce.entity.PaymentMethod;
import jakarta.validation.constraints.Size;

/** Partial update for an order: any field left null is unchanged. */
public class OrderUpdateRequest {

    private OrderStatus status;

    @Size(max = 100)
    private String deliverySlot;

    private PaymentMethod paymentMethod;

    @Size(max = 500)
    private String deliveryAddress;

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public String getDeliverySlot() { return deliverySlot; }
    public void setDeliverySlot(String deliverySlot) { this.deliverySlot = deliverySlot; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
}
