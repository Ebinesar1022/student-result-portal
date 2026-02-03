export const regex = {
  name: /^[A-Za-z ]{3,50}$/,
  rollNo: /^STU\d{3,5}$/,
  password: /^.{6,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
  marks: /^(100|[1-9]?\d)$/
};
export const validateField = (value: string, pattern: RegExp) => {
  return pattern.test(value);
};
