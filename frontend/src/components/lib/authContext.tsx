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
import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { LOCAL_STORAGE_KEYS } from '../utils/localStorageKeys';
import { decodeJWT } from '../utils/decoder';
import { toast } from 'sonner';
import { getData } from './apiMethods';
import CONFIG from '../utils/config';
import { apiEndpoints } from './apiEndpoints';

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
  accessToken: string | null;
  logout: () => void;
  login: (token: string, refreshToken: string, userData: User, rememberMe?: boolean) => void;
  checkSession: () => boolean;
  refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_REFRESH_THRESHOLD = 120;

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [sessionTimeoutId, setSessionTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [refreshTimeoutId, setRefreshTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const refreshInProgressRef = useRef(false);


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


  const isTokenAboutToExpire = (token: string): boolean => {
    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeToExpire = expirationTime - currentTime;

    return timeToExpire <= TOKEN_REFRESH_THRESHOLD && timeToExpire > 0;
  }


  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    if (refreshInProgressRef.current) {
      return false;
    }

    refreshInProgressRef.current = true;

    
    try {
      const refreshToken = getStorage(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        handleSessionExpired();
        return false;
      }

      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.REFRESH_TOKEN}`, {
        data: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.status !== 200) {
        if (response.status === 401) {
          handleSessionExpired();
        }
        return false;
      }

      const data = response.data;
      const { accessToken: access } = data;

      const rememberMe = getStorage(LOCAL_STORAGE_KEYS.REMEMBER_ME) === 'true';
      setStorage(LOCAL_STORAGE_KEYS.TOKEN, access, rememberMe);

      if (access) {
        removeStorage(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
      }

      setAccessToken(access);
      setupTokenRefreshTimeout(access);

      return true;

    }
    catch (error) {
      handleSessionExpired();
      return false;
    }
    finally {
      refreshInProgressRef.current = false;
    }
  }, [getStorage, setStorage]);
  
  
  const handleSessionExpired = () => {
    if (sessionTimeoutId) {
      clearTimeout(sessionTimeoutId);
      setSessionTimeoutId(null);
    }

    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId);
      setRefreshTimeoutId(null);
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
    setAccessToken(null);

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



  const setupTokenRefreshTimeout = useCallback((token: string) => {
    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId);
    }

    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeToExpire = expirationTime - currentTime;

    if (timeToExpire <= 0) {
      handleSessionExpired();
      return;
    }

    const refreshTime = Math.max(0, (timeToExpire - TOKEN_REFRESH_THRESHOLD) * 1000);

    if (refreshTime > 0) {
      const timeout = setTimeout(async () => {
        refreshAccessToken();
      }, refreshTime);

      setRefreshTimeoutId(timeout);
    }
    else if (timeToExpire <= TOKEN_REFRESH_THRESHOLD) {
      refreshAccessToken();
    }
  }, [refreshTimeoutId, refreshAccessToken, getTokenExpirationTime]);



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

    // const warningTime = Math.max(0, (timeToExpire - 300) * 1000);

    // if (warningTime > 0) {
    //   setTimeout(() => {
    //     toast.warning('Your session will expire in 5 minutes.');
    //   }, warningTime);
    // }

    const expirationTimeout = setTimeout(() => {
      toast.error('Your session has expired. Please log in again.');
      handleSessionExpired();
    }, timeToExpire * 1000);

    setSessionTimeoutId(expirationTimeout);
  }, [sessionTimeoutId]);


  const login = useCallback((token: string, refreshToken: string, userData: User, rememberMe: boolean = false) => {
    setStorage(LOCAL_STORAGE_KEYS.TOKEN, token, rememberMe);
    setStorage(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshToken, rememberMe);
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
    setAccessToken(token);
    setIsAuthenticated(true);

    setupSessionTimeout(token);
    setupTokenRefreshTimeout(token);

    toast.success(`Welcome ${safeUserData.username ? ', ' + safeUserData.username : ''}!`);
  }, [setupSessionTimeout, setupTokenRefreshTimeout, setStorage]);


  const logout = useCallback(() => {
    if (sessionTimeoutId) {
      clearTimeout(sessionTimeoutId);
      setSessionTimeoutId(null);
    }

    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId);
      setRefreshTimeoutId(null);
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
    setAccessToken(null);

    toast.success('Logged out successfully');
  }, [sessionTimeoutId, refreshTimeoutId, removeStorage]);


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
          setAccessToken(token);
          setIsAuthenticated(true);
          setupSessionTimeout(token);
          setupTokenRefreshTimeout(token);
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
      if (refreshTimeoutId) {
        clearTimeout(refreshTimeoutId);
      }
    };
  }, []);



  return (
    <AuthContext.Provider value={{ isAuthenticated, user, accessToken, login, logout, checkSession, refreshAccessToken }}>
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

















// import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
// import { LOCAL_STORAGE_KEYS } from '../utils/localStorageKeys';
// import { decodeJWT } from '../utils/decoder';
// import { toast } from 'sonner';
// import { jwtDecode } from 'jwt-decode';
// import CONFIG from '../utils/config';
// import { apiEndpoints } from './apiEndpoints';
// import { postData } from './apiMethods';

// interface JWTPayload {
//   exp: number;
//   iat: number;
// }

// interface User {
//   id: string;
//   email: string;
//   username?: string;
//   userType?: string;
//   profile_image?: string;
//   phone_no?: string;
//   country_code?: string;
//   first_name?: string;
//   last_name?: string;
// }

// interface AuthContextType {
//   isAuthenticated: boolean;
//   user: User | null;
//   accessToken?: string | null;
//   isLoading?: boolean;
//   logout: () => void;
//   login: (userData: User, accessToken: string, refreshToken: string) => void;
//   getAccessToken: () => string | null;
//   refreshAccessToken: () => Promise<string | null>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const [refreshToken, setRefreshToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const refreshingRef = useRef<Promise<string | null> | null>(null);


//   const getTokenExpiration = (token: string): number | null => {
//     try {
//       const decoded = jwtDecode<JWTPayload>(token);
//       return decoded.exp * 1000;
//     } catch {
//       return null;
//     }
//   };


//   const getPersistedUser = useCallback((): User | null => {
//     const userDataStr = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
//     if (userDataStr) {
//       try {
//         return JSON.parse(userDataStr);
//       }
//       catch (err) {
//         console.error('Error parsing user data:', err);
//       }
//     }
//     return null;
//   }, []);

//   const getPersistedRefreshToken = useCallback((): string | null => {
//     return localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
//   }, []);


//   const refreshAccessToken = useCallback((): Promise<string | null> => {
//     if (refreshingRef.current) {
//       return refreshingRef.current;
//     }

//     const refreshPromise = (async () => {
//       try {
//         const currentRefreshToken = refreshToken || getPersistedRefreshToken();

//         if (!currentRefreshToken) {
//           console.error('No refresh token available');
//           handleLogout();
//           return null;
//         }

//         const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.REFRESH_TOKEN}`, {}, {
//           withCredentials: true,
//         })
  
//         if (resp && resp.access) {
//           setAccessToken(resp.access);
//           setIsAuthenticated(true);

//           if (resp.refresh) {
//             setRefreshToken(resp.refresh);
//             localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, resp.refresh);
//           }
//           return resp.access;
//         }
//         return null;
//       }
//       catch (err: any) {
//         console.error('Token refresh error:', err);
//         handleLogout();
//         return null;
//       }
//       finally {
//         refreshingRef.current = null;
//       }
//     })();

//     refreshingRef.current = refreshPromise;
//     return refreshPromise;
//   }, [refreshToken, getPersistedRefreshToken])




//   const login = useCallback((userData: any, accessTkn: string, refreshTkn: string) => {
//     setAccessToken(accessTkn);
//     setRefreshToken(refreshTkn);
//     setUser(userData);
//     setIsAuthenticated(true);

//     const accessTokenExpiry = getTokenExpiration(accessTkn);
//     const refreshTokenExpiry = getTokenExpiration(refreshTkn);
  
//     if (accessTokenExpiry) {
//       const lifetimeMinutes = Math.floor((accessTokenExpiry - Date.now()) / 60000);
//       toast.warning(`Access token expires in ${lifetimeMinutes} minutes`);
//     }

//     localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData));
//     localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshTkn);

//     const decoded = decodeJWT(accessTkn);
//     if (decoded?.user_id) {
//       localStorage.setItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID, decoded.user_id);
//     }

//     toast.success(`Welcome ${userData.username ? ', ' + userData.username : ''}!`);
//   }, []);



//   const handleLogout = useCallback(() => {
//     setAccessToken(null);
//     setRefreshToken(null);
//     setUser(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
//     localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
//   }, [])



//   const logout = useCallback(() => {
//     handleLogout();

//     toast.success('Logged out successfully');
//   }, [handleLogout]);



//   const getAccessToken = useCallback(() => accessToken, [accessToken]);



//   useEffect(() => {
//     const initializeAuth = async () => {
//       setIsLoading(true);
      
//       const persistedUser = getPersistedUser();
//       const persistedRefreshToken = getPersistedRefreshToken();
      
//       if (persistedUser && persistedRefreshToken) {
//         setRefreshToken(persistedRefreshToken);
        
//         const newAccessToken = await refreshAccessToken();
        
//         if (newAccessToken) {
//           setUser(persistedUser);
//           setIsAuthenticated(true);
//         } else {
//           localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
//           localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
//         }
//       }
      
//       setIsLoading(false);
//     };

//     initializeAuth();
//   }, []);


//   useEffect(() => {
//     if (!accessToken) return;

//     const REFRESH_INTERVAL = 5 * 60 * 1000;
    
//     const intervalId = setInterval(() => {
//       refreshAccessToken();
//     }, REFRESH_INTERVAL);

//     return () => clearInterval(intervalId);
//   }, [accessToken, refreshAccessToken]);



//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, login, logout, accessToken, isLoading, getAccessToken, refreshAccessToken }}>
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