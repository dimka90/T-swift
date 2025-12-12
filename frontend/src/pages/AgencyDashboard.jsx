import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { useReadContract, useAccount } from "wagmi";
import { toast } from "react-toastify";
import { FiPlus, FiCheckCircle, FiClock, FiAlertCircle, FiUsers, FiDollarSign } from "react-icons/fi";
import AssignContract from "./AssignContract";
import { ProjectDashboard } from "../components/ProjectDashboard";
import { wagmiContractConfig } from "../lib/wagmiContractConfig";

function AgencyDashboard(){
  const navigate = useNavigate();
  const { isConnected, address } = useAppKitAccount();
  const { address: wagmiAddress } = useAccount();
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    activeProjects: 0,
    pendingReview: 0,
    totalContractors: 0,
    totalBudget: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch all contractors
  const { data: allContractors, isLoading: isLoadingContractors, error: contractorsError } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getAllContractors",
    args: [],
  });

  useEffect(() => {
    if (!isConnected) {
      toast.error("Please connect your wallet to access the agency dashboard", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    }
  }, [isConnected, navigate]);

  useEffect(() => {
    if (allContractors) {
      setStats(prev => ({
        ...prev,
        totalContractors: allContractors.length,
      }));
      setIsLoadingStats(false);
    }
  }, [allContractors]);

  if (!isConnected) {
    return null;
  }

  const statCards = [
    {
      label: "Active Projects",
      value: stats.activeProjects,
      icon: FiClock,
      color: "from-blue-500 to-blue-600",
      description: "Currently running",
    },
    {
      label: "Completed",
      value: stats.completedProjects,
      icon: FiCheckCircle,
      color: "from-green-500 to-green-600",
      description: "Successfully delivered",
    },
    {
      label: "Pending Review",
      value: stats.pendingReview,
      icon: FiAlertCircle,
      color: "from-yellow-500 to-yellow-600",
      description: "Awaiting approval",
    },
    {
      label: "Contractors",
      value: stats.totalContractors,
      icon: FiUsers,
      color: "from-purple-500 to-purple-600",
      description: "Registered partners",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Agency Dashboard</h1>
        <p className="text-gray-400">Manage projects, contractors, and procurement oversight</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-gray-100 text-sm font-medium opacity-90">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{isLoadingStats ? "..." : stat.value}</p>
              <p className="text-xs opacity-75 mt-2">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Create Project Form */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiPlus className="w-5 h-5" />
                Create New Project
              </h2>
              <p className="text-green-100 text-sm mt-1">Assign projects to contractors and manage budgets</p>
            </div>
            <div className="p-6">
              <AssignContract />
            </div>
          </div>
        </div>

        {/* Right Column - Agency Info & Contractors */}
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
                <p className="text-white font-medium">Celo Mainnet</p>
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

          {/* Contractors Overview */}
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiUsers className="w-5 h-5" />
              Contractors
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <p className="text-gray-400 text-sm">Total Registered</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {isLoadingStats ? "..." : stats.totalContractors}
                </p>
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm">
                View All Contractors
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition text-sm text-left">
                📋 Review Submissions
              </button>
              <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition text-sm text-left">
                ✓ Approve Milestones
              </button>
              <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition text-sm text-left">
                💰 View Budget Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgencyDashboard;