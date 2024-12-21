package com.rehneo.fieldplaybackend.footballfield;


import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldEditDto;
import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldFullReadDto;
import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldReadDto;
import com.rehneo.fieldplaybackend.metrostation.MetroStation;
import com.rehneo.fieldplaybackend.metrostation.MetroStationReadDto;
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
                .stations(footballField.getMetroStations().stream().map(
                        station -> MetroStationReadDto.builder().id(station.getId()).name(station.getName()).build()
                ).toList())
                .build();
    }

    public FootballFieldFullReadDto mapFull(FootballField footballField) {
        return FootballFieldFullReadDto.builder()
                .id(footballField.getId())
                .name(footballField.getName())
                .type(footballField.getType())
                .surfaceType(footballField.getSurfaceType())
                .address(footballField.getAddress())
                .stations(footballField.getMetroStations().stream().map(
                        station -> MetroStationReadDto.builder().id(station.getId()).name(station.getName()).build()
                ).toList())
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

    public void update(FootballFieldEditDto editDto, FootballField field) {
        field.setAddress(editDto.getAddress());
        field.setName(editDto.getName());
        field.setType(editDto.getType());
        field.setSurfaceType(editDto.getSurfaceType());
        field.setWidth(editDto.getWidth());
        field.setHeight(editDto.getHeight());
        field.setLength(editDto.getLength());
        field.setLockerRoom(editDto.getLockerRoom());
        field.setMaxPlayers(editDto.getMaxPlayers());
        field.setStands(editDto.getStands());
        field.setShower(editDto.getShower());
        field.setLighting(editDto.getLighting());
        field.setParkingSpace(editDto.getParkingSpace());
    }
}
