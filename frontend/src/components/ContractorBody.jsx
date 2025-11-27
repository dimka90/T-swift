import Meeting from "./Meetings"
import Milestone from "./Milestones"
import ProjectName from "./ProjectName"
import RecentProjects from "./RecentProjects"
import WelcomeCard from "./WelcomCard"

function ContractorBody(){
    return <div className="bg-white rounded-3xl flex gap-4 mt-10 ">
        <div className="w-[75%] p-[15px]">
            <WelcomeCard />
            <ProjectName />
            <RecentProjects />
        </div>
        <div className=" bg-[#F4F4F4] p-[15px] rounded-r-3xl flex flex-col gap-6">
            <Milestone />
            {/* <Meeting /> */}
        </div>
    </div>
}

export default ContractorBody