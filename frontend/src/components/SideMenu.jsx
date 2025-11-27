import profileImage from "../assets/Bitmap.png";
import { MdSpaceDashboard } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import { GrProjects } from "react-icons/gr";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
// import { IoIosLogOut } from "react-icons/io";

import { Link } from "react-router-dom";
// import 

function SideMenu() {
  return (
    <div className="text-white h-screen flex flex-col justify-between p-[20px]">
      <div>

        <div>
          <ul className="lg:text-base flex flex-col lg:gap-[35px]">
            <li className="font-semibold"><MdSpaceDashboard  className="inline text-white text-xl mr-3"/><Link to="/dashboard">Dashboard</Link></li>
            <li className=""><MdSpaceDashboard  className="inline text-white text-xl mr-3"/><Link to="/assignContract">Assign Contract</Link></li>
            <li><MdPayments  className="inline text-xl text-white mr-3"/><Link to="/payment"> Payment History</Link></li>
            <li><GrProjects className="inline text-xl text-white mr-3"/> <Link to="/projects">My Projects</Link></li>
            <li><GrProjects className="inline text-xl text-white mr-3"/> <Link to="/review">Projects Review</Link></li>

            {/* <li><GrProjects className="inline text-xl text-white mr-3"/> <Link to="/ReviewMilestone">Review</Link></li> */}
            {/* <li><BiSolidMessageSquareDetail className="inline text-xl text-white mr-3"/>Notifications</li> */}
          </ul>
        </div>
      </div>

      {/* <div>
        <button><IoIosLogOut className="inline text-2xl mr-3" />Logout</button>
      </div> */}
    </div>
  );
}

export default SideMenu;
