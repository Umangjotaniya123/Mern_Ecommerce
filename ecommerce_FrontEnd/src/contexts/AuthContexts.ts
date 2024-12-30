import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import  UserContext from 'AuthContexts'

interface UserContextProps {
  user: string | null;
  setUser: (user: string) => void;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = Cookies.get('user');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const updateUser = (newUser: string) => {
    setUser(newUser);
    Cookies.set('user', newUser, { expires: 7 });
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
