import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { createTransactionValidator } from '../../utils/validators';
import { ValidationError } from '../../utils/validators';
import { TRANSACTION_TYPES, CATEGORIES } from '../../utils/constants';
import { getTransactionTypeLabel } from '../../utils/helpers';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({ isOpen, onClose }) => {
  const { createTransaction, wallets } = useApp();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    wallet: '',
    amount: 0,
    type: TRANSACTION_TYPES.EXPENSE as keyof typeof TRANSACTION_TYPES,
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const validator = createTransactionValidator();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    try {
      validator.wallet.validate(formData.wallet, 'wallet');
    } catch (error) {
      if (error instanceof ValidationError) {
        newErrors.wallet = error.message;
      }
    }

    try {
      validator.amount.validate(formData.amount, 'amount');
    } catch (error) {
      if (error instanceof ValidationError) {
        newErrors.amount = error.message;
      }
    }

    try {
      validator.description.validate(formData.description, 'description');
    } catch (error) {
      if (error instanceof ValidationError) {
        newErrors.description = error.message;
      }
    }

    try {
      validator.category.validate(formData.category, 'category');
    } catch (error) {
      if (error instanceof ValidationError) {
        newErrors.category = error.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const amount = formData.type === TRANSACTION_TYPES.INCOME || formData.type === TRANSACTION_TYPES.LOAN_RECEIVED 
        ? Math.abs(formData.amount)
        : -Math.abs(formData.amount);

      await createTransaction({
        ...formData,
        amount,
        account: '',
        date: new Date(formData.date).toISOString()
      });
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      wallet: '',
      amount: 0,
      type: TRANSACTION_TYPES.EXPENSE,
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setErrors({});
  };

  const handleTypeChange = (newType: keyof typeof TRANSACTION_TYPES) => {
    setFormData({ ...formData, type: newType, category: '' });
    if (errors.type) {
      setErrors({ ...errors, type: '' });
    }
  };

  const getCurrentCategories = () => {
    return CATEGORIES[formData.type.toUpperCase() as keyof typeof CATEGORIES] || [];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm giao dịch"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Header Section - Single Background */}
        <div className="flex items-center space-x-3 p-4 bg-blue-50/80 rounded-xl border border-blue-200/40">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <Receipt className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-blue-900 text-sm">Thêm giao dịch mới</p>
            <p className="text-xs text-blue-600">Ghi lại thu chi của bạn</p>
          </div>
        </div>

        {/* Transaction Type Section - Clean Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Loại giao dịch
          </label>
          <div className="flex rounded-xl bg-gray-50/60 p-1 border border-gray-200/50">
            <button
              type="button"
              onClick={() => handleTypeChange(TRANSACTION_TYPES.INCOME)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                formData.type === TRANSACTION_TYPES.INCOME
                  ? 'bg-white text-green-700 shadow-sm border border-green-200/50'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Thu nhập</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange(TRANSACTION_TYPES.EXPENSE)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                formData.type === TRANSACTION_TYPES.EXPENSE
                  ? 'bg-white text-red-700 shadow-sm border border-red-200/50'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>Chi tiêu</span>
            </button>
          </div>
        </div>

        {/* Primary Input Section - Highlighted */}
        <div className="bg-yellow-50/60 p-4 rounded-xl border border-yellow-200/40">
          <Input
            label="Số tiền"
            type="number"
            value={formData.amount}
            onChange={(e) => {
              setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 });
              if (errors.amount) setErrors({ ...errors, amount: '' });
            }}
            placeholder="0"
            min="0"
            step="1000"
            required
            error={errors.amount}
            className="bg-white/90"
          />
        </div>

        {/* Secondary Inputs Section - Clean Background */}
        <div className="space-y-4">
          <Input
            label="Mô tả"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
            placeholder="Mô tả giao dịch..."
            required
            error={errors.description}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Wallet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ví
              </label>
              <select
                value={formData.wallet}
                onChange={(e) => {
                  setFormData({ ...formData, wallet: e.target.value });
                  if (errors.wallet) setErrors({ ...errors, wallet: '' });
                }}
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-300 text-sm ${
                  errors.wallet ? 'border-red-300/50' : 'border-gray-200/50'
                }`}
              >
                <option value="">Chọn ví</option>
                {wallets.map(wallet => (
                  <option key={wallet._id} value={wallet._id}>
                    {wallet.name}
                  </option>
                ))}
              </select>
              {errors.wallet && <p className="mt-1 text-xs text-red-600">{errors.wallet}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  if (errors.category) setErrors({ ...errors, category: '' });
                }}
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-300 text-sm ${
                  errors.category ? 'border-red-300/50' : 'border-gray-200/50'
                }`}
              >
                <option value="">Chọn danh mục</option>
                {getCurrentCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
            </div>
          </div>
        </div>

        {/* Date Section - Minimal */}
        <div className="bg-gray-50/40 p-3 rounded-lg border border-gray-200/30">
          <Input
            label="Ngày"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            size="sm"
            className="bg-white/80"
          />
        </div>

        {/* Action Buttons - Clean */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200/50">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="w-full sm:flex-1"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="w-full sm:flex-1"
          >
            Thêm giao dịch
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionFormModal;