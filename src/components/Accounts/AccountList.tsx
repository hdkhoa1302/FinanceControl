import React, { useState } from 'react';
import { Users, Plus, Crown, Eye, Settings, UserPlus, Shield, Star } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AccountService } from '../../services/AccountService';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import { currencyFormatter, dateFormatter } from '../../utils/formatters';

const AccountList: React.FC = () => {
  const { accounts, currentAccount, switchAccount, user, reloadAccounts } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const [createForm, setCreateForm] = useState({
    name: '',
    type: 'personal' as 'personal' | 'family'
  });

  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'member' as 'admin' | 'member' | 'viewer'
  });

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const service = new AccountService();
      const newAcc = await service.createAccount(createForm.name, createForm.type);
      await reloadAccounts();
      switchAccount(newAcc._id);
    } catch (err: any) {
      console.error('Create account error:', err);
    }
    setShowCreateModal(false);
    setCreateForm({ name: '', type: 'personal' });
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement invite member
    console.log('Invite member:', inviteForm, 'to account:', selectedAccount);
    setShowInviteModal(false);
    setInviteForm({ email: '', role: 'member' });
    setSelectedAccount(null);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'member':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-gray-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị';
      case 'member':
        return 'Thành viên';
      case 'viewer':
        return 'Xem';
      default:
        return role;
    }
  };

  const getRoleGradient = (role: string) => {
    switch (role) {
      case 'admin':
        return 'from-yellow-400/20 to-amber-500/20';
      case 'member':
        return 'from-blue-400/20 to-cyan-500/20';
      case 'viewer':
        return 'from-gray-400/20 to-gray-500/20';
      default:
        return 'from-gray-400/20 to-gray-500/20';
    }
  };

  const getAccountTypeGradient = (type: string) => {
    return type === 'family' 
      ? 'from-green-400/20 to-emerald-500/20' 
      : 'from-blue-400/20 to-cyan-500/20';
  };

  const getAccountTypeIcon = (type: string) => {
    return type === 'family' ? 'text-green-600' : 'text-blue-600';
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Quản lý tài khoản
          </h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg">Quản lý tài khoản cá nhân và gia đình</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          icon={Plus}
          size="lg"
        >
          Tạo tài khoản mới
        </Button>
      </div>

      {/* Current Account */}
      <div className="bg-gradient-to-br from-blue-500/90 to-purple-600/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white backdrop-blur-xl shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Tài khoản hiện tại</h2>
              <p className="text-blue-100 text-base sm:text-lg font-medium">{currentAccount?.name}</p>
              <p className="text-blue-200 text-sm capitalize">
                {currentAccount?.type === 'family' ? 'Gia đình' : 'Cá nhân'}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-lg sm:text-xl font-bold">{currentAccount?.members.length} thành viên</span>
              </div>
              <p className="text-blue-200 text-xs sm:text-sm">
                Tạo: {currentAccount && dateFormatter.formatDate(currentAccount.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {accounts.map((account) => (
          <div 
            key={account._id} 
            className={`bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden group ${
              account._id === currentAccount?._id 
                ? 'border-blue-500/50 ring-2 ring-blue-200/50' 
                : 'border-white/30'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${getAccountTypeGradient(account.type)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 bg-gradient-to-br ${getAccountTypeGradient(account.type)}`}>
                    <Users className={`w-6 h-6 sm:w-7 sm:h-7 ${getAccountTypeIcon(account.type)}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg">{account.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 capitalize font-medium">
                      {account.type === 'family' ? 'Tài khoản gia đình' : 'Tài khoản cá nhân'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {account.type === 'family' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedAccount(account);
                        setShowInviteModal(true);
                      }}
                      icon={UserPlus}
                      className="text-green-600 hover:bg-green-50/50 p-2 sm:p-3 rounded-xl sm:rounded-2xl"
                    >{null}</Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Settings}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-50/50 p-2 sm:p-3 rounded-xl sm:rounded-2xl"
                  >{null}</Button>
                </div>
              </div>

              {/* Members */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <h4 className="text-xs sm:text-sm font-bold text-gray-700">Thành viên</h4>
                <div className="space-y-2 sm:space-y-3 max-h-32 sm:max-h-40 overflow-y-auto">
                  {account.members.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50/50 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-gray-200/50">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center bg-gradient-to-br ${getRoleGradient(member.role)} backdrop-blur-sm`}>
                          {getRoleIcon(member.role)}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">{member.name}</span>
                      </div>
                      <span className="text-xs bg-gray-200/50 text-gray-600 px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm border border-gray-300/50 ml-2">
                        {getRoleLabel(member.role)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 mb-3 sm:mb-4">
                {account._id !== currentAccount?._id ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => switchAccount(account._id)}
                    className="w-full"
                  >
                    Chuyển đổi
                  </Button>
                ) : (
                  <div className="w-full text-center py-3 sm:py-3 text-xs sm:text-sm text-blue-600 font-bold bg-blue-50/50 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-blue-200/50 relative">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                    Đang sử dụng
                  </div>
                )}
              </div>

              <div className="pt-3 sm:pt-4 border-t border-gray-200/50">
                <p className="text-xs text-gray-500">
                  Tạo: {dateFormatter.formatDate(account.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {accounts.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100/80 to-gray-200/80 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 backdrop-blur-sm border border-gray-200/50">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Chưa có tài khoản nào</h3>
          <p className="text-gray-500 mb-4 sm:mb-6 text-base sm:text-lg">Tạo tài khoản đầu tiên để bắt đầu</p>
          <Button onClick={() => setShowCreateModal(true)} size="lg">
            Tạo tài khoản mới
          </Button>
        </div>
      )}

      {/* Create Account Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo tài khoản mới"
        size="md"
      >
        <form onSubmit={handleCreateAccount} className="space-y-6">
          <div className="flex items-center space-x-4 p-6 bg-blue-50/50 rounded-2xl backdrop-blur-sm border border-blue-200/50">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-blue-900">Tạo tài khoản mới</p>
              <p className="text-sm text-blue-600">Quản lý tài chính riêng biệt</p>
            </div>
          </div>

          <Input
            label="Tên tài khoản"
            value={createForm.name}
            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
            placeholder="Tài khoản gia đình, công ty..."
            required
          />

          <div>
            <label className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-3">
              Loại tài khoản
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCreateForm({ ...createForm, type: 'personal' })}
                className={`p-4 sm:p-6 border rounded-2xl text-left transition-all duration-300 ${
                  createForm.type === 'personal'
                    ? 'border-blue-500/50 bg-blue-50/50 text-blue-700 backdrop-blur-sm'
                    : 'border-white/30 hover:border-gray-400/50 bg-white/50 backdrop-blur-sm'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <p className="font-bold text-sm sm:text-base">Cá nhân</p>
                <p className="text-xs sm:text-sm text-gray-500">Chỉ cho bạn</p>
              </button>
              <button
                type="button"
                onClick={() => setCreateForm({ ...createForm, type: 'family' })}
                className={`p-4 sm:p-6 border rounded-2xl text-left transition-all duration-300 ${
                  createForm.type === 'family'
                    ? 'border-green-500/50 bg-green-50/50 text-green-700 backdrop-blur-sm'
                    : 'border-white/30 hover:border-gray-400/50 bg-white/50 backdrop-blur-sm'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <p className="font-bold text-sm sm:text-base">Gia đình</p>
                <p className="text-xs sm:text-sm text-gray-500">Chia sẻ với nhiều người</p>
              </button>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              Tạo tài khoản
            </Button>
          </div>
        </form>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title={`Mời thành viên vào ${selectedAccount?.name}`}
        size="md"
      >
        <form onSubmit={handleInviteMember} className="space-y-6">
          <div className="flex items-center space-x-4 p-6 bg-green-50/50 rounded-2xl backdrop-blur-sm border border-green-200/50">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-2xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-green-900">Mời thành viên</p>
              <p className="text-sm text-green-600">Chia sẻ quyền truy cập tài khoản</p>
            </div>
          </div>

          <Input
            label="Email"
            type="email"
            value={inviteForm.email}
            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
            placeholder="email@example.com"
            required
          />

          <div>
            <label className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-3">
              Vai trò
            </label>
            <select
              value={inviteForm.role}
              onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as any })}
              className="w-full px-4 py-3 border border-white/30 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-300"
            >
              <option value="member">Thành viên - Có thể thêm/sửa giao dịch</option>
              <option value="admin">Quản trị - Toàn quyền quản lý</option>
              <option value="viewer">Xem - Chỉ xem dữ liệu</option>
            </select>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowInviteModal(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              Gửi lời mời
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AccountList;