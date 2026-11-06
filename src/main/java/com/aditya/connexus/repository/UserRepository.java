package com.aditya.connexus.repository;

import com.aditya.connexus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Custom finder to locate users in Supabase by email
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
