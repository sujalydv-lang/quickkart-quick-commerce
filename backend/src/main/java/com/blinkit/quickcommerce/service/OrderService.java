package com.blinkit.quickcommerce.service;

import com.blinkit.quickcommerce.dto.OrderItemRequest;
import com.blinkit.quickcommerce.dto.OrderRequest;
import com.blinkit.quickcommerce.dto.OrderUpdateRequest;
import com.blinkit.quickcommerce.entity.Customer;
import com.blinkit.quickcommerce.entity.Order;
import com.blinkit.quickcommerce.entity.OrderItem;
import com.blinkit.quickcommerce.entity.OrderStatus;
import com.blinkit.quickcommerce.entity.PaymentMethod;
import com.blinkit.quickcommerce.entity.Product;
import com.blinkit.quickcommerce.exception.ApiException;
import com.blinkit.quickcommerce.repository.CustomerRepository;
import com.blinkit.quickcommerce.repository.OrderRepository;
import com.blinkit.quickcommerce.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        CustomerRepository customerRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public Page<Order> getAll(String search, OrderStatus status, Pageable pageable) {
        if (status != null) {
            return orderRepository.findByStatus(status, pageable);
        }
        // A numeric search is treated as a customer id; anything else lists all orders.
        if (search != null && !search.isBlank()) {
            try {
                return orderRepository.findByCustomerId(Long.parseLong(search.trim()), pageable);
            } catch (NumberFormatException ignored) {
                // fall through to findAll
            }
        }
        return orderRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Order not found with id " + id));
    }

    /**
     * Creates an order: validates every item (quantity 1-20, stock available),
     * decrements stock, and computes the total from the items' prices.
     */
    public Order create(OrderRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> ApiException.notFound("Customer not found with id " + request.getCustomerId()));
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw ApiException.badRequest("Order must contain at least one item");
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PLACED);
        order.setDeliverySlot(request.getDeliverySlot());
        order.setPaymentMethod(request.getPaymentMethod() == null ? PaymentMethod.UPI : request.getPaymentMethod());
        order.setDeliveryAddress(request.getDeliveryAddress() == null
                ? customer.getAddress() : request.getDeliveryAddress());

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();
        for (OrderItemRequest itemRequest : request.getItems()) {
            validateQuantity(itemRequest.getQuantity());
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> ApiException.notFound("Product not found with id " + itemRequest.getProductId()));
            if (itemRequest.getQuantity() > product.getStockQuantity()) {
                throw ApiException.badRequest("Not enough stock for '" + product.getName()
                        + "': requested " + itemRequest.getQuantity()
                        + ", available " + product.getStockQuantity());
            }
            // Decrement stock — no overselling.
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);

            OrderItem item = new OrderItem(order, product, itemRequest.getQuantity(), product.getPrice());
            items.add(item);
            total = total.add(item.getLineTotal());
        }
        order.setTotalAmount(total);
        order.setItems(items);
        return orderRepository.save(order);
    }

    /**
     * Updates status / delivery details. Cancelling restores stock;
     * re-activating a cancelled order re-checks and re-decrements stock.
     */
    public Order update(Long id, OrderUpdateRequest request) {
        Order order = getById(id);
        OrderStatus oldStatus = order.getStatus();

        if (request.getStatus() != null && request.getStatus() != oldStatus) {
            if (request.getStatus() == OrderStatus.CANCELLED && oldStatus != OrderStatus.CANCELLED) {
                restoreStock(order);
            } else if (oldStatus == OrderStatus.CANCELLED && request.getStatus() != OrderStatus.CANCELLED) {
                for (OrderItem item : order.getItems()) {
                    Product product = item.getProduct();
                    if (item.getQuantity() > product.getStockQuantity()) {
                        throw ApiException.badRequest("Not enough stock to re-activate order for '"
                                + product.getName() + "': requested " + item.getQuantity()
                                + ", available " + product.getStockQuantity());
                    }
                    product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
                    productRepository.save(product);
                }
            }
            order.setStatus(request.getStatus());
        }
        if (request.getDeliverySlot() != null) {
            order.setDeliverySlot(request.getDeliverySlot());
        }
        if (request.getPaymentMethod() != null) {
            order.setPaymentMethod(request.getPaymentMethod());
        }
        if (request.getDeliveryAddress() != null) {
            order.setDeliveryAddress(request.getDeliveryAddress());
        }
        return orderRepository.save(order);
    }

    /** Deletes an order; stock is restored unless the order was already cancelled. */
    public void delete(Long id) {
        Order order = getById(id);
        if (order.getStatus() != OrderStatus.CANCELLED) {
            restoreStock(order);
        }
        orderRepository.delete(order);
    }

    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity < 1 || quantity > 20) {
            throw ApiException.badRequest("Quantity must be between 1 and 20");
        }
    }

    private void restoreStock(Order order) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }
    }
}
