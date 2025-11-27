

import { FaCheck } from "react-icons/fa6";
import useContractorData from "./read";
import { useNavigate } from "react-router-dom";

function ProjectName() {
  let navigate = useNavigate();

  // Fetch data from the smart contract
  const projectData = useContractorData("getContractorsProject");
  if (!projectData || projectData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">Loading project details...</p>
      </div>
    );
  }

  // Assume we're rendering the last project fetched
  const lastProject = projectData[projectData.length - 1];

  // Helper to format timestamp into readable date
  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString();
  };

  const handle_navigate = () => {
    navigate("/milestoneform", {
      state: {
        projectId: lastProject.projectId,
      }
    });
  };

  return (
    <div className="mt-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Ongoing Project</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <FaCheck className={`text-lg p-1 rounded-full ${lastProject.completed ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`} />
            <p className={`text-base font-medium ${lastProject.completed ? "text-green-600" : "text-blue-600"}`}>
              {lastProject.completed ? "Completed" : "In Progress"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">Start End Date:</p>
            <p className="text-sm bg-gray-100 text-gray-800 py-1 px-3 rounded-lg font-semibold ">
              {lastProject.endDate ? formatDate(lastProject.startDate) : "No project end date"}
            </p>
            <p className="text-sm text-gray-500">Project End Date:</p>
            <p className="text-sm bg-gray-100 text-gray-800 py-1 px-3 rounded-lg font-bold ">
              {lastProject.endDate ? formatDate(lastProject.endDate) : "No project end date"}
            </p>
          </div>
        </div>
        <p className="text-gray-700 text-base leading-relaxed mb-4">
          {lastProject.description || "No project description available. Please check again."}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500">Project Budget</p>
            <p className="font-semibold text-gray-800">{Number(lastProject.budget)} LSK</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500">Current Balance</p>
            <p className="font-semibold text-gray-800">{0} LSK</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500">Contractor Address</p>
            <p className="font-semibold text-gray-800 truncate">{lastProject.contractorAddress}</p>
          </div>
        </div>
        <button
          className={`w-full py-3 rounded-lg font-semibold text-white text-center transition ${
            lastProject.completed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
          }`}
          disabled={lastProject.completed}
          onClick={handle_navigate}
        >
          {lastProject.completed ? "Project Completed" : "Complete Project"}
        </button>
      </div>
    </div>
  );
}

export default ProjectName;
