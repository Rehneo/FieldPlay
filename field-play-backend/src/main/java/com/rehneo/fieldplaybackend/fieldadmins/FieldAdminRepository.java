package com.rehneo.fieldplaybackend.fieldadmins;

import com.rehneo.fieldplaybackend.companies.Company;
import com.rehneo.fieldplaybackend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FieldAdminRepository extends JpaRepository<FieldAdmin, Integer> {

    Page<FieldAdmin> findAllByUser(User user, Pageable pageable);

    Page<FieldAdmin> findAllByCompany(Company company, Pageable pageable);

    Page<FieldAdmin> findAllByCompanyId(int companyId, Pageable pageable);

    Page<FieldAdmin> findAllByUserId(int userId, Pageable pageable);

    boolean existsByUserIdAndCompanyId(int userId, Integer fieldId);

    boolean existsByUserAndCompany(User user, Company company);

}
