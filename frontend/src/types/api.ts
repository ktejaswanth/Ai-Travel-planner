export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  timestamp?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errorCode?: string;
  timestamp?: string;
}
