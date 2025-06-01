import axios from 'axios';

const API_URL = 'http://localhost:8001/api';

export const loginUser = async (email: string, contrasena: string) => {
  const { data } = await axios.post(`${API_URL}/login`, { email, contrasena });
  return data;
};

