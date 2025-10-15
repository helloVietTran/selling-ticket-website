import React, { createContext, useState, useContext, type ReactNode, useEffect } from "react";
import type { User } from "@/types";
import { LOCAL_STORAGE_KEYS } from "@/constant";
import { logout as logoutApi, verifyToken } from "@/api/authApi"

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        if (!token) return;

        await verifyToken({ accessToken: token });

        // nếu mở rộng trong tương lai
        // if (res?.data?.user) {
        //   setUser(res.data.user);
        // }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkToken();
  }, []);


  const login = (userData: User, token: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      if (!token) return;
      await logoutApi({ accessToken: token })

      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
