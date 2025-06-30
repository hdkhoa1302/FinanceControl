import { BillSplitRepository } from '../../domain/repositories/Repository';
import { BillSplitEntity } from '../../domain/entities/BillSplitEntity';

export class InMemoryBillSplitRepository implements BillSplitRepository {
  private billSplits = new Map<string, BillSplitEntity>();

  async findById(id: string): Promise<BillSplitEntity | null> {
    return this.billSplits.get(id) || null;
  }

  async findAll(): Promise<readonly BillSplitEntity[]> {
    return Array.from(this.billSplits.values());
  }

  async findByAccountId(accountId: string): Promise<readonly BillSplitEntity[]> {
    return Array.from(this.billSplits.values())
      .filter(bill => bill.accountId === accountId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async findUnsettled(accountId: string): Promise<readonly BillSplitEntity[]> {
    return Array.from(this.billSplits.values())
      .filter(bill => bill.accountId === accountId && !bill.settled);
  }

  async save(billSplit: BillSplitEntity): Promise<BillSplitEntity> {
    this.billSplits.set(billSplit.id, billSplit);
    return billSplit;
  }

  async delete(id: string): Promise<void> {
    this.billSplits.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.billSplits.has(id);
  }

  // For testing and seeding
  seed(billSplits: BillSplitEntity[]): void {
    this.billSplits.clear();
    billSplits.forEach(bill => this.billSplits.set(bill.id, bill));
  }

  clear(): void {
    this.billSplits.clear();
  }
}