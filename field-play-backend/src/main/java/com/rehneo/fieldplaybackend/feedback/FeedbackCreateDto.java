package com.rehneo.fieldplaybackend.feedback;


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
public class FeedbackCreateDto {
    @NotNull(message = "id футбольного поля должно присутствовать")
    private Integer fieldId;
    @NotNull(message = "Сообщение отзыва должно присутствовать")
    @NotBlank(message = "Сообщение отзыва не должно быть пустым")
    private String message;
    @NotNull(message = "Рейтинг отзыва должен присутствовать")
    private Rating rating;

}
