import { BillSplitEntity } from '../../domain/entities/BillSplitEntity';
import { BillSplitRepository } from '../../domain/repositories/Repository';
import { CreateBillSplitRequest } from '../../types/application';

export class BillSplitService {
  constructor(private readonly billSplitRepository: BillSplitRepository) {}

  async createBillSplit(request: CreateBillSplitRequest): Promise<BillSplitEntity> {
    this.validateCreateRequest(request);

    const billSplit = BillSplitEntity.create({
      accountId: request.accountId,
      title: request.title,
      description: request.description,
      totalAmount: request.totalAmount,
      payerId: request.payerId,
      payerName: request.payerName,
      participants: request.participants.map(p => ({
        ...p,
        paid: false
      })),
      splitType: request.splitType as any,
      date: request.date
    });

    return this.billSplitRepository.save(billSplit);
  }

  async getBillSplitsByAccount(accountId: string): Promise<readonly BillSplitEntity[]> {
    return this.billSplitRepository.findByAccountId(accountId);
  }

  async getBillSplitById(id: string): Promise<BillSplitEntity | null> {
    return this.billSplitRepository.findById(id);
  }

  async updateParticipantPayment(billId: string, participantName: string, paid: boolean): Promise<BillSplitEntity> {
    const billSplit = await this.billSplitRepository.findById(billId);
    if (!billSplit) {
      throw new Error('Bill split not found');
    }

    const updatedBillSplit = billSplit.updateParticipantPayment(participantName, paid);
    return this.billSplitRepository.save(updatedBillSplit);
  }

  async settleBillSplit(id: string): Promise<BillSplitEntity> {
    const billSplit = await this.billSplitRepository.findById(id);
    if (!billSplit) {
      throw new Error('Bill split not found');
    }

    const settledBillSplit = billSplit.settle();
    return this.billSplitRepository.save(settledBillSplit);
  }

  async deleteBillSplit(id: string): Promise<void> {
    const exists = await this.billSplitRepository.exists(id);
    if (!exists) {
      throw new Error('Bill split not found');
    }

    await this.billSplitRepository.delete(id);
  }

  private validateCreateRequest(request: CreateBillSplitRequest): void {
    if (!request.title?.trim()) {
      throw new Error('Title is required');
    }

    if (request.totalAmount <= 0) {
      throw new Error('Total amount must be positive');
    }

    if (!request.payerId) {
      throw new Error('Payer is required');
    }

    if (!request.participants || request.participants.length === 0) {
      throw new Error('At least one participant is required');
    }

    // Validate total amounts match
    const totalParticipantAmount = request.participants.reduce((sum, p) => sum + p.amount, 0);
    if (Math.abs(totalParticipantAmount - request.totalAmount) > 0.01) {
      throw new Error('Total participant amounts must equal bill total');
    }
  }
}