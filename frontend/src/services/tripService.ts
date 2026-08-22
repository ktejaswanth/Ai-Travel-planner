import { api } from './api';
import { ApiResponse } from '../types/api';
import { CreateTripRequest, Trip, UpdateTripRequest } from '../types/trip';

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    const response = await api.get<ApiResponse<Trip[]>>('/trips');
    return response.data.data;
  },

  async getTripById(tripId: string): Promise<Trip> {
    const response = await api.get<ApiResponse<Trip>>(`/trips/${tripId}`);
    return response.data.data;
  },

  async createTrip(data: CreateTripRequest): Promise<Trip> {
    const response = await api.post<ApiResponse<Trip>>('/trips', data);
    return response.data.data;
  },

  async updateTrip(tripId: string, data: UpdateTripRequest): Promise<Trip> {
    const response = await api.put<ApiResponse<Trip>>(`/trips/${tripId}`, data);
    return response.data.data;
  },

  async deleteTrip(tripId: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/trips/${tripId}`);
  },
};
