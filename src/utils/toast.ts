import { toast } from 'sonner';

const TOAST_STYLES = {
  className: 'bg-background/95 border-border/50 text-foreground'
};

export const showToast = {
  success: (message: string) => toast.success(message, TOAST_STYLES),
  error: (message: string) => toast.error(message, TOAST_STYLES),
  info: (message: string) => toast.info(message, TOAST_STYLES),
  warning: (message: string) => toast.warning(message, TOAST_STYLES)
};