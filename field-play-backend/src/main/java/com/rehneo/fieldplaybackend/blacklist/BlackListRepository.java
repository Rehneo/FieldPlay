package com.rehneo.fieldplaybackend.blacklist;

import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlackListRepository extends JpaRepository<BlackList, Integer> {
    Page<BlackList> findAllByFootballFieldId(int fieldId, Pageable pageable);

    Page<BlackList> findAllByFootballField(FootballField field, Pageable pageable);
}

