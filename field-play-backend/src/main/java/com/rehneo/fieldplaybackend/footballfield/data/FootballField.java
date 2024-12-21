package com.rehneo.fieldplaybackend.footballfield.data;


import com.rehneo.fieldplaybackend.city.City;
import com.rehneo.fieldplaybackend.companies.Company;
import com.rehneo.fieldplaybackend.metrostation.MetroStation;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.hibernate.annotations.ColumnTransformer;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "football_fields")
public class FootballField {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private int id;

    @NotNull
    @NotBlank
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "football_fields_metro_stations",
            joinColumns = @JoinColumn(name = "football_field_id"),
            inverseJoinColumns = @JoinColumn(name = "metro_station_id")
    )
    private List<MetroStation> metroStations = new ArrayList<>();


    @NotNull
    @NotBlank
    @Column(name = "address", nullable = false)
    private String address;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @ColumnTransformer(write = "?::football_field_type")
    @Column(name = "type")
    private FootballFieldType type;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(name = "surface_type")
    private SurfaceType surfaceType;

    @NotNull
    @Positive
    @Column(name = "max_players", nullable = false)
    private Integer maxPlayers;

    @NotNull
    @Positive
    @Column(name = "length", nullable = false)
    private Float length;

    @NotNull
    @Positive
    @Column(name = "width", nullable = false)
    private Float width;

    @Positive
    @Column(name = "height")
    private Float height;

    @NotNull
    @Column(name = "locker_room", nullable = false)
    private Boolean lockerRoom;

    @NotNull
    @Column(name = "stands", nullable = false)
    private Boolean stands;

    @NotNull
    @Column(name = "shower", nullable = false)
    private Boolean shower;

    @NotNull
    @Column(name = "lighting", nullable = false)
    private Boolean lighting;

    @NotNull
    @Column(name = "parking_space", nullable = false)
    private Boolean parkingSpace;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

}
