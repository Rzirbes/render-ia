export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterResponse = {
  id: string;
  name?: string | null;
  email: string;
  credits?: number;
  createdAt?: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    name?: string | null;
    email: string;
  };
};

export type ApiErrorResponse = {
  message?: string | string[];
  error?: string | null;
  statusCode?: number;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};
