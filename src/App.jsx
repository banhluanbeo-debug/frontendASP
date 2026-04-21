import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './main/layouts/MainLayout';
import Home from './main/pages/Home';
import Menu from './main/pages/Menu';
import MenuDetail from './main/pages/MenuDetail';
import Reservation from './main/pages/Reservation';

import AdminLayout from './admin/layouts/AdminLayout';
import AdminLogin from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import Users from './admin/pages/Users';
import Orders from './admin/pages/Orders';
import MenuItems from './admin/pages/MenuItems';
import Tables from './admin/pages/Tables';

// Component Route Bảo Mật (Protected Route) 
// Chỉ những ai đã qua trang login và được lưu biến local thì mới được phép duyệt Admin
const ProtectedAdminRoute = ({ children }) => {
  const adminUser = localStorage.getItem('adminUser');

  if (!adminUser) {
    // Nếu chưa có phiên đăng nhập, đá về lại trang đăng nhập
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const user = JSON.parse(adminUser);
    // Kiểm tra xem Role của tài khoản này có thực sự là Admin không
    if (user.role?.roleName !== 'Admin') {
      return <Navigate to="/admin/login" replace />;
    }
  } catch (e) {
    return <Navigate to="/admin/login" replace />;
  }

  // Đủ quyền, cho phép truy cập Layout
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main/Client Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="menu/item/:id" element={<MenuDetail />} />
          <Route path="menu/:tableId" element={<Menu />} />
          <Route path="menu/:tableId/item/:id" element={<MenuDetail />} />
          <Route path="reservation" element={<Reservation />} />
        </Route>

        {/* Admin Login - Đứng ngoài hệ thống Sidebar */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes - Có Sidebar & Được bảo vệ bởi ProtectedAdminRoute */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="menu-items" element={<MenuItems />} />
          <Route path="orders" element={<Orders />} />
          <Route path="tables" element={<Tables />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;