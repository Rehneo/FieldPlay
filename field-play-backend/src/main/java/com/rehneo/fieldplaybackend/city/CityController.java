package com.rehneo.fieldplaybackend.city;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/blacklists", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class CityController {

    private final CityService service;

    @GetMapping
    public ResponseEntity<Page<CityReadDto>> findAll(Pageable pageable) {
        Page<CityReadDto> cities = service.findAll(pageable);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(cities.getTotalElements()))
                .body(cities);
    }
}
