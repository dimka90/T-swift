
import { FaCheckCircle, FaClock, FaRegCircle } from "react-icons/fa";


import useContractorData from "./read";

function Milestone() {
  const projects = useContractorData("getContractorsProject");

  if (!projects || projects.length === 0) {
    console.log(projects)
    return <p className="text-gray-500 text-center">Loading milestones...</p>;
  }

 
  // Fetch the last project from the array
  const lastProject = projects[projects.length - 1];

  const statusIcons = {
    completed: <FaCheckCircle className="text-green-500 text-xl" />,
    inProgress: <FaClock className="text-blue-500 text-xl" />,
    upcoming: <FaRegCircle className="text-gray-400 text-xl" />,
  };

  // Determine milestone status dynamically
  const getStatus = (milestone) => {
    if (milestone.completed) return "completed";
    const now = Math.floor(Date.now() / 1000);
    return milestone.dueDate > now ? "inProgress" : "upcoming";
  };

  return (
    <div className="p-8 bg-gray-50 rounded-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        MileStones
      </h2>

      {/* Render milestones dynamically */}
      <div className="space-y-4">
        {lastProject.mileStone?.map((milestone, index) => {
          const status = getStatus(milestone);

          return (
            <div
              key={index}
              className="flex items-start justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-start gap-3">
                {statusIcons[status]}
                <div>
                  {/* Milestone Status */}
                  <p
                    className={`font-semibold text-lg ${
                      status === "completed"
                        ? "text-green-600"
                        : status === "inProgress"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {status === "completed"
                      ? "Finished"
                      : status === "inProgress"
                      ? "In Progress"
                      : "Upcoming"}
                  </p>

                  {/* Milestone Name */}
                  <p className="text-sm font-medium text-gray-800">
                    {milestone.description || "No milestone name"}
                  </p>

                  {/* Milestone Description */}
                  <p className="text-xs text-gray-500 mt-1">
                    Payment Amount:{" "}
                    <span className="font-semibold text-gray-700">
                      {milestone.paymentAmount} ETH
                    </span>
                  </p>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <span
                  className={`inline-block text-xs px-3 py-1 rounded-full ${
                    status === "completed"
                      ? "bg-green-100 text-green-600"
                      : status === "inProgress"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {new Date(Number(milestone.dueDate)* 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* See all milestones link */}
      <div className="mt-4 text-right">
        <a
          href="#"
          className="text-blue-600 font-medium hover:underline hover:text-blue-700"
        >
          See all milestones
        </a>
      </div>
    </div>
  );
}

export default Milestone;
