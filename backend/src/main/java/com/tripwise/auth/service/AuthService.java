package com.tripwise.auth.service;

import com.tripwise.auth.dto.AuthResponse;
import com.tripwise.auth.dto.LoginRequest;
import com.tripwise.auth.dto.RegisterRequest;
import com.tripwise.auth.model.Role;
import com.tripwise.common.exception.DuplicateResourceException;
import com.tripwise.common.exception.ResourceNotFoundException;
import com.tripwise.common.exception.UnauthorizedException;
import com.tripwise.security.JwtTokenProvider;
import com.tripwise.user.dto.UserResponse;
import com.tripwise.user.model.User;
import com.tripwise.user.repository.UserRepository;
import com.tripwise.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("An account with this email already exists: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateToken(savedUser);

        return AuthResponse.builder()
                .token(token)
                .user(userService.mapToUserResponse(savedUser))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .user(userService.mapToUserResponse(user))
                .build();
    }

    public UserResponse getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user profile not found"));
        return userService.mapToUserResponse(user);
    }
}
