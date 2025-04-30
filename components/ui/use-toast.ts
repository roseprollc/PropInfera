// components/ui/use-toast.ts
"use client";

import { useState } from "react";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
} from "@radix-ui/react-toast";

interface ToastProps {
  id?: string;
  title?: string;
  description: string;
  duration?: number;
  variant?: "default" | "destructive";
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = ({ title, description, duration = 3000, variant = "default" }: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, description, duration, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  return {
    toast,
    toasts,
  };
}

export { Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription, ToastAction, ToastClose };
