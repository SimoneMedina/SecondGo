'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '@/lib/api';
import { AuthResponse, TipoUsuario } from '@/lib/types';

interface User {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  tipo_usuario: TipoUsuario;
}

interface RegisterData {
  nombres_usuario: string;
  apellidos_usuario: string;
  correo_usuario: string;
  contrasena_usuario: string;
  ubicacion_usuario: number;
  tipo_usuario: TipoUsuario;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (correo: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelado = false;

    queueMicrotask(() => {
      if (cancelado) return;

      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('usuario');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }

      setLoading(false);
    });

    return () => {
      cancelado = true;
    };
  }, []);

  const login = async (correo: string, password: string) => {
    const { data } = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', { correo, password });
    const { access_token, usuario } = data.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setToken(access_token);
    setUser(usuario);
  };

  const register = async (userData: RegisterData) => {
    const { data } = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', userData);
    const { access_token, usuario } = data.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setToken(access_token);
    setUser(usuario);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
