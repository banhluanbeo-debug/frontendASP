

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from "qrcode";

export default function Reservation() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [numPeople, setNumPeople] = useState(1);
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [tableOrders, setTableOrders] = useState({});

  // Payment states
  const [paymentTable, setPaymentTable] = useState(null);
  const [paymentOrders, setPaymentOrders] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [qrUrl, setQrUrl] = useState("");
  const [qrImage, setQrImage] = useState("");
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
      console.error("Lỗi khi tải danh sách bàn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);
  useEffect(() => {
    if (qrUrl) {
      QRCode.toDataURL(qrUrl).then(setQrImage);
    }
  }, [qrUrl]);


  const handleConfirmBooking = async () => {
    if (!selectedTable) return;
    if (numPeople > selectedTable.capacity) {
      alert(`Bàn này tối đa chỉ được ${selectedTable.capacity} người.`);
      return;
    }
    if (!customerName.trim()) {
      alert("Nhập tên đi 😑");
      return;
    }
    try {
      setBookingLoading(true);
      const res = await fetch(
        `${API_URL}/api/Order/by-table/${selectedTable.tableId}?customerName=${encodeURIComponent(customerName)}&numberOfPeople=${numPeople}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (res.ok) {
        await fetchTables();

        const url = `https://frontend-asp-delta.vercel.app/menu/${selectedTable.tableId}?name=${encodeURIComponent(customerName)}`;
        setQrUrl(url);
        // setTimeout(() => {
        //   navigate(`/menu/${selectedTable.tableId}`);
        // }, 800);
      } else {
        let errorText = await res.text();
        alert("Server lỗi: " + errorText);
      }
    } catch (error) {
      alert("Không thể kết nối đến máy chủ.");
    } finally {
      setBookingLoading(false);
      // setSelectedTable(null);
    }
  };
  const handleOpenBookingModal = (table) => {
    if (table.status?.toLowerCase() === 'occupied') return;
    setSelectedTable(table);
    setNumPeople(1);
    setCustomerName("");
    setQrUrl("");
    setQrImage("");
  };
  // Mở modal thanh toán: fetch orders của bàn rồi hiện bill
  const handleOpenPayment = async (table) => {
    setPaymentTable(table);
    setPaymentSuccess(false);
    setPaymentLoading(false);
    try {
      const res = await fetch(`${API_URL}/api/table/${table.tableId}/orders`);
      const data = await res.json();
      setPaymentOrders(data);
    } catch (error) {
      console.error("Lỗi khi tải món:", error);
      setPaymentOrders([]);
    }
  };

  // Gọi API thanh toán
  const handleConfirmPayment = async () => {
    if (!paymentTable) return;

    try {
      setPaymentLoading(true);

      const res = await fetch(
        `${API_URL}/api/Order/pay-by-table/${paymentTable.tableId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (res.ok) {
        const data = await res.json();
        setPaymentTotal(data.total);
        setPaymentSuccess(true);
        // Cập nhật lại danh sách bàn
        await fetchTables();
        // Xóa cache orders của bàn đó
        setTableOrders(prev => {
          const newData = { ...prev };
          delete newData[paymentTable.tableId];
          return newData;
        });
      } else {
        const errorText = await res.text();
        alert("Lỗi thanh toán: " + errorText);
      }
    } catch (error) {
      alert("Không thể kết nối đến máy chủ.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const billTotal = paymentOrders.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[75vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
          Chọn <span className="text-orange-600">Vị Trí</span> Của Bạn
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Vui lòng chọn bàn còn trống để bắt đầu trải nghiệm ẩm thực tuyệt vời tại nhà hàng chúng tôi.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Đang tìm bàn trống...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tables.map((table) => {
            const isOccupied = table.status?.toLowerCase() === 'occupied';

            return (
              <div
                key={table.tableId}
                onClick={() => {
                  if (isOccupied) {
                    handleOpenPayment(table);
                  } else {
                    handleOpenBookingModal(table);
                  }
                }}
                className={`
                  relative p-6 rounded-3xl border-2 transition-all cursor-pointer group
                  ${isOccupied
                    ? 'bg-gray-50 border-gray-100 opacity-75 hover:border-red-300 hover:shadow-md'
                    : 'bg-white border-gray-100 hover:border-orange-500 hover:shadow-xl hover:-translate-y-1'
                  }
                `}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl
                    ${isOccupied ? 'bg-gray-200 text-gray-400' : 'bg-orange-100 text-orange-600'}
                  `}>
                    {table.tableCode}
                  </div>
                  <div className={`
                    px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider
                    ${isOccupied ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}
                  `}>
                    {isOccupied ? 'Có khách' : 'Trống'}
                  </div>
                </div>

                <h3 className={`font-bold text-lg ${isOccupied ? 'text-gray-400' : 'text-gray-900'}`}>
                  Bàn {table.tableCode}
                </h3>
                <p className="text-gray-400 text-sm font-medium">
                  Sức chứa: <span className={isOccupied ? 'text-gray-400' : 'text-orange-500'}>{table.capacity} khách</span>
                </p>

                {!isOccupied && (
                  <div className="mt-4 flex items-center text-orange-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Đặt bàn ngay →
                  </div>
                )}

                {isOccupied && table.customerName && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-[10px] font-black flex-shrink-0">
                      {table.customerName.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-gray-500 truncate">{table.customerName}</span>
                    {table.numberOfPeople && (
                      <span className="ml-auto text-[10px] font-black bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full whitespace-nowrap">{table.numberOfPeople} người</span>
                    )}
                  </div>
                )}

                {isOccupied && (
                  <div className="mt-2 text-[10px] text-red-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Xem bill & thanh toán →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== BOOKING MODAL ===== */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-orange-600 p-8 text-white relative">
              <button
                onClick={() => setSelectedTable(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-3xl font-black mb-2">Đặt Bàn {selectedTable.tableCode}</h2>
              <p className="text-orange-100 font-medium">Vui lòng nhập số người tham gia</p>
            </div>

            <div className="p-8">
              {qrImage && !bookingLoading && (
                <div className="text-center mt-6">
                  <p className="mb-2 font-bold text-orange-600">Quét để gọi món</p>
                  <img src={qrImage} className="mx-auto w-40" />

                  <button
                    onClick={() => setSelectedTable(null)}
                    className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Xong
                  </button>
                </div>
              )}
              <div className="mb-8">
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Tên khách</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nhập tên của bạn..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  />
                </div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Số lượng khách</label>
                <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                  <button onClick={() => setNumPeople(Math.max(1, numPeople - 1))} className="w-12 h-12 flex items-center justify-center text-2xl text-gray-400 hover:text-orange-600 transition-colors">-</button>
                  <div className="flex-1 text-center font-black text-2xl text-gray-900">{numPeople}</div>
                  <button onClick={() => setNumPeople(numPeople + 1)} className="w-12 h-12 flex items-center justify-center text-2xl text-gray-400 hover:text-orange-600 transition-colors">+</button>
                </div>
                <p className="mt-3 text-xs text-gray-400 font-medium">* Tối đa {selectedTable.capacity} khách cho bàn này.</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setSelectedTable(null)} className="flex-1 py-4 px-6 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all">Hủy bỏ</button>
                <button
                  disabled={bookingLoading}
                  onClick={handleConfirmBooking}
                  className="flex-1 py-4 px-6 rounded-2xl font-black text-white bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/30 transition-all hover:-translate-y-1 flex items-center justify-center"
                >
                  {bookingLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Xác nhận đặt'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PAYMENT MODAL ===== */}
      {paymentTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden">

            {paymentSuccess ? (
              /* --- SUCCESS SCREEN --- */
              <div className="p-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-1">Thanh toán thành công!</h2>
                <p className="text-gray-400 mb-4">Bàn {paymentTable.tableCode} đã được trả</p>
                <div className="bg-green-50 rounded-2xl px-8 py-4 mb-6">
                  <p className="text-sm text-green-700 font-medium mb-1">Tổng tiền đã thanh toán</p>
                  <p className="text-3xl font-black text-green-700">{formatCurrency(paymentTotal)}</p>
                </div>
                <button
                  onClick={() => setPaymentTable(null)}
                  className="w-full py-4 rounded-2xl font-black text-white bg-orange-600 hover:bg-orange-700 transition-all"
                >
                  Xong
                </button>
              </div>
            ) : (
              /* --- BILL SCREEN --- */
              <>
                <div className="bg-gray-900 p-8 text-white relative">
                  <button
                    onClick={() => setPaymentTable(null)}
                    className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Hóa đơn</p>
                  <h2 className="text-3xl font-black mb-1">Bàn {paymentTable.tableCode}</h2>
                  {paymentTable.customerName && (
                    <p className="text-gray-400 text-sm">Khách: {paymentTable.customerName}</p>
                  )}
                </div>

                <div className="p-8">
                  {/* Danh sách món */}
                  <div className="mb-6 max-h-60 overflow-y-auto">
                    {paymentOrders.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">Chưa có món nào</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-100">
                            <th className="text-left pb-2">Món</th>
                            <th className="text-center pb-2">SL</th>
                            <th className="text-right pb-2">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentOrders.map((item, i) => (
                            <tr key={i} className="border-b border-gray-50">
                              <td className="py-2 text-gray-700 font-medium">{item.itemName}</td>
                              <td className="py-2 text-center text-gray-400">x{item.quantity}</td>
                              <td className="py-2 text-right text-gray-800 font-bold">
                                {item.price ? formatCurrency(item.price * item.quantity) : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Tổng */}
                  <div className="flex justify-between items-center py-4 border-t-2 border-gray-900 mb-6">
                    <span className="font-black text-gray-900 text-lg">Tổng cộng</span>
                    <span className="font-black text-2xl text-orange-600">{formatCurrency(billTotal)}</span>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setPaymentTable(null)}
                      className="flex-1 py-4 px-6 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                    >
                      Hủy
                    </button>
                    <button
                      disabled={paymentLoading || paymentOrders.length === 0}
                      onClick={handleConfirmPayment}
                      className="flex-1 py-4 px-6 rounded-2xl font-black text-white bg-gray-900 hover:bg-gray-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {paymentLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Thanh toán
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-16 flex justify-center gap-8 border-t border-gray-100 pt-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Bàn Trống</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Đang Có Khách</span>
        </div>
      </div>
    </div>
  );
}