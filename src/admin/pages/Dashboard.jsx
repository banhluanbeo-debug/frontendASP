export default function Dashboard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Báo cáo Hoạt động Nhà Hàng</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100 relative overflow-hidden">
          <div className="absolute top-2 right-2 p-4 opacity-10 blur-[1px] text-6xl select-none pointer-events-none">🍲</div>
          <h3 className="text-orange-900 font-bold mb-2 text-lg">Đơn gọi món h.nay</h3>
          <p className="text-5xl font-black text-orange-600">145</p>
          <p className="text-sm text-orange-700 mt-3 font-semibold bg-orange-100 inline-block px-2 py-1 rounded">↑ 12% so với hôm qua</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 relative overflow-hidden">
          <div className="absolute top-2 right-2 p-4 opacity-10 blur-[1px] text-6xl select-none pointer-events-none">👥</div>
          <h3 className="text-blue-900 font-bold mb-2 text-lg">Lượt khách bàn</h3>
          <p className="text-5xl font-black text-blue-600">320</p>
          <p className="text-sm text-blue-700 mt-3 font-semibold bg-blue-100 inline-block px-2 py-1 rounded">Hoạt động công suất 80%</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden">
          <div className="absolute top-2 right-2 p-4 opacity-10 blur-[1px] text-6xl select-none pointer-events-none">💰</div>
          <h3 className="text-emerald-900 font-bold mb-2 text-lg">Doanh thu</h3>
          <p className="text-5xl font-black text-emerald-600">32.4<span className="text-2xl text-emerald-500">M</span></p>
          <p className="text-sm text-emerald-700 mt-3 font-semibold bg-emerald-100 inline-block px-2 py-1 rounded">vnđ / ngày</p>
        </div>
      </div>
    </div>
  );
}
