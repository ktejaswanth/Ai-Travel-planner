package com.tripwise.trip;

import com.tripwise.common.exception.BadRequestException;
import com.tripwise.common.exception.ResourceNotFoundException;
import com.tripwise.trip.dto.CreateTripRequest;
import com.tripwise.trip.dto.TripResponse;
import com.tripwise.trip.dto.UpdateTripRequest;
import com.tripwise.trip.model.Trip;
import com.tripwise.trip.model.TripStatus;
import com.tripwise.trip.repository.TripPreferenceRepository;
import com.tripwise.trip.repository.TripRepository;
import com.tripwise.trip.service.TripService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TripServiceTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private TripPreferenceRepository tripPreferenceRepository;

    @InjectMocks
    private TripService tripService;

    private Trip sampleTrip;
    private final String userId = "user-123";

    @BeforeEach
    void setUp() {
        sampleTrip = Trip.builder()
                .id("trip-456")
                .userId(userId)
                .title("Goa Vacation")
                .origin("Hyderabad")
                .destination("Goa")
                .startDate(LocalDate.of(2026, 9, 10))
                .endDate(LocalDate.of(2026, 9, 14))
                .travelers(2)
                .budget(30000.0)
                .currency("INR")
                .status(TripStatus.PLANNING)
                .build();
    }

    @Test
    @DisplayName("Should successfully create a trip")
    void createTrip_Success() {
        CreateTripRequest request = CreateTripRequest.builder()
                .title("Goa Vacation")
                .origin("Hyderabad")
                .destination("Goa")
                .startDate(LocalDate.of(2026, 9, 10))
                .endDate(LocalDate.of(2026, 9, 14))
                .travelers(2)
                .budget(30000.0)
                .currency("INR")
                .build();

        when(tripRepository.save(any(Trip.class))).thenReturn(sampleTrip);

        TripResponse response = tripService.createTrip(userId, request);

        assertNotNull(response);
        assertEquals("Goa Vacation", response.getTitle());
        assertEquals("Goa", response.getDestination());
        verify(tripRepository, times(1)).save(any(Trip.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException when end date is before start date")
    void createTrip_InvalidDates_ThrowsException() {
        CreateTripRequest request = CreateTripRequest.builder()
                .destination("Goa")
                .startDate(LocalDate.of(2026, 9, 14))
                .endDate(LocalDate.of(2026, 9, 10)) // invalid
                .travelers(2)
                .budget(30000.0)
                .build();

        assertThrows(BadRequestException.class, () -> tripService.createTrip(userId, request));
    }

    @Test
    @DisplayName("Should retrieve trips owned by the authenticated user")
    void getUserTrips_Success() {
        when(tripRepository.findByUserIdOrderByCreatedAtDesc(userId)).thenReturn(List.of(sampleTrip));
        when(tripPreferenceRepository.findByTripId("trip-456")).thenReturn(Optional.empty());

        List<TripResponse> trips = tripService.getUserTrips(userId);

        assertEquals(1, trips.size());
        assertEquals("Goa Vacation", trips.get(0).getTitle());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when user accesses another user's trip")
    void getTripById_UnauthorizedAccess_ThrowsException() {
        when(tripRepository.findByIdAndUserId("trip-456", "other-user")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tripService.getTripById("trip-456", "other-user"));
    }

    @Test
    @DisplayName("Should delete trip when user is owner")
    void deleteTrip_Success() {
        when(tripRepository.findByIdAndUserId("trip-456", userId)).thenReturn(Optional.of(sampleTrip));

        tripService.deleteTrip("trip-456", userId);

        verify(tripPreferenceRepository, times(1)).deleteByTripId("trip-456");
        verify(tripRepository, times(1)).delete(sampleTrip);
    }
}
