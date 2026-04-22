package com.jeyasurya.jobtrackerbackend.repository;

import com.jeyasurya.jobtrackerbackend.entity.Application;
import com.jeyasurya.jobtrackerbackend.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByUserEmail(String email);

    List<Application> findByUserEmailAndStatus(String email, ApplicationStatus status);

    Optional<Application> findByIdAndUserEmail(Long id, String email);

    long countByUserEmail(String email);

    long countByUserEmailAndStatus(String email, ApplicationStatus status);

    @Query("SELECT FUNCTION('TO_CHAR', a.dateApplied, 'IYYY-IW') as week, COUNT(a) " +
            "FROM Application a WHERE a.user.email = :email " +
            "GROUP BY FUNCTION('TO_CHAR', a.dateApplied, 'IYYY-IW') " +
            "ORDER BY FUNCTION('TO_CHAR', a.dateApplied, 'IYYY-IW')")
    List<Object[]> countApplicationsPerWeek(@Param("email") String email);
}
