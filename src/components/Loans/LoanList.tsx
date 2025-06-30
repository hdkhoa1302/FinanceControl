import React, { useState } from 'react';
import { HandHeart, Plus, Calendar, User, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useLoans } from '../../hooks/useLoans';
import { PageHeader } from '../common/PageHeader';
import { EmptyState } from '../common/EmptyState';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import { currencyFormatter, dateFormatter } from '../../utils/formatters';

const LoanList: React.FC = () => {
  const { currentAccount } = useApp();
  const { loans, summary, loading, createLoan, deleteLoan } = useLoans(currentAccount?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'lent' | 'borrowed'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paid' | 'overdue'>('all');

  const [loanForm, setLoanForm] = useState({
    type: 'lent' as 'lent' | 'borrowed',
    counterpart: '',
    counterpartContact: '',
    amount: 0,
    interestRate: 0,
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: ''
  });

  // Filter options
  const typeFilters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'lent', label: 'Cho vay' },
    { key: 'borrowed', label: 'Đi vay' }
  ];

  const statusFilters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'active', label: 'Đang vay' },
    { key: 'paid', label: 'Đã trả' },
    { key: 'overdue', label: 'Quá hạn' }
  ];

  const filteredLoans = loans.filter(loan => {
    const matchesType = filter === 'all' || loan.type === filter;
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const handleCreateLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createLoan({
        accountId: currentAccount?.id || '',
        type: loanForm.type,
        counterpart: loanForm.counterpart,
        counterpartContact: loanForm.counterpartContact,
        amount: loanForm.amount,
        interestRate: loanForm.interestRate,
        startDate: new Date(loanForm.startDate),
        dueDate: new Date(loanForm.dueDate),
        description: loanForm.description
      });
      
      setShowCreateModal(false);
      setLoanForm({
        type: 'lent',
        counterpart: '',
        counterpartContact: '',
        amount: 0,
        interestRate: 0,
        startDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        description: ''
      });
    } catch (error) {
      console.error('Error creating loan:', error);
    }
  };

  const handleDelete = async (loanId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khoản vay này?')) {
      try {
        await deleteLoan(loanId);
      } catch (error) {
        alert('Không thể xóa. Vui lòng thử lại.');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return CheckCircle;
      case 'overdue':
        return AlertTriangle;
      default:
        return DollarSign;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'overdue':
        return 'error';
      default:
        return 'info';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Đã trả';
      case 'overdue':
        return 'Quá hạn';
      default:
        return 'Đang vay';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/40">
        <PageHeader
          title="Cho vay / Đi vay"
          subtitle="Quản lý các khoản vay và cho vay"
          actionLabel="Thêm khoản vay"
          actionIcon={Plus}
          onAction={() => setShowCreateModal(true)}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card variant="gradient" className="from-green-500/90 to-green-600/90 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <HandHeart className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-green-100 font-medium text-sm sm:text-base">Đang cho vay</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{currencyFormatter.format(summary.totalLent)}</p>
                <p className="text-green-200 text-xs sm:text-sm">
                  {summary.activeLentCount} khoản
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="from-orange-500/90 to-orange-600/90 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-orange-100 font-medium text-sm sm:text-base">Đang đi vay</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{currencyFormatter.format(summary.totalBorrowed)}</p>
                <p className="text-orange-200 text-xs sm:text-sm">
                  {summary.activeBorrowedCount} khoản
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters Section */}
      <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-xl rounded-2xl p-4 shadow-md border border-blue-200/30">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">Loại:</p>
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key as any)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                    filter === option.key
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 border border-blue-200/50 backdrop-blur-sm'
                      : 'text-gray-600 hover:bg-white/50 border border-transparent'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">Trạng thái:</p>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setStatusFilter(option.key as any)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                    statusFilter === option.key
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 border border-blue-200/50 backdrop-blur-sm'
                      : 'text-gray-600 hover:bg-white/50 border border-transparent'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loan List */}
      {filteredLoans.length === 0 ? (
        <div className="bg-gray-50/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/40">
          <EmptyState
            icon={HandHeart}
            title="Không có khoản vay"
            description="Chưa có khoản vay nào phù hợp với bộ lọc"
            actionLabel="Thêm khoản vay đầu tiên"
            onAction={() => setShowCreateModal(true)}
          />
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {filteredLoans.map((loan) => {
            const StatusIcon = getStatusIcon(loan.status);
            
            return (
              <Card key={loan._id} className="overflow-hidden">
                {/* Header Section */}
                <div className="border-b border-white/20 pb-4 sm:pb-6 mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Left Side - Loan Info */}
                    <div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 flex-shrink-0 ${
                        loan.type === 'lent' ? 'bg-gradient-to-br from-green-400/20 to-emerald-500/20' : 'bg-gradient-to-br from-orange-400/20 to-amber-500/20'
                      }`}>
                        <StatusIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          loan.status === 'paid' ? 'text-green-600' :
                          loan.status === 'overdue' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                            {loan.type === 'lent' ? 'Cho vay' : 'Đi vay'}: {loan.counterpart}
                          </h3>
                          <StatusBadge status={getStatusVariant(loan.status) as any}>
                            {getStatusLabel(loan.status)}
                          </StatusBadge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{loan.description}</p>
                        {loan.counterpartContact && (
                          <p className="text-sm text-gray-500">{loan.counterpartContact}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Right Side - Amount */}
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className={`text-xl sm:text-2xl font-bold ${
                        loan.type === 'lent' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {currencyFormatter.format(loan.amount)}
                      </p>
                      {loan.interestRate > 0 && (
                        <p className="text-sm text-gray-500">
                          Lãi suất: {loan.interestRate}%/tháng
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 bg-gray-50/50 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-gray-200/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-700">Ngày vay</span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{dateFormatter.formatDate(loan.startDate)}</p>
                  </div>

                  <div className="p-3 sm:p-4 bg-gray-50/50 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-gray-200/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-700">Hạn trả</span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{dateFormatter.formatDate(loan.dueDate)}</p>
                  </div>

                  <div className="p-3 sm:p-4 bg-gray-50/50 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-gray-200/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-700">Đã trả</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {currencyFormatter.format(loan.paidAmount)}
                    </p>
                  </div>
                </div>

                {/* Payment Progress */}
                {loan.paidAmount > 0 && (
                  <div className="p-4 sm:p-6 bg-green-50/50 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-green-200/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3">
                      <span className="text-sm text-green-700 font-medium">Tiến độ thanh toán:</span>
                      <span className="text-sm font-bold text-green-900">
                        {((loan.paidAmount / loan.amount) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <ProgressBar
                      value={loan.paidAmount}
                      max={loan.amount}
                      variant="success"
                      size="md"
                      showLabel={false}
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200/50">
                  <div className="flex justify-end">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(loan._id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Loan Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Thêm khoản vay"
        size="md"
      >
        <form onSubmit={handleCreateLoan} className="space-y-5">
          {/* Header */}
          <div className="flex items-center space-x-3 p-4 bg-orange-50/50 rounded-xl backdrop-blur-sm border border-orange-200/50">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-xl flex items-center justify-center">
              <HandHeart className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-bold text-orange-900 text-sm">Thêm khoản vay</p>
              <p className="text-xs text-orange-600">Quản lý cho vay và đi vay</p>
            </div>
          </div>

          {/* Type Selection */}
          <div className="bg-gray-50/60 p-4 rounded-xl border border-gray-200/40">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Loại giao dịch
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLoanForm({ ...loanForm, type: 'lent' })}
                className={`p-4 border rounded-xl text-left transition-all duration-300 ${
                  loanForm.type === 'lent'
                    ? 'border-green-500/50 bg-green-50/50 text-green-700 backdrop-blur-sm'
                    : 'border-white/30 hover:border-gray-400/50 bg-white/50 backdrop-blur-sm'
                }`}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2">
                  <HandHeart className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <p className="font-bold text-sm">Cho vay</p>
                <p className="text-xs text-gray-500">Bạn cho ai đó vay tiền</p>
              </button>
              <button
                type="button"
                onClick={() => setLoanForm({ ...loanForm, type: 'borrowed' })}
                className={`p-4 border rounded-xl text-left transition-all duration-300 ${
                  loanForm.type === 'borrowed'
                    ? 'border-orange-500/50 bg-orange-50/50 text-orange-700 backdrop-blur-sm'
                    : 'border-white/30 hover:border-gray-400/50 bg-white/50 backdrop-blur-sm'
                }`}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <p className="font-bold text-sm">Đi vay</p>
                <p className="text-xs text-gray-500">Bạn vay tiền từ ai đó</p>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 bg-white/60 p-4 rounded-xl border border-gray-200/30">
            <Input
              label={loanForm.type === 'lent' ? 'Người vay' : 'Người cho vay'}
              value={loanForm.counterpart}
              onChange={(e) => setLoanForm({ ...loanForm, counterpart: e.target.value })}
              placeholder="Tên người..."
              required
              icon={User}
              className="bg-white/90"
            />

            <Input
              label="Thông tin liên hệ (tùy chọn)"
              value={loanForm.counterpartContact}
              onChange={(e) => setLoanForm({ ...loanForm, counterpartContact: e.target.value })}
              placeholder="Số điện thoại, email..."
              className="bg-white/90"
            />

            <Input
              label="Số tiền"
              type="number"
              value={loanForm.amount}
              onChange={(e) => setLoanForm({ ...loanForm, amount: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              min="0"
              step="100000"
              required
              className="bg-white/90"
            />

            <Input
              label="Lãi suất (%/tháng)"
              type="number"
              value={loanForm.interestRate}
              onChange={(e) => setLoanForm({ ...loanForm, interestRate: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              min="0"
              step="0.1"
              className="bg-white/90"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Ngày vay"
                type="date"
                value={loanForm.startDate}
                onChange={(e) => setLoanForm({ ...loanForm, startDate: e.target.value })}
                required
                className="bg-white/90"
              />

              <Input
                label="Hạn trả"
                type="date"
                value={loanForm.dueDate}
                onChange={(e) => setLoanForm({ ...loanForm, dueDate: e.target.value })}
                required
                className="bg-white/90"
              />
            </div>

            <Input
              label="Mô tả"
              value={loanForm.description}
              onChange={(e) => setLoanForm({ ...loanForm, description: e.target.value })}
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
              onClick={() => setShowCreateModal(false)}
              className="w-full sm:flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1"
            >
              Thêm khoản vay
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LoanList;