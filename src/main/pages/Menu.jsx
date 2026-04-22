import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const { tableId } = useParams();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  const API_URL = "https://two123110291-tranvanluan.onrender.com";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, menuItemsRes] = await Promise.all([
          fetch(`${API_URL}/api/Category`),
          fetch(`${API_URL}/api/MenuItem`)
        ]);
        if (categoriesRes.ok) setCategories(await categoriesRes.json());
        if (menuItemsRes.ok) setMenuItems(await menuItemsRes.json());
      } catch (error) {
        console.error("Lỗi khi load dữ liệu API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (!tableId) return;

    fetch(`${API_URL}/api/Table/${tableId}`)
      .then(res => {
        if (!res.ok) throw new Error("Invalid table");
        return res.json();
      })
      .then(data => {
        console.log("Table OK:", data);
      })
      .catch(() => {
        alert("Bàn không tồn tại 😑");
        navigate("/menu");
      });
  }, [tableId]);
  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.categoryId === categoryId);
    return cat ? cat.categoryName : 'Danh mục chung';
  };

  const filteredItems = activeCategory
    ? menuItems.filter(item => item.categoryId === activeCategory)
    : menuItems;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[70vh]">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Thực Đơn <span className="text-orange-500">Toàn Diện</span></h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">Khám phá tinh hoa ẩm thực qua từng món ăn được tuyển chọn kỹ lưỡng từ các đầu bếp hàng đầu.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xl text-gray-500 font-medium animate-pulse">
          Đang chuẩn bị thực đơn...
        </div>
      ) : (
        <>
          {/* Menu Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-6 py-2.5 rounded-full font-bold transition-all shadow-sm ${activeCategory === null ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}
            >
              Tất cả món
            </button>
            {categories.map(cat => (
              <button
                key={cat.categoryId}
                onClick={() => setActiveCategory(cat.categoryId)}
                className={`px-6 py-2.5 rounded-full font-bold transition-all shadow-sm ${activeCategory === cat.categoryId ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredItems.map((item, index) => (
                <Link
                  to={
                    tableId
                      ? `/menu/${tableId}/item/${item.itemId}`
                      : `/menu/item/${item.itemId}`
                  } key={item.itemId || index}
                  className={`bg-white rounded-2xl shadow-sm transition-all overflow-hidden border border-gray-100 block ${!item.isAvailable ? 'opacity-90 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl group hover:-translate-y-1'}`}
                >                  <div className="h-56 relative overflow-hidden bg-gray-100">
                    {/* <img
                      src={item.imageUrl || item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"}
                      alt={item.itemName}
                      className={`w-full h-full object-cover transition-transform duration-500 ${!item.isAvailable ? 'grayscale opacity-60' : 'group-hover:scale-110'}`}
                    /> */}

                    <img
                      src={
                        item.imageUrl
                          ? item.imageUrl   // ✅ dùng trực tiếp nếu là full URL
                          : item.image
                            ? `${API_URL}${item.image}` // chỉ ghép khi là local path
                            : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"
                      }
                      alt={item.itemName}
                      className={`w-full h-full object-cover transition-transform duration-500 ${!item.isAvailable
                        ? "grayscale opacity-60"
                        : "group-hover:scale-110"
                        }`}
                    />
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-600/90 text-white font-black uppercase tracking-widest px-6 py-2 rounded-lg shadow-2xl transform -rotate-6 text-lg border-2 border-dashed border-white/50 animate-pulse">
                          Tạm Ngưng
                        </span>
                      </div>
                    )}
                    {item.isAvailable && item.isFeatured && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-orange-600 shadow-sm">
                        ★ Đề cử
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${!item.isAvailable ? 'text-gray-400' : 'text-orange-500'}`}>
                      {getCategoryName(item.categoryId)}
                    </p>
                    <h3 className={`font-bold text-xl mb-4 truncate ${!item.isAvailable ? 'text-gray-500' : 'text-gray-900'}`}>
                      {item.itemName || 'Chưa có tên món'}
                    </h3>
                    <div className="flex justify-between items-center">
                      <p className={`font-bold text-xl ${!item.isAvailable ? 'text-gray-400 line-through decoration-red-500/50 decoration-2' : 'text-gray-900'}`}>
                        {item.price ? `${item.price.toLocaleString('vi-VN')}đ` : 'Liên hệ'}
                      </p>
                      {item.isAvailable && (
                        <button className="bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow-sm">
                          +
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 text-lg border-2 border-dashed border-gray-200 rounded-3xl max-w-2xl mx-auto">
              Không tìm thấy món ăn nào thuộc danh mục này.
            </div>
          )}
        </>
      )}
    </div>
  );
}
