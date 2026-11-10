package com.blinkit.quickcommerce.service;

import com.blinkit.quickcommerce.dto.CategoryRequest;
import com.blinkit.quickcommerce.entity.ProductCategory;
import com.blinkit.quickcommerce.exception.ApiException;
import com.blinkit.quickcommerce.repository.ProductCategoryRepository;
import com.blinkit.quickcommerce.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CategoryService {

    private final ProductCategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(ProductCategoryRepository categoryRepository,
                           ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public Page<ProductCategory> getAll(String search, Pageable pageable) {
        if (search != null && !search.isBlank()) {
            return categoryRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                    search, search, pageable);
        }
        return categoryRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public ProductCategory getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Category not found with id " + id));
    }

    public ProductCategory create(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw ApiException.conflict("Category already exists with name '" + request.getName() + "'");
        }
        ProductCategory category = new ProductCategory();
        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        if (request.getActive() != null) {
            category.setActive(request.getActive());
        }
        return categoryRepository.save(category);
    }

    public ProductCategory update(Long id, CategoryRequest request) {
        ProductCategory category = getById(id);
        String newName = request.getName().trim();
        if (!category.getName().equalsIgnoreCase(newName)
                && categoryRepository.existsByNameIgnoreCase(newName)) {
            throw ApiException.conflict("Category already exists with name '" + newName + "'");
        }
        category.setName(newName);
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        if (request.getActive() != null) {
            category.setActive(request.getActive());
        }
        return categoryRepository.save(category);
    }

    public void delete(Long id) {
        ProductCategory category = getById(id);
        if (productRepository.existsByCategoryId(id)) {
            throw ApiException.conflict("Cannot delete category '" + category.getName()
                    + "' because it still has products");
        }
        categoryRepository.delete(category);
    }
}
