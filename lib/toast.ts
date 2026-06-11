import { toast, type ExternalToast } from "sonner"

/**
 * API toast DUY NHẤT của app (bọc sonner).
 * KHÔNG import "sonner" trực tiếp ở feature code — luôn dùng `notify`.
 * Quy ước: action thành công -> notify.success, lỗi -> notify.error.
 */
export const notify = {
  success: (message: string, opts?: ExternalToast) => toast.success(message, opts),
  error: (message: string, opts?: ExternalToast) => toast.error(message, opts),
  info: (message: string, opts?: ExternalToast) => toast.info(message, opts),
  warning: (message: string, opts?: ExternalToast) => toast.warning(message, opts),
  message: (message: string, opts?: ExternalToast) => toast(message, opts),
  loading: (message: string, opts?: ExternalToast) => toast.loading(message, opts),
  promise: toast.promise,
  dismiss: toast.dismiss,
}
