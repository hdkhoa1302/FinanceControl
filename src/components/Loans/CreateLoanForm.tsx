import React, { useState } from 'react';
import { HandHeart, DollarSign, User } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { LoanType } from '../../domain/entities/Loan';

interface CreateLoanFormProps {
  onSubmit: (loanData: any) => Promise<void>;
  onCancel: () => void;
}

export const CreateLoanForm: React.FC<CreateLoanFormProps> = ({ onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'lent' as LoanType,
    counterpart: '',
    counterpartContact: '',
    amount: 0,
    interestRate: 0,
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating loan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4 bg-orange-50/60 rounded-xl border border-orange-200/40">
        <div className="w-10 h-10 bg-orange-100/80 rounded-xl flex items-center justify-center">
          <HandHeart className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <p className="font-bold text-orange-900 text-sm">Thêm khoản vay</p>
          <p className="text-xs text-orange-600">Quản lý cho vay và đi vay</p>
        </div>
      </div>

      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Loại giao dịch
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'lent' })}
            className={`p-4 border rounded-xl text-left transition-all duration-300 ${
              formData.type === 'lent'
                ? 'border-green-500/50 bg-green-50/60 text-green-700'
                : 'border-gray-200/50 hover:border-green-400/50 bg-white/80'
            }`}
          >
            <div className="w-8 h-8 bg-green-100/80 rounded-lg flex items-center justify-center mb-2">
              <HandHeart className="w-4 h-4 text-green-600" />
            </div>
            <p className="font-bold text-sm">Cho vay</p>
            <p className="text-xs text-gray-500">Bạn cho ai đó vay tiền</p>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'borrowed' })}
            className={`p-4 border rounded-xl text-left transition-all duration-300 ${
              formData.type === 'borrowed'
                ? 'border-orange-500/50 bg-orange-50/60 text-orange-700'
                : 'border-gray-200/50 hover:border-orange-400/50 bg-white/80'
            }`}
          >
            <div className="w-8 h-8 bg-orange-100/80 rounded-lg flex items-center justify-center mb-2">
              <DollarSign className="w-4 h-4 text-orange-600" />
            </div>
            <p className="font-bold text-sm">Đi vay</p>
            <p className="text-xs text-gray-500">Bạn vay tiền từ ai đó</p>
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <Input
          label={formData.type === 'lent' ? 'Người vay' : 'Người cho vay'}
          value={formData.counterpart}
          onChange={(e) => setFormData({ ...formData, counterpart: e.target.value })}
          placeholder="Tên người..."
          required
          icon={User}
          className="bg-white/90"
        />

        <Input
          label="Thông tin liên hệ (tùy chọn)"
          value={formData.counterpartContact}
          onChange={(e) => setFormData({ ...formData, counterpartContact: e.target.value })}
          placeholder="Số điện thoại, email..."
          className="bg-white/90"
        />

        <Input
          label="Số tiền"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
          placeholder="0"
          min="0"
          step="100000"
          required
          className="bg-white/90"
        />

        <Input
          label="Lãi suất (%/tháng)"
          type="number"
          value={formData.interestRate}
          onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) || 0 })}
          placeholder="0"
          min="0"
          step="0.1"
          className="bg-white/90"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Ngày vay"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
            className="bg-white/90"
          />

          <Input
            label="Hạn trả"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
            className="bg-white/90"
          />
        </div>

        <Input
          label="Mô tả"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Mục đích vay tiền..."
          required
          className="bg-white/90"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200/50">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="w-full sm:flex-1"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          loading={loading}
          className="w-full sm:flex-1"
        >
          Thêm khoản vay
        </Button>
      </div>
    </form>
  );
};