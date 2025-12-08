import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { useReadContract, useAccount } from "wagmi";
import { toast } from "react-toastify";
import { FiCheckCircle, FiClock, FiAlertCircle, FiFileText, FiTrendingUp } from "react-icons/fi";
import { wagmiContractConfig } from "../lib/wagmiContractConfig";
import { ProjectDashboard } from "../components/ProjectDashboard";

function ContractorDashboard() {
  const navigate = useNavigate();
  const { isConnected, address } = useAppKitAccount();
  const { address: wagmiAddress } = useAccount();
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    pendingSubmissions: 0,
    rejectedMilestones: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch contractor projects
  const { data: contractorProjects, isLoading: isLoadingProjects } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getContractorsProject",
    args: [wagmiAddress],
    enabled: !!wagmiAddress,
  });

  // Fetch rejected milestones
  const { data: rejectedMilestones, isLoading: isLoadingRejected } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getRejectedProject",
    args: [wagmiAddress],
    enabled: !!wagmiAddress,
  });

  useEffect(() => {
    if (!isConnected) {
      toast.error("Please connect your wallet to access the contractor dashboard", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    }
  }, [isConnected, navigate]);

  useEffect(() => {
    if (contractorProjects && rejectedMilestones) {
      const active = contractorProjects.filter(p => !p.completed).length;
      const completed = contractorProjects.filter(p => p.completed).length;
      const pending = contractorProjects.filter(p => !p.imageCid || p.imageCid === " ").length;

      setStats({
        activeProjects: active,
        completedProjects: completed,
        pendingSubmissions: pending,
        rejectedMilestones: rejectedMilestones?.length || 0,
      });
      setIsLoadingStats(false);
    }
  }, [contractorProjects, rejectedMilestones]);

  if (!isConnected) {
    return null;
  }

  const statCards = [
    {
      label: "Active Projects",
      value: stats.activeProjects,
      icon: FiClock,
      color: "from-blue-500 to-blue-600",
      description: "Projects in progress",
    },
    {
      label: "Completed",
      value: stats.completedProjects,
      icon: FiCheckCircle,
      color: "from-green-500 to-green-600",
      description: "Successfully completed",
    },
    {
      label: "Pending Submission",
      value: stats.pendingSubmissions,
      icon: FiFileText,
      color: "from-yellow-500 to-yellow-600",
      description: "Awaiting submission",
    },
    {
      label: "Rejected Milestones",
      value: stats.rejectedMilestones,
      icon: FiAlertCircle,
      color: "from-red-500 to-red-600",
      description: "Need revision",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Contractor Dashboard</h1>
        <p className="text-gray-400">Track your projects, submissions, and milestones</p>
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
        {/* Left Column - Projects List */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5" />
                Your Projects
              </h2>
            </div>
            <div className="p-6">
              {isLoadingProjects ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-400">Loading projects...</p>
                </div>
              ) : contractorProjects && contractorProjects.length > 0 ? (
                <div className="space-y-4">
                  {contractorProjects.map((project, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">{project.description}</h4>
                          <p className="text-gray-400 text-sm">Budget: {project.budget?.toString()} tokens</p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            project.completed
                              ? "bg-green-500/10 text-green-400 border-green-500/30"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          }`}
                        >
                          {project.completed ? "Completed" : "In Progress"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Start Date</p>
                          <p className="text-white">
                            {new Date(project.startDate * 1000).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">End Date</p>
                          <p className="text-white">
                            {new Date(project.endDate * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {!project.imageCid || project.imageCid === " " ? (
                        <button className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm">
                          Submit Deliverables
                        </button>
                      ) : (
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                          ✓ Submitted on {new Date(project.startDate * 1000).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No projects assigned yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Info & Alerts */}
        <div className="space-y-6">
          {/* Contractor Info Card */}
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Your Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Wallet Address</p>
                <p className="text-blue-400 font-mono text-sm break-all">{address}</p>
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

          {/* Rejected Milestones Alert */}
          {stats.rejectedMilestones > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5" />
                Attention Required
              </h3>
              <p className="text-red-300 text-sm mb-4">
                You have {stats.rejectedMilestones} rejected milestone(s) that need revision.
              </p>
              <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition text-sm">
                Review Rejections
              </button>
            </div>
          )}

          {/* Quick Tips */}
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Tips</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Submit deliverables before the project deadline</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Include clear documentation with your submissions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Review feedback on rejected milestones promptly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Keep your wallet connected for notifications</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractorDashboard;
