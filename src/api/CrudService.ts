import axios from "axios";
import { ClassModel, CreateClass } from "../models/Class";
import { Student } from "../models/Student";
import { User } from "../models/User";
import { Teacher } from "../models/Teacher";

const API = "http://localhost:3000"; // ✅ ensure this matches json-server

export const CrudService = {
  /* ---------------- GENERIC METHODS ---------------- */

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

  /* ---------------- AUTH ---------------- */

  login: async (username: string, password: string) => {
    // ADMIN
    const usersRes = await axios.get<User[]>(`${API}/users`);
    const admin = usersRes.data.find(
      (u) => u.username === username && u.password === password
    );

    if (admin) {
      return { role: "admin" as const };
    }

    // TEACHER
    const teachersRes = await axios.get<Teacher[]>(
      `${API}/teachers?teacherNo=${username}&password=${password}`
    );

    if (teachersRes.data.length) {
      return {
        role: "teacher" as const,
        teacher: teachersRes.data[0],
      };
    }

    // STUDENT
    const studentsRes = await axios.get<Student[]>(
      `${API}/students?rollNo=${username}&password=${password}`
    );

    if (studentsRes.data.length) {
      return {
        role: "student" as const,
        rollNo: studentsRes.data[0].rollNo,
      };
    }

    return null;
  },

  /* ---------------- CLASS HELPERS ---------------- */

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

  /* ---------------- STUDENT HELPERS ---------------- */

  getStudentsByClass: async (classId: string) => {
    const res = await axios.get<Student[]>(
      `${API}/students?classId=${classId}`
    );
    return res.data;
  },
};
