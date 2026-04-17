export default function Users() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Khách hàng & Hội viên</h2>
        <div className="flex gap-2">
            <input type="text" placeholder="Tìm tên, SĐT..." className="border border-gray-200 px-4 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <button className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg font-medium shadow transition-colors">Tìm kiếm</button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider font-bold">
              <th className="p-4 border-b">Tên Khách Hàng</th>
              <th className="p-4 border-b">Số điện thoại</th>
              <th className="p-4 border-b">Hạng thành viên</th>
              <th className="p-4 border-b">Lượt đến</th>
              <th className="p-4 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-orange-50/50 transition-colors">
              <td className="p-4 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex justify-center items-center font-bold shadow-sm">B</div>
                 <span className="font-bold text-gray-800">Lê Văn Bách</span>
              </td>
              <td className="p-4 text-gray-600 font-medium">0981 223 445</td>
              <td className="p-4"><span className="bg-yellow-100 border border-yellow-200 font-black text-yellow-700 px-3 py-1 rounded inline-block text-xs uppercase tracking-wider shadow-sm">⭐ Vàng (Gold)</span></td>
              <td className="p-4 font-bold text-gray-700">12 lần</td>
              <td className="p-4">
                <button className="text-blue-600 hover:underline font-bold bg-blue-50 px-3 py-1 rounded hover:bg-blue-100 transition-colors">Xem lịch sử</button>
              </td>
            </tr>
            <tr className="hover:bg-orange-50/50 transition-colors">
              <td className="p-4 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex justify-center items-center font-bold shadow-sm">H</div>
                 <span className="font-bold text-gray-800">Đào Thu Hà</span>
              </td>
              <td className="p-4 text-gray-600 font-medium">0912 345 678</td>
              <td className="p-4"><span className="bg-gray-100 border border-gray-300 font-black text-gray-600 px-3 py-1 rounded inline-block text-xs uppercase tracking-wider shadow-sm">Bạc (Silver)</span></td>
              <td className="p-4 font-bold text-gray-700">5 lần</td>
              <td className="p-4">
                <button className="text-blue-600 hover:underline font-bold bg-blue-50 px-3 py-1 rounded hover:bg-blue-100 transition-colors">Xem lịch sử</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
