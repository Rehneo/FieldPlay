package com.rehneo.fieldplaybackend.integration;

import com.rehneo.fieldplaybackend.annotation.IT;
import com.rehneo.fieldplaybackend.metrostation.MetroStation;
import com.rehneo.fieldplaybackend.metrostation.MetroStationRepository;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

@IT
@RequiredArgsConstructor
public class MetroStationRepositoryTest {
    private final MetroStationRepository repository;


    @Test
    void testFindByIds() {
        List<Integer> ids = new ArrayList<>();
        ids.add(2);
        ids.add(3);
        ids.add(4);
        List<MetroStation> stations = repository.findAllByIdIn(ids);
        Assertions.assertEquals(3, stations.size());
    }
}
