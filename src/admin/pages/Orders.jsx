import React, { useState, useEffect } from 'react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedIds, setSelectedIds] = useState([]);
  const API_URL = "https://two123110291-tranvanluan.onrender.com";
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch cả Order và Table để lấy tên bàn
      const [orderRes, tableRes] = await Promise.all([
        fetch(`${API_URL}/api/Order?t=${new Date().getTime()}`),
        fetch(`${API_URL}/api/Table?t=${new Date().getTime()}`)
      ]);

      if (orderRes.ok && tableRes.ok) {
        const orderData = await orderRes.json();
        const tableData = await tableRes.json();

        console.log("Debug Order Data:", orderData); // Dòng này để kiểm tra dữ liệu thực tế
        console.log("Debug Table Data:", tableData);

        // Lọc linh hoạt hơn: Theo log thực tế, status của đơn hoàn tất là 2
        const paidOrders = orderData
          .filter(o =>
            o.status === 2 ||
            o.status === "Closed" ||
            o.Status === 2 ||
            o.Status === "Closed"
          )
          .map(order => {
            const tableId = order.tableId || order.TableId;
            const table = tableData.find(t => (t.tableId || t.TableId) === tableId);
            return {
              ...order,
              orderId: order.orderId || order.OrderId,
              customerName: order.customerName || order.CustomerName,
              subtotal: order.subtotal || order.Subtotal,
              paidAt: order.paidAt || order.PaidAt,
              tableName: table?.tableCode || table?.TableCode || 'N/A'
            };
          })
          // Sắp xếp đơn mới nhất lên đầu
          .sort((a, b) => new Date(b.paidAt || b.createdAt) - new Date(a.paidAt || a.createdAt));

        setOrders(paidOrders);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' +
      date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa hóa đơn #ORD-${id}?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/Order/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setOrders(orders.filter(o => o.orderId !== id));
        setSelectedIds(selectedIds.filter(idx => idx !== id));
      } else {
        alert("Không thể xóa hóa đơn này. Có thể nó đang được liên kết với dữ liệu khác.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa hóa đơn:", error);
      alert("Lỗi kết nối khi xóa.");
    }
  };

  const toggleSelectOrder = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === orders.length && orders.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map(o => o.orderId));
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} hóa đơn đã chọn? Hành động này không thể hoàn tác.`)) return;

    try {
      setLoading(true);
      // Gọi xóa từng cái song song
      await Promise.all(selectedIds.map(id =>
        fetch(`${API_URL}/api/Order/${id}`, { method: 'DELETE' })
      ));

      setSelectedIds([]);
      await fetchData(); // Load lại danh sách mới nhất
    } catch (error) {
      console.error("Lỗi xóa hàng loạt:", error);
      alert("Có lỗi xảy ra khi xóa một số hóa đơn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Lịch sử Thanh toán</h2>
          <p className="text-gray-400 text-sm font-medium">Danh sách các hóa đơn đã hoàn tất thanh toán</p>
        </div>
        <div className="flex gap-4">
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm transition-all animate-in slide-in-from-right-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Xóa {selectedIds.length} mục đã chọn
            </button>
          )}
          <button
            onClick={fetchData}
            className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm mới
          </button>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="text-5xl mb-4">📄</div>
            <p className="text-gray-400 font-bold">Chưa có hóa đơn nào đã thanh toán</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900 text-gray-300 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="p-5 text-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-gray-800"
                      checked={selectedIds.length === orders.length && orders.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-5">Mã Hóa Đơn</th>
                  <th className="p-5">Bàn Số 🪑</th>
                  <th className="p-5">Khách Hàng</th>
                  <th className="p-5">Tổng Tiền 💰</th>
                  <th className="p-5">Thời gian thanh toán ⏱️</th>
                  <th className="p-5 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.orderId} className={`hover:bg-orange-50/20 transition-colors group ${selectedIds.includes(order.orderId) ? 'bg-orange-50/40' : ''}`}>
                    <td className="p-5 text-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-200 text-orange-500 focus:ring-orange-500"
                        checked={selectedIds.includes(order.orderId)}
                        onChange={() => toggleSelectOrder(order.orderId)}
                      />
                    </td>
                    <td className="p-5">
                      <span className="font-black text-gray-800 bg-gray-100 px-3 py-1.5 rounded-lg text-sm border border-gray-200 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                        #ORD-{order.orderId}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                          {order.tableName}
                        </div>
                        <span className="font-bold text-gray-600">Bàn {order.tableName}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs border border-orange-200">
                          {order.customerName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-700">{order.customerName}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-lg font-black text-emerald-600">
                        {formatCurrency(order.subtotal)}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-700">{formatDate(order.paidAt).split(' - ')[0]}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {formatDate(order.paidAt).split(' - ')[1]}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <button
                        onClick={() => handleDeleteOrder(order.orderId)}
                        className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 hover:scale-110 transition-all shadow-sm"
                        title="Xóa hóa đơn"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


