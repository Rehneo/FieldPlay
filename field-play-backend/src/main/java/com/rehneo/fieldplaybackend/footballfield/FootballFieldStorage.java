package com.rehneo.fieldplaybackend.footballfield;

import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;
import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class FootballFieldStorage {
    private final FootballFieldRepository repository;

    @Transactional(readOnly = true)
    public Double getAvgRating(int fieldId) {
        return repository.getAvgRating(fieldId);
    }

    @Transactional(readOnly = true)
    public Page<FootballField> findAllByCompanyId(int companyId, Pageable pageable) {
        return repository.findAllByCompanyId(companyId, pageable);
    }

    @Transactional
    public FootballField save(FootballField footballField) {
        return repository.save(footballField);
    }

    @Transactional(readOnly = true)
    public FootballField findById(int id) {
        return repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Футбольного поля с id: " + id + " не существует")
        );
    }

    @Transactional(readOnly = true)
    public Page<FootballField> findAll(Specification<FootballField> criteria, Pageable pageable) {
        return repository.findAll(criteria, pageable);
    }
}
