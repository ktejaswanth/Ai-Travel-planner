package com.tripwise.auth;

import com.tripwise.auth.dto.AuthResponse;
import com.tripwise.auth.dto.LoginRequest;
import com.tripwise.auth.dto.RegisterRequest;
import com.tripwise.auth.model.Role;
import com.tripwise.auth.service.AuthService;
import com.tripwise.common.exception.DuplicateResourceException;
import com.tripwise.common.exception.UnauthorizedException;
import com.tripwise.security.JwtTokenProvider;
import com.tripwise.user.dto.UserResponse;
import com.tripwise.user.model.User;
import com.tripwise.user.repository.UserRepository;
import com.tripwise.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;
    private UserResponse sampleUserResponse;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id("user-123")
                .name("John Doe")
                .email("john@example.com")
                .passwordHash("hashedPassword")
                .role(Role.USER)
                .createdAt(Instant.now())
                .build();

        sampleUserResponse = UserResponse.builder()
                .id("user-123")
                .name("John Doe")
                .email("john@example.com")
                .role(Role.USER)
                .createdAt(Instant.now())
                .build();
    }

    @Test
    @DisplayName("Should successfully register a new user")
    void register_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .name("John Doe")
                .email("john@example.com")
                .password("password123")
                .build();

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateToken(any(User.class))).thenReturn("mock-jwt-token");
        when(userService.mapToUserResponse(sampleUser)).thenReturn(sampleUserResponse);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("john@example.com", response.getUser().getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when registering existing email")
    void register_DuplicateEmail_ThrowsException() {
        RegisterRequest request = RegisterRequest.builder()
                .name("John Doe")
                .email("john@example.com")
                .password("password123")
                .build();

        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should successfully login with valid credentials")
    void login_Success() {
        LoginRequest request = LoginRequest.builder()
                .email("john@example.com")
                .password("password123")
                .build();

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(true);
        when(tokenProvider.generateToken(sampleUser)).thenReturn("mock-jwt-token");
        when(userService.mapToUserResponse(sampleUser)).thenReturn(sampleUserResponse);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        verify(tokenProvider, times(1)).generateToken(sampleUser);
    }

    @Test
    @DisplayName("Should throw UnauthorizedException for invalid password")
    void login_InvalidPassword_ThrowsException() {
        LoginRequest request = LoginRequest.builder()
                .email("john@example.com")
                .password("wrongpassword")
                .build();

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongpassword", "hashedPassword")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }
}
