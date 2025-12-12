import { Link, useLocation } from "react-router-dom";
import { FiHome, FiFileText, FiClock, FiCheckCircle, FiAlertCircle, FiLogOut } from "react-icons/fi";
import { useAppKitAccount } from "@reown/appkit/react";

function ContractorSideMenu() {
  const location = useLocation();
  const { disconnect } = useAppKitAccount();

  const menuItems = [
    {
      icon: FiHome,
      label: "Dashboard",
      path: "/contractor-dashboard",
      description: "View your projects",
    },
    {
      icon: FiFileText,
      label: "Milestones",
      path: "/milestones",
      description: "Track milestones",
    },
    {
      icon: FiClock,
      label: "Submit Work",
      path: "/milestoneform",
      description: "Submit deliverables",
    },
    {
      icon: FiCheckCircle,
      label: "Completed",
      path: "/contractor-dashboard",
      description: "Completed projects",
    },
    {
      icon: FiAlertCircle,
      label: "Rejections",
      path: "/review",
      description: "Review feedback",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="text-white h-screen flex flex-col justify-between p-6 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-700/50 w-64">
      {/* Header */}
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">👷</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Contractor</h3>
              <p className="text-xs text-gray-400">Portal</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <ul className="space-y-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <li key={idx}>
                <Link
                  to={item.path}
                  className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive(item.path)
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-300 hover:text-blue-400 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500 group-hover:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer Section */}
      <div className="space-y-4">
        {/* Status Card */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Status</p>
          <p className="text-sm font-semibold text-blue-400">Active</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-gray-400">Connected</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => disconnect?.()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all duration-200 border border-red-500/30 font-medium text-sm"
        >
          <FiLogOut className="w-4 h-4" />
          Disconnect
        </button>
      </div>
    </div>
  );
}

export default ContractorSideMenu;
