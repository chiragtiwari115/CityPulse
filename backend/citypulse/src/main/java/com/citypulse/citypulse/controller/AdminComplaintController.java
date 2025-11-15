package com.citypulse.citypulse.controller;

import com.citypulse.citypulse.dto.ComplaintResponse;
import com.citypulse.citypulse.dto.StatusUpdateRequest;
import com.citypulse.citypulse.entity.User;
import com.citypulse.citypulse.enums.ComplaintCategory;
import com.citypulse.citypulse.enums.ComplaintSeverity;
import com.citypulse.citypulse.enums.ComplaintStatus;
import com.citypulse.citypulse.security.UserPrincipal;
import com.citypulse.citypulse.service.ComplaintService;
import com.citypulse.citypulse.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/complaints")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminComplaintController {

    private final ComplaintService complaintService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<ComplaintResponse>> listComplaints(
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) ComplaintCategory category,
            @RequestParam(required = false) ComplaintSeverity severity,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ComplaintResponse> page = complaintService.getComplaintsForAdmin(status, category, severity, pageable);
        return ResponseEntity.ok(page);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User admin = userService.findByEmail(principal.getUsername());
        ComplaintResponse response = complaintService.updateStatus(id, request, admin);
        return ResponseEntity.ok(response);
    }
}

