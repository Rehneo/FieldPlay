package com.rehneo.fieldplaybackend.metrostation;

import com.rehneo.fieldplaybackend.city.City;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetroStationRepository extends JpaRepository<MetroStation, Integer> {

    Page<MetroStation> findAllByCity(City city, Pageable pageable);

    Page<MetroStation> findAllByCityId(int cityId, Pageable pageable);

    List<MetroStation> findAllByIdIn(List<Integer> ids);
}
