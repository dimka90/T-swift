import { Link, useLocation } from "react-router-dom";

function SideMenu() {
  const location = useLocation();

  const menuItems = [
    { icon: "📊", label: "Dashboard", path: "/dashboard" },
    { icon: "📝", label: "Assign Contract", path: "/assignContract" },
    { icon: "💳", label: "Payment History", path: "/payment" },
    { icon: "📁", label: "My Projects", path: "/projects" },
    { icon: "✓", label: "Projects Review", path: "/review" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="text-white h-screen flex flex-col justify-between p-6 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-700/50">
      <div>
        <div className="mb-8">
          <h3 className="text-lg font-bold text-green-400 mb-6">Menu</h3>
          <ul className="space-y-2">
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "text-gray-300 hover:text-green-400 hover:bg-slate-800/50"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Section */}
      <div className="border-t border-slate-700/50 pt-6">
        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-400 mb-2">Connected</p>
          <p className="text-sm font-semibold text-green-400">Contractor Portal</p>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
