import { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  notificationIcon: ReactNode;
  description?: string;
  additionalText?: string;
}

const NotificationCards = ({ isOpen, onClose, title, notificationIcon, description, additionalText }: NotificationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-8">
        <DialogHeader className="text-start space-y-4">
          <DialogTitle className="flex items-center gap-4 text-xl text-center font-normal mt-5 text-black">
            {notificationIcon}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-6">
          {description && (
            <DialogDescription className="text-neutral-600 text-sm">
              {description}
            </DialogDescription>
          )}

          {additionalText && (
            <div className="mt-4">
              <p className="text-sm text-neutral-600 whitespace-pre-line">
                {additionalText}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationCards;
