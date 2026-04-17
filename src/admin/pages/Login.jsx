import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Gọi qua Proxy để qua mặt CORS bảo mật của trình duyệt
      const res = await fetch('/api/User');
      const users = await res.json();
      
      // Tìm tài khoản trùng khớp fullName và passwordHash
      const foundUser = users.find(
        (u) => u.fullName === username && u.passwordHash === password
      );

      if (foundUser) {
        // Kiểm tra phân quyền (phải là Admin mới được vào)
        if (foundUser.role?.roleName === 'Admin') {
          // Lưu thông tin để phân quyền các lần truy cập tiếp theo
          localStorage.setItem('adminUser', JSON.stringify(foundUser));
          navigate('/admin/dashboard');
        } else {
          setError('Tài khoản của bạn không có đủ quyền quản trị!');
        }
      } else {
        setError('Sai tên đăng nhập hoặc mật khẩu!');
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ, vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-600"></div>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-900 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner border-2 border-orange-500">
            👑
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Portal</h2>
          <p className="text-gray-500 mt-2 font-medium">Hệ thống quản lý nhà hàng</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium mb-4 border border-red-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tên đăng nhập (fullName)</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
              placeholder="VD: admin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md focus:ring-4 focus:ring-gray-400 mt-6 disabled:opacity-50"
          >
            {isLoading ? 'Đang xác thực...' : 'Đăng nhập hệ thống'}
          </button>
        </form>
      </div>
    </div>
  );
}
