export interface ApiError {
  status: number;
  code: string;
  message: string;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
