package com.rehneo.fieldplaybackend.metrostation;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MetroStationReadDto {
    private int id;
    private String name;
}
