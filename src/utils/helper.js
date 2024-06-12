import axios from 'axios'

const baseURL = 'http://localhost:4000'

export const apiHelper = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiHelper.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

