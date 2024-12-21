package com.rehneo.fieldplaybackend.footballfield.data.dto;


import com.rehneo.fieldplaybackend.footballfield.data.FootballFieldType;
import com.rehneo.fieldplaybackend.footballfield.data.SurfaceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FootballFieldEditDto {
    @NotNull(message = "Имя футбольного поля должно присутствовать")
    @NotBlank(message = "Имя футбольного поля не должно быть пустым")
    private String name;
    private List<Integer> stationIds = new ArrayList<>();
    @NotNull(message = "Адрес футбольного поля должен присутствовать")
    @NotBlank(message = "Адрес футбольного поля не должен быть пустым")
    private String address;
    @NotNull(message = "Тип футбольного поля должен присутствовать")
    private FootballFieldType type;
    @NotNull(message = "Тип покрытия должен присутствовать")
    private SurfaceType surfaceType;
    @NotNull(message = "Максимальное число игроков должно присутствовать")
    @Positive(message = "Максимальное число игроков должно быть больше нуля")
    private Integer maxPlayers;
    @NotNull(message = "Длина футбольного поля должна присутствовать")
    @Positive(message = "Длина футбольного поля должна быть больше нуля")
    private Float length;
    @NotNull(message = "Ширина футбольного поля должна присутствовать")
    @Positive(message = "Ширина футбольного поля должна быть больше нуля")
    private Float width;
    @Positive(message = "Высота футбольного поля должна быть больше нуля")
    private Float height;
    @NotNull(message = "Наличие раздевалок должно присутствовать")
    private Boolean lockerRoom;
    @NotNull(message = "Наличие трибун должно присутствовать")
    private Boolean stands;
    @NotNull(message = "Наличие душа должно присутствовать")
    private Boolean shower;
    @NotNull(message = "Наличие освещения должно присутствовать")
    private Boolean lighting;
    @NotNull(message = "Наличие парковки должно присутствовать")
    private Boolean parkingSpace;
}
