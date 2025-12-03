import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { CiSearch } from "react-icons/ci";
import { MdFilterList } from "react-icons/md";
import { IoMdArrowDown } from "react-icons/io";

function Payment() {
  const navigate = useNavigate();
  const { isConnected } = useAppKitAccount();

  useEffect(() => {
    if (!isConnected) {
      toast.error("Please connect your wallet to view payment history", {
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
    <div className="bg-white rounded-3xl  p-7 h-screen">
      <h3 className="text-[20px] font-semibold mb-10">Payment History</h3>
      <div className="flex gap-2">
        <button className="border border-gray-300 py-1 px-3 rounded-md">
          <MdFilterList className="inline text-lg mr-1" />
          Filters
        </button>
        <div className="border border-gray-300 py-1 px-3 rounded-md w-[85%]">
          <CiSearch className="inline mr-1 text-lg text-gray-600" />
          <input type="search" name="" id="" placeholder="Search" />
        </div>
      </div>

      <div className="mt-7 bg-[#F4F4F4] p-5" >
        <table className="table-fixed font-norma w-full text-xs">
          <thead className="border-b border-gray-500">
            <tr>
              <td className="py-2">
                Transaction ID <IoMdArrowDown className="inline text-base" />
              </td>
              <td className="py-2">Amount</td>
              <td className="py-2">End date</td>
              <td className="py-2">Status</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pt-3">TRX890123456</td>
              <td className="pt-3">20 eth</td>
              <td className="text-[#475467] pt-3 ">06/08/2024</td>
              <td className="text-[#475467] bg-white border rounded-sm inline mt-3">
                Completetd
              </td>
            </tr>
            <tr>
              <td className="pt-3">TRX890123456</td>
              <td className="pt-3">20 eth</td>
              <td className="text-[#475467] pt-3">06/08/2024</td>
              <td className="text-[#475467] bg-white border rounded-sm inline mt-9">
                Cancelled
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Payment;
