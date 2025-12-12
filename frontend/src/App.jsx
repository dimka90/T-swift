import Layout from "./Layout";
import AssignContract from "./pages/AssignContract";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Projects from "./pages/Projects";
import MilestoneFormPage from "./pages/MilestoneFormPage";
import Payment from "./pages/Payment";
import AgencyProjects from "./pages/AgencyProjects";
import AgencyPayment from "./pages/AgencyPayment";
import AgencyDashboard from "./pages/AgencyDashboard";
import ContractorDashboard from "./pages/ContractorDashboard";
import MilestonesPage from "./pages/MilestonesPage";
import Home from "./pages/Home";
import ReviewMilestone from "./pages/projectReview";
import AgencySideMenu from "./components/AgencySideMenu";
import { RoleProvider } from "./context/RoleContext";

function App() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a" }}>
      <Router>
        <RoleProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
              <Route path="/milestones" element={<MilestonesPage />} />
              <Route path="/milestones/submit" element={<MilestoneFormPage />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/agency-dashboard" element={<AgencyDashboard />} />
              <Route path="/agency-payment" element={<AgencyPayment />} />
              <Route path="/agency-projects" element={<AgencyProjects />} />
              <Route path="/assigncontract" element={<AssignContract />} />
              <Route path="/review" element={<ReviewMilestone />} />
              <Route path="/agency-sidemenu" element={<AgencySideMenu />} />
            </Route>
          </Routes>
        </RoleProvider>
      </Router>
    </div>
  );
}

export default App;