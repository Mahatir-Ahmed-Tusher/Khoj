import { useEffect } from "react";

type ToasterProps = {
  message: String | null;
  show: boolean;
  onClose: () => void;
};

export default function Toaster({ message, show, onClose }: ToasterProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2000); // auto-close after 3s
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white bg-gray-800 transition-all duration-300 ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
}
