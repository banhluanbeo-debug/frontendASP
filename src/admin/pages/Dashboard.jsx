import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    activeTables: 0,
    totalTables: 0,
    todayRevenue: 0,
    allTimeRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const API_URL = "https://two123110291-tranvanluan.onrender.com";

  const fetchData = async () => {
    try {
      setLoading(true);
      const [orderRes, tableRes] = await Promise.all([
        fetch(`${API_URL}/api/Order?t=${new Date().getTime()}`),
        fetch(`${API_URL}/api/Table?t=${new Date().getTime()}`)
      ]);

      if (orderRes.ok && tableRes.ok) {
        const orders = await orderRes.json();
        const tables = await tableRes.json();

        // Lấy ngày hôm nay định dạng YYYY-MM-DD
        const today = new Date().toLocaleDateString('en-CA');

        let tOrders = 0;
        let tRevenue = 0;
        let aRevenue = 0;

        orders.forEach(o => {
          const status = o.status ?? o.Status;
          const subtotal = o.subtotal ?? o.Subtotal ?? 0;
          const dateFull = o.paidAt || o.PaidAt || o.createdAt || o.CreatedAt;

          // Chỉ tính các đơn đã thanh toán (status 2 = Closed)
          if (status === 2 || status === "Closed") {
            aRevenue += subtotal;

            if (dateFull && dateFull.split('T')[0] === today) {
              tOrders += 1;
              tRevenue += subtotal;
            }
          }
        });

        const activeCount = tables.filter(t => (t.status || t.Status) !== 'Empty').length;

        setStats({
          todayOrders: tOrders,
          activeTables: activeCount,
          totalTables: tables.length,
          todayRevenue: tRevenue,
          allTimeRevenue: aRevenue
        });
      }
    } catch (error) {
      console.error("Lỗi Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Tính % công suất bàn
  const tableCapacity = stats.totalTables > 0
    ? Math.round((stats.activeTables / stats.totalTables) * 100)
    : 0;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Báo cáo Hoạt động</h2>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Dữ liệu thời gian thực</p>
        </div>
        <button
          onClick={fetchData}
          className="p-3 bg-gray-50 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all"
          title="Làm mới dữ liệu"
        >
          <svg className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card 1: Orders Today */}
        <div className="group bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-[2rem] shadow-lg shadow-orange-200 relative overflow-hidden transition-transform hover:scale-[1.02]">
          <div className="absolute -right-4 -bottom-4 opacity-10 blur-[1px] text-9xl select-none pointer-events-none group-hover:scale-110 transition-transform">🍱</div>
          <div className="relative z-10">
            <h3 className="text-orange-100 font-bold uppercase text-xs tracking-widest mb-4 opacity-80">Đơn hàng hôm nay</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-white">{stats.todayOrders}</span>
              <span className="text-orange-200 font-bold text-sm uppercase">Hóa đơn</span>
            </div>
            <div className="mt-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-black text-white uppercase tracking-tighter">Đang cập nhật</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Tables */}
        <div className="group bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] shadow-lg shadow-blue-200 relative overflow-hidden transition-transform hover:scale-[1.02]">
          <div className="absolute -right-4 -bottom-4 opacity-10 blur-[1px] text-9xl select-none pointer-events-none group-hover:scale-110 transition-transform">🪑</div>
          <div className="relative z-10">
            <h3 className="text-blue-100 font-bold uppercase text-xs tracking-widest mb-4 opacity-80">Bàn đang có khách</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-white">{stats.activeTables}</span>
              <span className="text-blue-200 font-bold text-sm uppercase">/ {stats.totalTables} Bàn</span>
            </div>
            <div className="mt-6 flex flex-col gap-1">
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-1000"
                  style={{ width: `${tableCapacity}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-black text-blue-200 uppercase mt-1">Công suất {tableCapacity}%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Today's Revenue */}
        <div className="group bg-gray-900 p-8 rounded-[2rem] shadow-xl relative overflow-hidden transition-transform hover:scale-[1.02]">
          <div className="absolute -right-4 -bottom-4 opacity-10 blur-[1px] text-9xl select-none pointer-events-none group-hover:scale-110 transition-transform">💰</div>
          <div className="relative z-10">
            <h3 className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-4 opacity-80">Doanh thu hôm nay</h3>
            <div className="flex flex-col">
              <span className="text-4xl font-black text-emerald-400 tracking-tighter leading-none mb-1">
                {formatCurrency(stats.todayRevenue)}
              </span>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">VNĐ thực nhận</span>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Tổng doanh thu nền</span>
                <span className="text-sm font-black text-gray-300">{formatCurrency(stats.allTimeRevenue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
