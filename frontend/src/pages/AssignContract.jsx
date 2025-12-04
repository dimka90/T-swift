import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { wagmiContractConfig } from "../lib/wagmiContractConfig";

const AssignContract = () => {
  const [loading, setLoading] = useState(false);
  const { isConnected } = useAccount();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    data: transactionData,
    writeContract,
    isLoading: isWriting,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: transactionData?.hash,
  });

  const convertToTimestamp = (date) => Math.floor(new Date(date).getTime() / 1000);

  const onSubmit = async (data) => {
    if (!isConnected) {
      toast.error("Please connect your wallet.");
      return;
    }

    const payload = {
      description: data.description,
      budget: data.budget,
      contractorAddress: data.contractorAddress,
      startDate: convertToTimestamp(data.startDate),
      endDate: convertToTimestamp(data.endDate),
    };

    try {
      setLoading(true);
      writeContract({
        ...wagmiContractConfig,
        functionName: "createProject",
        args: [
          payload.description,
          payload.budget,
          payload.contractorAddress,
          payload.startDate,
          payload.endDate,
        ],
      });
      toast.info("Transaction submitted. Awaiting confirmation...");
      setTimeout(()=>{
        toast.success("Project Successfully Assigned")
        reset();
      },3000);

     
    } catch (err) {
      console.error("Error:", err);
      toast.error(`Transaction failed: ${err.message}`);
    
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
          
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-200 mb-2">Project Description</label>
            <input
              type="text"
              {...register("description", { required: "Description is required" })}
              placeholder="Enter project description"
              className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.description ? "border-red-500" : "border-slate-600"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
            )}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-200 mb-2">Budget (in tokens)</label>
            <input
              type="number"
              {...register("budget", { required: "Budget is required", min: 1 })}
              placeholder="Enter budget amount"
              className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.budget ? "border-red-500" : "border-slate-600"
              }`}
            />
            {errors.budget && (
              <p className="mt-1 text-sm text-red-400">{errors.budget.message}</p>
            )}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-200 mb-2">Contractor Address</label>
            <input
              type="text"
              {...register("contractorAddress", { required: "Contractor address is required" })}
              placeholder="0x..."
              className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition font-mono text-sm ${
                errors.contractorAddress ? "border-red-500" : "border-slate-600"
              }`}
            />
            {errors.contractorAddress && (
              <p className="mt-1 text-sm text-red-400">{errors.contractorAddress.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Start Date</label>
              <input
                type="date"
                {...register("startDate", { required: "Start date is required" })}
                className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.startDate ? "border-red-500" : "border-slate-600"
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-400">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">End Date</label>
              <input
                type="date"
                {...register("endDate", { required: "End date is required" })}
                className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.endDate ? "border-red-500" : "border-slate-600"
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-400">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 rounded-lg hover:from-green-700 hover:to-green-800 flex items-center justify-center gap-2 transition duration-300 shadow-lg hover:shadow-xl"
            disabled={loading || isWriting || isConfirming}
          >
            {loading || isWriting || isConfirming ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              "Create Project"
            )}
          </button>

          {isConfirming && <p className="mt-4 text-center text-yellow-400 font-medium">⏳ Transaction confirming...</p>}
          {isConfirmed && <p className="mt-4 text-center text-green-400 font-medium">✓ Transaction confirmed!</p>}
          {error && <p className="mt-4 text-center text-red-400 font-medium">✕ {error.message}</p>}
        </form>
      <ToastContainer />
    </div>
  );
};

export default AssignContract;
