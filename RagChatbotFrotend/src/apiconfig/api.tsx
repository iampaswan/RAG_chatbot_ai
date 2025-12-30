import axios from 'axios';

// const url = 'http://localhost:4000';
const url = import.meta.env.VITE_API_URL;

export const getRagResponse = (question: string) => {
  return axios.post(`${url}`, { question });
}

export const getChats = () => {
  return axios.get(`${url}/chatHistory`);
}

// export const uploading = (formData: any) => {
//   return axios.post(`${url}/upload`, formData);
// }



export const uploading = (formData: FormData) => {
  return axios.post(`${url}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};