import React from "react";

const Footer = () => {
  return (
    <footer className=" text-white py-8 bg-[#263238] ">
      <div className="container mx-auto flex justify-between items-center flex-row-reverse px-4">
        <div className="">
        <button className="bg-slate-900 text-white lg:text-[15px] text-sm py-2 px-5 rounded-sm">
            Connect Wallet
          </button>
        </div>

        <div className="text-sm text-gray-400">
          <a
            href="/privacy-policy"
            className="hover:underline hover:text-white mr-4"
          >
            Privacy Policy
          </a>
          <span>© 2024 All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
