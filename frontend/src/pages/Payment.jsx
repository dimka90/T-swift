import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";

function Payment() {
  const navigate = useNavigate();
  const { isConnected } = useAppKitAccount();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isConnected) {
      toast.error("Please connect your wallet to view payment history", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    }
  }, [isConnected, navigate]);

  if (!isConnected) {
    return null;
  }

  const payments = [
    { id: "TRX890123456", amount: "20 LSK", date: "06/08/2024", status: "Completed", statusColor: "green" },
    { id: "TRX890123457", amount: "15 LSK", date: "05/08/2024", status: "Cancelled", statusColor: "red" },
    { id: "TRX890123458", amount: "25 LSK", date: "04/08/2024", status: "Completed", statusColor: "green" },
  ];

  const getStatusStyles = (color) => {
    const styles = {
      green: "bg-green-500/20 text-green-400 border border-green-500/30",
      red: "bg-red-500/20 text-red-400 border border-red-500/30",
      yellow: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    };
    return styles[color] || styles.green;
  };

  const filteredPayments = payments.filter(payment =>
    payment.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">💳 Payment History</h2>
          <p className="text-gray-400">Track all your transactions and payments</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <input
              type="search"
              placeholder="Search by transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <span className="absolute right-4 top-3 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment, idx) => (
                    <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-200">
                      <td className="px-6 py-4 text-white font-mono text-sm">{payment.id}</td>
                      <td className="px-6 py-4 text-green-400 font-semibold">{payment.amount}</td>
                      <td className="px-6 py-4 text-gray-400">{payment.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyles(payment.statusColor)}`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Transactions</p>
            <p className="text-3xl font-bold text-white">{payments.length}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Amount</p>
            <p className="text-3xl font-bold text-green-400">{payments.reduce((sum, p) => sum + parseFloat(p.amount), 0)} LSK</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Completed</p>
            <p className="text-3xl font-bold text-green-400">{payments.filter(p => p.status === "Completed").length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
