package com.iilm.CONNEXUS.service;

import com.iilm.CONNEXUS.modle.User;
import com.iilm.CONNEXUS.repository.UserEntryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserEntryRepo userRepository;

    //Working but use password hashing
    //Remove if hashing in not working

//    public String registerUser(User user) {
//        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
//        if (existingUser.isPresent()) {
//            return "Username already taken";
//        }
//
//        // Password stored as plain text — no hashing
//        userRepository.save(user);
//        return "User registered successfully!";
//    }
//
//    public String loginUser(User user) {
//        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
//
//        if (existingUser.isPresent()) {
//            User dbUser = existingUser.get();
//            if (dbUser.getPassword().equals(user.getPassword())) {
//                dbUser.setStatus(true);
//                userRepository.save(dbUser);
//                return "Login successful!";
//            }
//        }
//        return "Invalid username or password!";
//    }

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public String registerUser(User user) {
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            return "Username already taken";
        }

        // Hash the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);
        return "User registered successfully!";
    }

    public String loginUser(User user) {
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());

        if (existingUser.isPresent()) {
            User dbUser = existingUser.get();

            // Check hashed password
            if (passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
                dbUser.setStatus(true);
                userRepository.save(dbUser);
                return "Login successful!";
            }
        }
        return "Invalid username or password!";
    }

}
