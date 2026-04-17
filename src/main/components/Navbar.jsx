import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
          🥢 Hương Vị Á Châu
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Trang chủ</Link>
          <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Thực đơn</Link>
          <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Đặt bàn trực tuyến</Link>
        </div>
      </div>
    </nav>
  );
}
