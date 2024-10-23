import {create} from "zustand";
import axios from "axios";


const API_URL= "http://localhost:5000/api/auth";
// Bu kod, Axios kütüphanesini kullanırken yapılan HTTP isteklerinde kimlik doğrulama bilgilerini (credentials) otomatik olarak sunucuya gönderilmesini sağlar. her istekte bu çerezlerin gönderilmesi sağlanır.
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,

    signup: async (email,password,name) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/signup`, {email,password,name});
            set({ user: response.data.user, isAuthenticated: true, isLoading: false})
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false})
            throw error 
        }
    },
    verifyEmail: async(code) => {
        set({ isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/verify-email`, {code})
            set({ user:response.data.user, isAuthenticated: true, isLoading: false})
            return response.data;
        } catch (error) {
            set({error: error.response.data.message || "Error verifying Email", isLoading: false})
            throw error;
        }
    },
    checkAuth: async() => {
        set({ isCheckingAuth: true, error: null});
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({ user: response.data.user, isAuthenticated: true, isLoading: false, error: null});
        } catch (error) {
            set({ error: null, isCheckingAuth: false, isAuthenticated: false})
        }
    },
    login: async(email,password) => {
        set({ isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/login`, {email,password});
            set({ user: response.data.user, isAuthenticated: true, isLoading: false, error: null})
        } catch (error) {
            set({ error: error.response?.data?.message || "Error signing up", isLoading: false})
            throw error 
        }
    },
    logout: async() => {
        set({isLoading: true, error: null})
        try {
            const response = await axios.post(`${API_URL}/logout`)
            set({
                user: null,
                isAuthenticated: false,
                error: null,
                isLoading: false
            })
        } catch (error) {
            set({
                error: "Error logging out", isLoading: false
            })
            throw error;
            
        }
    },
    forgotPassword: async(email)=> {
        set({isLoading: true, error: null, messsage: null})
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, {email})
            set({ message: response.data.message, isLoading: false})
        } catch (error) {
            set({isLoading: false,error: error.response.data.message || "Error sending reset password email"})
            throw error;
        }
    },
    resetPassword: async(token,password) => {
        set({ isLoading: true, error:null})
        try {
            const response = await axios.post (`${API_URL}/reset-password/${token}`, {password})
            set({ message: response.data.message, isLoading: false})
        } catch (error) {
            set({isLoading: false,error: error.response.data.message || "Error resetting password "})
            throw error;
        }
    }
}))