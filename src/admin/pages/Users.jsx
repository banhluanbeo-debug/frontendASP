import React, { useState, useEffect } from 'react';

export default function Users() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const API_URL = "https://two123110291-tranvanluan.onrender.com";

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/Order?t=${new Date().getTime()}`);
      if (res.ok) {
        const orderData = await res.json();
        
        // Nhóm dữ liệu theo tên khách hàng
        const customerMap = {};
        
        orderData.forEach(order => {
          // Lấy tên khách và chuẩn hóa
          const rawName = order.customerName || order.CustomerName || "Khách vãng lai";
          const name = rawName.trim();
          
          if (!customerMap[name]) {
            customerMap[name] = {
              name,
              visitCount: 0,
              totalSpent: 0,
              lastVisit: null
            };
          }
          
          customerMap[name].visitCount += 1;
          customerMap[name].totalSpent += (order.subtotal || order.Subtotal || 0);
          
          const orderDate = new Date(order.paidAt || order.createdAt || order.CreatedAt);
          if (!customerMap[name].lastVisit || orderDate > new Date(customerMap[name].lastVisit)) {
            customerMap[name].lastVisit = orderDate;
          }
        });
        
        const customerList = Object.values(customerMap);
        
        // Sắp xếp theo yêu cầu logic: 
        // 1. Ưu tiên khách ăn >= 2 lần lên đầu
        // 2. Với khách đi 1 lần, sắp xếp theo số tiền nhiều nhất (đại gia mới)
        customerList.sort((a, b) => {
          const aFrequent = a.visitCount >= 2;
          const bFrequent = b.visitCount >= 2;
          
          if (aFrequent && !bFrequent) return -1;
          if (!aFrequent && bFrequent) return 1;
          
          // Nếu cả hai đều >= 2 lần, ưu tiên người đến nhiều hơn
          if (aFrequent && bFrequent) {
            return b.visitCount - a.visitCount;
          }
          
          // Nếu cả hai đều đi 1 lần, ưu tiên người tiêu nhiều hơn
          return b.totalSpent - a.totalSpent;
        });
        
        setCustomers(customerList);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu khách hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getMemberLevel = (visits, spent) => {
    if (visits >= 10 || spent >= 5000000) return { name: 'Kim Cương', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '💎' };
    if (visits >= 5 || spent >= 2000000) return { name: 'Vàng', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '⭐' };
    if (visits >= 2) return { name: 'Bạc', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: '🥈' };
    return { name: 'Mới', color: 'bg-green-100 text-green-700 border-green-200', icon: '👤' };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Thống kê Khách hàng</h2>
          <p className="text-gray-400 text-sm font-medium">Phân tích lượt đến và mức độ thân thiết của khách</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Tìm tên khách hàng..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 font-bold text-gray-700 w-80 transition-all shadow-sm" 
            />
          </div>
          <button 
            onClick={fetchData}
            className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <div className="text-5xl mb-4 text-gray-300">👥</div>
            <p className="text-gray-400 font-bold">Không tìm thấy khách hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[2rem] border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900 text-gray-300 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="p-6">Tên Khách Hàng</th>
                  <th className="p-6">Số lượt đến</th>
                  <th className="p-6">Hạng thành viên</th>
                  <th className="p-6">Tổng chi tiêu</th>
                  <th className="p-6">Ghé thăm cuối</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCustomers.map((customer, index) => {
                  const level = getMemberLevel(customer.visitCount, customer.totalSpent);
                  return (
                    <tr key={index} className="hover:bg-orange-50/30 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border ${level.color}`}>
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-gray-800 text-lg group-hover:text-orange-600 transition-colors">{customer.name}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{customer.visitCount > 1 ? 'Khách quen' : 'Khách vãng lai'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 font-black text-gray-700 border border-gray-200">
                          {customer.visitCount}
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 ${level.color}`}>
                          <span>{level.icon}</span>
                          {level.name}
                        </span>
                      </td>
                      <td className="p-6">
                        <span className="text-xl font-black text-emerald-600">
                          {formatCurrency(customer.totalSpent)}
                        </span>
                      </td>
                      <td className="p-6">
                        <span className="text-sm font-bold text-gray-500">
                          {customer.lastVisit ? customer.lastVisit.toLocaleDateString('vi-VN') : '---'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
