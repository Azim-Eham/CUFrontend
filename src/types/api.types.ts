export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    result: T[];
  };
}

export interface SingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errorSources?: { path: string; message: string }[];
  errorMessages?: { path: string; message: string }[];
}

export interface QueryParams {
  searchTerm?: string;
  sort?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}
