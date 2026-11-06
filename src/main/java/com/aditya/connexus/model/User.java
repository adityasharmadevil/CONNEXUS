package com.aditya.connexus.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users") // Maps to your table in Supabase
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String username;

    private String status; // ONLINE, OFFLINE, ACTIVE, INACTIVE
}
