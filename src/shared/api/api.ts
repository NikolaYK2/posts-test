import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://dummyjson.com', // или твой бэкенд, если уже есть
  headers: {
    'Content-Type': 'application/json',
  },
})

