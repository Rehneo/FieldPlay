package com.rehneo.fieldplaybackend.footballfield.data;


import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldFullReadDto;
import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldReadDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FootballFieldMapper {


    public FootballFieldReadDto map(FootballField footballField) {
        return FootballFieldReadDto.builder()
                .id(footballField.getId())
                .name(footballField.getName())
                .type(footballField.getType())
                .surfaceType(footballField.getSurfaceType())
                .address(footballField.getAddress())
                .stations(footballField.getMetroStations())
                .build();
    }

    public FootballFieldFullReadDto mapFull(FootballField footballField) {
        return FootballFieldFullReadDto.builder()
                .id(footballField.getId())
                .name(footballField.getName())
                .type(footballField.getType())
                .surfaceType(footballField.getSurfaceType())
                .address(footballField.getAddress())
                .stations(footballField.getMetroStations())
                .width(footballField.getWidth())
                .height(footballField.getHeight())
                .length(footballField.getLength())
                .lockerRoom(footballField.getLockerRoom())
                .maxPlayers(footballField.getMaxPlayers())
                .stands(footballField.getStands())
                .shower(footballField.getShower())
                .lighting(footballField.getLighting())
                .parkingSpace(footballField.getParkingSpace())
                .build();
    }
}
