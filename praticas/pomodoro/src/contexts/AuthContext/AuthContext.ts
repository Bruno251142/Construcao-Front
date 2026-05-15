import { createContext } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

export const AuthContext = createContext({} as AuthContextType);