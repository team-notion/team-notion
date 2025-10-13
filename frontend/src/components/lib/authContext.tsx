// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { LOCAL_STORAGE_KEYS } from '../utils/localStorageKeys';
import { decodeJWT } from '../utils/decoder';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name?: string;
  userType?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  login: (userData: User, token: string, refreshToken: string) => void;
  checkSession: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [sessionTimeoutId, setSessionTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // Check if token is expired
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const decoded = decodeJWT(token);
      if (decoded && decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
      }
      return true;
    }
    catch (err) {
      return false;
    }
  }, [])


  const getTokenExpirationTime = useCallback((token: string): number | null => {
    try {
      const decoded = decodeJWT(token);
      return decoded && decoded.exp ? decoded.exp : null;
    }
    catch (err) {
      return null;
    }
  }, []);
  
  
  const handleSessionExpired = useCallback(() => {
      if (sessionTimeoutId) {
      clearTimeout(sessionTimeoutId);
      setSessionTimeoutId(null);
    }

    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_USER_EXIST);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN_USER_ID);
    
    setIsAuthenticated(false);
    setUser(null);
  }, [sessionTimeoutId]);



  const checkSession = useCallback((): boolean => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    if (!token) return false;

    const expired = isTokenExpired(token);
    if (expired) {
      handleSessionExpired();
      toast.error('Your session has expired. Please log in again');
      return false;
    }

    return true;
  }, [isTokenExpired, handleSessionExpired]);



  const setupSessionTimeout = useCallback((token: string) => {
    if (sessionTimeoutId) {
      clearTimeout(sessionTimeoutId);
    }

    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeToExpire = expirationTime - currentTime;

    // If token is already expired or will expire very soon
    if (timeToExpire <= 0) {
      handleSessionExpired();
      return;
    }

    const expirationTimeout = setTimeout(() => {
      toast.warning('Your session is about to expire. Please log in again.');
      handleSessionExpired();
    }, timeToExpire * 1000);

    setSessionTimeoutId(expirationTimeout);
  }, [handleSessionExpired, getTokenExpirationTime, sessionTimeoutId]);


  const login = useCallback((userData: any, token: string, refreshToken: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(LOCAL_STORAGE_KEYS.IS_USER_EXIST, "true");

    const safeUserData = {
      id: userData.id,
      email: userData.email,
      userType: userData.userType,
      name: userData.name || '',
    }

    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(safeUserData));

    try {
      const decoded = decodeJWT(token);
      if (decoded.sub) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID, decoded.sub);
      }
    }
    catch (err) {
        console.error("Error decoding token:", err);
    }

    setUser(safeUserData);
    setIsAuthenticated(true);

    setupSessionTimeout(token);
  }, [setupSessionTimeout]);



  const logout = useCallback(() => {
    if (sessionTimeoutId) {
      clearTimeout(sessionTimeoutId);
      setSessionTimeoutId(null);
    }

    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_USER_EXIST);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN_USER_ID);

    setIsAuthenticated(false);
    setUser(null);

    toast.success('Logged out successfully');
  }, [sessionTimeoutId]);


  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    const userDataStr = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);

    if (token && userDataStr) {
      try {
        const expired = isTokenExpired(token);
        const userData = JSON.parse(userDataStr);

        if (!expired) {
          setUser(userData);
          setIsAuthenticated(true);
          setupSessionTimeout(token);
        }
        else {
          handleSessionExpired();
        }
      }
      catch (err) {
        console.error('Error parsing user data:', err);
        handleSessionExpired();
      }
    }

    return () => {
      if (sessionTimeoutId) {
        clearTimeout(sessionTimeoutId);
      }
    };
  }, []);



  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};