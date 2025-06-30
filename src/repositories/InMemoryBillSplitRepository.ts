import { BillSplit, IBillSplitRepository } from '../types';

export class InMemoryBillSplitRepository implements IBillSplitRepository {
  private billSplits: BillSplit[] = [];
  private nextId = 1;

  async findById(id: string): Promise<BillSplit | null> {
    return this.billSplits.find(b => b._id === id) || null;
  }

  async findAll(): Promise<BillSplit[]> {
    return [...this.billSplits];
  }

  async findByAccount(accountId: string): Promise<BillSplit[]> {
    return this.billSplits.filter(b => b.account === accountId);
  }

  async findByPayer(payerId: string): Promise<BillSplit[]> {
    return this.billSplits.filter(b => b.payer === payerId);
  }

  async findUnsettled(accountId: string): Promise<BillSplit[]> {
    return this.billSplits.filter(b => b.account === accountId && !b.settled);
  }

  async create(billSplit: Omit<BillSplit, '_id'>): Promise<BillSplit> {
    const newBillSplit: BillSplit = {
      ...billSplit,
      _id: `bill${this.nextId++}`
    };
    
    this.billSplits.push(newBillSplit);
    return newBillSplit;
  }

  async update(id: string, updates: Partial<BillSplit>): Promise<BillSplit> {
    const index = this.billSplits.findIndex(b => b._id === id);
    if (index === -1) {
      throw new Error('Bill split not found');
    }

    this.billSplits[index] = { ...this.billSplits[index], ...updates };
    return this.billSplits[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.billSplits.findIndex(b => b._id === id);
    if (index === -1) {
      throw new Error('Bill split not found');
    }

    this.billSplits.splice(index, 1);
  }

  // For testing and initialization
  seed(billSplits: BillSplit[]): void {
    this.billSplits = [...billSplits];
    this.nextId = Math.max(...billSplits.map(b => parseInt(b._id.replace('bill', ''))), 0) + 1;
  }
}