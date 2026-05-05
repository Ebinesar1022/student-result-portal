import axios from "axios";
import { ClassModel, CreateClass } from "../models/Class";
import { Student } from "../models/Student";

// Use environment variable for API URL, fallback to proxy or /api
const API = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5062/api');

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const CrudService = {

  get: async <T>(url: string): Promise<T> => {
    const res = await axios.get(`${API}${url}`);
    return res.data;
  },

  post: async <T>(url: string, data: any): Promise<T> => {
    const res = await axios.post(`${API}${url}`, data);
    return res.data;
  },

  put: async <T>(url: string, data: any): Promise<T> => {
    const res = await axios.put(`${API}${url}`, data);
    return res.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const res = await axios.delete(`${API}${url}`);
    return res.data;
  },


  login: async (username: string, password: string) => {
    try {
      const res = await axios.post(`${API}/auth/login`, { username, password });
      return res.data;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        return null;
      }

      // Retry once for transient first-request failures while the local API wakes up.
      await sleep(400);

      try {
        const retryRes = await axios.post(`${API}/auth/login`, {
          username,
          password,
        });
        return retryRes.data;
      } catch (retryError: any) {
        if (retryError?.response?.status === 401) {
          return null;
        }

        throw retryError;
      }
    }
  },


  getClasses: async () => {
    const res = await axios.get<ClassModel[]>(`${API}/classes`);
    return res.data;
  },

  addClass: async (data: CreateClass) =>
    axios.post(`${API}/classes`, data),

  updateClass: async (id: string, data: ClassModel) =>
    axios.put(`${API}/classes/${id}`, data),

  deleteClass: async (id: string) =>
    axios.delete(`${API}/classes/${id}`),


  getStudentsByClass: async (classId: string) => {
    const res = await axios.get<Student[]>(
      `${API}/students?classId=${classId}`
    );
    return res.data;
  },
};
