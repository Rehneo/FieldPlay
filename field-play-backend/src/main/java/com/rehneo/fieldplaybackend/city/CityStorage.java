package com.rehneo.fieldplaybackend.city;

import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class CityStorage {
    private final CityRepository repository;

    @Transactional(readOnly = true)
    public Page<City> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public City findById(int id) {
        return repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Города с id: " + id + " не существует"
                )
        );
    }
}
