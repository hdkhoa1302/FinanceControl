import { BillSplit, BillSplitParticipant, SplitType } from '../../types/domain';

export class BillSplitEntity {
  constructor(private readonly data: BillSplit) {
    this.validate();
  }

  static create(params: Omit<BillSplit, 'id' | 'settled' | 'createdAt' | 'updatedAt'>): BillSplitEntity {
    const now = new Date();
    return new BillSplitEntity({
      ...params,
      id: this.generateId(),
      settled: false,
      createdAt: now,
      updatedAt: now
    });
  }

  // Getters
  get id(): string { return this.data.id; }
  get accountId(): string { return this.data.accountId; }
  get title(): string { return this.data.title; }
  get description(): string | undefined { return this.data.description; }
  get totalAmount(): number { return this.data.totalAmount; }
  get payerId(): string { return this.data.payerId; }
  get payerName(): string { return this.data.payerName; }
  get participants(): readonly BillSplitParticipant[] { return this.data.participants; }
  get splitType(): SplitType { return this.data.splitType; }
  get date(): Date { return this.data.date; }
  get settled(): boolean { return this.data.settled; }
  get createdAt(): Date { return this.data.createdAt; }
  get updatedAt(): Date { return this.data.updatedAt; }

  // Business Logic
  updateParticipantPayment(participantName: string, paid: boolean): BillSplitEntity {
    const updatedParticipants = this.data.participants.map(p => {
      if (p.name === participantName) {
        return {
          ...p,
          paid,
          paidDate: paid ? new Date() : undefined
        };
      }
      return p;
    });

    const allPaid = updatedParticipants.every(p => p.paid);

    return new BillSplitEntity({
      ...this.data,
      participants: updatedParticipants,
      settled: allPaid,
      updatedAt: new Date()
    });
  }

  settle(): BillSplitEntity {
    if (this.data.settled) {
      throw new Error('Bill split already settled');
    }

    const settledParticipants = this.data.participants.map(p => ({
      ...p,
      paid: true,
      paidDate: p.paidDate || new Date()
    }));

    return new BillSplitEntity({
      ...this.data,
      participants: settledParticipants,
      settled: true,
      updatedAt: new Date()
    });
  }

  getPaymentProgress(): number {
    const paidCount = this.data.participants.filter(p => p.paid).length;
    return this.data.participants.length > 0 ? (paidCount / this.data.participants.length) * 100 : 0;
  }

  private validate(): void {
    if (!this.data.title.trim()) {
      throw new Error('Bill split title is required');
    }

    if (this.data.totalAmount <= 0) {
      throw new Error('Total amount must be positive');
    }

    if (!this.data.payerId) {
      throw new Error('Payer is required');
    }

    if (this.data.participants.length === 0) {
      throw new Error('At least one participant is required');
    }

    // Validate total amounts match
    const totalParticipantAmount = this.data.participants.reduce((sum, p) => sum + p.amount, 0);
    if (Math.abs(totalParticipantAmount - this.data.totalAmount) > 0.01) {
      throw new Error('Total participant amounts must equal bill total');
    }
  }

  private static generateId(): string {
    return `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toData(): BillSplit {
    return { ...this.data };
  }
}