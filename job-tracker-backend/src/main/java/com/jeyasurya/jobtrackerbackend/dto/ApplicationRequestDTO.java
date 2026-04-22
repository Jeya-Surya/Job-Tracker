package com.jeyasurya.jobtrackerbackend.dto;

import com.jeyasurya.jobtrackerbackend.entity.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ApplicationRequestDTO {

    @NotBlank
    private String companyName;

    @NotBlank
    private String role;

    private String location;

    private String jobUrl;

    @NotNull
    private ApplicationStatus status;

    private LocalDate dateApplied;

    private String notes;
}
