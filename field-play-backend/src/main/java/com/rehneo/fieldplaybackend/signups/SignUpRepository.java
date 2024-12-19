package com.rehneo.fieldplaybackend.signups;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SignUpRepository extends CrudRepository<SignUp, Integer> {
}
