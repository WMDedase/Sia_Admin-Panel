import axios from "axios";

// Base API URL
const API_URL = "http://26.81.173.255:8000/api/";

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Function to fetch current user's data
export async function fetchCurrentUser() {
    try {
        const response = await api.get('user', {
            params: {
                with: 'studentProfile'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch current user');
    }
}

// Function to fetch documents for the current user
export async function fetchDocxForCurrentUser() {
    try {
        const response = await api.get('/borrowstatus/user');
        console.log('Borrow status API response:', response.data); // Log the response
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch borrow status data for the current user');
    }
}

// Function to post a document request
export async function postDocumentRequest(requestData) {
    try {
        const response = await api.post('/docreq', requestData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to submit document request');
    }
}

// Function to upload a profile picture
export async function uploadProfilePicture(formData) {
    try {
        const response = await api.post('/profilepic', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to upload profile picture');
    }
}

export default api;
