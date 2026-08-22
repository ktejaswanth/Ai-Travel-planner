package com.tripwise.security;

import com.tripwise.auth.model.Role;
import com.tripwise.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private static final String TEST_SECRET = "0123456789012345678901234567890123456789012345678901234567890123";
    private static final long EXPIRATION_MS = 3600000; // 1 hour

    private JwtTokenProvider tokenProvider;
    private User testUser;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider(TEST_SECRET, EXPIRATION_MS);
        testUser = User.builder()
                .id("user_123")
                .email("test@tripwise.ai")
                .name("Test User")
                .role(Role.USER)
                .build();
    }

    @Test
    @DisplayName("Should generate valid token and extract subject & email correctly")
    void testGenerateAndValidateToken() {
        String token = tokenProvider.generateToken(testUser);

        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals("user_123", tokenProvider.getUserIdFromToken(token));
        assertEquals("test@tripwise.ai", tokenProvider.getEmailFromToken(token));
    }

    @Test
    @DisplayName("Should reject invalid or tampered token")
    void testInvalidToken() {
        String token = tokenProvider.generateToken(testUser);
        String tamperedToken = token + "tampered";

        assertFalse(tokenProvider.validateToken(tamperedToken));
        assertFalse(tokenProvider.validateToken("invalid.token.structure"));
        assertFalse(tokenProvider.validateToken(null));
        assertFalse(tokenProvider.validateToken(""));
    }

    @Test
    @DisplayName("Should throw exception when secret is too short")
    void testShortSecret() {
        assertThrows(Exception.class, () -> new JwtTokenProvider("short_secret", EXPIRATION_MS));
    }
}
