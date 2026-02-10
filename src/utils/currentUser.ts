export const getCurrentUser = () => {
  const raw = localStorage.getItem("currentUser");
  return raw ? JSON.parse(raw) : null;
};
