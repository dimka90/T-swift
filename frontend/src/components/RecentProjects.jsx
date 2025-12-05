
function RecentProjects() {
  const projects = [
    { name: "Project Alpha", endDate: "06/08/2024", status: "Completed", statusColor: "green" },
    { name: "Project Beta", endDate: "06/08/2024", status: "Cancelled", statusColor: "red" },
  ];

  const getStatusStyles = (color) => {
    const styles = {
      green: "bg-green-500/20 text-green-400 border border-green-500/30",
      red: "bg-red-500/20 text-red-400 border border-red-500/30",
      yellow: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    };
    return styles[color] || styles.green;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">📁 Recent Projects</h2>
        <p className="text-gray-400">Track your active and completed projects</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Project Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">End Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, idx) => (
                <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-200">
                  <td className="px-6 py-4 text-white font-medium">{project.name}</td>
                  <td className="px-6 py-4 text-gray-400">{project.endDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyles(project.statusColor)}`}>
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RecentProjects;
