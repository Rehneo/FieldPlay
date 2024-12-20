package com.rehneo.fieldplaybackend.companies;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyReadDto {
    private int id;
    private String name;
    private int balance;
    private int numberOfFields;
}
