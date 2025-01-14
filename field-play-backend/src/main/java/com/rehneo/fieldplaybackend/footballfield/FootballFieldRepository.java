package com.rehneo.fieldplaybackend.footballfield;

import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FootballFieldRepository extends JpaRepository<FootballField, Integer>,
        JpaSpecificationExecutor<FootballField> {

    @Query(value = "SELECT get_average_rating(:fieldId)", nativeQuery = true)
    Double getAvgRating(int fieldId);

    Page<FootballField> findAllByCompanyId(int companyId, Pageable pageable);
}
