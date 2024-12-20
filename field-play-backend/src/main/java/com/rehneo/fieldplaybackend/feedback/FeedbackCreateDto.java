package com.rehneo.fieldplaybackend.feedback;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FeedbackCreateDto {
    @NotNull(message = "id футбольного поля должно присутствовать")
    private int fieldId;
    @NotNull(message = "Сообщение отзыва должно присутствовать")
    @NotBlank(message = "Сообщение отзыва не должно быть пустым")
    private String message;
    @NotNull(message = "Рейтинг отзыва должен присутствовать")
    private Rating rating;

}
