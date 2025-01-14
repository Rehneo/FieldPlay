package com.rehneo.fieldplaybackend.companies;

import com.rehneo.fieldplaybackend.user.User;
import com.rehneo.fieldplaybackend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyService {
    private final CompanyRepository repository;
    private final UserService userService;

    public Page<CompanyReadDto> findAllByUser(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        Page<Company> companies = repository.findAllByUser(currentUser, pageable);
        return companies.map(company -> CompanyReadDto.builder()
                .id(company.getId())
                .name(company.getName())
                .balance(company.getBalance())
                .numberOfFields(repository.getNumberOfFields(company.getId()))
                .build());

    }

    public Page<CompanyReadDto> findAll(Pageable pageable) {
        Page<Company> companies = repository.findAll(pageable);
        return companies.map(company -> CompanyReadDto.builder()
                .id(company.getId())
                .name(company.getName())
                .balance(company.getBalance())
                .numberOfFields(repository.getNumberOfFields(company.getId()))
                .build());
    }
}
