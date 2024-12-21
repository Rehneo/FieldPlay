package com.rehneo.fieldplaybackend.blacklist;

import com.rehneo.fieldplaybackend.companies.CompanyRepository;
import com.rehneo.fieldplaybackend.error.AccessDeniedException;
import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;
import com.rehneo.fieldplaybackend.fieldadmins.FieldAdminService;
import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserNotFoundException;
import com.rehneo.fieldplaybackend.user.UserRepository;
import com.rehneo.fieldplaybackend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BlackListService {
    private final BlackListRepository repository;
    private final UserService userService;
    private final FieldAdminService fieldAdminService;
    private final UserRepository userRepository;
    private final BlackListMapper mapper;
    private final CompanyRepository companyRepository;


    public Page<BlackListReadDto> findAllByCompany(int companyId, Pageable pageable) {
        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException("Компании с id: " + companyId + " не существует");
        }
        User currentUser = userService.getCurrentUser();
        if (fieldAdminService.exists(currentUser.getId(), companyId) || currentUser.isAdmin()) {
            return repository
                    .findAllByCompanyId(companyId, pageable)
                    .map(mapper::map);
        } else {
            throw new AccessDeniedException("Вы не являетесь админом данной компании");
        }
    }

    @Transactional
    public void delete(int id) {
        BlackList blackList = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Записи с id: " + id + " не существует в черном списке")
        );
        User currentUser = userService.getCurrentUser();
        if (
                fieldAdminService.exists(currentUser.getId(), blackList.getCompany().getId())
                        || currentUser.isAdmin()) {
            repository.deleteById(id);
        } else {
            throw new AccessDeniedException("Вы не являетесь админом данной компании");
        }
    }

    @Transactional
    public BlackListReadDto create(BlackListCreateDto createDto) {

        BlackList blackList = BlackList.builder()
                .user(userRepository.findById(createDto.getUserId()).orElseThrow(
                        () -> new UserNotFoundException(
                                "Пользователя с id: " + createDto.getUserId() + " не существует"
                        )
                ))
                .company(companyRepository.findById(createDto.getCompanyId()).orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Компании с id: " + createDto.getCompanyId() + " не существует"
                        )
                ))
                .reason(createDto.getReason())
                .build();
        User currentUser = userService.getCurrentUser();
        if (!fieldAdminService.exists(currentUser.getId(), createDto.getCompanyId()) && !currentUser.isAdmin()) {
            throw new AccessDeniedException("Вы не являетесь админом данной компании");
        }

        repository.save(blackList);

        return mapper.map(blackList);

    }
}
