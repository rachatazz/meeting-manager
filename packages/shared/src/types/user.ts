export type UserRole = 'recruiter' | 'interviewer' | 'admin';

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface IUserPublic {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}
