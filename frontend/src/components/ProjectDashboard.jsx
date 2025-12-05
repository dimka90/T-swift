import { useState, useEffect } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { FiLoader, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { wagmiContractConfig } from '../lib/wagmiContractConfig';

export const ProjectDashboard = () => {
  const { address } = useAccount();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch submitted projects
  const { data: submittedProjects, isLoading: isLoadingProjects, error: projectError } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getSubmittedProject',
    args: [address],
    enabled: !!address,
  });

  useEffect(() => {
    if (projectError) {
      setError('Failed to load projects');
      setIsLoading(false);
    } else if (submittedProjects) {
      setProjects(submittedProjects);
      setIsLoading(false);
    }
  }, [submittedProjects, projectError]);

  const getProjectStatus = (project) => {
    if (project.completed) return { label: 'Completed', color: 'green', icon: FiCheckCircle };
    if (new Date(project.endDate * 1000) < new Date()) return { label: 'Overdue', color: 'red', icon: FiAlertCircle };
    return { label: 'In Progress', color: 'yellow', icon: FiClock };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-green-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 flex items-center gap-3">
        <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No projects found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project, idx) => {
        const status = getProjectStatus(project);
        const StatusIcon = status.icon;
        const statusColors = {
          green: 'bg-green-500/10 text-green-400 border-green-500/30',
          red: 'bg-red-500/10 text-red-400 border-red-500/30',
          yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        };

        return (
          <div key={idx} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-1">{project.description}</h4>
                <p className="text-gray-400 text-sm">Budget: {project.budget?.toString()} tokens</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-2 ${statusColors[status.color]}`}>
                <StatusIcon className="w-4 h-4" />
                {status.label}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Start Date</p>
                <p className="text-white">{new Date(project.startDate * 1000).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-400">End Date</p>
                <p className="text-white">{new Date(project.endDate * 1000).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
