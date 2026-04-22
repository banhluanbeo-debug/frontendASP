import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "https://two123110291-tranvanluan.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, menuItemsRes] = await Promise.all([
          fetch(`${API_URL}/api/Category`),
          fetch(`${API_URL}/api/MenuItem`)
        ]);

        if (categoriesRes.ok) {
          const catsData = await categoriesRes.json();
          setCategories(catsData);
        }

        if (menuItemsRes.ok) {
          const itemsData = await menuItemsRes.json();
          setMenuItems(itemsData);
        }
      } catch (error) {
        console.error("Lỗi khi load dữ liệu API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper để lấy tên category dựa trên categoryId
  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.categoryId === categoryId);
    return cat ? cat.categoryName : 'Danh mục chung';
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-black overflow-hidden rounded-2xl shadow-xl mb-12 border border-gray-800 group">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80" alt="Restaurant Background" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl drop-shadow-lg">
            <span className="block">Tinh hoa ẩm thực</span>{' '}
            <span className="block text-orange-500 mt-2">Truyền thống Á Châu</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-gray-200 sm:max-w-3xl drop-shadow-md font-medium">
            Thưởng thức nghệ thuật ẩm thực độc đáo kết hợp giữa hương vị truyền thống và phong cách chế biến hiện đại. Không gian ấm cúng, sang trọng.
          </p>
          <div className="mt-10 flex space-x-4">
            <Link to="/menu" className="px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-orange-600 hover:bg-orange-700 shadow-lg hover:shadow-orange-500/30 transition-all">
              Xem Bản Thực Đơn
            </Link>
            <Link to="/reservation" className="px-8 py-4 border-2 border-white text-lg font-bold rounded-full text-white bg-transparent hover:bg-white hover:text-black shadow-lg transition-all">
              Đặt Bàn Ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Menu */}
      <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Món ăn nổi bật</h2>
          <p className="text-gray-500 mt-2">Những hương vị không thể bỏ lỡ tại nhà hàng</p>
        </div>
        <Link to="/menu" className="text-orange-600 font-semibold hover:text-orange-700 bg-orange-50 px-4 py-2 rounded-lg">Xem tất cả thưc đơn →</Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 font-medium animate-pulse">
          Đang tải thực đơn từ máy chủ...
        </div>
      ) : menuItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {menuItems
            .filter((item) => item.isAvailable !== false)
            .slice(0, 4)
            .map((item, index) => (
              <Link to={`/menu/${item.itemId}`} key={item.itemId || index} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden group cursor-pointer border border-gray-100 hover:-translate-y-1 block">
                <div className="h-56 relative overflow-hidden bg-gray-100">
                  {/* Ưu tiên sử dụng hình ảnh từ API, nếu không có sẽ hiển thị ảnh mặc định */}
                  {/* <img src={item.imageUrl || item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"} alt={item.name || item.itemName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> */}

                  <img
                    src={
                      item.imageUrl
                        ? item.imageUrl   // ✅ dùng trực tiếp
                        : item.image
                          ? `${API_URL}${item.image}` // chỉ nối khi là local path
                          : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"
                    }
                    alt={item.name || item.itemName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {item.isFeatured && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-orange-600 shadow-sm">
                      ★ Đề cử
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-orange-500 text-xs font-bold uppercase tracking-wider mb-2">
                    {getCategoryName(item.categoryId)}
                  </p>
                  <h3 className="font-bold text-xl text-gray-900 mb-4 truncate">{item.name || item.itemName || 'Chưa có tên món'}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-900 font-bold text-xl">
                      {item.price ? `${item.price.toLocaleString('vi-VN')}đ` : 'Liên hệ'}
                    </p>
                    <button className="bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow-sm">
                      +
                    </button>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 font-medium">
          Chưa có món ăn nào được tìm thấy.
        </div>
      )}
    </div>
  );
}
