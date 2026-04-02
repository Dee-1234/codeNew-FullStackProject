package com.deepika.CodeNew.controller;

import com.deepika.CodeNew.dto.LoginRequest;
import com.deepika.CodeNew.dto.RegisterRequest;
import com.deepika.CodeNew.security.JwtService;
import com.deepika.CodeNew.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager; // Added
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService; // Added
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
             authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(jwtToken);
    }
}