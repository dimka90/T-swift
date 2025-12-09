import { Outlet } from "react-router-dom";
import ContractorSideMenu from "./components/ContractorSideMenu";
import Navbar from "./components/Navbar";
import AgencySideMenu from "./components/AgencySideMenu";
import { useRole } from "./context/RoleContext";

function Layout() {
  const { userRole } = useRole();

  return (
    <div className="grid grid-rows-layout grid-cols-[256px_1fr] pt-24">
      {/* Header */}
      <header className="row-span-1 col-span-full text-white fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>

      {/* Sidebar - Role-based */}
      <aside className="row-span-2 col-span-1 text-white mt-20 overflow-y-auto">
        {userRole === 'agency' ? <AgencySideMenu /> : <ContractorSideMenu />}
      </aside>

      {/* Main Content */}
      <main className="row-span-2 col-span-1 p-4 overflow-y-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="row-span-1 col-span-full border-t border-slate-700/50">
        {/* Footer content can be added here */}
      </footer>
    </div>
  );
}

export default Layout;