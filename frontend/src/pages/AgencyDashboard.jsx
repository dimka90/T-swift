import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { FiPlus, FiBarChart3, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import AssignContract from "./AssignContract"

function AgencyDashboard(){
  const navigate = useNavigate();
  const { isConnected, address } = useAppKitAccount();
  const [showAssignForm, setShowAssignForm] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      toast.error("Please connect your wallet to access the agency dashboard", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    }
  }, [isConnected, navigate]);

  if (!isConnected) {
    return null;
  }

  const stats = [
    { label: "Active Projects", value: "12", icon: FiBarChart3, color: "from-blue-500 to-blue-600" },
    { label: "Completed", value: "8", icon: FiCheckCircle, color: "from-green-500 to-green-600" },
    { label: "In Progress", value: "4", icon: FiClock, color: "from-yellow-500 to-yellow-600" },
    { label: "Pending Review", value: "2", icon: FiAlertCircle, color: "from-red-500 to-red-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Agency Dashboard</h1>
        <p className="text-gray-400">Manage projects, contractors, and milestones</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-100 text-sm font-medium opacity-90">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon className="w-12 h-12 opacity-30" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Assign Contract Form */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiPlus className="w-5 h-5" />
                Create New Project
              </h2>
            </div>
            <div className="p-6">
              <AssignContract />
            </div>
          </div>
        </div>

        {/* Right Column - Quick Info */}
        <div className="space-y-6">
          {/* Agency Info Card */}
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Agency Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Wallet Address</p>
                <p className="text-green-400 font-mono text-sm break-all">{address}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Network</p>
                <p className="text-white font-medium">Lisk Sepolia Testnet</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-green-400 font-medium">Connected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b border-slate-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-white text-sm font-medium">Project Created</p>
                  <p className="text-gray-400 text-xs">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-slate-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-white text-sm font-medium">Milestone Submitted</p>
                  <p className="text-gray-400 text-xs">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-white text-sm font-medium">Payment Processed</p>
                  <p className="text-gray-400 text-xs">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgencyDashboard;