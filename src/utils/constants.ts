export const WALLET_TYPES = {
  CASH: 'cash',
  BANK: 'bank',
  E_WALLET: 'e-wallet'
} as const;

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  LOAN_RECEIVED: 'loan_received',
  LOAN_GIVEN: 'loan_given'
} as const;

export const ACCOUNT_TYPES = {
  PERSONAL: 'personal',
  FAMILY: 'family'
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer'
} as const;

export const SPLIT_TYPES = {
  EQUAL: 'equal',
  CUSTOM: 'custom',
  PERCENTAGE: 'percentage'
} as const;

export const CATEGORIES = {
  INCOME: ['Lương', 'Thưởng', 'Đầu tư', 'Bán hàng', 'Khác'],
  EXPENSE: ['Ăn uống', 'Di chuyển', 'Mua sắm', 'Giải trí', 'Y tế', 'Học tập', 'Khác'],
  LOAN_RECEIVED: ['Vay ngân hàng', 'Vay bạn bè', 'Vay gia đình', 'Khác'],
  LOAN_GIVEN: ['Cho vay bạn bè', 'Cho vay gia đình', 'Ứng trước', 'Khác']
} as const;

export const WALLET_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
  '#6B7280', '#84CC16', '#F97316', '#06B6D4', '#8B5A2B', '#7C2D12'
] as const;

export const CURRENCY = {
  VND: 'VND',
  USD: 'USD',
  EUR: 'EUR'
} as const;

export const DATE_FORMATS = {
  DD_MM_YYYY: 'dd/mm/yyyy',
  MM_DD_YYYY: 'mm/dd/yyyy',
  YYYY_MM_DD: 'yyyy-mm-dd'
} as const;