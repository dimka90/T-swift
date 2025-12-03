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


import React, { useState, useEffect } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
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
    <nav className="bg-white top-0 z-50 w-full md:w-full fixed">
      <div className="container mx-auto px-4 py-5 flex justify-between items-center">
        <Link to="/" className='ml-28 flex flex-col items-center'>
          <div className="flex items-center w-7" >
            <img src={Logo} alt="Logo" className="" />
          </div>
          <h2 className='text-green-600 font-bold text-xl'>TswiFt</h2>
        </Link>
        <ul className="hidden md:flex space-x-8 text-base text-[#18191F]">
          <Link to="/">
            <li className="hover:text-slate-950 cursor-pointer hover:underline">Services</li>
          </Link>
          <li
            className="hover:text-slate-950 cursor-pointer hover:underline"
            onClick={handleScrollToMission}
          >
            About
          </li>
          <Link to="">
            <li className="hover:text-slate-950 cursor-pointer hover:underline">FAQ</li>
          </Link>
        </ul>
        <button
          onClick={() => appKit.open()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          {isConnected && address
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : 'Connect Wallet'}
        </button>
        <div
          className="md:hidden text-2xl cursor-pointer"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <ul className="flex flex-col items-center space-y-4 py-4 text-lg font-medium">
            <li className="hover:text-green-500 cursor-pointer">Services</li>
            <li
              className="hover:text-green-500 cursor-pointer"
              onClick={handleScrollToMission}
            >
              About
            </li>
            <li className="hover:text-green-500 cursor-pointer">FAQ</li>
            <li></li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
