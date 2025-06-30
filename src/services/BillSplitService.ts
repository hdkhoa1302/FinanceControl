import { BillSplit, IBillSplitService, IBillSplitRepository } from '../types';
import { EventBus } from '../utils/EventBus';

export class BillSplitService implements IBillSplitService {
  constructor(
    private billSplitRepository: IBillSplitRepository,
    private eventBus: EventBus
  ) {}

  async createBillSplit(billSplit: Omit<BillSplit, '_id'>): Promise<BillSplit> {
    this.validateBillSplit(billSplit);
    
    const newBillSplit = await this.billSplitRepository.create({
      ...billSplit,
      date: billSplit.date || new Date().toISOString(),
      settled: false
    });

    this.eventBus.emit({
      type: 'BILL_SPLIT_CREATED',
      payload: newBillSplit,
      timestamp: new Date()
    });

    return newBillSplit;
  }

  async getBillSplits(accountId: string): Promise<BillSplit[]> {
    const billSplits = await this.billSplitRepository.findByAccount(accountId);
    return billSplits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async updateParticipantPayment(billId: string, participantName: string, paid: boolean): Promise<BillSplit> {
    const billSplit = await this.billSplitRepository.findById(billId);
    if (!billSplit) {
      throw new Error('Bill split not found');
    }

    const updatedParticipants = billSplit.participants.map(p => {
      if (p.name === participantName) {
        return {
          ...p,
          paid,
          paidDate: paid ? new Date().toISOString() : undefined
        };
      }
      return p;
    });

    // Check if all participants have paid
    const allPaid = updatedParticipants.every(p => p.paid);

    const updatedBillSplit = await this.billSplitRepository.update(billId, {
      participants: updatedParticipants,
      settled: allPaid
    });

    this.eventBus.emit({
      type: 'BILL_SPLIT_PAYMENT_UPDATED',
      payload: { billSplit: updatedBillSplit, participantName, paid },
      timestamp: new Date()
    });

    return updatedBillSplit;
  }

  async settleBillSplit(id: string): Promise<BillSplit> {
    const billSplit = await this.billSplitRepository.findById(id);
    if (!billSplit) {
      throw new Error('Bill split not found');
    }

    if (billSplit.settled) {
      throw new Error('Bill split already settled');
    }

    // Mark all participants as paid
    const settledParticipants = billSplit.participants.map(p => ({
      ...p,
      paid: true,
      paidDate: p.paidDate || new Date().toISOString()
    }));

    const settledBillSplit = await this.billSplitRepository.update(id, {
      participants: settledParticipants,
      settled: true
    });

    this.eventBus.emit({
      type: 'BILL_SPLIT_SETTLED',
      payload: settledBillSplit,
      timestamp: new Date()
    });

    return settledBillSplit;
  }

  async deleteBillSplit(id: string): Promise<void> {
    const billSplit = await this.billSplitRepository.findById(id);
    if (!billSplit) {
      throw new Error('Bill split not found');
    }

    await this.billSplitRepository.delete(id);

    this.eventBus.emit({
      type: 'BILL_SPLIT_DELETED',
      payload: { billSplitId: id },
      timestamp: new Date()
    });
  }

  private validateBillSplit(billSplit: Omit<BillSplit, '_id'>): void {
    if (!billSplit.title?.trim()) {
      throw new Error('Title is required');
    }
    
    if (billSplit.totalAmount <= 0) {
      throw new Error('Total amount must be greater than 0');
    }

    if (!billSplit.payer) {
      throw new Error('Payer is required');
    }

    if (!billSplit.participants || billSplit.participants.length === 0) {
      throw new Error('At least one participant is required');
    }

    // Validate participants
    for (const participant of billSplit.participants) {
      if (!participant.name?.trim()) {
        throw new Error('Participant name is required');
      }
      
      if (participant.amount <= 0) {
        throw new Error('Participant amount must be greater than 0');
      }
    }

    // Validate total amounts match
    const totalParticipantAmount = billSplit.participants.reduce((sum, p) => sum + p.amount, 0);
    if (Math.abs(totalParticipantAmount - billSplit.totalAmount) > 0.01) {
      throw new Error('Total participant amounts must equal bill total');
    }
  }
}