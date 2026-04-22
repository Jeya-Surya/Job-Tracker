package com.jeyasurya.jobtrackerbackend.service;

import com.jeyasurya.jobtrackerbackend.dto.ApplicationRequestDTO;
import com.jeyasurya.jobtrackerbackend.dto.ApplicationResponseDTO;
import com.jeyasurya.jobtrackerbackend.entity.Application;
import com.jeyasurya.jobtrackerbackend.entity.User;
import com.jeyasurya.jobtrackerbackend.repository.ApplicationRepository;
import com.jeyasurya.jobtrackerbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public ApplicationResponseDTO create(ApplicationRequestDTO request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Application app = new Application();
        app.setCompanyName(request.getCompanyName());
        app.setRole(request.getRole());
        app.setLocation(request.getLocation());
        app.setJobUrl(request.getJobUrl());
        app.setStatus(request.getStatus());
        app.setDateApplied(request.getDateApplied());
        app.setNotes(request.getNotes());
        app.setUser(user);

        return mapToResponse(applicationRepository.save(app));
    }

    private ApplicationResponseDTO mapToResponse(Application app) {
        ApplicationResponseDTO response = new ApplicationResponseDTO();
        response.setId(app.getId());
        response.setCompanyName(app.getCompanyName());
        response.setRole(app.getRole());
        response.setLocation(app.getLocation());
        response.setJobUrl(app.getJobUrl());
        response.setStatus(app.getStatus());
        response.setDateApplied(app.getDateApplied());
        response.setNotes(app.getNotes());

        return response;
    }

    public List<ApplicationResponseDTO> getAll(String email) {
        return applicationRepository.findByUserEmail(email)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ApplicationResponseDTO getById(Long id, String email) {
        Application app = applicationRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new RuntimeException("Application not found!"));

        return mapToResponse(app);
    }

    public ApplicationResponseDTO update(Long id, String email, ApplicationRequestDTO request) {
        Application app = applicationRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new RuntimeException("Application not found!"));

        app.setCompanyName(request.getCompanyName());
        app.setRole(request.getRole());
        app.setLocation(request.getLocation());
        app.setJobUrl(request.getJobUrl());
        app.setStatus(request.getStatus());
        app.setDateApplied(request.getDateApplied());
        app.setNotes(request.getNotes());

        return mapToResponse(applicationRepository.save(app));
    }

    public String delete(Long id, String email) {
        Application app = applicationRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new RuntimeException("Application not found!"));

        applicationRepository.delete(app);

        return "Application deleted successfully";
    }
}
