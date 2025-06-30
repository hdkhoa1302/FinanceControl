import React, { useState } from 'react';
import { Receipt, Plus, Check, X, Users, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import BillSplitFormModal from './BillSplitFormModal';
import Button from '../common/Button';
import { currencyFormatter, dateFormatter } from '../../utils/formatters';

const BillSplitList: React.FC = () => {
  const { billSplits, updateBillSplitParticipantPayment, settleBillSplit, deleteBillSplit } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unsettled' | 'settled'>('all');

  const filteredBillSplits = billSplits.filter(bill => {
    if (filter === 'unsettled') return !bill.settled;
    if (filter === 'settled') return bill.settled;
    return true;
  });

  const handleParticipantPayment = async (billId: string, participantName: string, paid: boolean) => {
    try {
      await updateBillSplitParticipantPayment(billId, participantName, paid);
    } catch (error) {
      alert('Không thể cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  const handleSettle = async (billId: string) => {
    if (window.confirm('Xác nhận tất cả mọi người đã trả tiền?')) {
      try {
        await settleBillSplit(billId);
      } catch (error) {
        alert('Không thể cập nhật trạng thái. Vui lòng thử lại.');
      }
    }
  };

  const handleDelete = async (billId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      try {
        await deleteBillSplit(billId);
      } catch (error) {
        alert('Không thể xóa. Vui lòng thử lại.');
      }
    }
  };

  const totalUnsettled = billSplits
    .filter(b => !b.settled)
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Single Clean Background */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg border border-white/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Chia hóa đơn
            </h1>
            <p className="text-gray-600 mt-2 text-base sm:text-lg">
              Chưa thu hồi: <span className="font-semibold text-red-600">{currencyFormatter.format(totalUnsettled)}</span>
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            icon={Plus}
            size="lg"
          >
            Chia hóa đơn mới
          </Button>
        </div>
      </div>

      {/* Filter Section - Distinct Background */}
      <div className="bg-green-50/60 rounded-2xl p-4 border border-green-200/40">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'unsettled', label: 'Chưa xong' },
            { key: 'settled', label: 'Đã xong' }
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setFilter(option.key as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === option.key
                  ? 'bg-white text-green-700 shadow-sm border border-green-200/50'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bill Split List */}
      {filteredBillSplits.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-gray-50/40 rounded-2xl border border-gray-200/30">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100/60 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Receipt className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Không có hóa đơn nào</h3>
          <p className="text-gray-500 mb-4 sm:mb-6 text-base sm:text-lg">Chưa có hóa đơn nào phù hợp với bộ lọc</p>
          <Button onClick={() => setShowForm(true)} size="lg">
            Tạo chia hóa đơn đầu tiên
          </Button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {filteredBillSplits.map((bill) => (
            <div key={bill._id} className="bg-white/90 rounded-2xl sm:rounded-3xl shadow-lg border border-white/50 overflow-hidden">
              {/* Header Section - Clean Single Background */}
              <div className="p-4 sm:p-6 border-b border-gray-100/60">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Left Side - Bill Info */}
                  <div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center ${
                      bill.settled 
                        ? 'bg-green-100/80 border border-green-200/50' 
                        : 'bg-blue-100/80 border border-blue-200/50'
                    }`}>
                      <Receipt className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        bill.settled ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{bill.title}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full w-fit ${
                          bill.settled 
                            ? 'bg-green-100/80 text-green-700 border border-green-200/50' 
                            : 'bg-blue-100/80 text-blue-700 border border-blue-200/50'
                        }`}>
                          {bill.settled ? 'Đã xong' : 'Chưa xong'}
                        </span>
                      </div>
                      {bill.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{bill.description}</p>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            {dateFormatter.formatDate(bill.date)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            {bill.participants.length} người
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side - Amount & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-blue-600 text-xl sm:text-2xl">
                        {currencyFormatter.format(bill.totalAmount)}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        Chia {bill.splitType === 'equal' ? 'đều' : 'tùy chỉnh'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!bill.settled && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSettle(bill._id)}
                          icon={Check}
                          className="text-green-600 hover:bg-green-50/50 p-2 sm:p-3 rounded-xl sm:rounded-2xl"
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(bill._id)}
                        icon={X}
                        className="text-red-600 hover:bg-red-50/50 p-2 sm:p-3 rounded-xl sm:rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Section - Only for Unsettled Bills */}
              {!bill.settled && (
                <div className="px-4 sm:px-6 py-3 bg-blue-50/40 border-b border-blue-100/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <span className="text-sm font-bold text-blue-700">Tiến độ thanh toán</span>
                    <span className="text-sm text-blue-600">
                      {bill.participants.filter(p => p.paid).length}/{bill.participants.length} người đã trả
                    </span>
                  </div>
                  <div className="w-full bg-blue-200/30 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(bill.participants.filter(p => p.paid).length / bill.participants.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Participants Section - Clean Layout */}
              <div className="p-4 sm:p-6">
                <h4 className="font-bold text-gray-700 text-sm mb-3 sm:mb-4">Danh sách người tham gia</h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {bill.participants.map((participant, index) => (
                    <div 
                      key={index} 
                      className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
                        participant.paid 
                          ? 'bg-green-50/60 border-green-200/40' 
                          : 'bg-gray-50/60 border-gray-200/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {/* Participant Info */}
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            participant.paid 
                              ? 'bg-green-100/80' 
                              : 'bg-gray-100/80'
                          }`}>
                            {participant.paid ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Users className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-gray-900 text-sm truncate">{participant.name}</p>
                            {participant.contact && (
                              <p className="text-xs text-gray-500 truncate">{participant.contact}</p>
                            )}
                            {participant.paid && participant.paidDate && (
                              <p className="text-xs text-green-600 font-medium">
                                Đã trả: {dateFormatter.formatDate(participant.paidDate)}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Amount & Action */}
                        <div className="flex items-center space-x-3 flex-shrink-0">
                          <div className="text-right bg-white/80 rounded-lg px-2 py-1 border border-gray-200/40">
                            <p className="font-bold text-gray-900 text-sm">
                              {currencyFormatter.format(participant.amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {participant.share.toFixed(1)}%
                            </p>
                          </div>
                          {!bill.settled && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleParticipantPayment(bill._id, participant.name, !participant.paid)}
                              className={`px-3 py-2 rounded-xl font-medium text-xs ${
                                participant.paid 
                                  ? 'text-orange-600 hover:bg-orange-50/50' 
                                  : 'text-green-600 hover:bg-green-50/50'
                              }`}
                            >
                              {participant.paid ? 'Chưa trả' : 'Đã trả'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BillSplitFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
};

export default BillSplitList;