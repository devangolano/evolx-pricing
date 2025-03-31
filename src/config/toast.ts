import { toast, type ToastOptions } from "react-hot-toast"

export const toastConfig: ToastOptions = {
  duration: 2000,
  position: "top-right",
  style: {
    background: "#1E1E1E",
    color: "#fff",
    border: "1px solid #3A3A3A",
  },
  iconTheme: {
    primary: "#22c55e",
    secondary: "#FFFFFF",
  },
}

export const notify = {
  success: (message: string) =>
    toast.success(message, {
      ...toastConfig,
      style: {
        ...toastConfig.style,
        border: "1px solid #22c55e",
      },
    }),
  error: (message: string) =>
    toast.error(message, {
      ...toastConfig,
      style: {
        ...toastConfig.style,
        border: "1px solid #ef4444",
      },
    }),
  loading: (message: string) => toast.loading(message, toastConfig),
  custom: (message: string) => toast(message, toastConfig),
}

