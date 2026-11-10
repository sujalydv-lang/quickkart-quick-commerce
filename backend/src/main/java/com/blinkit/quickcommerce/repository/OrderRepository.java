package com.blinkit.quickcommerce.repository;

import com.blinkit.quickcommerce.entity.Order;
import com.blinkit.quickcommerce.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    Page<Order> findByCustomerId(Long customerId, Pageable pageable);

    boolean existsByCustomerIdAndStatusIn(Long customerId, List<OrderStatus> statuses);
}
