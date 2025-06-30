import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';

const RegisterForm: React.FC = () => {
  const { register, setAuthView } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Đăng ký</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="Họ và tên"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          label="Mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Đăng ký</Button>
      </form>
      <p className="mt-4 text-sm">
        Đã có tài khoản?{' '}
        <button
          onClick={() => setAuthView('login')}
          className="text-blue-500 hover:underline"
        >
          Đăng nhập
        </button>
      </p>
    </div>
  );
};

export default RegisterForm; 