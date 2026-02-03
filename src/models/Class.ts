export interface Subject {
  name: string;
  marks: number;
}

export interface ClassModel {
  id: string;
  className: string;
  classCode: string;
  subjects: string[];
}
export type CreateClass = Omit<ClassModel, "id">;