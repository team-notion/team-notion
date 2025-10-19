// // src/context/AuthContext.tsx
// import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
// import { LOCAL_STORAGE_KEYS } from '../utils/localStorageKeys';
// import { decodeJWT } from '../utils/decoder';
// import { toast } from 'sonner';

// interface User {
//   id: string;
//   email: string;
//   name?: string;
//   userType?: string;
//   avatar?: string;
// }

// interface AuthContextType {
//   isAuthenticated: boolean;
//   user: User | null;
//   logout: () => void;
//   login: (token: string, userData?: any, rememberMe?: boolean) => void;
//   checkSession: () => boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [sessionTimeoutId, setSessionTimeoutId] = useState<NodeJS.Timeout | null>(null);


//   const getStorage = useCallback((key: string): string | null => {
//     const localValue = localStorage.getItem(key);
//     if (localValue) return localValue;
//     return sessionStorage.getItem(key);
//   }, []);


//   const setStorage = useCallback((key: string, value: string, rememberMe: boolean = true) => {
//     if (rememberMe) {
//       localStorage.setItem(key, value);
//       sessionStorage.removeItem(key);
//     } else {
//       sessionStorage.setItem(key, value);
//       localStorage.removeItem(key);
//     }
//   }, []);


//   const removeStorage = useCallback((key: string) => {
//     localStorage.removeItem(key);
//     sessionStorage.removeItem(key);
//   }, []);


//   const isSanctumToken = useCallback((token: string): boolean => {
//     return token.includes('|');
//   }, []);



//   const isTokenExpired = useCallback((token: string): boolean => {
//     if (isSanctumToken(token)) {
//       return false;
//     }

//     try {
//       const decoded = decodeJWT(token);
//       if (decoded && decoded.exp) {
//         const currentTime = Math.floor(Date.now() / 1000);
//         return decoded.exp < currentTime;
//       }
//       return false;
//     }
//     catch (err) {
//       return false;
//     }
//   }, [isSanctumToken])


//   const getTokenExpirationTime = useCallback((token: string): number | null => {
//     if (isSanctumToken(token)) {
//       return null;
//     }

//     try {
//       const decoded = decodeJWT(token);
//       return decoded && decoded.exp ? decoded.exp : null;
//     }
//     catch (err) {
//       return null;
//     }
//   }, [isSanctumToken]);
  
  
//   const handleSessionExpired = useCallback(() => {
//     if (sessionTimeoutId) {
//       clearTimeout(sessionTimeoutId);
//       setSessionTimeoutId(null);
//     }

//     removeStorage(LOCAL_STORAGE_KEYS.TOKEN);
//     removeStorage(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
//     removeStorage(LOCAL_STORAGE_KEYS.USER);
//     removeStorage(LOCAL_STORAGE_KEYS.IS_USER_EXIST);
//     removeStorage(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);
//     removeStorage(LOCAL_STORAGE_KEYS.REFRESH_TOKEN_USER_ID);
//     removeStorage(LOCAL_STORAGE_KEYS.REMEMBER_ME);
    
//     setIsAuthenticated(false);
//     setUser(null);

//     window.location.href = '/login';
//   }, [sessionTimeoutId, removeStorage]);



//   const checkSession = useCallback((): boolean => {
//     const token = getStorage(LOCAL_STORAGE_KEYS.TOKEN);
//     if (!token) return false;

//     const expired = isTokenExpired(token);
//     if (expired) {
//       handleSessionExpired();
//       toast.error('Your session has expired. Please log in again');
//       return false;
//     }

//     return true;
//   }, [isTokenExpired, handleSessionExpired, getStorage]);



//   const setupSessionTimeout = useCallback((token: string) => {
//     if (sessionTimeoutId) {
//       clearTimeout(sessionTimeoutId);
//     }

//     if (isSanctumToken(token)) {
//       return;
//     }

//     const expirationTime = getTokenExpirationTime(token);
//     if (!expirationTime) return;

//     const currentTime = Math.floor(Date.now() / 1000);
//     const timeToExpire = expirationTime - currentTime;

//     // If token is already expired or will expire very soon
//     if (timeToExpire <= 0) {
//       handleSessionExpired();
//       return;
//     }

//     const warningTime = Math.max(0, (timeToExpire - 300) * 1000);

//     if (warningTime > 0) {
//       setTimeout(() => {
//         toast.warning('Your session will expire in 5 minutes.');
//       }, warningTime);
//     }

//     const expirationTimeout = setTimeout(() => {
//       toast.error('Your session has expired. Please log in again.');
//       handleSessionExpired();
//     }, timeToExpire * 1000);

//     setSessionTimeoutId(expirationTimeout);
//   }, [handleSessionExpired, getTokenExpirationTime, sessionTimeoutId]);


//   const login = useCallback((token: string, userData: any, rememberMe: boolean = false) => {
//     setStorage(LOCAL_STORAGE_KEYS.TOKEN, token, rememberMe);
//     setStorage(LOCAL_STORAGE_KEYS.IS_USER_EXIST, "true", rememberMe);
//     setStorage(LOCAL_STORAGE_KEYS.REMEMBER_ME, rememberMe.toString(), rememberMe);

//     const safeUserData = {
//       // id: userData.id,
//       // email: userData.email,
//       // userType: userData.userType,
//       // name: userData.name,
//       // avatar: userData.avatar,
//     }

//     setStorage(LOCAL_STORAGE_KEYS.USER, JSON.stringify(safeUserData), rememberMe);

//     if (!isSanctumToken(token)) {
//       try {
//         const decoded = decodeJWT(token);
//         if (decoded?.user_id) {
//           setStorage(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID, decoded.user_id, rememberMe);
//         }
//       }
//       catch (err) {
//         console.error("Error decoding token:", err);
//       }
//     }

//     // setUser(safeUserData);
//     setIsAuthenticated(true);

//     setupSessionTimeout(token);

//     // toast.success(`Welcome ${safeUserData.name ? ', ' + safeUserData.name : ''}!`);
//   }, [setupSessionTimeout, setStorage, isSanctumToken]);



//   const logout = useCallback(() => {
//     if (sessionTimeoutId) {
//       clearTimeout(sessionTimeoutId);
//       setSessionTimeoutId(null);
//     }

//     removeStorage(LOCAL_STORAGE_KEYS.TOKEN);
//     removeStorage(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
//     removeStorage(LOCAL_STORAGE_KEYS.USER);
//     removeStorage(LOCAL_STORAGE_KEYS.IS_USER_EXIST);
//     removeStorage(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);
//     removeStorage(LOCAL_STORAGE_KEYS.REFRESH_TOKEN_USER_ID);
//     removeStorage(LOCAL_STORAGE_KEYS.REMEMBER_ME);

//     setIsAuthenticated(false);
//     setUser(null);

//     toast.success('Logged out successfully');
//   }, [sessionTimeoutId, removeStorage]);



//   useEffect(() => {
//     // Check if user is authenticated on mount
//     const token = getStorage(LOCAL_STORAGE_KEYS.TOKEN);
//     const userDataStr = getStorage(LOCAL_STORAGE_KEYS.USER);
//     const rememberMeStr = getStorage(LOCAL_STORAGE_KEYS.REMEMBER_ME);

//     if (token && userDataStr) {
//       try {
//         const expired = isTokenExpired(token);
//         const userData = JSON.parse(userDataStr);
//         const isRemembered = rememberMeStr === 'true';

//         if (!expired) {
//           setUser(userData);
//           setIsAuthenticated(true);
//           setupSessionTimeout(token);
//         }
//         else {
//           handleSessionExpired();
//         }
//       }
//       catch (err) {
//         console.error('Error parsing user data:', err);
//         handleSessionExpired();
//       }
//     }

//     return () => {
//       if (sessionTimeoutId) {
//         clearTimeout(sessionTimeoutId);
//       }
//     };
//   }, []);



//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, login, logout, checkSession }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };





















// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { LOCAL_STORAGE_KEYS } from '../utils/localStorageKeys';
import { decodeJWT } from '../utils/decoder';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  username?: string;
  userType?: string;
  profile_image?: string;
  phone_no?: string;
  country_code?: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  login: (token: string, userData: User, rememberMe?: boolean) => void;
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


  const getStorage = useCallback((key: string): string | null => {
    const localValue = localStorage.getItem(key);
    if (localValue) return localValue;
    return sessionStorage.getItem(key);
  }, []);


  const setStorage = useCallback((key: string, value: string, rememberMe: boolean = true) => {
    if (rememberMe) {
      localStorage.setItem(key, value);
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, value);
      localStorage.removeItem(key);
    }
  }, []);


  const removeStorage = useCallback((key: string) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }, []);


  const isTokenExpired = (token: string): boolean => {
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
  }


  const getTokenExpirationTime = (token: string): number | null => {
    try {
      const decoded = decodeJWT(token);
      return decoded && decoded.exp ? decoded.exp : null;
    }
    catch (err) {
      return null;
    }
  };
  
  
  const handleSessionExpired = () => {
    if (sessionTimeoutId) {
      clearTimeout(sessionTimeoutId);
      setSessionTimeoutId(null);
    }

    removeStorage(LOCAL_STORAGE_KEYS.TOKEN);
    removeStorage(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    removeStorage(LOCAL_STORAGE_KEYS.USER);
    removeStorage(LOCAL_STORAGE_KEYS.IS_USER_EXIST);
    removeStorage(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);
    removeStorage(LOCAL_STORAGE_KEYS.REFRESH_TOKEN_USER_ID);
    removeStorage(LOCAL_STORAGE_KEYS.REMEMBER_ME);
    
    setIsAuthenticated(false);
    setUser(null);

    window.location.href = '/login';
  };



  const checkSession = (): boolean => {
    const token = getStorage(LOCAL_STORAGE_KEYS.TOKEN);
    if (!token) return false;

    const expired = isTokenExpired(token);
    if (expired) {
      handleSessionExpired();
      toast.error('Your session has expired. Please log in again');
      return false;
    }

    return true;
  };



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

    const warningTime = Math.max(0, (timeToExpire - 300) * 1000);

    if (warningTime > 0) {
      setTimeout(() => {
        toast.warning('Your session will expire in 5 minutes.');
      }, warningTime);
    }

    const expirationTimeout = setTimeout(() => {
      toast.error('Your session has expired. Please log in again.');
      handleSessionExpired();
    }, timeToExpire * 1000);

    setSessionTimeoutId(expirationTimeout);
  }, [handleSessionExpired, getTokenExpirationTime, sessionTimeoutId]);


  const login = useCallback((token: string, userData: any, rememberMe: boolean = false) => {
    setStorage(LOCAL_STORAGE_KEYS.TOKEN, token, rememberMe);
    setStorage(LOCAL_STORAGE_KEYS.IS_USER_EXIST, "true", rememberMe);
    setStorage(LOCAL_STORAGE_KEYS.REMEMBER_ME, rememberMe.toString(), rememberMe);

    const safeUserData = {
      id: userData.id,
      email: userData.email,
      userType: userData.userType,
      username: userData.username,
      profile_image: userData.profile_image,
      phone_no: userData.phone_no,
      country_code: userData.country_code,
      first_name: userData.first_name,
      last_name: userData.last_name,
    }

    setStorage(LOCAL_STORAGE_KEYS.USER, JSON.stringify(safeUserData), rememberMe);

    const decoded = decodeJWT(token);
    if (decoded?.user_id) {
      setStorage(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID, decoded.user_id, rememberMe);
    }

    setUser(userData);
    setIsAuthenticated(true);

    setupSessionTimeout(token);

    toast.success(`Welcome ${safeUserData.username ? ', ' + safeUserData.username : ''}!`);
  }, [setupSessionTimeout]);



  const logout = useCallback(() => {
    if (sessionTimeoutId) {
      clearTimeout(sessionTimeoutId);
      setSessionTimeoutId(null);
    }

    removeStorage(LOCAL_STORAGE_KEYS.TOKEN);
    removeStorage(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    removeStorage(LOCAL_STORAGE_KEYS.USER);
    removeStorage(LOCAL_STORAGE_KEYS.IS_USER_EXIST);
    removeStorage(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);
    removeStorage(LOCAL_STORAGE_KEYS.REFRESH_TOKEN_USER_ID);
    removeStorage(LOCAL_STORAGE_KEYS.REMEMBER_ME);

    setIsAuthenticated(false);
    setUser(null);

    toast.success('Logged out successfully');
  }, [sessionTimeoutId, removeStorage]);



  useEffect(() => {
    // Check if user is authenticated on mount
    const token = getStorage(LOCAL_STORAGE_KEYS.TOKEN);
    const userDataStr = getStorage(LOCAL_STORAGE_KEYS.USER);
    const rememberMeStr = getStorage(LOCAL_STORAGE_KEYS.REMEMBER_ME);

    if (token && userDataStr) {
      try {
        const expired = isTokenExpired(token);
        const userData = JSON.parse(userDataStr);
        const isRemembered = rememberMeStr === 'true';

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