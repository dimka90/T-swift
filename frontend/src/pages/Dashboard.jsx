import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
import ContractorBody from "../components/ContractorBody";

function Dashboard() {
  const navigate = useNavigate();
  const { isConnected } = useAppKitAccount();

  useEffect(() => {
    if (!isConnected) {
      toast.error("Please connect your wallet to access the dashboard", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    }
  }, [isConnected, navigate]);

  if (!isConnected) {
    return null;
  }

  return (
    <div>
      <div>
        <ContractorBody />
      </div>
    </div>
  );
}

export default Dashboard;
