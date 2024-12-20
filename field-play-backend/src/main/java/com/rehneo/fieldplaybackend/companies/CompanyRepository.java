package com.rehneo.fieldplaybackend.companies;

import com.rehneo.fieldplaybackend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends CrudRepository<Company, Integer> {

    @Query(value = "SELECT c FROM Company c " +
            "JOIN FieldAdmin fa ON c = fa.company " +
            "WHERE fa.user = :user ")
    Page<Company> findAllByUser(User user, Pageable pageable);

    @Query(value = "SELECT c FROM Company c " +
            "JOIN FieldAdmin fa ON c = fa.company " +
            "WHERE fa.user.id = :userId ")
    Page<Company> findAllByUserId(int userId, Pageable pageable);

    @Query(value = "SELECT get_number_of_fields(:companyId)", nativeQuery = true)
    int getNumberOfFields(int companyId);

}
