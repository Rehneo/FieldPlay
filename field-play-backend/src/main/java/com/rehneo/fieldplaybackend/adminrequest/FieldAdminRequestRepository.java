package com.rehneo.fieldplaybackend.adminrequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FieldAdminRequestRepository extends JpaRepository<FieldAdminRequest, Integer> {

    Page<FieldAdminRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<FieldAdminRequest> findAllByStatusOrderByCreatedAtDesc(Status status, Pageable pageable);

    Optional<FieldAdminRequest> findByUserId(int userId);
}
