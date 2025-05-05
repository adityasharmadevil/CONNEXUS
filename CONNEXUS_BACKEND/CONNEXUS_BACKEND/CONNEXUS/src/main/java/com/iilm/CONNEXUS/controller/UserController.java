package com.iilm.CONNEXUS.controller;



import com.iilm.CONNEXUS.modle.User;
import com.iilm.CONNEXUS.repository.UserEntryRepo;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.iilm.CONNEXUS.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserEntryRepo userRepository;
    @Autowired
    private UserService userService;

    // // 🟢 Register New User
    // @PostMapping("/register")
    // public ResponseEntity<String> registerUser(@RequestBody User user) {
    //     try {
    //         // Hash the password before saving
    //         String hashedPassword = passwordUtil.hashPassword(user.getPasswordHash());
    //         user.setPasswordHash(hashedPassword);

    //         userService.createUser(user);

    //         return ResponseEntity.ok("User registered successfully");
    //     } catc   h (Exception e) {
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
        String response = userService.registerUser(user);
        if (response.equals("Username already taken")) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

//    @PostMapping("/login")
//    public ResponseEntity<String> loginUser(@RequestBody User user) {
//        String response = userService.loginUser(user);
//        if (response.equals("Login successful!")) {
//       // String tempName =   userRepository.
//            return ResponseEntity.ok(response);
//        }
//        return ResponseEntity.badRequest().body(response);
//    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<?> checkUsernameAvailability(@PathVariable String username) {
        boolean available = !userRepository.findByUsername(username).isPresent();
        return ResponseEntity.ok().body(Collections.singletonMap("available", available));
    }

    //Test Function

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        String response = userService.loginUser(user);

        if (response.equals("Login successful!")) {
            Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
            if (existingUser.isPresent()) {
                User dbUser = existingUser.get();

                // Create a map with only username and name
                Map<String, String> result = new HashMap<>();
                result.put("username", dbUser.getUsername());
                result.put("name", dbUser.getName());

                return ResponseEntity.ok(result);
            }
        }

        // Return error as JSON
        return ResponseEntity
                .badRequest()
                .body(Collections.singletonMap("message", response));
    }

    @GetMapping("/status/{username}")
    public ResponseEntity<?> checkUserStatus(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isPresent()) {
            String status = user.get().getStatus(); // "active", "inactive", or "on call"
            return ResponseEntity.ok(Collections.singletonMap("status", status));
        }

        return ResponseEntity.badRequest()
                .body(Collections.singletonMap("message", "User not found"));
    }



    @PatchMapping("/status/{username}")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable String username,
            @RequestParam String status) {

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Validate status input
            if (!status.equalsIgnoreCase("active") &&
                    !status.equalsIgnoreCase("inactive") &&
                    !status.equalsIgnoreCase("on call")) {
                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap("message", "Invalid status value. Allowed: active, inactive, on call"));
            }

            user.setStatus(status.toLowerCase()); // Normalize status to lowercase
            userRepository.save(user);

            return ResponseEntity.ok(Collections.singletonMap("message", "Status updated successfully"));
        }

        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "User not found"));
    }

}

