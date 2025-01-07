package com.rehneo.fieldplaybackend.blacklist;

import com.rehneo.fieldplaybackend.companies.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlackListRepository extends JpaRepository<BlackList, Integer> {
    Page<BlackList> findAllByCompanyId(int companyId, Pageable pageable);

    Page<BlackList> findAllByCompany(Company company, Pageable pageable);

    boolean existsByUserIdAndCompanyId(int userId, Integer companyId);
}

