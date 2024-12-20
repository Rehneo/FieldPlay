package com.rehneo.fieldplaybackend.fieldadmins;

import com.rehneo.fieldplaybackend.companies.Company;
import com.rehneo.fieldplaybackend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FieldAdminService {
    private final FieldAdminRepository repository;


    public boolean exists(int userId, int companyId) {
        return repository.existsByUserIdAndCompanyId(userId, companyId);
    }

    public boolean exists(User user, Company company) {
        return repository.existsByUserAndCompany(user, company);
    }

    public void save(FieldAdmin fieldAdmin) {
        repository.save(fieldAdmin);
    }
}
