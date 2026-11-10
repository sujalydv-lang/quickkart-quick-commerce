package com.blinkit.quickcommerce.repository;

import com.blinkit.quickcommerce.entity.OrderItem;
import com.blinkit.quickcommerce.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    /** True if the product appears in any order whose status is in the given list. */
    @Query("SELECT COUNT(oi) > 0 FROM OrderItem oi WHERE oi.product.id = :productId AND oi.order.status IN :statuses")
    boolean existsByProductIdAndOrderStatusIn(@Param("productId") Long productId,
                                              @Param("statuses") List<OrderStatus> statuses);
}
