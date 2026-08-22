import { api } from './api';
import { ApiResponse } from '../types/api';
import { UpdateUserRequest, User } from '../types/user';

export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/users/me');
    return response.data.data;
  },

  async updateProfile(data: UpdateUserRequest): Promise<User> {
    const response = await api.put<ApiResponse<User>>('/users/me', data);
    return response.data.data;
  },
};
