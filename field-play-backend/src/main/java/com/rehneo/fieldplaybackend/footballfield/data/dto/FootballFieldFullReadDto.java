package com.rehneo.fieldplaybackend.footballfield.data.dto;

import com.rehneo.fieldplaybackend.footballfield.data.FootballFieldType;
import com.rehneo.fieldplaybackend.footballfield.data.SurfaceType;
import com.rehneo.fieldplaybackend.metrostation.MetroStation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FootballFieldFullReadDto {
    private int id;
    private String name;
    private List<MetroStation> stations;
    private String address;
    private FootballFieldType type;
    private SurfaceType surfaceType;
    private int maxPlayers;
    private double avgRating;
    private Float length;
    private Float width;
    private Float height;
    private Boolean lockerRoom;
    private Boolean stands;
    private Boolean shower;
    private Boolean lighting;
    private Boolean parkingSpace;
}
