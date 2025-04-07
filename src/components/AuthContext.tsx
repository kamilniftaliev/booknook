"use client";

import axios from "axios";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { toast } from "sonner";
import { IAuthResponse, User as UserType } from "@/types";
import {
  logInFormSchema,
  signUpFormSchema,
  updateFormSchema,
} from "@/constants";
import { z } from "zod";
import { redirect, usePathname } from "next/navigation";

interface AuthContextType {
  user: UserType | null;
  isLoading: boolean;
  login: (values: z.infer<typeof logInFormSchema>) => void;
  logout: () => void;
  register: (values: z.infer<typeof signUpFormSchema>) => void;
  update: (values: z.infer<typeof updateFormSchema>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const path = usePathname();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) throw Error("Not authorized");

        const { data } = await axios.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data);
      } catch (err) {
        localStorage.removeItem("authToken");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const login = useCallback(async (values: z.infer<typeof logInFormSchema>) => {
    try {
      setIsLoading(true);

      const { data, statusText } = await axios.post<IAuthResponse>(
        "/api/login",
        {
          email: values.email,
          password: values.password,
        }
      );

      if (!data.user) {
        throw Error(statusText || "Something went wrong");
      }

      localStorage.setItem("authToken", data.token);

      setUser(data.user);
    } catch (err: any) {
      const e = err.response?.data || err;
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
  }, []);

  const register = useCallback(
    async (values: z.infer<typeof signUpFormSchema>) => {
      try {
        setIsLoading(true);

        const { data, statusText } = await axios.post<IAuthResponse>(
          "/api/register",
          {
            name: values.name,
            email: values.email,
            password: values.password,
          }
        );

        if (!data.user) {
          throw Error(statusText || "Something went wrong");
        }

        localStorage.setItem("authToken", data.token);

        setUser(data.user);

        toast.success(data.message);
      } catch (err: any) {
        const e = err.response?.data || err;
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const update = useCallback(
    async (values: z.infer<typeof updateFormSchema>) => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) throw Error("Not authorized");

        setIsLoading(true);

        const { data, statusText } = await axios.put<IAuthResponse>(
          "/api/profile",
          {
            name: values.name,
            email: values.email,
            password: values.password,
            confirmationPassword: values.confirmationPassword,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!data.user) {
          throw Error(statusText || "Something went wrong");
        }

        localStorage.setItem("authToken", data.token);

        setUser(data.user);

        toast.success(data.message);
      } catch (err: any) {
        const e = err.response?.data || err;
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const isAuthenticated = !!user;
  const isHomePage = path === "/";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isHomePage) {
      redirect("/");
    }
  }, [isAuthenticated, isLoading, isHomePage]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        update,
      }}
    >
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
