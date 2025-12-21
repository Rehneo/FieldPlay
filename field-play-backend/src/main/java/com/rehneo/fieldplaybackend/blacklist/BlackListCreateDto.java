package com.rehneo.fieldplaybackend.blacklist;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlackListCreateDto {
    @NotNull(message = "id пользователя должно присутствовать")
    private Integer userId;
    @NotNull(message = "id компании должно присутствовать")
    private Integer companyId;
    @NotNull(message = "Причина добавления в черный список должна присутствовать")
    @NotBlank(message = "Причина добавления пользователя в черный список не должна быть пустой")
    private String reason;
}
