export interface Student {
  id: number;
  classId: string;
  className: string;
  name: string;
  rollNo: string;
  photo?: string
  password: string;
  phone: string;
  email: string;
  gender: string;
  section: string[];
  state: string;
  district: string;
  subjects: { name: string; marks: number }[];
}
