import { IoIosNotificationsOutline } from "react-icons/io";
import { useNotification } from "./lib/notificationContext";

interface NotificationBellProps {
  onClick?: () => void;
}

const NotificationBell = ({ onClick }: NotificationBellProps) => {
  const { unreadCount } = useNotification();

  return (
    <button onClick={onClick} className='relative p-2 text-gray-600 hover:text-gray-500 hover:cursor-pointer transition'>
      <IoIosNotificationsOutline className='size-6' />
      {unreadCount > 0 && (
        <span className='absolute top-1.5 right-2.5 h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse' />
      )}
    </button>
  );
};

export default NotificationBell;
