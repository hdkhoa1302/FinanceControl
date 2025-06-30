import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Download, Trash2, Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const SettingsPage: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    avatar: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    budgetAlerts: true,
    transactionAlerts: false,
    weeklyReports: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'vi',
    currency: 'VND',
    dateFormat: 'dd/mm/yyyy'
  });

  const tabs = [
    { id: 'profile', label: 'Hồ sơ', icon: User, color: 'text-blue-600' },
    { id: 'notifications', label: 'Thông báo', icon: Bell, color: 'text-yellow-600' },
    { id: 'security', label: 'Bảo mật', icon: Shield, color: 'text-green-600' },
    { id: 'appearance', label: 'Giao diện', icon: Palette, color: 'text-purple-600' },
    { id: 'data', label: 'Dữ liệu', icon: Download, color: 'text-gray-600' }
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save profile
    console.log('Save profile:', profileForm);
  };

  const handleExportData = () => {
    // TODO: Implement data export
    console.log('Export data');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log('Delete account');
    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Single Clean Background */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/40">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Cài đặt
          </h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg">Quản lý tài khoản và tùy chỉnh ứng dụng</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Sidebar - Clean Design */}
        <div className="lg:w-64">
          <div className="bg-gradient-to-br from-gray-50/80 to-gray-100/80 backdrop-blur-xl rounded-2xl shadow-md border border-gray-200/40 overflow-hidden">
            <div className="p-3 sm:p-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 mb-2 ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-700 shadow-md border border-blue-200/50'
                        : 'text-gray-700 hover:bg-white/60'
                    }`}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-white/80 border border-gray-200/40">
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === tab.id ? 'text-blue-600' : tab.color}`} />
                    </div>
                    <span className="font-medium text-sm sm:text-base">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Section - Single Background */}
        <div className="flex-1">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            {/* Content Header - Clean Design */}
            <div className="bg-gradient-to-r from-gray-50/90 to-gray-100/90 px-6 py-4 border-b border-gray-200/50">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8">
              {activeTab === 'profile' && (
                <div>
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    {/* Avatar Section - Compact */}
                    <div className="flex items-center space-x-4 sm:space-x-6 p-4 bg-blue-50/60 rounded-xl border border-blue-200/40">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100/80 rounded-2xl flex items-center justify-center border border-gray-200/50">
                        <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                      <div>
                        <Button variant="secondary" size="sm">
                          Thay đổi ảnh
                        </Button>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">JPG, PNG tối đa 2MB</p>
                      </div>
                    </div>

                    {/* Form Fields - Clean Layout */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Họ và tên"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          required
                          className="bg-white/90"
                        />
                        <Input
                          label="Email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          required
                          className="bg-white/90"
                        />
                      </div>
                      <Input
                        label="Số điện thoại"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="bg-white/90"
                      />
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-200/50">
                      <Button type="submit" icon={Save} size="lg">
                        Lưu thay đổi
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Thông báo qua email', description: 'Nhận thông báo quan trọng qua email' },
                    { key: 'pushNotifications', label: 'Thông báo đẩy', description: 'Nhận thông báo trên thiết bị' },
                    { key: 'budgetAlerts', label: 'Cảnh báo ngân sách', description: 'Thông báo khi vượt ngân sách' },
                    { key: 'transactionAlerts', label: 'Cảnh báo giao dịch', description: 'Thông báo cho mọi giao dịch' },
                    { key: 'weeklyReports', label: 'Báo cáo hàng tuần', description: 'Nhận báo cáo tài chính hàng tuần' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gray-50/40">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">{setting.label}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            [setting.key]: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  {/* Password Change - Highlighted */}
                  <div className="p-4 sm:p-6 border border-blue-200/50 rounded-xl bg-blue-50/60">
                    <h3 className="font-bold text-blue-900 mb-2 text-sm sm:text-base">Đổi mật khẩu</h3>
                    <p className="text-xs sm:text-sm text-blue-600 mb-4">Cập nhật mật khẩu để bảo vệ tài khoản</p>
                    <Button variant="secondary" size="lg">
                      Đổi mật khẩu
                    </Button>
                  </div>

                  {/* Security Settings - Clean Layout */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gray-50/40">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Xác thực hai yếu tố</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Tăng cường bảo mật với xác thực 2FA</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactorAuth}
                          onChange={(e) => setSecuritySettings({
                            ...securitySettings,
                            twoFactorAuth: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gray-50/40">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Cảnh báo đăng nhập</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Thông báo khi có đăng nhập từ thiết bị mới</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.loginAlerts}
                          onChange={(e) => setSecuritySettings({
                            ...securitySettings,
                            loginAlerts: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-5">
                  {/* Theme Selection - Clean Design */}
                  <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200/40">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Chủ đề</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { value: 'light', label: 'Sáng' },
                        { value: 'dark', label: 'Tối' }
                      ].map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: theme.value })}
                          className={`p-4 border rounded-xl text-left transition-all duration-300 ${
                            appearanceSettings.theme === theme.value
                              ? 'border-purple-500/50 bg-white text-purple-700 shadow-sm'
                              : 'border-gray-200/50 hover:border-purple-400/50 bg-white/80'
                          }`}
                        >
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100/60 rounded-lg sm:rounded-xl flex items-center justify-center mb-2">
                            <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                          </div>
                          <p className="font-bold text-sm">{theme.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Settings Grid - Clean Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ</label>
                      <select
                        value={appearanceSettings.language}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, language: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-300 text-sm"
                      >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị tiền tệ</label>
                      <select
                        value={appearanceSettings.currency}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, currency: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-300 text-sm"
                      >
                        <option value="VND">VND (₫)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Định dạng ngày</label>
                      <select
                        value={appearanceSettings.dateFormat}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, dateFormat: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-300 text-sm"
                      >
                        <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                        <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                        <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="space-y-4">
                  {/* Export Data - Highlighted */}
                  <div className="p-4 sm:p-6 border border-green-200/50 rounded-xl bg-green-50/60">
                    <h3 className="font-bold text-green-900 mb-2 text-sm sm:text-base">Xuất dữ liệu</h3>
                    <p className="text-xs sm:text-sm text-green-600 mb-4">Tải xuống tất cả dữ liệu của bạn</p>
                    <Button variant="secondary" onClick={handleExportData} icon={Download} size="lg">
                      Xuất dữ liệu
                    </Button>
                  </div>

                  {/* Delete Account - Warning Design */}
                  <div className="p-4 sm:p-6 border border-red-200/50 rounded-xl bg-red-50/60">
                    <h3 className="font-bold text-red-900 mb-2 text-sm sm:text-base">Xóa tài khoản</h3>
                    <p className="text-xs sm:text-sm text-red-600 mb-4">
                      Xóa vĩnh viễn tài khoản và tất cả dữ liệu. Hành động này không thể hoàn tác.
                    </p>
                    <Button 
                      variant="danger" 
                      onClick={() => setShowDeleteModal(true)}
                      icon={Trash2}
                      size="lg"
                    >
                      Xóa tài khoản
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal - Clean Design */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận xóa tài khoản"
        size="md"
      >
        <div className="space-y-5">
          {/* Warning Section - Single Background */}
          <div className="p-4 bg-red-50/80 rounded-xl border border-red-200/50">
            <p className="text-red-800 font-bold mb-2 text-sm">Cảnh báo!</p>
            <p className="text-red-700 text-sm mb-3">
              Việc xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu của bạn bao gồm:
            </p>
            <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
              <li>Tất cả giao dịch và ví</li>
              <li>Ngân sách và báo cáo</li>
              <li>Thông tin cá nhân</li>
              <li>Lịch sử hoạt động</li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <Input
            label="Nhập 'XÓA TÀI KHOẢN' để xác nhận"
            placeholder="XÓA TÀI KHOẢN"
            className="bg-white/90"
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200/50">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              className="w-full sm:flex-1"
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              className="w-full sm:flex-1"
            >
              Xóa tài khoản
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;