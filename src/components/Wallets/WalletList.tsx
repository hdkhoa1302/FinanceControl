import React, { useState } from 'react';
import { Wallet, Plus, Edit2, Trash2, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import WalletFormModal from './WalletFormModal';
import { PageHeader } from '../common/PageHeader';
import { EmptyState } from '../common/EmptyState';
import { Card } from '../common/Card';
import { ActionMenu } from '../common/ActionMenu';
import { currencyFormatter } from '../../utils/formatters';

const WalletList: React.FC = () => {
  const { wallets, deleteWallet } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState<any>(null);

  const walletIcons = {
    cash: Banknote,
    bank: CreditCard,
    'e-wallet': Smartphone
  };

  const walletGradients = {
    cash: 'from-green-400/20 to-emerald-500/20',
    bank: 'from-blue-400/20 to-cyan-500/20',
    'e-wallet': 'from-purple-400/20 to-violet-500/20'
  };

  const walletIconColors = {
    cash: 'text-green-600',
    bank: 'text-blue-600',
    'e-wallet': 'text-purple-600'
  };

  const handleEdit = (wallet: any) => {
    setEditingWallet(wallet);
    setShowForm(true);
  };

  const handleDelete = async (walletId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ví này?')) {
      try {
        await deleteWallet(walletId);
      } catch (error) {
        alert('Không thể xóa ví. Vui lòng thử lại.');
      }
    }
  };

  const handleCreateNew = () => {
    setEditingWallet(null);
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingWallet(null);
  };

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Quản lý ví"
        subtitle={`Tổng cộng: ${currencyFormatter.format(totalBalance)}`}
        actionLabel="Thêm ví mới"
        actionIcon={Plus}
        onAction={handleCreateNew}
      />

      {wallets.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Chưa có ví nào"
          description="Tạo ví đầu tiên để bắt đầu quản lý tài chính"
          actionLabel="Thêm ví mới"
          onAction={handleCreateNew}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {wallets.map((wallet) => {
            const IconComponent = walletIcons[wallet.type];
            const gradientClass = walletGradients[wallet.type];
            const iconColorClass = walletIconColors[wallet.type];
            
            return (
              <Card key={wallet._id} hover className="relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradientClass} border border-white/30 backdrop-blur-sm`}>
                        <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 ${iconColorClass}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">{wallet.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 capitalize font-medium">
                          {wallet.type === 'e-wallet' ? 'Ví điện tử' : 
                           wallet.type === 'bank' ? 'Ngân hàng' : 'Tiền mặt'}
                        </p>
                      </div>
                    </div>
                    <ActionMenu
                      items={[
                        {
                          label: 'Chỉnh sửa',
                          icon: Edit2,
                          onClick: () => handleEdit(wallet)
                        },
                        {
                          label: 'Xóa',
                          icon: Trash2,
                          onClick: () => handleDelete(wallet._id),
                          variant: 'danger'
                        }
                      ]}
                    />
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{currencyFormatter.format(wallet.balance)}</p>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">Số dư hiện tại</p>
                    </div>

                    {wallet.bankInfo && (
                      <div className="p-3 sm:p-4 bg-gray-50/50 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-gray-200/50">
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">{wallet.bankInfo}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200/50">
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">Loại ví</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 capitalize">
                        {wallet.type === 'e-wallet' ? 'Ví điện tử' : 
                         wallet.type === 'bank' ? 'Ngân hàng' : 'Tiền mặt'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <WalletFormModal
        isOpen={showForm}
        wallet={editingWallet}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default WalletList;