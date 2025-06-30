import React, { useState } from 'react';
import { PieChart, Plus, Target, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import { currencyFormatter } from '../../utils/formatters';

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
}

interface Budget {
  _id: string;
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  categories: BudgetCategory[];
}

const BudgetList: React.FC = () => {
  const { transactions } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock budget data - in real app this would come from API
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      _id: 'budget1',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      totalIncome: 20000000,
      totalExpense: 15000000,
      categories: [
        { name: 'Ăn uống', allocated: 5000000, spent: 4200000 },
        { name: 'Di chuyển', allocated: 2000000, spent: 1800000 },
        { name: 'Mua sắm', allocated: 3000000, spent: 3500000 },
        { name: 'Giải trí', allocated: 2000000, spent: 1500000 },
        { name: 'Y tế', allocated: 1000000, spent: 800000 },
        { name: 'Học tập', allocated: 2000000, spent: 1200000 }
      ]
    }
  ]);

  const [budgetForm, setBudgetForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalIncome: 0,
    categories: [
      { name: 'Ăn uống', allocated: 0 },
      { name: 'Di chuyển', allocated: 0 },
      { name: 'Mua sắm', allocated: 0 },
      { name: 'Giải trí', allocated: 0 },
      { name: 'Y tế', allocated: 0 },
      { name: 'Học tập', allocated: 0 }
    ]
  });

  const currentBudget = budgets.find(b => b.month === selectedMonth && b.year === selectedYear);

  const getSpentPercentage = (spent: number, allocated: number) => {
    if (allocated === 0) return 0;
    return (spent / allocated) * 100;
  };

  const getCategoryStatus = (spent: number, allocated: number) => {
    const percentage = getSpentPercentage(spent, allocated);
    if (percentage > 100) return 'over';
    if (percentage > 80) return 'warning';
    return 'good';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'over':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over':
        return AlertTriangle;
      case 'warning':
        return TrendingUp;
      default:
        return Target;
    }
  };

  const getProgressVariant = (status: string) => {
    switch (status) {
      case 'over':
        return 'danger';
      case 'warning':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getCategoryGradient = (status: string) => {
    switch (status) {
      case 'over':
        return 'from-red-50/80 to-rose-50/80';
      case 'warning':
        return 'from-yellow-50/80 to-orange-50/80';
      default:
        return 'from-green-50/80 to-emerald-50/80';
    }
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalAllocated = budgetForm.categories.reduce((sum, cat) => sum + cat.allocated, 0);
    
    const newBudget: Budget = {
      _id: `budget${Date.now()}`,
      month: budgetForm.month,
      year: budgetForm.year,
      totalIncome: budgetForm.totalIncome,
      totalExpense: totalAllocated,
      categories: budgetForm.categories.map(cat => ({
        ...cat,
        spent: 0 // Will be calculated from actual transactions
      }))
    };

    setBudgets([...budgets, newBudget]);
    setShowCreateModal(false);
    setBudgetForm({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      totalIncome: 0,
      categories: [
        { name: 'Ăn uống', allocated: 0 },
        { name: 'Di chuyển', allocated: 0 },
        { name: 'Mua sắm', allocated: 0 },
        { name: 'Giải trí', allocated: 0 },
        { name: 'Y tế', allocated: 0 },
        { name: 'Học tập', allocated: 0 }
      ]
    });
  };

  const updateCategoryAllocation = (index: number, allocated: number) => {
    const updatedCategories = budgetForm.categories.map((cat, i) => 
      i === index ? { ...cat, allocated } : cat
    );
    setBudgetForm({ ...budgetForm, categories: updatedCategories });
  };

  const totalAllocated = budgetForm.categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const remainingBudget = budgetForm.totalIncome - totalAllocated;

  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/40">
        <PageHeader
          title="Ngân sách"
          subtitle="Lập kế hoạch và theo dõi chi tiêu"
          actionLabel="Tạo ngân sách"
          actionIcon={Plus}
          onAction={() => setShowCreateModal(true)}
        />
      </div>

      {/* Month/Year Selector - Mobile Optimized */}
      <div className="bg-gradient-to-r from-purple-50/80 to-blue-50/80 backdrop-blur-xl rounded-2xl p-4 shadow-md border border-purple-200/30">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tháng</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 border border-purple-200/50 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 backdrop-blur-sm transition-all duration-300 text-sm"
            >
              {months.map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Năm</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 border border-purple-200/50 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 backdrop-blur-sm transition-all duration-300 text-sm"
            >
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {currentBudget ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Budget Overview - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card variant="gradient" className="from-blue-500/90 to-blue-600/90 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-blue-100 font-medium text-sm sm:text-base">Thu nhập dự kiến</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{currencyFormatter.format(currentBudget.totalIncome)}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="gradient" className="from-green-500/90 to-green-600/90 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-green-100 font-medium text-sm sm:text-base">Ngân sách</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{currencyFormatter.format(currentBudget.totalExpense)}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="gradient" className="from-purple-500/90 to-purple-600/90 text-white sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <PieChart className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-purple-100 font-medium text-sm sm:text-base">Còn lại</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold">
                      {currencyFormatter.format(currentBudget.totalIncome - currentBudget.totalExpense)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Categories Section - Completely Redesigned */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            {/* Header with Clean Design */}
            <div className="bg-gradient-to-r from-gray-50/90 to-gray-100/90 px-6 py-4 border-b border-gray-200/50">
              <h3 className="font-bold text-gray-900 text-lg">Chi tiết theo danh mục</h3>
              <p className="text-sm text-gray-600 mt-1">Theo dõi chi tiêu của từng danh mục</p>
            </div>

            {/* Categories Grid - Mobile First */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {currentBudget.categories.map((category, index) => {
                  const percentage = getSpentPercentage(category.spent, category.allocated);
                  const status = getCategoryStatus(category.spent, category.allocated);
                  const StatusIcon = getStatusIcon(status);
                  const remaining = Math.max(0, category.allocated - category.spent);
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md bg-gradient-to-r ${getCategoryGradient(status)} border-white/40`}
                    >
                      {/* Category Header - Clean Layout */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center backdrop-blur-sm">
                            <StatusIcon className={`w-4 h-4 ${
                              status === 'over' ? 'text-red-600' : 
                              status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{category.name}</h4>
                            <StatusBadge status={getStatusVariant(status) as any} size="sm">
                              {percentage.toFixed(0)}%
                            </StatusBadge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Amount Display - Simplified */}
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 font-medium">Đã chi:</span>
                          <span className="text-sm font-bold text-gray-900">
                            {currencyFormatter.format(category.spent)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 font-medium">Ngân sách:</span>
                          <span className="text-sm font-medium text-gray-700">
                            {currencyFormatter.format(category.allocated)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-white/50">
                          <span className="text-xs font-bold text-gray-700">Còn lại:</span>
                          <span className={`text-sm font-bold ${
                            status === 'over' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {status === 'over' ? '-' : ''}{currencyFormatter.format(remaining)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress Bar - Clean Design */}
                      <div className="space-y-1">
                        <ProgressBar
                          value={category.spent}
                          max={category.allocated}
                          variant={getProgressVariant(status) as any}
                          size="sm"
                          showLabel={false}
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">0</span>
                          <span className="text-xs font-medium text-gray-600">
                            {percentage.toFixed(1)}%
                          </span>
                          <span className="text-xs text-gray-500">
                            {currencyFormatter.format(category.allocated)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/40">
          <EmptyState
            icon={PieChart}
            title="Chưa có ngân sách"
            description={`Chưa có ngân sách cho ${months[selectedMonth - 1]} ${selectedYear}`}
            actionLabel="Tạo ngân sách"
            onAction={() => setShowCreateModal(true)}
          />
        </div>
      )}

      {/* Create Budget Modal - Optimized Spacing */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo ngân sách mới"
        size="lg"
      >
        <form onSubmit={handleCreateBudget} className="space-y-4">
          {/* Header - Compact */}
          <div className="flex items-center space-x-3 p-3 bg-purple-50/50 rounded-xl backdrop-blur-sm border border-purple-200/50">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400/20 to-violet-500/20 rounded-lg flex items-center justify-center">
              <PieChart className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-bold text-purple-900 text-sm">Tạo ngân sách mới</p>
              <p className="text-xs text-purple-600">Lập kế hoạch chi tiêu thông minh</p>
            </div>
          </div>

          {/* Date Selection - Compact */}
          <div className="bg-gray-50/60 p-3 rounded-xl border border-gray-200/40">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tháng</label>
                <select
                  value={budgetForm.month}
                  onChange={(e) => setBudgetForm({ ...budgetForm, month: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-300 text-sm"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Năm</label>
                <select
                  value={budgetForm.year}
                  onChange={(e) => setBudgetForm({ ...budgetForm, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-300 text-sm"
                >
                  {[2023, 2024, 2025].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Income Input - Highlighted but Compact */}
          <div className="bg-gradient-to-r from-green-50/60 to-emerald-50/60 p-3 rounded-xl border border-green-200/40">
            <Input
              label="Thu nhập dự kiến"
              type="number"
              value={budgetForm.totalIncome}
              onChange={(e) => setBudgetForm({ ...budgetForm, totalIncome: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              min="0"
              step="100000"
              required
              className="bg-white/90"
              size="sm"
            />
          </div>

          {/* Categories Section - Compact */}
          <div className="bg-white/60 p-3 rounded-xl border border-gray-200/30">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phân bổ ngân sách theo danh mục
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {budgetForm.categories.map((category, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border border-gray-200/50 rounded-lg bg-white/80 backdrop-blur-sm">
                  <div className="w-16 text-xs font-bold text-gray-700 flex-shrink-0">
                    {category.name}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      value={category.allocated}
                      onChange={(e) => updateCategoryAllocation(index, parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      step="10000"
                      size="sm"
                      className="bg-white/90"
                    />
                  </div>
                  <div className="w-12 text-xs text-gray-500 font-medium text-center flex-shrink-0">
                    {budgetForm.totalIncome > 0 ? 
                      `${((category.allocated / budgetForm.totalIncome) * 100).toFixed(0)}%` : 
                      '0%'
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Section - Compact */}
          <div className="p-3 bg-gray-50/50 rounded-xl backdrop-blur-sm border border-gray-200/50">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700 text-sm">Tổng phân bổ:</span>
                <span className="font-bold text-gray-900 text-sm">{currencyFormatter.format(totalAllocated)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700 text-sm">Còn lại:</span>
                <span className={`font-bold text-sm ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currencyFormatter.format(remainingBudget)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons - Compact */}
          <div className="flex gap-3 pt-3 border-t border-gray-200/50">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
              size="sm"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={remainingBudget < 0}
              size="sm"
            >
              Tạo ngân sách
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BudgetList;