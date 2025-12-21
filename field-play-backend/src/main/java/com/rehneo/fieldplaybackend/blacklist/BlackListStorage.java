package com.rehneo.fieldplaybackend.blacklist;

import com.rehneo.fieldplaybackend.error.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class BlackListStorage {
    private final BlackListRepository repository;

    @Transactional(readOnly = true)
    public boolean existsByUserIdAndCompanyId(int userId, int companyId) {
        return repository.existsByUserIdAndCompanyId(userId, companyId);
    }

    @Transactional(readOnly = true)
    public BlackList findById(int id) {
        return repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Записи с id: " + id + " не существует в черном списке")
        );
    }

    @Transactional(readOnly = true)
    public Page<BlackList> findAllByCompanyId(int companyId, Pageable pageable) {
        return repository.findAllByCompanyId(companyId, pageable);
    }

    @Transactional
    public BlackList save(BlackList blackList) {
        return repository.save(blackList);
    }

    @Transactional
    public void delete(int id) {
        repository.deleteById(id);
    }
}
