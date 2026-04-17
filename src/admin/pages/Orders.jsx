export default function Orders() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Order / Đặt bàn</h2>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
          + Tạo Order mới
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider font-bold">
              <th className="p-4 border-b">Mã Order</th>
              <th className="p-4 border-b">Khách Hàng</th>
              <th className="p-4 border-b">Bàn Số / Loại</th>
              <th className="p-4 border-b">Tổng Tiền</th>
              <th className="p-4 border-b">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-orange-50/50 transition-colors">
              <td className="p-4 font-bold text-gray-900">#ORD-902</td>
              <td className="p-4 font-medium">Anh Tuấn</td>
              <td className="p-4"><span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">Bàn Tầng 2 - Số 05</span></td>
              <td className="p-4 font-black text-gray-800">1.250.000đ</td>
              <td className="p-4"><span className="bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide">Đang chế biến</span></td>
            </tr>
            <tr className="hover:bg-orange-50/50 transition-colors">
               <td className="p-4 font-bold text-gray-900">#ORD-901</td>
               <td className="p-4 font-medium">Chị Linh Mai</td>
               <td className="p-4"><span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Mang về (Takeaway)</span></td>
               <td className="p-4 font-black text-gray-800">450.000đ</td>
               <td className="p-4"><span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide">Đã hoàn tất</span></td>
            </tr>
            <tr className="hover:bg-orange-50/50 transition-colors bg-red-50/20">
               <td className="p-4 font-bold text-gray-900">#ORD-900</td>
               <td className="p-4 font-medium">Anh Khang</td>
               <td className="p-4"><span className="text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded">Bàn VIP 1</span></td>
               <td className="p-4 font-black text-gray-800">8.500.000đ</td>
               <td className="p-4"><span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide">Chờ thanh toán</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
