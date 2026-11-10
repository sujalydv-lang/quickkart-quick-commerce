package com.blinkit.quickcommerce.service;

import com.blinkit.quickcommerce.dto.CustomerRequest;
import com.blinkit.quickcommerce.entity.Customer;
import com.blinkit.quickcommerce.entity.OrderStatus;
import com.blinkit.quickcommerce.exception.ApiException;
import com.blinkit.quickcommerce.repository.CustomerRepository;
import com.blinkit.quickcommerce.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CustomerService {

    private static final List<OrderStatus> ACTIVE_STATUSES = List.of(
            OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PACKED, OrderStatus.OUT_FOR_DELIVERY);

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    public CustomerService(CustomerRepository customerRepository, OrderRepository orderRepository) {
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public Page<Customer> getAll(String search, Pageable pageable) {
        if (search != null && !search.isBlank()) {
            return customerRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContaining(
                    search, search, search, pageable);
        }
        return customerRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Customer getById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Customer not found with id " + id));
    }

    public Customer create(CustomerRequest request) {
        checkDuplicates(request.getEmail(), request.getPhone(), null);
        Customer customer = new Customer();
        apply(request, customer);
        return customerRepository.save(customer);
    }

    public Customer update(Long id, CustomerRequest request) {
        Customer customer = getById(id);
        checkDuplicates(request.getEmail(), request.getPhone(), id);
        apply(request, customer);
        return customerRepository.save(customer);
    }

    public void delete(Long id) {
        Customer customer = getById(id);
        if (orderRepository.existsByCustomerIdAndStatusIn(id, ACTIVE_STATUSES)) {
            throw ApiException.conflict("Cannot delete customer '" + customer.getName()
                    + "' because they have an active order");
        }
        customerRepository.delete(customer);
    }

    private void checkDuplicates(String email, String phone, Long excludeId) {
        boolean emailTaken = customerRepository.existsByEmailIgnoreCase(email.trim());
        boolean phoneTaken = customerRepository.existsByPhone(phone.trim());
        if (excludeId != null) {
            // On update, the customer's own email/phone are not duplicates.
            Customer existing = customerRepository.findById(excludeId).orElse(null);
            if (existing != null) {
                if (existing.getEmail().equalsIgnoreCase(email.trim())) {
                    emailTaken = false;
                }
                if (existing.getPhone().equals(phone.trim())) {
                    phoneTaken = false;
                }
            }
        }
        if (emailTaken) {
            throw ApiException.conflict("Customer already exists with email '" + email + "'");
        }
        if (phoneTaken) {
            throw ApiException.conflict("Customer already exists with phone '" + phone + "'");
        }
    }

    private void apply(CustomerRequest request, Customer customer) {
        customer.setName(request.getName().trim());
        customer.setEmail(request.getEmail().trim());
        customer.setPhone(request.getPhone().trim());
        customer.setAddress(request.getAddress());
        customer.setCity(request.getCity() == null || request.getCity().isBlank()
                ? "Bengaluru" : request.getCity().trim());
        customer.setPincode(request.getPincode());
    }
}
