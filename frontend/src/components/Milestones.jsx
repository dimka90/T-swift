import { FiCheckCircle, FiClock, FiAlertCircle, FiLoader } from "react-icons/fi";
import useContractorData from "./read";

function Milestone() {
  const projects = useContractorData("getContractorsProject");

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FiLoader className="w-8 h-8 text-gray-400 animate-spin mb-3" />
        <p className="text-gray-400 text-sm">Loading milestones...</p>
      </div>
    );
  }

  const lastProject = projects[projects.length - 1];
  const milestones = lastProject.mileStone || [];

  if (milestones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FiAlertCircle className="w-8 h-8 text-gray-400 mb-3" />
        <p className="text-gray-400 text-sm">No milestones available</p>
      </div>
    );
  }

  const getStatus = (milestone) => {
    if (milestone.completed) return "completed";
    const now = Math.floor(Date.now() / 1000);
    return milestone.dueDate > now ? "inProgress" : "overdue";
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        icon: FiCheckCircle,
        label: "Completed",
        bgColor: "bg-green-500/10",
        textColor: "text-green-400",
        borderColor: "border-green-500/30",
        badgeBg: "bg-green-500/20",
        badgeText: "text-green-400",
      },
      inProgress: {
        icon: FiClock,
        label: "In Progress",
        bgColor: "bg-blue-500/10",
        textColor: "text-blue-400",
        borderColor: "border-blue-500/30",
        badgeBg: "bg-blue-500/20",
        badgeText: "text-blue-400",
      },
      overdue: {
        icon: FiAlertCircle,
        label: "Overdue",
        bgColor: "bg-red-500/10",
        textColor: "text-red-400",
        borderColor: "border-red-500/30",
        badgeBg: "bg-red-500/20",
        badgeText: "text-red-400",
      },
    };
    return configs[status] || configs.inProgress;
  };

  const calculateProgress = () => {
    const completed = milestones.filter(m => m.completed).length;
    return Math.round((completed / milestones.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">Project Milestones</h3>
          <span className="text-sm font-semibold text-gray-400">
            {milestones.filter(m => m.completed).length}/{milestones.length}
          </span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden border border-slate-600">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">{progress}% Complete</p>
      </div>

      {/* Milestones List */}
      <div className="space-y-3">
        {milestones.map((milestone, index) => {
          const status = getStatus(milestone);
          const config = getStatusConfig(status);
          const Icon = config.icon;
          const dueDate = new Date(Number(milestone.dueDate) * 1000);
          const isOverdue = status === "overdue" && !milestone.completed;

          return (
            <div
              key={index}
              className={`group relative p-4 rounded-lg border transition-all duration-300 hover:shadow-lg ${config.bgColor} ${config.borderColor}`}
            >
              {/* Milestone Card */}
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${config.badgeBg}`}>
                  <Icon className={`w-5 h-5 ${config.badgeText}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className={`font-semibold text-sm ${config.textColor}`}>
                        {config.label}
                      </p>
                      <p className="text-white font-medium text-sm mt-1">
                        {milestone.description || `Milestone ${index + 1}`}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${config.badgeBg} ${config.badgeText}`}>
                      {dueDate.toLocaleDateString()}
                    </span>
                  </div>

                  {/* Payment Info */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-600/50">
                    <div>
                      <p className="text-xs text-gray-400">Payment Amount</p>
                      <p className="text-sm font-semibold text-white">
                        {milestone.paymentAmount} ETH
                      </p>
                    </div>
                    {isOverdue && (
                      <div className="ml-auto">
                        <p className="text-xs text-red-400 font-medium">⚠️ Overdue</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {status === "inProgress" && (
                <button className="mt-3 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm">
                  Submit Deliverables
                </button>
              )}
              {status === "overdue" && !milestone.completed && (
                <button className="mt-3 w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition text-sm">
                  Submit Now (Overdue)
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-600/50">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">
            {milestones.filter(m => m.completed).length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-400">
            {milestones.filter(m => !m.completed && getStatus(m) === "inProgress").length}
          </p>
          <p className="text-xs text-gray-400 mt-1">In Progress</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-400">
            {milestones.filter(m => !m.completed && getStatus(m) === "overdue").length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Overdue</p>
        </div>
      </div>
    </div>
  );
}

export default Milestone;
