// import React, { useState } from 'react';
// import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
// import Logo from "../assets/Logo.png"
// import { Link } from 'react-router-dom';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   return (
//     <nav className="bg-white  top-0 z-50 w-full md:w-full">
//       <div className="container mx-auto px-4 py-5 flex justify-between items-center">
//         <Link to="/">
//         <div className="flex items-center">
//           <img src={Logo} alt="Logo" className="" />
//         </div>
//         </Link>
//         <ul className="hidden md:flex space-x-8 text-base text-[#18191F]">
//           <Link to="/">
//           <li className="hover:text-slate-950 cursor-pointer hover:underline">Services</li>
//           </Link>
//           <Link to="">
//           <li className="hover:text-slate-950 cursor-pointer hover:underline">About</li>
//           </Link>
//           <Link to="">
//           <li className="hover:text-slate-950 cursor-pointer hover:underline">FAQ</li>
//           </Link>
//         </ul>
//           <ConnectButton />
//         <div
//           className="md:hidden text-2xl cursor-pointer"
//           onClick={toggleMobileMenu}
//         >
//           {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
//         </div>
//       </div>

//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-white shadow-lg">
//           <ul className="flex flex-col items-center space-y-4 py-4 text-lg font-medium">
//             <li className="hover:text-green-500 cursor-pointer">Services</li>
//             <li className="hover:text-green-500 cursor-pointer">About</li>
//             <li className="hover:text-green-500 cursor-pointer">FAQ</li>
//             <li>
//             </li>
//           </ul>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;


import { useState } from 'react';
import Logo from "../assets/Logo.png"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { appKit } from '../wagmi';
import { useAppKitAccount } from '@reown/appkit/react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { address, isConnected } = useAppKitAccount();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleScrollToMission = () => {
    if (location.pathname === "/") {
      // Scroll to the "Our Mission" section if on the home page
      const missionSection = document.getElementById("our-mission");
      if (missionSection) {
        missionSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to the home page first, then scroll
      navigate("/");
      setTimeout(() => {
        const missionSection = document.getElementById("our-mission");
        if (missionSection) {
          missionSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 300); // Delay to ensure the DOM is loaded
    }
  };

  return (
    <nav className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 top-0 z-50 w-full fixed border-b border-slate-700/50 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
          <div className="flex items-center w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-1">
            <img src={Logo} alt="Logo" className="w-full h-full" />
          </div>
          <h2 className='text-green-400 font-bold text-2xl hidden sm:block'>TswiFt</h2>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-1 text-base text-gray-300">
          <Link to="/">
            <li className="px-3 py-2 rounded-lg hover:text-green-400 hover:bg-slate-800/50 cursor-pointer transition-all duration-200">Services</li>
          </Link>
          <li
            className="px-3 py-2 rounded-lg hover:text-green-400 hover:bg-slate-800/50 cursor-pointer transition-all duration-200"
            onClick={handleScrollToMission}
          >
            About
          </li>
          <Link to="">
            <li className="px-3 py-2 rounded-lg hover:text-green-400 hover:bg-slate-800/50 cursor-pointer transition-all duration-200">FAQ</li>
          </Link>
        </ul>

        {/* Connect Wallet Button */}
        <button
          onClick={() => appKit.open()}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-green-500/50"
        >
          {isConnected && address
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : 'Connect Wallet'}
        </button>

        {/* Mobile Menu Button */}
        <div
          className="md:hidden text-2xl cursor-pointer text-gray-300 hover:text-green-400 transition-colors"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-sm shadow-lg border-t border-slate-700/50 animate-fade-in">
          <ul className="flex flex-col space-y-2 py-4 px-4 text-base font-medium text-gray-300">
            <Link to="/">
              <li className="px-3 py-2 rounded-lg hover:text-green-400 hover:bg-slate-800/50 cursor-pointer transition-all duration-200">Services</li>
            </Link>
            <li
              className="px-3 py-2 rounded-lg hover:text-green-400 hover:bg-slate-800/50 cursor-pointer transition-all duration-200"
              onClick={handleScrollToMission}
            >
              About
            </li>
            <Link to="">
              <li className="px-3 py-2 rounded-lg hover:text-green-400 hover:bg-slate-800/50 cursor-pointer transition-all duration-200">FAQ</li>
            </Link>
          </ul>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
