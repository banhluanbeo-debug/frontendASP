
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";

export default function MenuDetail() {
  // const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [ordering, setOrdering] = useState(false);
  const { tableId, id } = useParams();
  const { tableId } = useParams();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const customerName = query.get("name");
  const API_URL = "https://two123110291-tranvanluan.onrender.com";
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`${API_URL}/api/MenuItem/${id}`);
        if (res.ok) {
          const data = await res.json();
          setItem(data);
        } else {
          setItem(null);
        }
      } catch (error) {
        console.error("Lỗi khi load dữ liệu món ăn:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);
  console.log("ORDER TABLE ID:", tableId);
  const handleOrder = async () => {
    if (!item) return;
    setOrdering(true);
    try {
      const res = await fetch(`${API_URL}/api/table/${tableId}/order?itemId=${item.itemId || item.id}&qty=${quantity}`,
        { method: "POST" }
      );
      if (res.ok) {
        alert(`Đã order ${quantity} ${item.itemName} 🍜`);
      } else {
        alert("Order thất bại ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server");
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-32 px-4 text-center min-h-[70vh]">
        <div className="inline-block p-4 rounded-full bg-orange-50 mb-4 animate-bounce">
          <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="animate-pulse text-2xl font-bold text-gray-500">Đang chuẩn bị phục vụ...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto py-32 px-4 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Món ăn không tồn tại 😢</h2>
        <p className="text-gray-500 text-lg mb-8">Có vẻ như món ăn này đã được dỡ khỏi thực đơn hoặc bị xóa.</p>
        <Link
          to={`/menu/${tableId}?name=${customerName}`}
          className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/30"
        >
          ← Quay lại Thực đơn
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[75vh]">
      <div className="mb-8">
        <Link
          to="/menu"
          className="text-gray-500 hover:text-orange-600 font-bold flex items-center gap-2 transition-colors w-max uppercase tracking-wider text-sm bg-gray-50 px-4 py-2 rounded-full border border-gray-200 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Mục Thực đơn
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">

        {/* Hình ảnh (Trái) */}
        <div className="lg:w-1/2 relative bg-gray-50 min-h-[400px]">
          {/* <img
            src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&q=80"}
            alt={item.itemName}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-700 ${!item.isAvailable ? 'grayscale opacity-70' : ''}`}
          /> */}
          <img
            src={
              item.imageUrl
                ? item.imageUrl   // ✅ dùng trực tiếp
                : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&q=80"
            }
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px] flex items-center justify-center">
              <div className="bg-red-600 text-white font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-2xl transform -rotate-12 text-3xl border border-red-400">
                TẠM NGƯNG
              </div>
            </div>
          )}
          {item.isAvailable && (
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-5 py-2 rounded-full text-sm font-extrabold text-orange-600 shadow-xl border border-white/20">
              ★ BÁN CHẠY NHẤT
            </div>
          )}
        </div>

        {/* Thông tin Chi tiết (Phải) */}
        <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-white to-orange-50/30">
          <div className="mb-4">
            <span className="bg-orange-100 text-orange-700 border border-orange-200 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
              {item.category?.categoryName || 'Danh Mục Khác'}
            </span>
          </div>

          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black mt-2 mb-6 leading-[1.1] tracking-tight ${!item.isAvailable ? 'text-gray-400' : 'text-gray-900'}`}>
            {item.itemName}
          </h1>

          <div className="flex flex-col gap-2 mb-8 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-4">
              <span className={`text-4xl lg:text-5xl font-black tracking-tight ${!item.isAvailable ? 'text-gray-300 line-through decoration-red-500/40 decoration-4' : 'text-orange-600'}`}>
                {item.price?.toLocaleString('vi-VN')} ₫
              </span>
            </div>
            {!item.isAvailable && (
              <span className="text-red-500 font-bold bg-red-50 px-4 py-2 rounded-lg text-sm inline-block w-max mt-2 border border-red-100">
                Lưu ý: Món này đang tạm ngưng kinh doanh hôm nay.
              </span>
            )}
          </div>

          <div className="prose prose-lg text-gray-500 mb-12">
            <p className="font-medium text-[1.1rem] leading-relaxed whitespace-pre-line">
              {item.description || `Tuyệt tác ẩm thực ${item.itemName} được chế tác tỉ mỉ từ những nguyên liệu hảo hạng nhất trong ngày.`}
            </p>
            <ul className="mt-6 space-y-3 text-sm font-medium text-gray-400 p-0 list-none">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Nguyên liệu 100% tươi sạch tuyển chọn
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Gia vị độc quyền đậm đà tinh hoa Á Châu
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Đầu bếp chuẩn 5 sao chế biến tận tâm
              </li>
            </ul>
          </div>

          <div className="mt-auto">
            <div className="flex flex-col sm:flex-row gap-5 items-center">

              {/* Vùng Chọn Số Lượng */}
              <div className={`flex items-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-1 ${!item.isAvailable ? 'opacity-50' : 'focus-within:ring-orange-500 focus-within:ring-2 transition-all'}`}>
                <button
                  disabled={!item.isAvailable || quantity <= 1}
                  onClick={() => setQuantity(q => q - 1)}
                  className="w-12 h-14 flex items-center justify-center text-2xl text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  -
                </button>
                <div className="w-14 h-14 flex items-center justify-center font-black text-xl text-gray-900 bg-white">
                  {quantity}
                </div>
                <button
                  disabled={!item.isAvailable || quantity >= 10}
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-14 flex items-center justify-center text-2xl text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  +
                </button>
              </div>

              {/* Nút Order */}
              <button
                disabled={!item.isAvailable || ordering}
                onClick={handleOrder}
                className={`flex-1 h-16 text-lg font-black rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 w-full sm:w-auto ${item.isAvailable
                  ? 'bg-gray-900 text-white hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-1 ring-4 ring-transparent hover:ring-orange-500/20'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                  }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {ordering
                  ? "Đang gửi order..."
                  : item.isAvailable
                    ? "Xác nhận chọn món 🍜"
                    : "Chưa thể đặt món"}
              </button>
            </div>

            {item.isAvailable && (
              <p className="text-center sm:text-left text-xs font-bold text-gray-400 mt-5 pl-2 tracking-wide uppercase">
                ✓ Đã bao gồm Thuế VAT & Phí dịch vụ
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}