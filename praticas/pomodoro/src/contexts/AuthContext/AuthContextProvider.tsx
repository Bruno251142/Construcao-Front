import { useState } from 'react';

import { AuthContext } from './AuthContext';

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
  const storageAuth = sessionStorage.getItem('isAuthenticated');

  return storageAuth === 'true';
});

  function login(username: string, password: string) {
    const mockUser = '25114290088';
    const mockPassword = '20042004';

    if (username === mockUser && password === mockPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAuthenticated', 'true');

      return true;
    }

    return false;
  }

 function logout() {
  setIsAuthenticated(false);

  sessionStorage.removeItem('isAuthenticated');
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