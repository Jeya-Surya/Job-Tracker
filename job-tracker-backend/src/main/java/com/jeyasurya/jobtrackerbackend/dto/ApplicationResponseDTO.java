package com.jeyasurya.jobtrackerbackend.dto;

import com.jeyasurya.jobtrackerbackend.entity.ApplicationStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ApplicationResponseDTO {

    private Long id;
    private String companyName;
    private String role;
    private String location;
    private String jobUrl;
    private ApplicationStatus status;
    private LocalDate dateApplied;
    private String notes;
}
