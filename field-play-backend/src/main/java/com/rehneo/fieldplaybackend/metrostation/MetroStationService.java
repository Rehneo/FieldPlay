package com.rehneo.fieldplaybackend.metrostation;

import com.rehneo.fieldplaybackend.feedback.Feedback;
import com.rehneo.fieldplaybackend.feedback.FeedbackReadDto;
import com.rehneo.fieldplaybackend.search.SearchCriteriaDto;
import com.rehneo.fieldplaybackend.search.SearchMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MetroStationService {

    private final MetroStationRepository repository;
    private final SearchMapper<MetroStation> searchMapper;


    public Page<MetroStationReadDto> findAllByCity(int cityId, Pageable pageable) {
        return repository.findAllByCityId(cityId, pageable).map(station -> MetroStationReadDto.builder()
                .id(station.getId())
                .name(station.getName())
                .build());
    }

    public Page<MetroStationReadDto> search(SearchCriteriaDto criteria, Pageable pageable) {
        Page<MetroStation> stations = repository.findAll(searchMapper.map(criteria), pageable);
        return stations.map(station -> MetroStationReadDto.builder()
                .id(station.getId())
                .name(station.getName())
                .build());
    }


}
