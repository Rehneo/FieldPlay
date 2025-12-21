package com.rehneo.fieldplaybackend.adminrequest;

import com.rehneo.fieldplaybackend.companies.Company;
import com.rehneo.fieldplaybackend.companies.CompanyStorage;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.fieldadmins.FieldAdmin;
import com.rehneo.fieldplaybackend.fieldadmins.FieldAdminService;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
public class FieldAdminRequestService {
    private final CompanyStorage companyStorage;
    private final FieldAdminService fieldAdminService;
    private final FieldAdminRequestStorage storage;
    private final UserService userService;
    private final FieldAdminRequestMapper mapper;

    public Page<FieldAdminRequestReadDto> findAllByCompanyAndStatus(
            int companyId,
            Status status,
            Pageable pageable
    ) {
        User currentUser = userService.getCurrentUser();
        if (!fieldAdminService.exists(currentUser.getId(), companyId) && !currentUser.isAdmin()) {
            throw new AccessDeniedException("Вы не являетесь админом данной компании");
        }
        return storage
                .findAllByCompanyIdAndStatusOrderByCreatedAtDesc(companyId, status, pageable)
                .map(mapper::map);
    }

    public FieldAdminRequestReadDto findMyByCompanyId(int companyId) {
        User user = userService.getCurrentUser();
        return mapper.map(storage.findByUserIdAndCompanyId(user.getId(), companyId));
    }

    @Transactional
    public FieldAdminRequestReadDto create(int companyId) {
        Company company = companyStorage.findById(companyId);
        User user = userService.getCurrentUser();
        if (storage.existsByUserAndCompany(user, company)) {
            throw new RequestAlreadyExistsException(
                    "Пользователь с логином: " + user.getUsername() + " " +
                            "уже отправил запрос компании с именем " + company.getName()
            );
        }
        FieldAdminRequest adminRequest = FieldAdminRequest.builder()
                .company(company)
                .user(user)
                .status(Status.PENDING)
                .build();
        return mapper.map(storage.save(adminRequest));

    }

    @Transactional
    public FieldAdminRequestReadDto process(int id, boolean approved) {
        FieldAdminRequest adminRequest = storage.findById(id);
        User currentUser = userService.getCurrentUser();
        if (!fieldAdminService.exists(currentUser, adminRequest.getCompany()) && !currentUser.isAdmin()) {
            throw new AccessDeniedException(
                    "Недостаточно прав для обработки данного запроса. " +
                            "Вы не являетесь админом компании" + adminRequest.getCompany().getName());
        }
        if (adminRequest.getStatus() != Status.PENDING) {
            throw new RequestAlreadyProcessedException
                    ("Запрос с id: " + id + " уже был обработан");
        }
        adminRequest.setApprovedAt(ZonedDateTime.now());
        adminRequest.setApprovedBy(currentUser);
        if (approved) {
            adminRequest.setStatus(Status.APPROVED);
            fieldAdminService.save(FieldAdmin.builder()
                    .user(adminRequest.getUser())
                    .company(adminRequest.getCompany())
                    .build());
        } else {
            adminRequest.setStatus(Status.REJECTED);
        }

        return mapper.map(storage.save(adminRequest));
    }
}
