package com.citypulse.citypulse.repository;

import com.citypulse.citypulse.entity.Complaint;
import com.citypulse.citypulse.enums.ComplaintCategory;
import com.citypulse.citypulse.enums.ComplaintSeverity;
import com.citypulse.citypulse.enums.ComplaintStatus;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Page<Complaint> findAllByUserId(Long userId, Pageable pageable);

    Optional<Complaint> findByIdAndUserId(Long complaintId, Long userId);

    Page<Complaint> findAllByStatus(ComplaintStatus status, Pageable pageable);

    Page<Complaint> findAllByCategory(ComplaintCategory category, Pageable pageable);

    Page<Complaint> findAllBySeverity(ComplaintSeverity severity, Pageable pageable);

    Page<Complaint> findAllByStatusAndCategoryAndSeverity(
            ComplaintStatus status,
            ComplaintCategory category,
            ComplaintSeverity severity,
            Pageable pageable);

    Page<Complaint> findAllByStatusAndCategory(
            ComplaintStatus status,
            ComplaintCategory category,
            Pageable pageable);

    Page<Complaint> findAllByStatusAndSeverity(
            ComplaintStatus status,
            ComplaintSeverity severity,
            Pageable pageable);

    Page<Complaint> findAllByCategoryAndSeverity(
            ComplaintCategory category,
            ComplaintSeverity severity,
            Pageable pageable);
}

