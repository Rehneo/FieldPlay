package com.rehneo.fieldplaybackend.fieldadmins;

import com.rehneo.fieldplaybackend.companies.Company;
import com.rehneo.fieldplaybackend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FieldAdminRepository extends JpaRepository<FieldAdmin, Integer> {
    boolean existsByUserIdAndCompanyId(int userId, Integer companyId);

    boolean existsByUserAndCompany(User user, Company company);
}
