package com.rehneo.fieldplaybackend.footballfield.data;

import com.rehneo.fieldplaybackend.city.CityRepository;
import com.rehneo.fieldplaybackend.companies.Company;
import com.rehneo.fieldplaybackend.companies.CompanyRepository;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;
import com.rehneo.fieldplaybackend.fieldadmins.FieldAdminService;
import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldCreateOrEditDto;
import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldFullReadDto;
import com.rehneo.fieldplaybackend.metrostation.MetroStationRepository;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FootballFieldService {
    private final FootballFieldRepository repository;
    private final FootballFieldMapper mapper;
    private final CompanyRepository companyRepository;
    private final CityRepository cityRepository;
    private final MetroStationRepository stationRepository;
    private final FieldAdminService fieldAdminService;
    private final UserService userService;


    public FootballFieldFullReadDto findById(int id) {
        FootballField field = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Футбольно поле с id: " + id + "не существует")
        );
        FootballFieldFullReadDto readDto = mapper.mapFull(field);
        readDto.setAvgRating(readDto.getAvgRating());
        return readDto;
    }

    @Transactional
    public FootballFieldFullReadDto create(FootballFieldCreateOrEditDto createDto) {
        Company company = companyRepository.findById(createDto.getCompanyId()).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Компании с id: " + createDto.getCompanyId() + "не существует"
                )
        );
        User currentUser = userService.getCurrentUser();
        if (!fieldAdminService.exists(currentUser.getId(), createDto.getCompanyId())) {
            throw new AccessDeniedException("Вы не являетесь админом данной компании");
        }
        FootballField field = FootballField.builder()
                .city(cityRepository.findById(createDto.getCityId()).orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Города с id: " + createDto.getCityId() + "не существует"
                        )
                ))
                .name(createDto.getName())
                .address(createDto.getAddress())
                .type(createDto.getType())
                .surfaceType(createDto.getSurfaceType())
                .length(createDto.getLength())
                .height(createDto.getHeight())
                .metroStations(stationRepository.findAllByIdIn(createDto.getStationIds()))
                .width(createDto.getWidth())
                .maxPlayers(createDto.getMaxPlayers())
                .shower(createDto.getShower())
                .lockerRoom(createDto.getLockerRoom())
                .parkingSpace(createDto.getParkingSpace())
                .lighting(createDto.getLighting())
                .stands(createDto.getStands())
                .company(company)
                .build();
        repository.save(field);
        return mapper.mapFull(field);
    }

//    @Transactional
//    public FootballFieldFullReadDto edit(FootballFieldCreateOrEditDto editDto) {
//        FootballField field = repository.findById(editDto.getId()).orElseThrow(
//                () -> new ResourceNotFoundException("Футбольно поле с id: " + editDto.getId() + "не существует")
//        );
//        User currentUser = userService.getCurrentUser();
//        if (!fieldAdminService.exists(currentUser.getId(), field.getCompany().getId())) {
//            throw new AccessDeniedException("Вы не являетесь админом данной компании");
//        }
//    }


}
