import api from './axios';

export const login = (data) => api.post('/login', data);
export const getMe = () => api.get('/me');
export const register = (data) => api.post('/register', data);
export const verifyOTP = (data) => api.post('/verify-otp', data);
export const resendOTP = (data) => api.post('/resend-otp', data);
export const logout = () => api.post('/logout');
export const refreshToken = () => api.post('/refresh-token');
export const getTurnCredentials = async () => {
    const response = await api.get('/turn-credentials');
    return response.data;
};
