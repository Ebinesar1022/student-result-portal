import axios from "axios";
import { ClassModel,CreateClass } from "../models/Class";
import { Student } from "../models/Student";
import { User } from "../models/User";

const API = "http://localhost:3000";

export const CrudService = {
  login: async (username: string, password: string) => {
    const usersRes = await axios.get<User[]>(`${API}/users`);
    const admin = usersRes.data.find(
      (u) => u.username === username && u.password === password
    );

    if (admin) {
      return { role: "admin" as const };
    }

    const studentsRes = await axios.get<Student[]>(
      `${API}/students?rollNo=${username}&password=${password}`
    );

    if (studentsRes.data.length > 0) {
      return {
        role: "student" as const,
        rollNo: studentsRes.data[0].rollNo
      };
    }

    return null;
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

 getStudentByRoll: async (rollNo: string): Promise<Student | null> => {
  const res = await axios.get(`${API}/students?rollNo=${rollNo}`);
  return res.data[0] || null;
},


  getStudentsByClass: async (classId: string) => {
    const res = await axios.get<Student[]>(
      `${API}/students?classId=${classId}`
    );
    return res.data;
  },
  getStudentById: async (id: string) => {
  const res = await axios.get(`${API}/students/${id}`);
  return res.data;
},


  addStudent: async (data: Student) =>
    axios.post(`${API}/students`, data),

  updateStudent: async (id: number, data: Student) =>
    axios.put(`${API}/students/${id}`, data),

  deleteStudent: async (id: number) =>
    axios.delete(`${API}/students/${id}`)
};
