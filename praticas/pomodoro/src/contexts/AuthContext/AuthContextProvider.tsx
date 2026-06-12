import { useState } from 'react';

import { AuthContext } from './AuthContext';

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storageAuth = sessionStorage.getItem(
      'isAuthenticated',
    );

    return storageAuth === 'true';
  });

  async function login(
    email: string,
    password: string,
  ) {
    try {
      const response = await fetch(
        'http://localhost:3333/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      setIsAuthenticated(true);

      sessionStorage.setItem(
        'isAuthenticated',
        'true',
      );

      sessionStorage.setItem('token', data.token);

      sessionStorage.setItem(
        'user',
        JSON.stringify(data.user),
      );

      return true;
    } catch {
      return false;
    }
  }

  function logout() {
    setIsAuthenticated(false);

    sessionStorage.removeItem('isAuthenticated');

    sessionStorage.removeItem('token');

    sessionStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}