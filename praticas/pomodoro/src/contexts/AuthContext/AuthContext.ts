import { createContext } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<boolean>;

  logout: () => void;
};

export const AuthContext =
  createContext({} as AuthContextType);