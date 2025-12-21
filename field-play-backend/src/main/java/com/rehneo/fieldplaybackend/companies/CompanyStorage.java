package com.rehneo.fieldplaybackend.companies;

import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;
import com.rehneo.fieldplaybackend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class CompanyStorage {
    private final CompanyRepository repository;

    @Transactional(readOnly = true)
    public Page<Company> findAllByUser(User user, Pageable pageable) {
        return repository.findAllByUser(user, pageable);
    }

    @Transactional(readOnly = true)
    public int getNumberOfFields(int companyId) {
        return repository.getNumberOfFields(companyId);
    }

    @Transactional(readOnly = true)
    public Page<Company> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Company findById(int id) {
        return repository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Компании с id: " + id + " не существует")
        );
    }
}
