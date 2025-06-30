// Application Layer Types
export interface CreateWalletRequest {
  readonly accountId: string;
  readonly name: string;
  readonly type: string;
  readonly balance: number;
  readonly currency: string;
  readonly bankInfo?: string;
  readonly color: string;
}

export interface CreateTransactionRequest {
  readonly accountId: string;
  readonly walletId: string;
  readonly amount: number;
  readonly type: string;
  readonly category: string;
  readonly description: string;
  readonly date: Date;
}

export interface CreateBillSplitRequest {
  readonly accountId: string;
  readonly title: string;
  readonly description?: string;
  readonly totalAmount: number;
  readonly payerId: string;
  readonly payerName: string;
  readonly participants: readonly {
    readonly name: string;
    readonly contact?: string;
    readonly share: number;
    readonly amount: number;
  }[];
  readonly splitType: string;
  readonly date: Date;
}

export interface CreateLoanRequest {
  readonly accountId: string;
  readonly type: string;
  readonly counterpart: string;
  readonly counterpartContact?: string;
  readonly amount: number;
  readonly interestRate: number;
  readonly startDate: Date;
  readonly dueDate: Date;
  readonly description: string;
}

export interface FilterOptions {
  readonly search?: string;
  readonly type?: string;
  readonly category?: string;
  readonly walletId?: string;
  readonly dateFrom?: Date;
  readonly dateTo?: Date;
}