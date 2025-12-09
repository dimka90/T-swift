import React, { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ContractorSideMenu from "./components/ContractorSideMenu";
import Navbar from "./components/Navbar";
import AgencySideMenu from "./components/AgencySideMenu";

function Layout() {
  const location = useLocation();

  // Determine which sidebar to show based on current route
  // Agency routes take priority
  const isAgencyRoute = useMemo(() => {
    return (
      location.pathname.includes("agency") ||
      location.pathname === "/assignContract"
    );
  }, [location.pathname]);

  // Contractor routes - only if NOT an agency route
  const isContractorRoute = useMemo(() => {
    if (isAgencyRoute) return false;
    
    return (
      location.pathname.includes("contractor") ||
      location.pathname === "/dashboard" ||
      location.pathname === "/milestones" ||
      location.pathname === "/milestoneform" ||
      location.pathname === "/review"
    );
  }, [location.pathname, isAgencyRoute]);

  return (
    <div className="grid grid-rows-layout grid-cols-[256px_1fr] pt-24">
      {/* Header */}
      <header className="row-span-1 col-span-full text-white fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>

      {/* Sidebar - Role-based */}
      <aside className="row-span-2 col-span-1 text-white mt-20 overflow-y-auto">
        {isAgencyRoute ? <AgencySideMenu /> : <ContractorSideMenu />}
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