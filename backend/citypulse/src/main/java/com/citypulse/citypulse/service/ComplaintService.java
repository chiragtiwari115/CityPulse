package com.citypulse.citypulse.service;

import com.citypulse.citypulse.dto.ComplaintRequest;
import com.citypulse.citypulse.dto.ComplaintResponse;
import com.citypulse.citypulse.dto.StatusUpdateRequest;
import com.citypulse.citypulse.entity.Complaint;
import com.citypulse.citypulse.entity.User;
import com.citypulse.citypulse.enums.ComplaintCategory;
import com.citypulse.citypulse.enums.ComplaintSeverity;
import com.citypulse.citypulse.enums.ComplaintStatus;
import com.citypulse.citypulse.mapper.ComplaintMapper;
import com.citypulse.citypulse.repository.ComplaintRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.io.IOException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintMapper complaintMapper;
    private final MailService mailService;

    @Transactional
    public ComplaintResponse submitComplaint(User reporter, ComplaintRequest request, MultipartFile imageFile) {
        Complaint complaint = new Complaint();
        complaint.setUser(reporter);
        complaint.setTitle(request.title());
        complaint.setDescription(request.description());
        complaint.setCategory(request.category());
        complaint.setSeverity(request.severity());
        complaint.setContactName(request.contactName());
        complaint.setContactPhone(request.contactPhone());
        complaint.setContactEmail(request.contactEmail());
        complaint.setAddress(request.address());
        complaint.setLatitude(request.latitude() != null ? BigDecimal.valueOf(request.latitude()) : null);
        complaint.setLongitude(request.longitude() != null ? BigDecimal.valueOf(request.longitude()) : null);
        complaint.setStatus(ComplaintStatus.SUBMITTED);
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                complaint.setImage(imageFile.getBytes());
                complaint.setImageContentType(imageFile.getContentType());
            } catch (IOException ex) {
                throw new IllegalArgumentException("Failed to read uploaded image", ex);
            }
        }

        Complaint saved = complaintRepository.save(complaint);
        mailService.sendComplaintSubmissionEmail(saved);
        return complaintMapper.toDto(saved);
    }

    public Page<ComplaintResponse> getComplaintsForUser(Long userId, Pageable pageable) {
        return complaintRepository.findAllByUserId(userId, pageable)
                .map(complaintMapper::toDto);
    }

    public ComplaintResponse getComplaintForUser(Long id, Long userId) {
        Complaint complaint = complaintRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found."));
        return complaintMapper.toDto(complaint);
    }

    public Optional<Complaint> getComplaintWithImage(Long id) {
        return complaintRepository.findById(id)
                .filter(complaint -> complaint.getImage() != null);
    }

    public Page<ComplaintResponse> getComplaintsForAdmin(
            ComplaintStatus status, ComplaintCategory category, ComplaintSeverity severity, Pageable pageable) {
        if (status != null && category != null && severity != null) {
            return complaintRepository
                    .findAllByStatusAndCategoryAndSeverity(status, category, severity, pageable)
                    .map(complaintMapper::toDto);
        }
        if (status != null && category != null) {
            return complaintRepository.findAllByStatusAndCategory(status, category, pageable).map(complaintMapper::toDto);
        }
        if (status != null && severity != null) {
            return complaintRepository.findAllByStatusAndSeverity(status, severity, pageable).map(complaintMapper::toDto);
        }
        if (category != null && severity != null) {
            return complaintRepository
                    .findAllByCategoryAndSeverity(category, severity, pageable)
                    .map(complaintMapper::toDto);
        }
        if (status != null) {
            return complaintRepository.findAllByStatus(status, pageable).map(complaintMapper::toDto);
        }
        if (category != null) {
            return complaintRepository.findAllByCategory(category, pageable).map(complaintMapper::toDto);
        }
        if (severity != null) {
            return complaintRepository.findAllBySeverity(severity, pageable).map(complaintMapper::toDto);
        }

        return complaintRepository.findAll(pageable).map(complaintMapper::toDto);
    }

    @Transactional
    public ComplaintResponse updateStatus(Long complaintId, StatusUpdateRequest request, User admin) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found."));
        complaint.setStatus(request.status());
        complaint.setStatusNotes(request.notes());
        Complaint updated = complaintRepository.save(complaint);
        mailService.sendStatusUpdateEmail(updated, admin);
        return complaintMapper.toDto(updated);
    }
}

