package com.rehneo.fieldplaybackend.search;

import com.rehneo.fieldplaybackend.city.City;
import com.rehneo.fieldplaybackend.footballfield.data.FootballField;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.ZonedDateTime;

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
        };
    }
}
