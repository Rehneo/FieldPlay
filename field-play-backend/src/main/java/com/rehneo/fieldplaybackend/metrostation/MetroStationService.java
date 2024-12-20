package com.rehneo.fieldplaybackend.metrostation;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MetroStationService {

    private final MetroStationRepository repository;


    public Page<MetroStationReadDto> findAllByCity(int cityId, Pageable pageable) {
        return repository.findAllByCityId(cityId, pageable).map(station -> MetroStationReadDto.builder()
                .id(station.getId())
                .name(station.getName())
                .build());
    }
}
