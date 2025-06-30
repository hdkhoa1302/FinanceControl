import React, { useState } from 'react';
import { Receipt, Users, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { SPLIT_TYPES } from '../../utils/constants';
import { generateId } from '../../utils/helpers';

interface BillSplitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Participant {
  id: string;
  name: string;
  contact: string;
  amount: number;
  paid: boolean;
}

const BillSplitFormModal: React.FC<BillSplitFormModalProps> = ({ isOpen, onClose }) => {
  const { user, createBillSplit } = useApp();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    totalAmount: 0,
    splitType: SPLIT_TYPES.EQUAL as keyof typeof SPLIT_TYPES,
    date: new Date().toISOString().split('T')[0]
  });

  const [participants, setParticipants] = useState<Participant[]>([
    { id: generateId('participant_'), name: '', contact: '', amount: 0, paid: false }
  ]);

  const addParticipant = () => {
    setParticipants([...participants, { 
      id: generateId('participant_'), 
      name: '', 
      contact: '', 
      amount: 0, 
      paid: false 
    }]);
  };

  const removeParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const updateParticipant = (id: string, field: keyof Participant, value: string | number | boolean) => {
    const updated = participants.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    );
    setParticipants(updated);
  };

  const calculateEqualSplit = () => {
    if (formData.totalAmount > 0 && participants.length > 0) {
      const amountPerPerson = formData.totalAmount / participants.length;
      const updated = participants.map(p => ({ ...p, amount: amountPerPerson }));
      setParticipants(updated);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề hóa đơn';
    }

    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = 'Tổng tiền phải lớn hơn 0';
    }

    const validParticipants = participants.filter(p => p.name.trim());
    if (validParticipants.length === 0) {
      newErrors.participants = 'Phải có ít nhất một người tham gia';
    }

    if (formData.splitType === SPLIT_TYPES.CUSTOM) {
      const totalParticipantAmount = participants.reduce((sum, p) => sum + (p.amount || 0), 0);
      if (Math.abs(totalParticipantAmount - formData.totalAmount) > 0.01) {
        newErrors.amounts = 'Tổng tiền của các người tham gia phải bằng tổng hóa đơn';
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
      const validParticipants = participants
        .filter(p => p.name.trim())
        .map(p => ({
          name: p.name.trim(),
          contact: p.contact?.trim(),
          share: formData.splitType === SPLIT_TYPES.EQUAL ? 100 / participants.length : 
                 (p.amount / formData.totalAmount) * 100,
          amount: formData.splitType === SPLIT_TYPES.EQUAL ? formData.totalAmount / participants.length : p.amount,
          paid: false
        }));

      await createBillSplit({
        ...formData,
        payer: user?._id || '',
        payerName: user?.name || '',
        participants: validParticipants,
        account: '',
        settled: false,
        date: new Date(formData.date).toISOString()
      });
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating bill split:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      totalAmount: 0,
      splitType: SPLIT_TYPES.EQUAL,
      date: new Date().toISOString().split('T')[0]
    });
    setParticipants([{ id: generateId('participant_'), name: '', contact: '', amount: 0, paid: false }]);
    setErrors({});
  };

  const splitTypeOptions = [
    { value: SPLIT_TYPES.EQUAL, label: 'Chia đều' },
    { value: SPLIT_TYPES.CUSTOM, label: 'Tùy chỉnh' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chia hóa đơn"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Header Section - Single Background */}
        <div className="flex items-center space-x-3 p-4 bg-green-50/80 rounded-xl border border-green-200/40">
          <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
            <Receipt className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-green-900 text-sm">Chia hóa đơn</p>
            <p className="text-xs text-green-600">Chia sẻ chi phí với nhiều người</p>
          </div>
        </div>

        {/* Basic Info Section - Clean Background */}
        <div className="space-y-4">
          <Input
            label="Tiêu đề hóa đơn"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            placeholder="Ăn trưa, đi chơi, mua sắm..."
            required
            error={errors.title}
            size="sm"
          />

          <Input
            label="Mô tả (tùy chọn)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Chi tiết về hóa đơn..."
            size="sm"
          />

          <Input
            label="Tổng tiền"
            type="number"
            value={formData.totalAmount}
            onChange={(e) => {
              const amount = parseFloat(e.target.value) || 0;
              setFormData({ ...formData, totalAmount: amount });
              if (formData.splitType === SPLIT_TYPES.EQUAL) {
                calculateEqualSplit();
              }
              if (errors.totalAmount) setErrors({ ...errors, totalAmount: '' });
            }}
            placeholder="0"
            min="0"
            step="1000"
            required
            error={errors.totalAmount}
            size="sm"
          />
        </div>

        {/* Split Type Section - Minimal Background */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Cách chia
          </label>
          <div className="flex rounded-xl bg-gray-50/60 p-1 border border-gray-200/50">
            {splitTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, splitType: option.value as keyof typeof SPLIT_TYPES });
                  if (option.value === SPLIT_TYPES.EQUAL) {
                    calculateEqualSplit();
                  }
                }}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  formData.splitType === option.value 
                    ? 'bg-white text-green-700 shadow-sm border border-green-200/50' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Participants Section - Single Clean Background */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Người tham gia
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addParticipant}
              icon={Plus}
              className="text-green-600 hover:bg-green-50/50 px-3 py-1.5 rounded-lg"
            >
              Thêm
            </Button>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto p-3 bg-gray-50/40 rounded-xl border border-gray-200/30">
            {participants.map((participant, index) => (
              <div key={participant.id} className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-gray-200/40">
                <div className="w-8 h-8 bg-blue-100/60 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    placeholder="Tên"
                    value={participant.name}
                    onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                    size="sm"
                  />
                  <Input
                    placeholder="Liên hệ"
                    value={participant.contact}
                    onChange={(e) => updateParticipant(participant.id, 'contact', e.target.value)}
                    size="sm"
                  />
                  {formData.splitType === SPLIT_TYPES.CUSTOM ? (
                    <Input
                      type="number"
                      placeholder="Số tiền"
                      value={participant.amount}
                      onChange={(e) => updateParticipant(participant.id, 'amount', parseFloat(e.target.value) || 0)}
                      size="sm"
                      min="0"
                    />
                  ) : (
                    <div className="flex items-center justify-center text-xs text-gray-600 font-medium bg-green-50/80 rounded-lg px-2 py-2 border border-green-200/40">
                      {formData.totalAmount > 0 ? 
                        new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(formData.totalAmount / participants.length) :
                        '0đ'
                      }
                    </div>
                  )}
                </div>
                
                {participants.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeParticipant(participant.id)}
                    icon={Trash2}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50/50 p-2 rounded-lg flex-shrink-0"
                  />
                )}
              </div>
            ))}
          </div>
          
          {errors.participants && (
            <p className="mt-2 text-sm text-red-600 bg-red-50/50 px-3 py-1 rounded-lg border border-red-200/50">
              {errors.participants}
            </p>
          )}
          {errors.amounts && (
            <p className="mt-2 text-sm text-red-600 bg-red-50/50 px-3 py-1 rounded-lg border border-red-200/50">
              {errors.amounts}
            </p>
          )}
        </div>

        {/* Date Section - Minimal */}
        <Input
          label="Ngày"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          size="sm"
        />

        {/* Action Buttons - Clean */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200/50">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="w-full sm:flex-1"
            size="sm"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="w-full sm:flex-1"
            size="sm"
          >
            Tạo chia hóa đơn
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BillSplitFormModal;