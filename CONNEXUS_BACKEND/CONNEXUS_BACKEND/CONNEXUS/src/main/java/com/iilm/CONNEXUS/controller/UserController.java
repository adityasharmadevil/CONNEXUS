package com.iilm.CONNEXUS.controller;



import com.iilm.CONNEXUS.modle.User;
import com.iilm.CONNEXUS.repository.UserEntryRepo;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserEntryRepo userRepository;

    // // 🟢 Register New User
    // @PostMapping("/register")
    // public ResponseEntity<String> registerUser(@RequestBody User user) {
    //     try {
    //         // Hash the password before saving
    //         String hashedPassword = passwordUtil.hashPassword(user.getPasswordHash());
    //         user.setPasswordHash(hashedPassword);

    //         userService.createUser(user);

    //         return ResponseEntity.ok("User registered successfully");
    //     } catch (Exception e) {
    //         return ResponseEntity.badRequest().body("Error registering user: " + e.getMessage());
    //     }
    // }
//     @PostMapping("/register")
//     public ResponseEntity<String> registerUser(@RequestBody User user){
//         Optional<User> existingUser = userEntryRepo.findByUsername(user.getUsername());
//         if(existingUser.isPresent()){
//             return new ResponseEntity<>(HttpStatus.ALREADY_REPORTED);
//         }
//         userService.createUser(user);
//         return new ResponseEntity<>(HttpStatus.CREATED);
        
//     }
//     @PostMapping("/login")
//     public ResponseEntity<String> loginUser(@RequestBody User user){
//         Optional<User> existingUser = userEntryRepo.findByUsername(user.getUsername());
//         if(existingUser.isPresent() && existingUser.get().getPasswordHash().equals(user.getPasswordHash())){
//             existingUser.get().setStatus(true);
//             userEntryRepo.save(existingUser.get());
//             return new ResponseEntity<>(HttpStatus.ACCEPTED);
//         }
//         return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//     }
// This is not working as i think so i will update in future , From now this will work

@PostMapping("/register")
public ResponseEntity<String> registerUser(@RequestBody User user) {
    Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
    if (existingUser.isPresent()) {
        return ResponseEntity.badRequest().body("Username already taken");
    }

    userRepository.save(user);
    return ResponseEntity.ok("User registered successfully!");
}
@PostMapping("/login")
public ResponseEntity<String> loginUser(@RequestBody User user) {
    Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
    if (existingUser.isPresent() && existingUser.get().getPasswordHash().equals(user.getPasswordHash())) {
        existingUser.get().setStatus(true);
        userRepository.save(existingUser.get());
        return ResponseEntity.ok("Login successful!");
    }
    return ResponseEntity.badRequest().body("Invalid username or password!");
}
}

