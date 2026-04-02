package com.deepika.CodeNew.service;

import com.deepika.CodeNew.dto.AuthResponse;
import com.deepika.CodeNew.dto.LoginRequest;
import com.deepika.CodeNew.dto.RegisterRequest;
import com.deepika.CodeNew.entity.User;
import com.deepika.CodeNew.repository.UserRepository;
import com.deepika.CodeNew.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String token = jwtUtils.generateToken(user.getEmail());
            return new AuthResponse(token, user.getEmail(), user.getRole());
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}