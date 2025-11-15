package com.citypulse.citypulse.controller;

import com.citypulse.citypulse.dto.ComplaintRequest;
import com.citypulse.citypulse.dto.ComplaintResponse;
import com.citypulse.citypulse.entity.Complaint;
import com.citypulse.citypulse.entity.User;
import com.citypulse.citypulse.enums.ComplaintCategory;
import com.citypulse.citypulse.enums.ComplaintSeverity;
import com.citypulse.citypulse.security.UserPrincipal;
import com.citypulse.citypulse.service.ComplaintService;
import com.citypulse.citypulse.service.UserService;
import jakarta.validation.constraints.NotBlank;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;
    private final UserService userService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ComplaintResponse> submitComplaint(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam("category") @NotBlank String category,
            @RequestParam("severity") @NotBlank String severity,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("contactName") String contactName,
            @RequestParam("contactPhone") String contactPhone,
            @RequestParam("contactEmail") String contactEmail,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        ComplaintCategory complaintCategory;
        ComplaintSeverity complaintSeverity;
        try {
            complaintCategory = ComplaintCategory.valueOf(category.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid category: " + category);
        }
        try {
            complaintSeverity = ComplaintSeverity.valueOf(severity.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid severity: " + severity);
        }

        ComplaintRequest request = new ComplaintRequest(
                complaintCategory,
                complaintSeverity,
                title,
                description,
                contactName,
                contactPhone,
                contactEmail,
                address,
                latitude,
                longitude);

        User reporter = userService.findByEmail(principal.getUsername());
        ComplaintResponse response = complaintService.submitComplaint(reporter, request, imageFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<ComplaintResponse>> getMyComplaints(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 10) Pageable pageable) {
        User user = userService.findByEmail(principal.getUsername());
        Page<ComplaintResponse> page = complaintService.getComplaintsForUser(user.getId(), pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getComplaint(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        User user = userService.findByEmail(principal.getUsername());
        ComplaintResponse response = complaintService.getComplaintForUser(id, user.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<Resource> getComplaintImage(@PathVariable Long id) {
        Optional<Complaint> complaintOptional = complaintService.getComplaintWithImage(id);
        if (complaintOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Complaint complaint = complaintOptional.get();
        byte[] imageBytes = complaint.getImage();
        if (imageBytes == null || imageBytes.length == 0) {
            return ResponseEntity.notFound().build();
        }
        ByteArrayResource resource = new ByteArrayResource(imageBytes);
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (complaint.getImageContentType() != null) {
            try {
                mediaType = MediaType.parseMediaType(complaint.getImageContentType());
            } catch (IllegalArgumentException ex) {
                // If content type is invalid, use default
            }
        }
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"complaint-" + id + ".jpg\"")
                .body(resource);
    }
}

