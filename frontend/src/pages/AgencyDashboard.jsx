// import Meeting from "./Meetings"
// import Milestone from "./Milestones"
// import ProjectName from "./ProjectName"
// import RecentProjects from "./RecentProjects"
// import WelcomeCard from "./WelcomCard"
import Meeting from "../components/Meetings"
import ProjectName from "../components/ProjectName"
import Milestone from "../components/Milestones"
import RecentProjects from "../components/RecentProjects"
import AssignContract from "./AssignContract"

function AgencyDashboard(){
    return <div className="bg-white  rounded-2xl  gap-4 ">
        <div className="w-[70%] ">
            <AssignContract/>
        </div>
    </div>
}

export default AgencyDashboard;