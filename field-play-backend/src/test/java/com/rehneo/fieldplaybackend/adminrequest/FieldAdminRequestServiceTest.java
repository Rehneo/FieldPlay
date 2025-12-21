package com.rehneo.fieldplaybackend.adminrequest;

import com.rehneo.fieldplaybackend.companies.Company;
import com.rehneo.fieldplaybackend.companies.CompanyStorage;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.fieldadmins.FieldAdmin;
import com.rehneo.fieldplaybackend.fieldadmins.FieldAdminService;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FieldAdminRequestServiceTest {
    @Mock
    CompanyStorage companyStorage;
    @Mock
    FieldAdminService fieldAdminService;
    @Mock
    FieldAdminRequestStorage storage;
    @Mock
    UserService userService;
    @Mock
    FieldAdminRequestMapper mapper;

    @InjectMocks
    FieldAdminRequestService service;

    @Test
    void findAllByCompanyAndStatus_companyAdmin_success() {
        int companyId = 10;
        Pageable pageable = PageRequest.of(0, 10);

        User user = mock(User.class);
        FieldAdminRequest request = mock(FieldAdminRequest.class);
        FieldAdminRequestReadDto dto = mock(FieldAdminRequestReadDto.class);

        when(userService.getCurrentUser()).thenReturn(user);
        when(user.getId()).thenReturn(1);

        when(fieldAdminService.exists(1, companyId)).thenReturn(true);

        when(storage.findAllByCompanyIdAndStatusOrderByCreatedAtDesc(
                companyId, Status.PENDING, pageable
        )).thenReturn(new PageImpl<>(List.of(request)));

        when(mapper.map(request)).thenReturn(dto);

        Page<FieldAdminRequestReadDto> result =
                service.findAllByCompanyAndStatus(companyId, Status.PENDING, pageable);

        assertEquals(1, result.getTotalElements());
        verify(storage).findAllByCompanyIdAndStatusOrderByCreatedAtDesc(
                companyId, Status.PENDING, pageable
        );
    }

    @Test
    void findAllByCompanyAndStatus_accessDenied() {
        int companyId = 10;
        Pageable pageable = PageRequest.of(0, 10);

        User user = mock(User.class);

        when(userService.getCurrentUser()).thenReturn(user);
        when(user.isAdmin()).thenReturn(false);
        when(user.getId()).thenReturn(1);
        when(fieldAdminService.exists(1, companyId)).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> service.findAllByCompanyAndStatus(companyId, Status.PENDING, pageable)
        );
    }

    @Test
    void findMyByCompanyId_success() {
        int companyId = 10;

        User user = mock(User.class);
        FieldAdminRequest request = mock(FieldAdminRequest.class);
        FieldAdminRequestReadDto dto = mock(FieldAdminRequestReadDto.class);

        when(userService.getCurrentUser()).thenReturn(user);
        when(user.getId()).thenReturn(1);

        when(storage.findByUserIdAndCompanyId(1, companyId))
                .thenReturn(request);

        when(mapper.map(request)).thenReturn(dto);

        FieldAdminRequestReadDto result =
                service.findMyByCompanyId(companyId);

        assertNotNull(result);
        verify(storage).findByUserIdAndCompanyId(1, companyId);
    }

    @Test
    void create_success() {
        int companyId = 10;

        User user = mock(User.class);
        Company company = mock(Company.class);
        FieldAdminRequest saved = mock(FieldAdminRequest.class);
        FieldAdminRequestReadDto dto = mock(FieldAdminRequestReadDto.class);

        when(companyStorage.findById(companyId)).thenReturn(company);
        when(userService.getCurrentUser()).thenReturn(user);

        when(storage.existsByUserAndCompany(user, company)).thenReturn(false);
        when(storage.save(any(FieldAdminRequest.class))).thenReturn(saved);
        when(mapper.map(saved)).thenReturn(dto);

        FieldAdminRequestReadDto result = service.create(companyId);

        assertNotNull(result);
        verify(storage).save(any(FieldAdminRequest.class));
    }

    @Test
    void create_requestAlreadyExists() {
        int companyId = 10;

        User user = mock(User.class);
        Company company = mock(Company.class);

        when(companyStorage.findById(companyId)).thenReturn(company);
        when(userService.getCurrentUser()).thenReturn(user);
        when(storage.existsByUserAndCompany(user, company)).thenReturn(true);

        assertThrows(
                RequestAlreadyExistsException.class,
                () -> service.create(companyId)
        );
    }

    @Test
    void process_approved_success() {
        User admin = mock(User.class);
        User targetUser = mock(User.class);
        Company company = mock(Company.class);

        FieldAdminRequest request = mock(FieldAdminRequest.class);
        FieldAdminRequestReadDto dto = mock(FieldAdminRequestReadDto.class);

        when(storage.findById(1)).thenReturn(request);
        when(userService.getCurrentUser()).thenReturn(admin);

        when(admin.isAdmin()).thenReturn(true);
        when(request.getStatus()).thenReturn(Status.PENDING);
        when(request.getCompany()).thenReturn(company);
        when(request.getUser()).thenReturn(targetUser);

        when(storage.save(request)).thenReturn(request);
        when(mapper.map(request)).thenReturn(dto);

        FieldAdminRequestReadDto result = service.process(1, true);

        assertNotNull(result);
        verify(request).setStatus(Status.APPROVED);
        verify(fieldAdminService).save(any(FieldAdmin.class));
    }

    @Test
    void process_rejected_success() {
        User admin = mock(User.class);
        Company company = mock(Company.class);

        FieldAdminRequest request = mock(FieldAdminRequest.class);
        FieldAdminRequestReadDto dto = mock(FieldAdminRequestReadDto.class);

        when(storage.findById(1)).thenReturn(request);
        when(userService.getCurrentUser()).thenReturn(admin);

        when(admin.isAdmin()).thenReturn(true);
        when(request.getStatus()).thenReturn(Status.PENDING);
        when(request.getCompany()).thenReturn(company);

        when(storage.save(request)).thenReturn(request);
        when(mapper.map(request)).thenReturn(dto);

        FieldAdminRequestReadDto result = service.process(1, false);

        assertNotNull(result);
        verify(request).setStatus(Status.REJECTED);
        verify(fieldAdminService, never()).save(any());
    }

    @Test
    void process_alreadyProcessed() {
        User admin = mock(User.class);
        Company company = mock(Company.class);
        FieldAdminRequest request = mock(FieldAdminRequest.class);

        when(storage.findById(1)).thenReturn(request);
        when(userService.getCurrentUser()).thenReturn(admin);

        when(admin.isAdmin()).thenReturn(true);
        when(request.getStatus()).thenReturn(Status.APPROVED);
        when(request.getCompany()).thenReturn(company);

        assertThrows(
                RequestAlreadyProcessedException.class,
                () -> service.process(1, true)
        );
    }

    @Test
    void process_accessDenied() {
        User user = mock(User.class);
        Company company = mock(Company.class);
        FieldAdminRequest request = mock(FieldAdminRequest.class);

        when(storage.findById(1)).thenReturn(request);
        when(userService.getCurrentUser()).thenReturn(user);

        when(user.isAdmin()).thenReturn(false);
        when(request.getCompany()).thenReturn(company);

        when(fieldAdminService.exists(user, company)).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> service.process(1, true)
        );
    }
}
