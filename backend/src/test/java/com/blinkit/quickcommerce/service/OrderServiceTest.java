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
import com.blinkit.quickcommerce.entity.ProductCategory;
import com.blinkit.quickcommerce.exception.ApiException;
import com.blinkit.quickcommerce.repository.CustomerRepository;
import com.blinkit.quickcommerce.repository.OrderRepository;
import com.blinkit.quickcommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for OrderService stock and quantity validation.
 * Repositories are mocked; no database is needed.
 */
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private ProductRepository productRepository;

    private OrderService orderService;
    private Customer customer;
    private Product milk;

    @BeforeEach
    void setUp() {
        orderService = new OrderService(orderRepository, customerRepository, productRepository);

        customer = new Customer();
        customer.setId(1L);
        customer.setName("Arjun Rao");
        customer.setEmail("arjun.rao@gmail.com");
        customer.setPhone("9845012345");
        customer.setAddress("12, Bull Temple Road, Basavanagudi");
        customer.setCity("Bengaluru");
        customer.setPincode("560004");

        ProductCategory dairy = new ProductCategory();
        dairy.setId(1L);
        dairy.setName("Dairy & Eggs");

        milk = new Product();
        milk.setId(1L);
        milk.setName("Amul Toned Milk");
        milk.setPrice(new BigDecimal("56.00"));
        milk.setStockQuantity(10);
        milk.setUnit("1 L");
        milk.setCategory(dairy);
        milk.setActive(true);
    }

    private OrderRequest requestWithQuantity(int quantity) {
        OrderItemRequest item = new OrderItemRequest();
        item.setProductId(1L);
        item.setQuantity(quantity);
        OrderRequest request = new OrderRequest();
        request.setCustomerId(1L);
        request.setDeliverySlot("Today, 6 PM - 7 PM");
        request.setPaymentMethod(PaymentMethod.UPI);
        request.setDeliveryAddress("12, Bull Temple Road, Basavanagudi");
        request.setItems(List.of(item));
        return request;
    }

    @Test
    void createOrder_computesTotalAndDecrementsStock() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(milk));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        Order order = orderService.create(requestWithQuantity(2));

        // Total = 2 x Rs 56 = Rs 112, computed from the items.
        assertEquals(new BigDecimal("112.00"), order.getTotalAmount());
        assertEquals(OrderStatus.PLACED, order.getStatus());
        // Stock 10 -> 8.
        assertEquals(8, milk.getStockQuantity());
        verify(productRepository).save(milk);
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void createOrder_rejectsQuantityBelowOne() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        assertThrows(ApiException.class, () -> orderService.create(requestWithQuantity(0)));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void createOrder_rejectsQuantityAboveTwenty() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        assertThrows(ApiException.class, () -> orderService.create(requestWithQuantity(21)));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void createOrder_rejectsQuantityExceedingStock() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(milk));

        // Milk has only 10 in stock.
        assertThrows(ApiException.class, () -> orderService.create(requestWithQuantity(11)));
        // Stock must be untouched on a failed order.
        assertEquals(10, milk.getStockQuantity());
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void cancelOrder_restoresStock() {
        Product product = milk;
        OrderItem item = new OrderItem(null, product, 2, new BigDecimal("56.00"));
        Order order = new Order();
        order.setId(1L);
        order.setCustomer(customer);
        order.setStatus(OrderStatus.PLACED);
        order.setTotalAmount(new BigDecimal("112.00"));
        order.setItems(List.of(item));
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderUpdateRequest update = new OrderUpdateRequest();
        update.setStatus(OrderStatus.CANCELLED);

        Order cancelled = orderService.update(1L, update);

        assertEquals(OrderStatus.CANCELLED, cancelled.getStatus());
        // Stock 10 -> 12 (2 restored).
        assertEquals(12, product.getStockQuantity());
        verify(productRepository).save(product);
    }

    @Test
    void createOrder_rejectsUnknownCustomer() {
        when(customerRepository.findById(99L)).thenReturn(Optional.empty());
        OrderRequest request = requestWithQuantity(1);
        request.setCustomerId(99L);

        assertThrows(ApiException.class, () -> orderService.create(request));
        verify(orderRepository, never()).save(any(Order.class));
    }
}
