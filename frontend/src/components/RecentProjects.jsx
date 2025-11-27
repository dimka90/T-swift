
import { IoMdArrowDown } from "react-icons/io";

function RecentProjects() {
  return (
    <div className="mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Recent Projects</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full text-sm text-gray-600">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="py-4 px-6 text-left font-semibold text-gray-700">
                Project Name <IoMdArrowDown className="inline text-gray-500 text-base ml-1" />
              </th>
              <th className="py-4 px-6 text-left font-semibold text-gray-700">End Date</th>
              <th className="py-4 px-6 text-left font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50 transition">
              <td className="py-4 px-6 font-medium text-gray-800">Project Alpha</td>
              <td className="py-4 px-6 text-gray-600">06/08/2024</td>
              <td>
                <span className="inline-block px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                  Completed
                </span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition">
              <td className="py-4 px-6 font-medium text-gray-800">Project Beta</td>
              <td className="py-4 px-6 text-gray-600">06/08/2024</td>
              <td>
                <span className="inline-block px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                  Cancelled
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentProjects;
