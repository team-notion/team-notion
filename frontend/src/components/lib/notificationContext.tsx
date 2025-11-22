import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { deleteData, getData, patchData } from "./apiMethods";
import CONFIG from "../utils/config";
import { apiEndpoints } from "./apiEndpoints";
import { useAuth } from "./authContext";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | 'reservation' | 'cancelled' | 'updated' | 'payment';
  isRead: boolean;
  createdAt: string;
  timeStamp?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearNotification: () => void;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProfviderProps {
  children: ReactNode;
  pollingInterval?: number;
}

export function NotificationProvider({ children, pollingInterval = 60000 }: NotificationProfviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_NOTIFICATIONS}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        }
      })

      if (resp.status === 200) {
        const data = await resp.data;
        setNotifications(data.results || []);
      }
    }
    catch (err) {
      console.error("Error fetching notifications:", err);
    }
    finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const markNotificationAsRead = useCallback(async (id: string) => {
    try {
      const resp = await patchData(`${CONFIG.BASE_URL}${apiEndpoints.UPDATE_NOTIFICATIONS}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        }
      })

      if (resp.status === 200) {
        setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
      }
    }
    catch (err) {
      console.error("Error marking notification as read:", err);
    }
  }, [isAuthenticated]);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      const resp = await deleteData(`${CONFIG.BASE_URL}${apiEndpoints.UPDATE_NOTIFICATIONS}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        }
      });

      if (resp.status === 204) {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      }
    }
    catch (err) {
      console.error("Error deleting notification:", err);
    }
  }, [isAuthenticated]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }
    
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [fetchNotifications, pollingInterval, isAuthenticated]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, addNotification, markNotificationAsRead, deleteNotification, clearNotification: clearNotifications, isLoading }}>
      {children}
    </NotificationContext.Provider>
  );
}


export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}