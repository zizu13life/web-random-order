import { environment } from "src/environments/environment";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  googleId: string;
  isActive: boolean;
  isAdmin: boolean;
  avatar: string;
}

export const USER_API_BASE_URL = environment.baseApiUrl + 'users';