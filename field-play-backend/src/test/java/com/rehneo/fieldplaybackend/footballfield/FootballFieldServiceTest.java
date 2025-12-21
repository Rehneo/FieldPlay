package com.rehneo.fieldplaybackend.footballfield;

import com.rehneo.fieldplaybackend.city.City;
import com.rehneo.fieldplaybackend.city.CityStorage;
import com.rehneo.fieldplaybackend.companies.Company;
import com.rehneo.fieldplaybackend.companies.CompanyStorage;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.fieldadmins.FieldAdminService;
import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import com.rehneo.fieldplaybackend.footballfield.data.FootballFieldType;
import com.rehneo.fieldplaybackend.footballfield.data.SurfaceType;
import com.rehneo.fieldplaybackend.footballfield.data.dto.*;
import com.rehneo.fieldplaybackend.metrostation.MetroStation;
import com.rehneo.fieldplaybackend.metrostation.MetroStationRepository;
import com.rehneo.fieldplaybackend.search.SearchCriteriaDto;
import com.rehneo.fieldplaybackend.search.SearchMapper;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FootballFieldServiceTest {
    @Mock
    FootballFieldMapper mapper;
    @Mock
    CityStorage cityStorage;
    @Mock
    SearchMapper<FootballField> searchMapper;
    @Mock
    MetroStationRepository stationRepository;
    @Mock
    FieldAdminService fieldAdminService;
    @Mock
    UserService userService;
    @Mock
    FootballFieldStorage storage;
    @Mock
    CompanyStorage companyStorage;

    @InjectMocks
    FootballFieldService service;

    // ---------- findById ----------

    @Test
    void findById_success() {
        FootballField field = mock(FootballField.class);
        FootballFieldFullReadDto dto = mock(FootballFieldFullReadDto.class);

        when(storage.findById(1)).thenReturn(field);
        when(mapper.mapFull(field)).thenReturn(dto);
        when(storage.getAvgRating(field.getId())).thenReturn(4.5);

        FootballFieldFullReadDto result = service.findById(1);

        assertNotNull(result);
        verify(dto).setAvgRating(4.5);
    }

    // ---------- findAllByCompany ----------

    @Test
    void findAllByCompany_success() {
        Pageable pageable = PageRequest.of(0, 10);
        FootballField field = mock(FootballField.class);
        FootballFieldReadDto dto = mock(FootballFieldReadDto.class);

        when(storage.findAllByCompanyId(10, pageable))
                .thenReturn(new PageImpl<>(List.of(field)));
        when(mapper.map(field)).thenReturn(dto);
        when(storage.getAvgRating(field.getId())).thenReturn(4.2);

        Page<FootballFieldReadDto> result = service.findAllByCompany(10, pageable);

        assertEquals(1, result.getTotalElements());
        verify(dto).setAvgRating(4.2);
    }

    // ---------- search ----------

    @Test
    void search_success() {
        Pageable pageable = PageRequest.of(0, 10);
        SearchCriteriaDto criteria = mock(SearchCriteriaDto.class);
        FootballField field = mock(FootballField.class);
        Specification specification = mock(Specification.class);
        FootballFieldReadDto dto = mock(FootballFieldReadDto.class);

        when(searchMapper.map(criteria)).thenReturn(specification);
        when(storage.findAll(any(), eq(pageable)))
                .thenReturn(new PageImpl<>(List.of(field)));
        when(mapper.map(field)).thenReturn(dto);
        when(storage.getAvgRating(field.getId())).thenReturn(4.0);

        Page<FootballFieldReadDto> result = service.search(criteria, pageable);

        assertEquals(1, result.getTotalElements());
        verify(dto).setAvgRating(4.0);
    }

    // ---------- create ----------

    @Test
    void create_success() {
        FootballFieldCreateDto createDto = mock(FootballFieldCreateDto.class);
        Company company = mock(Company.class);
        User admin = mock(User.class);
        FootballField field = mock(FootballField.class);
        FootballFieldFullReadDto dto = mock(FootballFieldFullReadDto.class);
        MetroStation station = mock(MetroStation.class);

        when(createDto.getCompanyId()).thenReturn(10);
        when(companyStorage.findById(10)).thenReturn(company);

        when(userService.getCurrentUser()).thenReturn(admin);
        when(fieldAdminService.exists(admin.getId(), 10)).thenReturn(true);

        when(createDto.getCityId()).thenReturn(1);
        when(createDto.getName()).thenReturn("Field 1");
        when(createDto.getAddress()).thenReturn("Addr");
        when(createDto.getType()).thenReturn(FootballFieldType.OUTDOOR);
        when(createDto.getSurfaceType()).thenReturn(SurfaceType.LINOLEUM);
        when(createDto.getLength()).thenReturn(100.0f);
        when(createDto.getHeight()).thenReturn(50.0f);
        when(createDto.getWidth()).thenReturn(50.f);
        when(createDto.getMaxPlayers()).thenReturn(10);
        when(createDto.getShower()).thenReturn(true);
        when(createDto.getLockerRoom()).thenReturn(true);
        when(createDto.getParkingSpace()).thenReturn(true);
        when(createDto.getLighting()).thenReturn(true);
        when(createDto.getStands()).thenReturn(true);
        when(createDto.getStationIds()).thenReturn(List.of(1));

        when(cityStorage.findById(1)).thenReturn(mock(City.class));
        when(stationRepository.findAllByIdIn(List.of(1))).thenReturn(List.of(station));
        when(storage.save(any(FootballField.class))).thenReturn(field);
        when(mapper.mapFull(field)).thenReturn(dto);

        FootballFieldFullReadDto result = service.create(createDto);

        assertNotNull(result);
    }

    @Test
    void create_accessDenied() {
        FootballFieldCreateDto createDto = mock(FootballFieldCreateDto.class);
        Company company = mock(Company.class);
        User user = mock(User.class);

        when(createDto.getCompanyId()).thenReturn(10);
        when(companyStorage.findById(10)).thenReturn(company);
        when(userService.getCurrentUser()).thenReturn(user);
        when(fieldAdminService.exists(user.getId(), 10)).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> service.create(createDto)
        );
    }

    // ---------- edit ----------

    @Test
    void edit_success() {
        int fieldId = 1;
        FootballFieldEditDto editDto = mock(FootballFieldEditDto.class);
        FootballField field = mock(FootballField.class);
        User admin = mock(User.class);
        FootballFieldFullReadDto dto = mock(FootballFieldFullReadDto.class);

        when(storage.findById(fieldId)).thenReturn(field);
        when(userService.getCurrentUser()).thenReturn(admin);
        when(fieldAdminService.exists(admin.getId(), 10)).thenReturn(true);
        when(field.getCompany()).thenReturn(mock(Company.class));
        when(field.getCompany().getId()).thenReturn(10);
        when(editDto.getStationIds()).thenReturn(List.of(1));
        doNothing().when(mapper).update(editDto, field);
        when(storage.save(field)).thenReturn(field);
        when(mapper.mapFull(field)).thenReturn(dto);

        FootballFieldFullReadDto result = service.edit(fieldId, editDto);

        assertNotNull(result);
    }

    @Test
    void edit_accessDenied() {
        int fieldId = 1;
        FootballFieldEditDto editDto = mock(FootballFieldEditDto.class);
        FootballField field = mock(FootballField.class);
        User user = mock(User.class);

        when(storage.findById(fieldId)).thenReturn(field);
        when(userService.getCurrentUser()).thenReturn(user);
        when(field.getCompany()).thenReturn(mock(Company.class));
        when(field.getCompany().getId()).thenReturn(10);
        when(fieldAdminService.exists(user.getId(), 10)).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> service.edit(fieldId, editDto)
        );
    }
}