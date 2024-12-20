package com.rehneo.fieldplaybackend.blacklist;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BlackListCreateDto {

    @NotNull(message = "id пользователя должно присутствовать")
    private int userId;
    @NotNull(message = "id компании должно присутствовать")
    private int companyId;
    @NotNull(message = "Причина добавления в черный список должна присутствовать")
    @NotBlank(message = "Причина добавления пользователя в черный список не должна быть пустой")
    private String reason;

}
