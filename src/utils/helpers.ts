import { TRANSACTION_TYPES, WALLET_TYPES, USER_ROLES } from './constants';

export const getTransactionTypeLabel = (type: string): string => {
  const labels = {
    [TRANSACTION_TYPES.INCOME]: 'Thu nhập',
    [TRANSACTION_TYPES.EXPENSE]: 'Chi tiêu',
    [TRANSACTION_TYPES.LOAN_RECEIVED]: 'Được vay',
    [TRANSACTION_TYPES.LOAN_GIVEN]: 'Cho vay'
  };
  return labels[type as keyof typeof labels] || type;
};

export const getWalletTypeLabel = (type: string): string => {
  const labels = {
    [WALLET_TYPES.CASH]: 'Tiền mặt',
    [WALLET_TYPES.BANK]: 'Ngân hàng',
    [WALLET_TYPES.E_WALLET]: 'Ví điện tử'
  };
  return labels[type as keyof typeof labels] || type;
};

export const getRoleLabel = (role: string): string => {
  const labels = {
    [USER_ROLES.ADMIN]: 'Quản trị',
    [USER_ROLES.MEMBER]: 'Thành viên',
    [USER_ROLES.VIEWER]: 'Xem'
  };
  return labels[role as keyof typeof labels] || role;
};

export const generateId = (prefix: string = ''): string => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};