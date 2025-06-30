export class CurrencyFormatter {
  private static instance: CurrencyFormatter;
  private formatter: Intl.NumberFormat;

  private constructor(locale: string = 'vi-VN', currency: string = 'VND') {
    this.formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    });
  }

  static getInstance(): CurrencyFormatter {
    if (!CurrencyFormatter.instance) {
      CurrencyFormatter.instance = new CurrencyFormatter();
    }
    return CurrencyFormatter.instance;
  }

  format(amount: number): string {
    return this.formatter.format(amount);
  }

  formatAbsolute(amount: number): string {
    return this.formatter.format(Math.abs(amount));
  }
}

export class DateFormatter {
  private static instance: DateFormatter;
  private dateFormatter: Intl.DateTimeFormat;
  private timeFormatter: Intl.DateTimeFormat;
  private dateTimeFormatter: Intl.DateTimeFormat;

  private constructor(locale: string = 'vi-VN') {
    this.dateFormatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    this.timeFormatter = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    this.dateTimeFormatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static getInstance(): DateFormatter {
    if (!DateFormatter.instance) {
      DateFormatter.instance = new DateFormatter();
    }
    return DateFormatter.instance;
  }

  formatDate(date: string | Date): string {
    return this.dateFormatter.format(new Date(date));
  }

  formatTime(date: string | Date): string {
    return this.timeFormatter.format(new Date(date));
  }

  formatDateTime(date: string | Date): string {
    return this.dateTimeFormatter.format(new Date(date));
  }

  formatRelative(date: string | Date): string {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInMs = now.getTime() - targetDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hôm nay';
    if (diffInDays === 1) return 'Hôm qua';
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`;
    return `${Math.floor(diffInDays / 365)} năm trước`;
  }
}

export const currencyFormatter = CurrencyFormatter.getInstance();
export const dateFormatter = DateFormatter.getInstance();