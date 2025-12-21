package com.rehneo.fieldplaybackend.blacklist;

import com.rehneo.fieldplaybackend.companies.CompanyStorage;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.error.ConflictException;
import com.rehneo.fieldplaybackend.fieldadmins.FieldAdminService;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BlackListService {
    private final UserService userService;
    private final FieldAdminService fieldAdminService;
    private final BlackListStorage storage;
    private final BlackListMapper mapper;
    private final CompanyStorage companyStorage;

    @Transactional(readOnly = true)
    public Page<BlackListReadDto> findAllByCompany(int companyId, Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        if (fieldAdminService.exists(currentUser.getId(), companyId) || currentUser.isAdmin()) {
            return storage
                    .findAllByCompanyId(companyId, pageable)
                    .map(mapper::map);
        } else {
            throw new AccessDeniedException("Вы не являетесь админом данной компании");
        }
    }

    @Transactional
    public void delete(int id) {
        BlackList blackList = storage.findById(id);
        User currentUser = userService.getCurrentUser();
        if (
                fieldAdminService.exists(currentUser.getId(), blackList.getCompany().getId())
                        || currentUser.isAdmin()) {
            storage.delete(id);
        } else {
            throw new AccessDeniedException("Вы не являетесь админом данной компании");
        }
    }

    @Transactional
    public BlackListReadDto create(BlackListCreateDto createDto) {
        if (storage.existsByUserIdAndCompanyId(createDto.getUserId(), createDto.getCompanyId())) {
            throw new ConflictException("Данный пользователь уже находится в черном списке данной компании");
        }
        BlackList blackList = BlackList.builder()
                .user(userService.findById(createDto.getUserId()))
                .company(companyStorage.findById(createDto.getCompanyId()))
                .reason(createDto.getReason())
                .build();
        User currentUser = userService.getCurrentUser();
        if (!fieldAdminService.exists(currentUser.getId(), createDto.getCompanyId()) && !currentUser.isAdmin()) {
            throw new AccessDeniedException("Вы не являетесь админом данной компании");
        }

        return mapper.map(storage.save(blackList));
    }
}
