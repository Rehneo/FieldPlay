package com.rehneo.fieldplaybackend.city;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CityReadDto {
    private int id;
    private String name;
}
