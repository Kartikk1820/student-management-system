"use client";
import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const Notification = ({
  message,
  type = "info", // 'success', 'error', 'warning', 'info'
  duration = 5000,
  onClose,
  show = true,
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);

    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!isVisible) return null;

  const getNotificationStyles = () => {
    const baseStyles =
      "fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border p-4 transform transition-all duration-300 ease-in-out";

    switch (type) {
      case "success":
        return `${baseStyles} border-green-200 bg-green-50`;
      case "error":
        return `${baseStyles} border-red-200 bg-red-50`;
      case "warning":
        return `${baseStyles} border-yellow-200 bg-yellow-50`;
      case "info":
      default:
        return `${baseStyles} border-blue-200 bg-blue-50`;
    }
  };

  const getIcon = () => {
    const iconClasses = "h-5 w-5";

    switch (type) {
      case "success":
        return <CheckCircleIcon className={`${iconClasses} text-green-600`} />;
      case "error":
        return (
          <ExclamationTriangleIcon className={`${iconClasses} text-red-600`} />
        );
      case "warning":
        return (
          <ExclamationTriangleIcon
            className={`${iconClasses} text-yellow-600`}
          />
        );
      case "info":
      default:
        return (
          <InformationCircleIcon className={`${iconClasses} text-blue-600`} />
        );
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      case "info":
      default:
        return "text-blue-800";
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <div className={getNotificationStyles()}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${getTextColor()}`}>{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleClose}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
