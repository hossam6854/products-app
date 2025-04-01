import React, { useEffect, useState } from "react";
import clsx from "clsx";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = "success", duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={clsx(
        "fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white transition-opacity duration-500",
        {
          "bg-green-500": type === "success",
          "bg-red-500": type === "error",
        }
      )}
    >
      {message}
    </div>
  );
};


export default Toast;
