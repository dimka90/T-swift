import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
import AssignContract from "./AssignContract"

function AgencyDashboard(){
  const navigate = useNavigate();
  const { isConnected } = useAppKitAccount();

  useEffect(() => {
    if (!isConnected) {
      toast.error("Please connect your wallet to access the agency dashboard", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    }
  }, [isConnected, navigate]);

  if (!isConnected) {
    return null;
  }

  return <div className="bg-white  rounded-2xl  gap-4 ">
    <div className="w-[70%] ">
      <AssignContract/>
    </div>
  </div>
}

export default AgencyDashboard;