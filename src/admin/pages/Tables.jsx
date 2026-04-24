import React, { useState, useEffect } from 'react';

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({ tableCode: '', capacity: 4, status: 'Empty' });
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableOrders, setTableOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const API_URL = "https://two123110291-tranvanluan.onrender.com";
  const fetchTables = async () => {
    try {
      setLoading(true);
      const [tableRes, orderRes] = await Promise.all([
        fetch(`${API_URL}/api/Table?t=${new Date().getTime()}`),
        fetch(`${API_URL}/api/Order?t=${new Date().getTime()}`)
      ]);

      if (tableRes.ok && orderRes.ok) {
        const tableData = await tableRes.json();
        const orderData = await orderRes.json();

        const merged = tableData.map(table => {
          const activeOrder = orderData
            .filter(o => o.tableId === table.tableId && o.status === 0)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

          return {
            ...table,
            customerName: activeOrder?.customerName || null,
            numberOfPeople: activeOrder?.numberOfPeople || null
          };
        });

        setTables(merged);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();

    const interval = setInterval(() => {
      fetchTables();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenModal = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        tableCode: table.tableCode,
        capacity: table.capacity,
        status: table.status || 'Empty'
      });
    } else {
      setEditingTable(null);
      setFormData({ tableCode: '', capacity: 4, status: 'Empty' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingTable ? `${API_URL}/api/Table/${editingTable.tableId}` : `${API_URL}/api/Table`;
    const method = editingTable ? 'PUT' : 'POST';

    // Nếu là PUT, cần kèm theo TableId trong body nếu API yêu cầu
    const body = editingTable
      ? { ...editingTable, tableCode: formData.tableCode, capacity: formData.capacity, status: formData.status }
      : { tableCode: formData.tableCode, capacity: formData.capacity, status: formData.status };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setModalOpen(false);
        fetchTables();
      }
    } catch (error) {
      console.error("Lỗi khi lưu bàn:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bàn này?")) return;
    try {
      const res = await fetch(`${API_URL}/api/Table/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTables();
    } catch (error) {
      console.error("Lỗi khi xóa bàn:", error);
    }
  };


  const handleResetTable = async (table) => {
    if (!window.confirm(`Reset bàn ${table.tableCode}?`)) return;

    try {
      // 🧨 QUAN TRỌNG: đóng order trước
      await fetch(`${API_URL}/api/Table/${table.tableId}/close-order`, {
        method: 'PUT'
      });

      // 🪑 rồi mới reset bàn
      await fetch(`${API_URL}/api/Table/${table.tableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...table, status: 'Empty' })
      });

      fetchTables();
    } catch (error) {
      console.error(error);
    }
  };


  const stats = {
    total: tables.length,
    occupied: tables.filter(t => t.status?.toLowerCase() === 'occupied').length,
    empty: tables.filter(t => t.status?.toLowerCase() !== 'occupied').length
  };


  const handleViewOrders = async (table) => {
    setSelectedTable(table);
    setOrderLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/table/${table.tableId}/orders`);
      const data = await res.json();
      setTableOrders(data);
    } catch (error) {
      console.error("Lỗi load món:", error);
      setTableOrders([]);
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shadow-inner">📊</div>
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Tổng số bàn</p>
            <h3 className="text-3xl font-black text-gray-800">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-2xl shadow-inner">✅</div>
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Bàn đang trống</p>
            <h3 className="text-3xl font-black text-gray-800">{stats.empty}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl shadow-inner">🔥</div>
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Đang có khách</p>
            <h3 className="text-3xl font-black text-gray-800">{stats.occupied}</h3>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Sơ đồ bàn ăn</h2>
            <p className="text-gray-400 text-sm font-medium">Quản lý vị trí, trạng thái và sức chứa của nhà hàng</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchTables}
              className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Làm mới
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="text-xl">+</span> Thêm bàn mới
            </button>
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tables.map(table => {
                const isOccupied = table.status?.toLowerCase() === 'occupied';
                return (
                  // <div key={table.tableId} className="group relative bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl hover:border-orange-200 transition-all">
                  <div
                    key={table.tableId}
                    onClick={() => handleViewOrders(table)}
                    className="group relative bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer"  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner ${isOccupied ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {table.tableCode}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(table)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
                          title="Sửa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(table.tableId)}
                          className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"
                          title="Xóa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-gray-800 uppercase tracking-wide">Bàn {table.tableCode}</h4>
                      <p className="text-gray-400 text-sm font-bold">
                        Sức chứa: <span className="text-orange-500">{table.capacity} chỗ</span>
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isOccupied ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {isOccupied ? 'Đang có khách' : 'Trống'}
                      </span>
                      {isOccupied && (
                        <button
                          onClick={() => handleResetTable(table)}
                          className="text-xs font-black text-orange-600 hover:underline flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          Reset bàn
                        </button>
                      )}
                    </div>
                    {/* Tên khách + số người */}
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Khách đang ngồi</p>
                    {isOccupied && table.customerName ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black flex-shrink-0">
                            {table.customerName.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-gray-700 truncate">{table.customerName}</span>
                        </div>
                        {table.numberOfPeople && (
                          <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 text-[11px] font-bold px-3 py-1 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                            {table.numberOfPeople} người
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300 italic">— Chưa có khách —</span>
                    )}
                  </div>

                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal Add/Edit */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-3xl p-6 w-[400px] max-h-[80vh] overflow-auto">

            <h2 className="text-xl font-bold mb-4">
              Bàn {selectedTable.tableCode}
            </h2>

            {orderLoading ? (
              <p>Đang tải món...</p>
            ) : tableOrders.length === 0 ? (
              <p>Chưa có món nào</p>
            ) : (
              <ul className="space-y-2">
                {tableOrders.map((item, index) => (
                  <li key={index} className="flex justify-between border-b pb-1">
                    <span>{item.itemName}</span>
                    <span>x{item.quantity}</span>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setSelectedTable(null)}
              className="mt-4 w-full bg-orange-600 text-white py-2 rounded-xl"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      {
        modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
              <div className="bg-orange-600 p-8 text-white">
                <h2 className="text-2xl font-black">{editingTable ? 'Sửa thông tin bàn' : 'Thêm bàn mới'}</h2>
                <p className="text-orange-100 text-sm font-medium opacity-80">Vui lòng điền thông tin chi tiết bên dưới</p>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Mã bàn (Table Code)</label>
                  <input
                    type="text"
                    value={formData.tableCode}
                    onChange={(e) => setFormData({ ...formData, tableCode: e.target.value.toUpperCase() })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-800"
                    placeholder="Ví dụ: T01, VIP01..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Sức chứa (Capacity)</label>
                  <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                    <button type="button" onClick={() => setFormData({ ...formData, capacity: Math.max(1, formData.capacity - 1) })} className="w-12 h-12 flex items-center justify-center text-2xl text-gray-400 hover:text-orange-600"> - </button>
                    <div className="flex-1 text-center font-black text-xl text-gray-800">{formData.capacity}</div>
                    <button type="button" onClick={() => setFormData({ ...formData, capacity: formData.capacity + 1 })} className="w-12 h-12 flex items-center justify-center text-2xl text-gray-400 hover:text-orange-600"> + </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Trạng thái bàn</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'Empty' })}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${formData.status !== 'Occupied' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400 opacity-50'}`}
                    >
                      <div className={`w-3 h-3 rounded-full ${formData.status !== 'Occupied' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      Trống
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'Occupied' })}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${formData.status === 'Occupied' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-gray-50 border-gray-100 text-gray-400 opacity-50'}`}
                    >
                      <div className={`w-3 h-3 rounded-full ${formData.status === 'Occupied' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                      Có khách
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-600/20 transition-all"
                  >
                    {editingTable ? 'Cập nhật' : 'Tạo bàn'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div >
  );
}
