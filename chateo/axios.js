import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob, encode as btoa } from 'base-64';

const instance = axios.create({
    baseURL: 'http://192.168.43.223:80/api/',
    timeout: 5000,
    headers: {
        Authorization: async () => {
            try {
                const accessToken = await AsyncStorage.getItem('access_token');
                console.log('Access Token:', accessToken); // Log the access token
                return accessToken ? `JWT ${accessToken}` : null;
            } catch (error) {
                console.error('Error retrieving access token:', error);
                throw error; // Rethrow the error to be caught later
            }
        },
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (typeof error.response === 'undefined') {
            console.error('Server problem');
            return Promise.reject(error);
        }

        if (
            error.response.status === 401 &&
            originalRequest.url === instance.defaults.baseURL + 'account/token/refresh/'
        ) {
            console.error('Token refresh request failed. Redirect to login site');
            return Promise.reject(error);
        }

        if (
            (error.response.status === 401 || error.response.status === 'Unauthorized') &&
            error.response.data.code === 'token_not_valid'
        ) {
            console.log('Attempting token refresh...');
            
            try {
                const refreshToken = await AsyncStorage.getItem('refresh_token');
                console.log('Refresh Token:', refreshToken);

                if (refreshToken) {
                    const token = JSON.parse(atob(refreshToken.split('.')[1]));
                    const now = Math.ceil(Date.now() / 1000);
                    console.log('Token expiration:', token.exp);
                    
                    if (token.exp > now) {
                        console.log('Refreshing token...');
                        
                        try {
                            const response = await instance.post('account/token/refresh/', { refresh: refreshToken });
                            console.log('Token refresh successful:', response.data);
                            if (response.data.access) {
                                AsyncStorage.setItem('access_token', response.data.access);
                            }
                            if (response.data.refresh) {
                                AsyncStorage.setItem('refresh_token', response.data.refresh);
                            }
                            instance.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
                            originalRequest.headers['Authorization'] = 'JWT ' + response.data.access;

                            console.log('Retrying original request after token refresh...');
                            return instance(originalRequest);
                        } catch (refreshError) {
                            console.error('Token refresh failed:', refreshError);
                            throw refreshError; // Rethrow the error to be caught later
                        }
                    } else {
                        console.log('Refresh token is expired', token.exp, now);
                        console.error('Redirect to login site');
                    }
                } else {
                    console.error('Refresh token is not available');
                    console.error('Redirect to login site');
                }
            } catch (asyncStorageError) {
                console.error('Error retrieving refresh token from AsyncStorage:', asyncStorageError);
                throw asyncStorageError; // Rethrow the error to be caught later
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
