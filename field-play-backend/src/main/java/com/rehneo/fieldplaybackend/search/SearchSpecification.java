package com.rehneo.fieldplaybackend.search;

import com.rehneo.fieldplaybackend.city.City;
import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import com.rehneo.fieldplaybackend.metrostation.MetroStation;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.ZonedDateTime;
import java.util.List;

import static java.time.format.DateTimeFormatter.ISO_DATE_TIME;

@RequiredArgsConstructor
public class SearchSpecification<T> implements Specification<T> {
    private final SearchCriteria criteria;

    @Override
    public Predicate toPredicate(
            @NonNull Root<T> root,
            @Nullable CriteriaQuery<?> query,
            @NonNull CriteriaBuilder cb) {
        var value = criteria.getValue().toString().toLowerCase();
        return switch (criteria.getOperator()) {
            case CONTAINS -> cb.like(
                    cb.lower(root.get(criteria.getKey())),
                    "%" + value + "%"
            );
            case EQUAL -> cb.equal(
                    root.get(criteria.getKey()),
                    criteria.getValue()
            );
            case STR_EQUAL -> cb.equal(
                    root.get(criteria.getKey()).as(String.class),
                    criteria.getValue().toString()
            );
            case BEFORE -> {
                var date = ZonedDateTime.parse(criteria.getValue().toString(), ISO_DATE_TIME);
                yield cb.lessThanOrEqualTo(root.get(criteria.getKey()), date);
            }
            case AFTER -> {
                var date = ZonedDateTime.parse(criteria.getValue().toString(), ISO_DATE_TIME);
                yield cb.greaterThanOrEqualTo(root.get(criteria.getKey()), date);
            }
            case GREATER_THAN -> cb.greaterThan(
                    root.get(criteria.getKey()),
                    criteria.getValue().toString()
            );
            case LESS_THAN -> cb.lessThan(
                    root.get(criteria.getKey()),
                    criteria.getValue().toString()
            );
            case NESTED_CITY_ID -> {
                Join<T, City> cityJoin = root.join("city");
                yield cb.equal(cityJoin.<Integer>get("id"), criteria.getValue());
            }
            case NESTED_FIELD_ID -> {
                Join<T, FootballField> fieldJoin = root.join("footballField");
                yield cb.equal(fieldJoin.<Integer>get("id"), criteria.getValue());
            }
            case NESTED_STATION_ID -> {
                Join<T, MetroStation> stationJoin = root.join("metroStations");
                CriteriaBuilder.In<Integer> inClause = cb.in(stationJoin.get("id"));
                List<Integer> stationIds;
                if (criteria.getValue() instanceof List<?> list && list.stream().allMatch(id -> id instanceof Integer)) {
                    stationIds = list.stream().map(id -> (Integer) id).toList();
                } else {
                    throw new IllegalArgumentException("Value must be a list of integers");
                }
                stationIds.forEach(inClause::value);
                yield inClause;
            }
        };
    }
}