package com.rehneo.fieldplaybackend.footballfield;

import com.rehneo.fieldplaybackend.city.CityStorage;
import com.rehneo.fieldplaybackend.companies.Company;
import com.rehneo.fieldplaybackend.companies.CompanyStorage;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.fieldadmins.FieldAdminService;
import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldCreateDto;
import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldEditDto;
import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldFullReadDto;
import com.rehneo.fieldplaybackend.footballfield.data.dto.FootballFieldReadDto;
import com.rehneo.fieldplaybackend.metrostation.MetroStationRepository;
import com.rehneo.fieldplaybackend.search.SearchCriteriaDto;
import com.rehneo.fieldplaybackend.search.SearchMapper;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FootballFieldService {
    private final FootballFieldMapper mapper;
    private final CityStorage cityStorage;
    private final SearchMapper<FootballField> searchMapper;
    private final MetroStationRepository stationRepository;
    private final FieldAdminService fieldAdminService;
    private final UserService userService;
    private final FootballFieldStorage storage;
    private final CompanyStorage companyStorage;

    public FootballFieldFullReadDto findById(int id) {
        FootballField field = storage.findById(id);
        FootballFieldFullReadDto readDto = mapper.mapFull(field);
        readDto.setAvgRating(storage.getAvgRating(field.getId()));
        return readDto;
    }

    public Page<FootballFieldReadDto> findAllByCompany(int companyId, Pageable pageable) {
        Page<FootballField> fields = storage.findAllByCompanyId(companyId, pageable);
        return fields.map(field -> {
            FootballFieldReadDto readDto = mapper.map(field);
            readDto.setAvgRating(storage.getAvgRating(field.getId()));
            return readDto;
        });
    }

    public Page<FootballFieldReadDto> search(SearchCriteriaDto criteria, Pageable pageable) {
        Page<FootballField> fields = storage.findAll(searchMapper.map(criteria), pageable);
        return fields.map(field -> {
            FootballFieldReadDto readDto = mapper.map(field);
            readDto.setAvgRating(storage.getAvgRating(field.getId()));
            return readDto;
        });
    }

    @Transactional
    public FootballFieldFullReadDto create(FootballFieldCreateDto createDto) {
        Company company = companyStorage.findById(createDto.getCompanyId());
        User currentUser = userService.getCurrentUser();
        if (!fieldAdminService.exists(currentUser.getId(), createDto.getCompanyId())) {
            throw new AccessDeniedException("Вы не являетесь админом данной компании");
        }
        FootballField field = FootballField.builder()
                .city(cityStorage.findById(createDto.getCityId()))
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
        return mapper.mapFull(storage.save(field));
    }

    @Transactional
    public FootballFieldFullReadDto edit(int fieldId, FootballFieldEditDto editDto) {
        FootballField field = storage.findById(fieldId);
        User currentUser = userService.getCurrentUser();
        if (!fieldAdminService.exists(currentUser.getId(), field.getCompany().getId())) {
            throw new AccessDeniedException("Вы не являетесь админом данной компании");
        }
        mapper.update(editDto, field);
        field.setMetroStations(stationRepository.findAllById(editDto.getStationIds()));
        return mapper.mapFull(storage.save(field));
    }
}
