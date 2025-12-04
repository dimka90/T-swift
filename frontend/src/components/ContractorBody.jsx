import Milestone from "./Milestones"
import RecentProjects from "./RecentProjects"
import WelcomeCard from "./WelcomCard"

function ContractorBody(){
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-8">
                    <WelcomeCard />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Projects */}
                    <div className="lg:col-span-2 space-y-6">
                        <RecentProjects />
                    </div>

                    {/* Right Column - Milestones */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span>📋</span>
                                Milestones
                            </h3>
                            <Milestone />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContractorBody