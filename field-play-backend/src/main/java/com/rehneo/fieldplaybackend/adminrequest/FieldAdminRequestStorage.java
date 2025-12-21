package com.rehneo.fieldplaybackend.adminrequest;

import com.rehneo.fieldplaybackend.companies.Company;
import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;
import com.rehneo.fieldplaybackend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class FieldAdminRequestStorage {
    private final FieldAdminRequestRepository repository;

    @Transactional(readOnly = true)
    public FieldAdminRequest findById(int id) {
        return repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Запрос с id: " + id + " не найден")
        );
    }

    @Transactional(readOnly = true)
    FieldAdminRequest findByUserIdAndCompanyId(int userId, int companyId) {
        return repository.findByUserIdAndCompanyId(userId, companyId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Запроса пользователя с id: " + userId + " для компании с id: " + companyId + " не существует"
                )
        );
    }

    @Transactional(readOnly = true)
    public boolean existsByUserAndCompany(User user, Company company) {
        return repository.existsByUserAndCompany(user, company);
    }

    @Transactional
    public FieldAdminRequest save(FieldAdminRequest fieldAdminRequest) {
        return repository.save(fieldAdminRequest);
    }

    @Transactional(readOnly = true)
    public Page<FieldAdminRequest> findAllByCompanyIdAndStatusOrderByCreatedAtDesc(
            int companyId,
            Status status,
            Pageable pageable
    ) {
        return repository.findAllByCompanyIdAndStatusOrderByCreatedAtDesc(companyId, status, pageable);
    }
}
