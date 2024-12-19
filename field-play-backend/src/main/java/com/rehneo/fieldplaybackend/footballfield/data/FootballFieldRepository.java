package com.rehneo.fieldplaybackend.footballfield.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FootballFieldRepository extends JpaRepository<FootballField, Integer> {

    @Query(value = "SELECT get_average_rating(:fieldId)", nativeQuery = true)
    double getAvgRating(int fieldId);
}
