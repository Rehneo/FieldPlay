package com.rehneo.fieldplaybackend.search;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SearchMapper<T> {
    public Specification<T> map(SearchCriteriaDto searchDto) {
        SearchSpecificationBuilder<T> builder = new SearchSpecificationBuilder<>();
        if (searchDto == null) return builder.build();
        List<SearchCriteria> criteriaList = searchDto.getCriteriaList();
        if (criteriaList == null) return builder.build();
        criteriaList.forEach(builder::with);
        return builder.build();
    }
}
