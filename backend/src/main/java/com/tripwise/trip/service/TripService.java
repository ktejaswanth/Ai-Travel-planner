package com.tripwise.trip.service;

import com.tripwise.common.exception.BadRequestException;
import com.tripwise.common.exception.ResourceNotFoundException;
import com.tripwise.trip.dto.*;
import com.tripwise.trip.model.Trip;
import com.tripwise.trip.model.TripPreference;
import com.tripwise.trip.model.TripStatus;
import com.tripwise.trip.repository.TripPreferenceRepository;
import com.tripwise.trip.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final TripPreferenceRepository tripPreferenceRepository;

    public TripResponse createTrip(String userId, CreateTripRequest request) {
        validateDates(request.getStartDate(), request.getEndDate());

        String title = request.getTitle();
        if (title == null || title.isBlank()) {
            title = "Trip to " + request.getDestination();
        }

        Trip trip = Trip.builder()
                .userId(userId)
                .title(title)
                .origin(request.getOrigin())
                .destination(request.getDestination())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .travelers(request.getTravelers())
                .budget(request.getBudget())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .status(TripStatus.PLANNING)
                .build();

        Trip savedTrip = tripRepository.save(trip);

        TripPreference preference = null;
        if (request.getPreferences() != null) {
            preference = TripPreference.builder()
                    .tripId(savedTrip.getId())
                    .interests(request.getPreferences().getInterests())
                    .travelStyle(request.getPreferences().getTravelStyle())
                    .pace(request.getPreferences().getPace())
                    .accommodationPreference(request.getPreferences().getAccommodationPreference())
                    .transportPreference(request.getPreferences().getTransportPreference())
                    .dietaryPreference(request.getPreferences().getDietaryPreference())
                    .specialRequirements(request.getPreferences().getSpecialRequirements())
                    .build();
            preference = tripPreferenceRepository.save(preference);
        }

        return mapToTripResponse(savedTrip, preference);
    }

    public List<TripResponse> getUserTrips(String userId) {
        List<Trip> trips = tripRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return trips.stream()
                .map(trip -> {
                    Optional<TripPreference> pref = tripPreferenceRepository.findByTripId(trip.getId());
                    return mapToTripResponse(trip, pref.orElse(null));
                })
                .collect(Collectors.toList());
    }

    public TripResponse getTripById(String tripId, String userId) {
        Trip trip = tripRepository.findByIdAndUserId(tripId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found or unauthorized access"));
        Optional<TripPreference> pref = tripPreferenceRepository.findByTripId(trip.getId());
        return mapToTripResponse(trip, pref.orElse(null));
    }

    public TripResponse updateTrip(String tripId, String userId, UpdateTripRequest request) {
        validateDates(request.getStartDate(), request.getEndDate());

        Trip trip = tripRepository.findByIdAndUserId(tripId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found or unauthorized access"));

        trip.setTitle(request.getTitle() != null && !request.getTitle().isBlank() ? request.getTitle() : "Trip to " + request.getDestination());
        trip.setOrigin(request.getOrigin());
        trip.setDestination(request.getDestination());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setTravelers(request.getTravelers());
        trip.setBudget(request.getBudget());
        if (request.getCurrency() != null) {
            trip.setCurrency(request.getCurrency());
        }
        if (request.getStatus() != null) {
            trip.setStatus(request.getStatus());
        }

        Trip updatedTrip = tripRepository.save(trip);

        TripPreference preference = null;
        if (request.getPreferences() != null) {
            Optional<TripPreference> existingPref = tripPreferenceRepository.findByTripId(tripId);
            TripPreference prefToSave = existingPref.orElseGet(() -> TripPreference.builder().tripId(tripId).build());

            prefToSave.setInterests(request.getPreferences().getInterests());
            prefToSave.setTravelStyle(request.getPreferences().getTravelStyle());
            prefToSave.setPace(request.getPreferences().getPace());
            prefToSave.setAccommodationPreference(request.getPreferences().getAccommodationPreference());
            prefToSave.setTransportPreference(request.getPreferences().getTransportPreference());
            prefToSave.setDietaryPreference(request.getPreferences().getDietaryPreference());
            prefToSave.setSpecialRequirements(request.getPreferences().getSpecialRequirements());

            preference = tripPreferenceRepository.save(prefToSave);
        } else {
            preference = tripPreferenceRepository.findByTripId(tripId).orElse(null);
        }

        return mapToTripResponse(updatedTrip, preference);
    }

    public void deleteTrip(String tripId, String userId) {
        Trip trip = tripRepository.findByIdAndUserId(tripId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found or unauthorized access"));

        tripPreferenceRepository.deleteByTripId(trip.getId());
        tripRepository.delete(trip);
    }

    private void validateDates(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        if (endDate.isBefore(startDate)) {
            throw new BadRequestException("End date (" + endDate + ") cannot be before start date (" + startDate + ")");
        }
    }

    private TripResponse mapToTripResponse(Trip trip, TripPreference preference) {
        TripPreferenceDto prefDto = null;
        if (preference != null) {
            prefDto = TripPreferenceDto.builder()
                    .interests(preference.getInterests())
                    .travelStyle(preference.getTravelStyle())
                    .pace(preference.getPace())
                    .accommodationPreference(preference.getAccommodationPreference())
                    .transportPreference(preference.getTransportPreference())
                    .dietaryPreference(preference.getDietaryPreference())
                    .specialRequirements(preference.getSpecialRequirements())
                    .build();
        }

        return TripResponse.builder()
                .id(trip.getId())
                .userId(trip.getUserId())
                .title(trip.getTitle())
                .origin(trip.getOrigin())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .travelers(trip.getTravelers())
                .budget(trip.getBudget())
                .currency(trip.getCurrency())
                .status(trip.getStatus())
                .preferences(prefDto)
                .createdAt(trip.getCreatedAt())
                .updatedAt(trip.getUpdatedAt())
                .build();
    }
}
