import { useState, useEffect } from 'react';

export default function MenuItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [currentItem, setCurrentItem] = useState({
    itemName: '',
    price: 0,
    categoryId: '',
    description: '',
    isAvailable: true,
    imageUrl: ''
  });
  // const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const API_URL = "https://two123110291-tranvanluan.onrender.com";
  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, catsRes] = await Promise.all([
        fetch(`${API_URL}/api/MenuItem`),
        fetch(`${API_URL}/api/Category`)
      ]);
      if (itemsRes.ok) setItems(await itemsRes.json());
      if (catsRes.ok) setCategories(await catsRes.json());
    } catch (error) {
      console.error('Lỗi khi fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.categoryId === id);
    return cat ? cat.categoryName : 'N/A';
  };

  const handleOpenModal = (mode, item = null) => {
    setModalMode(mode);
    setImageFile(null);
    if (item) {
      setCurrentItem({ ...item, imageUrl: item.imageUrl || '' });
      setImagePreview(item.imageUrl || null);
    } else {
      setCurrentItem({
        itemName: '',
        price: 0,
        categoryId: categories.length > 0 ? categories[0].categoryId : '',
        description: '',
        isAvailable: true,
        imageUrl: ''
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImageFile(file);
  //     const url = URL.createObjectURL(file);
  //     setImagePreview(url);
  //   }
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' || name === 'categoryId' ? Number(value) : value)
    }));
  };




  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // 🔥 Validate trước khi gửi
      if (!currentItem.itemName) {
        alert("Thiếu tên món");
        return;
      }

      if (!currentItem.categoryId) {
        alert("Chưa chọn danh mục 😤");
        return;
      }

      if (!currentItem.price || isNaN(currentItem.price)) {
        alert("Giá không hợp lệ");
        return;
      }

      // 🔥 Append dữ liệu
      formData.append('ItemName', currentItem.itemName);
      formData.append('Price', String(currentItem.price));
      formData.append('CategoryId', String(currentItem.categoryId));
      formData.append('Description', currentItem.description || '');
      formData.append('IsAvailable', currentItem.isAvailable ? "true" : "false");

      // if (imageFile) {
      //   formData.append('image', imageFile);
      // }

      formData.append('ImageUrl', currentItem.imageUrl || '');

      // 🔥 LOG để debug
      console.log("==== FORM DATA ====");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      let res;

      if (modalMode === 'create') {
        res = await fetch(`${API_URL}/api/MenuItem`, {
          method: 'POST',
          body: formData
        });
      } else {
        res = await fetch(`${API_URL}/api/MenuItem/${currentItem.itemId}`, {
          method: 'PUT',
          body: formData
        });
      }

      // 🔥 LOG response
      console.log("STATUS:", res.status);

      if (res.ok) {
        console.log("SUCCESS ✅");
        setIsModalOpen(false);
        fetchData();
      } else {
        const errorText = await res.text();
        console.error("BACKEND ERROR ❌:", errorText);
        alert("Backend lỗi:\n" + errorText);
      }

    } catch (error) {
      console.error("FETCH ERROR ❌:", error);
      alert("Lỗi kết nối server");
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa món này không?')) {
      try {
        const res = await fetch(`${API_URL}/api/MenuItem/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchData();
        } else {
          alert('Không thể xóa món này!');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 border-b-4 border-orange-500 inline-block pb-1">Quản lý Thực Đơn</h1>
          <p className="text-gray-500 mt-2">Xem, thêm, sửa, xóa các món ăn trong nhà hàng</p>
        </div>
        <button
          onClick={() => handleOpenModal('create')}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Thêm Món Mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider border-b border-gray-200">
                <th className="p-4 font-bold">Hình ảnh</th>
                <th className="p-4 font-bold">Tên món</th>
                <th className="p-4 font-bold">Danh mục</th>
                <th className="p-4 font-bold">Giá bán</th>
                <th className="p-4 font-bold">Trạng thái</th>
                <th className="p-4 font-bold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Chưa có món ăn nào</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.itemId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm bg-gray-100 border border-gray-200">
                        {item.imageUrl ? (
                          <img
                            src={
                              item.imageUrl?.startsWith("http")
                                ? item.imageUrl
                                : `https://two123110291-tranvanluan.onrender.com${item.imageUrl}`
                            }
                            alt={item.itemName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Trống</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-900">{item.itemName}</td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                        {getCategoryName(item.categoryId)}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-700">
                      {item.price.toLocaleString('vi-VN')}₫
                    </td>
                    <td className="p-4">
                      {item.isAvailable ? (
                        <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span> Còn phục vụ
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span> Tạm ngưng
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleOpenModal('view', item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button onClick={() => handleOpenModal('edit', item)} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Chỉnh sửa">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(item.itemId)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden mt-10">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">
                {modalMode === 'create' ? 'Tạo Món Mới' : modalMode === 'edit' ? 'Chỉnh Sửa Món' : 'Chi Tiết Món Ăn'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tên món ăn <span className="text-red-500">*</span></label>
                  <input
                    type="text" name="itemName" required disabled={modalMode === 'view'}
                    value={currentItem.itemName} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="VD: Cơm chiên hải sản"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                  <input
                    type="number" name="price" required min="0" disabled={modalMode === 'view'}
                    value={currentItem.price} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục <span className="text-red-500">*</span></label>
                  <select
                    name="categoryId" required disabled={modalMode === 'view'}
                    value={currentItem.categoryId} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  >
                    <option value="" disabled>--- Chọn danh mục ---</option>
                    {categories.map(c => (
                      <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả chi tiết món ăn</label>
                  <textarea
                    name="description" rows="3" disabled={modalMode === 'view'}
                    value={currentItem.description || ''} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
                    placeholder="VD: Món bò lúc lắc xào thơm ngon đậm vị..."
                  ></textarea>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Link ảnh (Cloudinary)
                  </label>

                  <input
                    type="text"
                    name="imageUrl"
                    value={currentItem.imageUrl || ''}
                    onChange={handleChange}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500"
                  />

                  {currentItem.imageUrl && (
                    <div className="mt-3 w-32 h-32 rounded-xl overflow-hidden border">
                      <img src={currentItem.imageUrl} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {imagePreview && (
                    <div className="mt-3 w-32 h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="col-span-2 flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <input
                    type="checkbox" name="isAvailable" id="isAvailable" disabled={modalMode === 'view'}
                    checked={currentItem.isAvailable} onChange={handleChange}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                  />
                  <label htmlFor="isAvailable" className="ml-3 text-sm font-bold text-gray-700 cursor-pointer">
                    Trạng thái: Còn phục vụ (Hiển thị hiển thị lên trang khách)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                  {modalMode === 'view' ? 'Đóng' : 'Hủy bỏ'}
                </button>
                {modalMode !== 'view' && (
                  <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/30">
                    {modalMode === 'create' ? 'Xác nhận tạo mới' : 'Lưu thay đổi'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
