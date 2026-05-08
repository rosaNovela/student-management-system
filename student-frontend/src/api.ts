import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getStudents = async () => {
    const response = await api.get('/students');
    return response.data;
};

// New function to handle searching by name
export const searchStudents = async (name: string) => {
    const response = await api.get(`/students/search?name=${name}`);
    return response.data;
};