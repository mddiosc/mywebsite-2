import axios, { AxiosError, AxiosInstance } from 'axios'

interface ApiErrorResponse {
  message: string
  status?: number
}

const baseURL = (import.meta.env['VITE_API_URL'] as string) || 'http://localhost:3000'

const instance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const errorMessage = error.response?.data.message ?? 'An error occurred'
    return Promise.reject(new Error(errorMessage))
  },
)

export { instance as axiosInstance }
