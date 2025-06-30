export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export interface ValidationRule<T> {
  validate(value: T): boolean;
  message: string;
}

export class Validator<T> {
  private rules: ValidationRule<T>[] = [];

  addRule(rule: ValidationRule<T>): this {
    this.rules.push(rule);
    return this;
  }

  validate(value: T, fieldName?: string): void {
    for (const rule of this.rules) {
      if (!rule.validate(value)) {
        throw new ValidationError(rule.message, fieldName);
      }
    }
  }

  isValid(value: T): boolean {
    try {
      this.validate(value);
      return true;
    } catch {
      return false;
    }
  }
}

// Common validation rules
export const ValidationRules = {
  required: <T>(message: string = 'Trường này là bắt buộc'): ValidationRule<T> => ({
    validate: (value: T) => value !== null && value !== undefined && value !== '',
    message
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value: string) => value && value.length >= min,
    message: message || `Tối thiểu ${min} ký tự`
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value: string) => !value || value.length <= max,
    message: message || `Tối đa ${max} ký tự`
  }),

  email: (message: string = 'Email không hợp lệ'): ValidationRule<string> => ({
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !value || emailRegex.test(value);
    },
    message
  }),

  positive: (message: string = 'Giá trị phải lớn hơn 0'): ValidationRule<number> => ({
    validate: (value: number) => value > 0,
    message
  }),

  nonNegative: (message: string = 'Giá trị không được âm'): ValidationRule<number> => ({
    validate: (value: number) => value >= 0,
    message
  }),

  oneOf: <T>(options: T[], message?: string): ValidationRule<T> => ({
    validate: (value: T) => options.includes(value),
    message: message || `Giá trị phải là một trong: ${options.join(', ')}`
  })
};

// Specific validators for domain objects
export const createTransactionValidator = () => {
  return {
    wallet: new Validator<string>()
      .addRule(ValidationRules.required('Vui lòng chọn ví')),
    
    amount: new Validator<number>()
      .addRule(ValidationRules.required('Vui lòng nhập số tiền'))
      .addRule(ValidationRules.positive('Số tiền phải lớn hơn 0')),
    
    description: new Validator<string>()
      .addRule(ValidationRules.required('Vui lòng nhập mô tả'))
      .addRule(ValidationRules.minLength(2, 'Mô tả phải có ít nhất 2 ký tự'))
      .addRule(ValidationRules.maxLength(200, 'Mô tả không được quá 200 ký tự')),
    
    category: new Validator<string>()
      .addRule(ValidationRules.required('Vui lòng chọn danh mục')),
    
    type: new Validator<string>()
      .addRule(ValidationRules.oneOf(['income', 'expense', 'loan_received', 'loan_given'], 'Loại giao dịch không hợp lệ'))
  };
};

export const createWalletValidator = () => {
  return {
    name: new Validator<string>()
      .addRule(ValidationRules.required('Vui lòng nhập tên ví'))
      .addRule(ValidationRules.minLength(2, 'Tên ví phải có ít nhất 2 ký tự'))
      .addRule(ValidationRules.maxLength(50, 'Tên ví không được quá 50 ký tự')),
    
    type: new Validator<string>()
      .addRule(ValidationRules.oneOf(['cash', 'bank', 'e-wallet'], 'Loại ví không hợp lệ')),
    
    balance: new Validator<number>()
      .addRule(ValidationRules.nonNegative('Số dư không được âm'))
  };
};