import axios from 'axios'

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (like 401) here
    if (error.response && error.response.status === 401) {
      // Handle unauthorized
      console.log('Unauthorized, redirecting to login...')
      // Add your redirect logic here
    }
    return Promise.reject(error)
  }
)

// Example endpoints
export const exampleApi = {
  getData: () => api.get('/data'),
  postData: (data) => api.post('/data', data),
  updateData: (id, data) => api.put(`/data/${id}`, data),
  deleteData: (id) => api.delete(`/data/${id}`),
}

export default api
