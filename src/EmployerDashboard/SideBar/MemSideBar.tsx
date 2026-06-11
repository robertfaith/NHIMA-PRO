import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";

// icons
import { SiHomebridge } from "react-icons/si";
import { PiUserCircleCheckDuotone } from "react-icons/pi";
import { TbLayoutSidebarLeftCollapse, TbReport } from "react-icons/tb";
import { AiOutlineNotification } from "react-icons/ai";
import { MdOutlineSettingsSuggest, MdPolicy, MdAddHomeWork, MdOutlineLogout } from "react-icons/md";
import { FaUsers, FaChevronRight } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { FaUsersCog } from "react-icons/fa";
import Logo from "../../assets/2.png";

interface MemSideBarProps {
  show: boolean;
}

const navLinks = [
  { label: "Dashboard", icon: <SiHomebridge />, to: "/dashboard" },
  { label: "Profile", icon: <PiUserCircleCheckDuotone />, to: "/profile" },
  { label: "Contributions", icon: <MdAddHomeWork />, to: "/jobs" },
  { label: "Claims", icon: <AiOutlineNotification />, to: "/claims" },
  { label: "Reports", icon: <TbReport />, to: "/reports" },
  { label: "Policies", icon: <MdPolicy />, to: "/policies" },
  { label: "Applicants", icon: <FaUsersCog />, to: "/applicants" },
  { label: "Users", icon: <FaUsers />, to: "/users" },
  { label: "Payments", icon: <GiMoneyStack />, to: "/payments" },
  { label: "Benefits", icon: <MdOutlineSettingsSuggest />, to: "/benefits" },
  { label: "Settings", icon: <MdOutlineSettingsSuggest />, to: "/settings" },
];

const logoImageStyles: React.CSSProperties = {
  maxWidth: '100px',
  height: 'auto',
  marginLeft: '8px',
  borderRadius: '2px',
  padding: '6px',
};

const MemSideBar: React.FC<MemSideBarProps> = ({ show }) => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  const role = "Administrator"; // Replace with actual user context
  const userName = "RobTech Innovation";

  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-[999] lg:hidden"
        />
      )}

      <aside
        className="fixed top-0 left-0 h-screen w-[240px] bg-[#011627] z-[1000] flex flex-col transition-all duration-300 overflow-y-auto"
        style={{ left: show || mobileOpen ? '0' : '-240px' }}
      >
        {/* Logo */}
        <div className="px-5 pt-8 pb-6 border-b border-white/10 flex justify-between items-center">
          <img src={Logo} alt="Logo" style={logoImageStyles} />
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* User Card */}
        <div className="mx-3 mt-5 mb-4 p-4 rounded-xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
              {userName.charAt(0)}
            </span>
            <div>
              <p className="text-sm text-slate-200 font-semibold">{userName}</p>
              <p className="text-xs text-slate-400">
                {role === "Administrator" ? "Administrator" : role === "Employer" ? "Employer" : "User"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Label */}
        <div className="px-5 pb-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest">
            NAVIGATIONS
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const isActive = pathname.startsWith(item.to);
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-150 relative ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500" />
                )}
                <span
                  className={`w-5 h-5 shrink-0 inline-flex items-center justify-center ${
                    isActive ? "text-indigo-300" : "text-slate-400 group-hover:text-slate-300"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="flex-1 min-w-0 text-left truncate">{item.label}</span>
                {isActive && <FaChevronRight className="w-3.5 h-3.5 text-indigo-500/50" />}
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[13px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150"
          >
            <MdOutlineLogout className="w-[17px] h-[17px]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default MemSideBar;