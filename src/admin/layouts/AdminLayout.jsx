import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AdminLayout() {
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center px-8">
          <h1 className="text-xl font-black text-gray-800 tracking-tight">Hệ thống quản lý</h1>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] text-gray-400 font-black uppercase leading-none">Xin chào,</p>
                <p className="text-sm font-bold text-gray-800">{adminUser.fullName || 'Admin'}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold border border-orange-200">
                {adminUser.fullName?.charAt(0) || 'A'}
             </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
