package com.rehneo.fieldplaybackend.metrostation;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/metro-stations", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class MetroStationController {

    private final MetroStationService service;

    @GetMapping
    public ResponseEntity<Page<MetroStationReadDto>> findAllByCity(
            @RequestParam int cityId,
            Pageable pageable) {
        Page<MetroStationReadDto> stations = service.findAllByCity(cityId, pageable);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(stations.getTotalElements()))
                .body(stations);
    }
}
