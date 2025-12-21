package com.rehneo.fieldplaybackend.city;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CityService {
    private final CityRepository repository;

    public Page<CityReadDto> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(city -> CityReadDto.builder()
                .id(city.getId())
                .name(city.getName())
                .build());
    }
}
