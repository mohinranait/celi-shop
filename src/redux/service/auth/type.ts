


export interface User {
  _id: string;
  name: string;
  phone: string;
  role: "User" | "Admin";
  status : "Active" | "Pending"
  createdAt: string;
  updatedAt: string;
}

export interface AutResponse  {
  success: boolean,
  message: string;
  payload: User
}

