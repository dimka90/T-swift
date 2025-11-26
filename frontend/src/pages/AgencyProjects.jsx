import avatar from "../assets/Avatar.png";
import { MdFilterList } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

function AgencyProjects() {
  return (
    <div className="bg-white rounded-3xl  p-7 h-screen">
      <h3 className="text-[20px] font-semibold mb-10">All Projects</h3>

      <div className="flex justify-between">
        <ul className="flex gap-3">
          <li>
            <button className="border border-gray-300 py-1 px-3 rounded-md">
              All Active
            </button>
          </li>
          <li>
            <button className="border border-gray-300 py-1 px-3 rounded-md ">
              All Completed
            </button>
          </li>
          <li>
            <button className="border border-gray-300 py-1 px-3 rounded-md">
              All Pending
            </button>
          </li>
        </ul>
        <div className="flex gap-3">
          <button className="border border-gray-300 py-1 px-3 rounded-md">
            <MdFilterList className="inline text-lg mr-1" />
            Filters
          </button>
          <div className="border border-gray-300 py-1 px-3 rounded-md">
            <CiSearch className="inline mr-1 text-lg text-gray-600" />
            <input type="search" name="" id="" placeholder="Search" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-3 mt-6">
        <div className="bg-[#F4F4F4] border border-slate-900 p-3 rounded-xl">
          <p className="text-2xl text-[#101828] font-semibold">Project Name</p>
          <p className="mt-4 text-[#475467]">
            Project description.Project description.Project description.Project
            description.Project description.Project description.Project
            description.
          </p>
          <div className="flex gap-2 mt-4">
            <div>
              <img src={avatar} alt="" />
            </div>

            <div>
              <p className="font-semibold">Olivia Rhye</p>
              <p className="text-[#475467]">20 Jan, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgencyProjects;
