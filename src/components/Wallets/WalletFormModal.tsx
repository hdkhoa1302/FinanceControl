import React, { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { createWalletValidator } from '../../utils/validators';
import { ValidationError } from '../../utils/validators';
import { WALLET_TYPES, WALLET_COLORS } from '../../utils/constants';
import { getWalletTypeLabel } from '../../utils/helpers';

interface WalletFormModalProps {
  isOpen: boolean;
  wallet?: any;
  onClose: () => void;
}

const WalletFormModal: React.FC<WalletFormModalProps> = ({ isOpen, wallet, onClose }) => {
  const { createWallet, updateWallet } = useApp();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    type: WALLET_TYPES.CASH as keyof typeof WALLET_TYPES,
    balance: 0,
    bankInfo: '',
    color: WALLET_COLORS[0]
  });

  const validator = createWalletValidator();

  const walletTypes = [
    { value: WALLET_TYPES.CASH, label: getWalletTypeLabel(WALLET_TYPES.CASH) },
    { value: WALLET_TYPES.BANK, label: getWalletTypeLabel(WALLET_TYPES.BANK) },
    { value: WALLET_TYPES.E_WALLET, label: getWalletTypeLabel(WALLET_TYPES.E_WALLET) }
  ];

  useEffect(() => {
    if (wallet) {
      setFormData({
        name: wallet.name,
        type: wallet.type,
        balance: wallet.balance,
        bankInfo: wallet.bankInfo || '',
        color: wallet.color || WALLET_COLORS[0]
      });
    } else {
      resetForm();
    }
    setErrors({});
  }, [wallet, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      type: WALLET_TYPES.CASH,
      balance: 0,
      bankInfo: '',
      color: WALLET_COLORS[0]
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    try {
      validator.name.validate(formData.name, 'name');
    } catch (error) {
      if (error instanceof ValidationError) {
        newErrors.name = error.message;
      }
    }

    try {
      validator.type.validate(formData.type, 'type');
    } catch (error) {
      if (error instanceof ValidationError) {
        newErrors.type = error.message;
      }
    }

    try {
      validator.balance.validate(formData.balance, 'balance');
    } catch (error) {
      if (error instanceof ValidationError) {
        newErrors.balance = error.message;
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
      if (wallet) {
        await updateWallet(wallet._id, formData);
      } else {
        await createWallet({
          ...formData,
          account: '',
          currency: 'VND'
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={wallet ? 'Chỉnh sửa ví' : 'Thêm ví mới'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Tên ví"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: '' });
          }}
          placeholder="Ví tiền mặt, Techcombank, MoMo..."
          required
          error={errors.name}
        />

        <div>
          <label className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-3">
            Loại ví *
          </label>
          <select
            value={formData.type}
            onChange={(e) => {
              setFormData({ ...formData, type: e.target.value as keyof typeof WALLET_TYPES });
              if (errors.type) setErrors({ ...errors, type: '' });
            }}
            className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-300 ${
              errors.type ? 'border-red-300/50' : 'border-white/30'
            }`}
          >
            {walletTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {errors.type && <p className="mt-2 text-sm text-red-600 bg-red-50/50 px-3 py-1 rounded-xl backdrop-blur-sm border border-red-200/50">{errors.type}</p>}
        </div>

        <Input
          label="Số dư ban đầu"
          type="number"
          value={formData.balance}
          onChange={(e) => {
            setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 });
            if (errors.balance) setErrors({ ...errors, balance: '' });
          }}
          placeholder="0"
          error={errors.balance}
        />

        {formData.type === WALLET_TYPES.BANK && (
          <Input
            label="Thông tin ngân hàng"
            value={formData.bankInfo}
            onChange={(e) => setFormData({ ...formData, bankInfo: e.target.value })}
            placeholder="Techcombank - 19036789012"
          />
        )}

        <div>
          <label className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-3">
            Màu sắc
          </label>
          <div className="grid grid-cols-6 gap-3">
            {WALLET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-10 h-10 rounded-2xl border-2 transition-all duration-300 ${
                  formData.color === color ? 'border-gray-400 scale-110 shadow-lg' : 'border-gray-200 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            {wallet ? 'Cập nhật' : 'Tạo ví'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default WalletFormModal;