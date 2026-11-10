package com.blinkit.quickcommerce.service;

import com.blinkit.quickcommerce.dto.ProductRequest;
import com.blinkit.quickcommerce.entity.OrderStatus;
import com.blinkit.quickcommerce.entity.Product;
import com.blinkit.quickcommerce.entity.ProductCategory;
import com.blinkit.quickcommerce.exception.ApiException;
import com.blinkit.quickcommerce.repository.OrderItemRepository;
import com.blinkit.quickcommerce.repository.ProductCategoryRepository;
import com.blinkit.quickcommerce.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductService {

    private static final List<OrderStatus> ACTIVE_STATUSES = List.of(
            OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PACKED, OrderStatus.OUT_FOR_DELIVERY);

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final OrderItemRepository orderItemRepository;

    public ProductService(ProductRepository productRepository,
                          ProductCategoryRepository categoryRepository,
                          OrderItemRepository orderItemRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Transactional(readOnly = true)
    public Page<Product> getAll(String search, Long categoryId, Pageable pageable) {
        if (categoryId != null) {
            return productRepository.findByCategoryId(categoryId, pageable);
        }
        if (search != null && !search.isBlank()) {
            return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                    search, search, pageable);
        }
        return productRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Product not found with id " + id));
    }

    public Product create(ProductRequest request) {
        ProductCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> ApiException.notFound("Category not found with id " + request.getCategoryId()));
        if (productRepository.existsByNameIgnoreCaseAndCategoryId(request.getName().trim(), request.getCategoryId())) {
            throw ApiException.conflict("Product '" + request.getName()
                    + "' already exists in category '" + category.getName() + "'");
        }
        Product product = new Product();
        apply(request, product, category);
        return productRepository.save(product);
    }

    public Product update(Long id, ProductRequest request) {
        Product product = getById(id);
        ProductCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> ApiException.notFound("Category not found with id " + request.getCategoryId()));
        String newName = request.getName().trim();
        boolean nameOrCategoryChanged = !product.getName().equalsIgnoreCase(newName)
                || !product.getCategory().getId().equals(request.getCategoryId());
        if (nameOrCategoryChanged
                && productRepository.existsByNameIgnoreCaseAndCategoryId(newName, request.getCategoryId())) {
            throw ApiException.conflict("Product '" + newName
                    + "' already exists in category '" + category.getName() + "'");
        }
        apply(request, product, category);
        return productRepository.save(product);
    }

    public void delete(Long id) {
        Product product = getById(id);
        if (orderItemRepository.existsByProductIdAndOrderStatusIn(id, ACTIVE_STATUSES)) {
            throw ApiException.conflict("Cannot delete product '" + product.getName()
                    + "' because it is part of an active order");
        }
        productRepository.delete(product);
    }

    private void apply(ProductRequest request, Product product, ProductCategory category) {
        product.setName(request.getName().trim());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setUnit(request.getUnit());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);
        if (request.getActive() != null) {
            product.setActive(request.getActive());
        }
    }
}
