package com.rehneo.fieldplaybackend.search;

import lombok.Data;

@Data
public class SearchCriteria {
    private String key;
    private Object value;
    private SearchOperator operator;

    public SearchCriteria(String key, Object value, SearchOperator operator) {
        this.key = key;
        this.value = value;
        this.operator = operator;
    }
}
