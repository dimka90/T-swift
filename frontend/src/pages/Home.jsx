import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import image1 from "../assets/image5.png";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import image2 from "../assets/pana.png";

function Home() {
  const [allowNavigation, setAllowNavigation] = useState(false); 
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    if (!allowNavigation) {
      toast.error("Please connect your wallet to proceed!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setAllowNavigation(true); 
    } else {
      navigate(path); 
    }
  };

  return (
    <div className="bg-[#F5F7FA]">
      <ToastContainer />

      <Navbar />
      <div className="flex xl:px-32 lg:px-20 px-5 lg:py-32 py-10 lg:flex-row flex-col xl:h-screen lg:h-screen">
        <div className="self-center">
          <h1 className="lg:text-[40px] font-medium text-[30px]">
            Streamline Contract Management from Start to Finish
          </h1>
          <p className="lg:text-[18px] text-[#505F98] w-[409px] text-sm mb-7">
            An all-in-one platform for government parastatals and contractors to
            monitor, manage, and complete projects seamlessly
          </p>
          <div className="flex gap-8 justify items-center">
            <button
              className="bg-green-600 hover:bg-yellow-500 text-white lg:text-[15px] text-md py-3 px-5 rounded-xl"
              onClick={() => handleButtonClick("/dashboard")}
            >
              Start as Contractor
            </button>
            <button
              className="bg-green-600 hover:bg-yellow-500 text-white lg:text-[15px] text-md py-3 px-5 rounded-xl"
              onClick={() => handleButtonClick("/agency-dashboard")}
            >
              Start as Agency
            </button>
          </div>
        </div>
        <div className="self-center">
          <img src={image1} alt="" />
        </div>
      </div>
      <div className="lg:px-32 bg-white pb-20 px-5">
        <div className="grid lg:grid-cols-2 grid-cols-1">
          <div>
            <img src={image2} alt="" />
          </div>
          <div className="self-center">
            <p className="text-[#4D4D4D] font-semibold text-[26px]">
              The Journey of Simplifying Contract Management
            </p>
            <p className="text-[#717171] text-[14px]">
              Managing contracts for government projects is no small feat. Our
              platform has redefined how parastatals and contractors
              collaborate. From tracking progress to ensuring timely completion,
              we’ve built a system that empowers efficiency and transparency.
              Every milestone is an opportunity to improve accountability and
              achieve excellence in project management.
            </p>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 px-10 grid-cols-1 gap-10 lg:px-32 py-10" id="our-mission">
  <div>
    <p className="text-[#4D4D4D] font-semibold text-[26px]">
      Transforming{" "}
      <span className="text-slate-800">Project Management</span> for the
      Better
    </p>
    <p className="text-sm">
      Revolutionizing how contracts are tracked and completed, fostering
      collaboration and transparency for government parastatals and
      contractors.
    </p>
  </div>
  <div>
    <p className="text-[#4D4D4D] font-semibold text-[26px]">
      Our Mission
    </p>
    <p className="text-sm">
      To simplify contract management by streamlining processes, enhancing
      accountability, and ensuring successful project delivery from start
      to finish.
    </p>
  </div>
</div>

      <div className="grid lg:grid-cols-2 bg-white lg:px-32 px-10 grid-cols-1 mb-10">
        <div>
          <img src={image2} alt="" />
        </div>
        <div className="self-center">
          <p className="text-[#4D4D4D] font-semibold text-[26px]">
            Simplifying Contract Management for Seamless Collaboration
          </p>
          <p className="text-[#717171] text-[14px]">
            Managing contracts doesn’t have to be complicated. Our platform is
            designed to help government parastatals and contractors keep track
            of every project from initiation to completion. Whether it's
            tracking milestones, managing documents, or ensuring transparency,
            we provide the tools you need to stay organized and efficient.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
