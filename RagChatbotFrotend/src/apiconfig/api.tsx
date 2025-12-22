import axios from 'axios';

const url = 'http://localhost:4000';

export const getRagResponse = (question: string) => {
  return axios.post(`${url}`, { question });
}

export const clearChats = () => {
  return axios.post(`${url}/clearChats`);
}

export const getChats = () => {
  return axios.get(`${url}/chatHistory`);
}

export const uploading = (formData: any) => {
  return axios.post(`${url}/upload`, formData);
}