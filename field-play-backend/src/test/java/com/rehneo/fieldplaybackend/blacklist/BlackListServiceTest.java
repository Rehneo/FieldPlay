package com.rehneo.fieldplaybackend.blacklist;

import com.rehneo.fieldplaybackend.companies.Company;
import com.rehneo.fieldplaybackend.companies.CompanyStorage;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.error.ConflictException;
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
class BlackListServiceTest {
    @Mock
    UserService userService;
    @Mock
    FieldAdminService fieldAdminService;
    @Mock
    BlackListStorage storage;
    @Mock
    BlackListMapper mapper;
    @Mock
    CompanyStorage companyStorage;

    @InjectMocks
    BlackListService service;

    // ---------- findAllByCompany ----------

    @Test
    void findAllByCompany_companyAdmin_success() {
        int companyId = 10;
        Pageable pageable = PageRequest.of(0, 10);

        User user = mock(User.class);
        BlackList entity = mock(BlackList.class);
        BlackListReadDto dto = mock(BlackListReadDto.class);

        when(userService.getCurrentUser()).thenReturn(user);
        when(user.getId()).thenReturn(1);

        when(fieldAdminService.exists(1, companyId)).thenReturn(true);

        when(storage.findAllByCompanyId(companyId, pageable))
                .thenReturn(new PageImpl<>(List.of(entity)));

        when(mapper.map(entity)).thenReturn(dto);

        Page<BlackListReadDto> result =
                service.findAllByCompany(companyId, pageable);

        assertEquals(1, result.getTotalElements());
        verify(storage).findAllByCompanyId(companyId, pageable);
    }

    @Test
    void findAllByCompany_admin_success() {
        int companyId = 10;
        Pageable pageable = PageRequest.of(0, 10);

        User admin = mock(User.class);

        when(userService.getCurrentUser()).thenReturn(admin);
        when(admin.isAdmin()).thenReturn(true);

        when(storage.findAllByCompanyId(companyId, pageable))
                .thenReturn(Page.empty());

        Page<BlackListReadDto> result =
                service.findAllByCompany(companyId, pageable);

        assertNotNull(result);
        verify(storage).findAllByCompanyId(companyId, pageable);
    }

    @Test
    void findAllByCompany_accessDenied() {
        int companyId = 10;
        Pageable pageable = PageRequest.of(0, 10);

        User user = mock(User.class);

        when(userService.getCurrentUser()).thenReturn(user);
        when(user.getId()).thenReturn(1);
        when(user.isAdmin()).thenReturn(false);
        when(fieldAdminService.exists(1, companyId)).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> service.findAllByCompany(companyId, pageable)
        );
    }

    // ---------- delete ----------

    @Test
    void delete_companyAdmin_success() {
        int blacklistId = 1;
        int companyId = 10;

        User user = mock(User.class);
        Company company = mock(Company.class);
        BlackList blackList = mock(BlackList.class);

        when(storage.findById(blacklistId)).thenReturn(blackList);
        when(blackList.getCompany()).thenReturn(company);
        when(company.getId()).thenReturn(companyId);

        when(userService.getCurrentUser()).thenReturn(user);
        when(user.getId()).thenReturn(1);

        when(fieldAdminService.exists(1, companyId)).thenReturn(true);

        service.delete(blacklistId);

        verify(storage).delete(blacklistId);
    }

    @Test
    void delete_admin_success() {
        int blacklistId = 1;

        User admin = mock(User.class);
        Company company = mock(Company.class);
        BlackList blackList = mock(BlackList.class);

        when(storage.findById(blacklistId)).thenReturn(blackList);
        when(blackList.getCompany()).thenReturn(company);

        when(userService.getCurrentUser()).thenReturn(admin);
        when(admin.isAdmin()).thenReturn(true);

        service.delete(blacklistId);

        verify(storage).delete(blacklistId);
    }

    @Test
    void delete_accessDenied() {
        int blacklistId = 1;
        int companyId = 10;

        User user = mock(User.class);
        Company company = mock(Company.class);
        BlackList blackList = mock(BlackList.class);

        when(storage.findById(blacklistId)).thenReturn(blackList);
        when(blackList.getCompany()).thenReturn(company);
        when(company.getId()).thenReturn(companyId);

        when(userService.getCurrentUser()).thenReturn(user);
        when(user.getId()).thenReturn(1);
        when(user.isAdmin()).thenReturn(false);

        when(fieldAdminService.exists(1, companyId)).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> service.delete(blacklistId)
        );
    }

    // ---------- create ----------

    @Test
    void create_success() {
        BlackListCreateDto dto = mock(BlackListCreateDto.class);
        User admin = mock(User.class);
        User targetUser = mock(User.class);
        Company company = mock(Company.class);
        BlackList saved = mock(BlackList.class);
        BlackListReadDto readDto = mock(BlackListReadDto.class);

        when(dto.getUserId()).thenReturn(2);
        when(dto.getCompanyId()).thenReturn(10);
        when(dto.getReason()).thenReturn("reason");

        when(storage.existsByUserIdAndCompanyId(2, 10)).thenReturn(false);

        when(userService.findById(2)).thenReturn(targetUser);
        when(companyStorage.findById(10)).thenReturn(company);

        when(userService.getCurrentUser()).thenReturn(admin);
        when(admin.isAdmin()).thenReturn(true);

        when(storage.save(any(BlackList.class))).thenReturn(saved);
        when(mapper.map(saved)).thenReturn(readDto);

        BlackListReadDto result = service.create(dto);

        assertNotNull(result);
        verify(storage).save(any(BlackList.class));
    }

    @Test
    void create_conflict() {
        BlackListCreateDto dto = mock(BlackListCreateDto.class);

        when(dto.getUserId()).thenReturn(2);
        when(dto.getCompanyId()).thenReturn(10);

        when(storage.existsByUserIdAndCompanyId(2, 10)).thenReturn(true);

        assertThrows(
                ConflictException.class,
                () -> service.create(dto)
        );
    }

    @Test
    void create_accessDenied() {
        BlackListCreateDto dto = mock(BlackListCreateDto.class);
        User user = mock(User.class);

        when(dto.getUserId()).thenReturn(2);
        when(dto.getCompanyId()).thenReturn(10);
        when(dto.getReason()).thenReturn("reason");

        when(storage.existsByUserIdAndCompanyId(2, 10)).thenReturn(false);

        when(userService.findById(2)).thenReturn(mock(User.class));
        when(companyStorage.findById(10)).thenReturn(mock(Company.class));

        when(userService.getCurrentUser()).thenReturn(user);
        when(user.getId()).thenReturn(1);
        when(user.isAdmin()).thenReturn(false);

        when(fieldAdminService.exists(1, 10)).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> service.create(dto)
        );
    }
}