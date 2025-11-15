package com.citypulse.citypulse.repository;

import com.citypulse.citypulse.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByAuth0ProviderId(String auth0ProviderId);

    boolean existsByEmail(String email);
}

