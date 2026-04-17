import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-800 hover:text-white';

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  return (
    <div className="w-64 bg-gray-900 min-h-screen p-5 border-r border-gray-800 flex flex-col">
      <div className="mb-10 text-center">
        <Link to="/admin/dashboard" className="text-2xl font-black tracking-wider text-orange-500 flex items-center justify-center gap-2">
          <span>👑</span> ADMIN
        </Link>
        <p className="text-xs text-gray-500 mt-2 tracking-widest uppercase">Quản lý nhà hàng</p>
      </div>

      <nav className="flex flex-col space-y-2 flex-1">
        <Link to="/admin/dashboard" className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${isActive('/admin/dashboard')}`}>
          <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
          Tổng quan
        </Link>
        
        <Link to="/admin/orders" className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${isActive('/admin/orders')}`}>
          <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          Đơn hàng (Order)
        </Link>

        <Link to="/admin/users" className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${isActive('/admin/users')}`}>
          <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          Khách hàng
        </Link>
      </nav>

      <div className="pt-6 mt-6 border-t border-gray-800 space-y-2">
        <Link to="/" className="w-full px-4 py-3 text-gray-400 hover:text-white rounded-xl transition-colors flex items-center gap-3 group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Xem trang khách
        </Link>
        
        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors flex items-center gap-3 group">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
