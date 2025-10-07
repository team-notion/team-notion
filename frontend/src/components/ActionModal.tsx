import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary";
}

const ActionModal = ({ isOpen, onClose, title, description, onConfirm, confirmText = "Confirm", cancelText = "Cancel", confirmVariant = "danger" }: ActionModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-8">
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-xl text-center font-normal mt-5 text-black">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-neutral-600 text-sm">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
          <button
            onClick={onClose}
            className={`w-[7rem] px-6 py-3 rounded-xl font-medium transition-colors hover:cursor-pointer ${
              confirmVariant === "danger"
                ? "bg-white border-2 border-[#F97316] text-[#F97316] hover:bg-orange-50"
                : "bg-[#F97316] text-white hover:bg-orange-600"
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`w-[7rem] px-6 py-3 rounded-xl font-medium transition-colors hover:cursor-pointer ${
              confirmVariant === "danger"
                ? "bg-[#F97316] text-white hover:bg-orange-600"
                : "bg-white border-2 border-[#F97316] text-[#F97316] hover:bg-orange-50"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionModal;
