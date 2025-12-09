import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp } from "react-icons/fi";
import Milestone from "../components/Milestones";

function MilestonesPage() {
  const navigate = useNavigate();
  const { isConnected } = useAppKitAccount();

  useEffect(() => {
    if (!isConnected) {
      toast.error("Please connect your wallet to view milestones", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    }
  }, [isConnected, navigate]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Project Milestones</h1>
        <p className="text-gray-400">Track your project deliverables and payment milestones</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Milestones */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
            <Milestone />
          </div>
        </div>

        {/* Right Column - Info & Tips */}
        <div className="space-y-6">
          {/* Milestone Info Card */}
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5" />
              Milestone Guide
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <FiCheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Completed</p>
                  <p className="text-gray-400 text-xs mt-1">Milestone delivered and approved</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <FiClock className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">In Progress</p>
                  <p className="text-gray-400 text-xs mt-1">Awaiting your submission</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <FiAlertCircle className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Overdue</p>
                  <p className="text-gray-400 text-xs mt-1">Submission deadline has passed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Best Practices</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>Submit deliverables before the deadline</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>Include comprehensive documentation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>Ensure quality meets project requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>Respond promptly to feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>Keep communication clear and professional</span>
              </li>
            </ul>
          </div>

          {/* Payment Info */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg shadow-lg border border-green-500/30 p-6">
            <h3 className="text-lg font-bold text-green-400 mb-4">💰 Payment Schedule</h3>
            <p className="text-gray-300 text-sm mb-4">
              Payments are released upon milestone approval. Each completed milestone triggers an automatic payment transfer.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Processing Time:</span>
                <span className="text-white font-medium">1-2 business days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Method:</span>
                <span className="text-white font-medium">Direct Transfer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MilestonesPage;
