package com.rehneo.fieldplaybackend.adminrequest;

import com.rehneo.fieldplaybackend.companies.Company;
import com.rehneo.fieldplaybackend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FieldAdminRequestRepository extends JpaRepository<FieldAdminRequest, Integer> {


    Page<FieldAdminRequest> findAllByCompanyIdAndStatusOrderByCreatedAtDesc(int companyId,
                                                                            Status status,
                                                                            Pageable pageable);

    boolean existsByUserAndCompany(User user, Company company);

    Optional<FieldAdminRequest> findByUserIdAndCompanyId(int userId, int companyId);
}
