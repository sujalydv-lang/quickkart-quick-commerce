package com.blinkit.quickcommerce.repository;

import com.blinkit.quickcommerce.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Page<Customer> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContaining(
            String name, String email, String phone, Pageable pageable);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByPhone(String phone);
}
