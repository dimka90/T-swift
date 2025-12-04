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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">📋 Create New Project</h2>
        <p className="text-gray-400">Fill in the project details to assign a new contract</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Project Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-3">Project Description</label>
          <textarea
            {...register("description", { required: "Description is required" })}
            placeholder="Enter a detailed project description"
            rows="3"
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none ${
              errors.description ? "border-red-500" : "border-slate-600"
            }`}
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <span>⚠️</span> {errors.description.message}
            </p>
          )}
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-3">Budget (in tokens)</label>
          <div className="relative">
            <input
              type="number"
              {...register("budget", { required: "Budget is required", min: 1 })}
              placeholder="0.00"
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.budget ? "border-red-500" : "border-slate-600"
              }`}
            />
            <span className="absolute right-4 top-3 text-gray-400 text-sm">LSK</span>
          </div>
          {errors.budget && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <span>⚠️</span> {errors.budget.message}
            </p>
          )}
        </div>

        {/* Contractor Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-3">Contractor Address</label>
          <input
            type="text"
            {...register("contractorAddress", { required: "Contractor address is required" })}
            placeholder="0x..."
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition font-mono text-sm ${
              errors.contractorAddress ? "border-red-500" : "border-slate-600"
            }`}
          />
          {errors.contractorAddress && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <span>⚠️</span> {errors.contractorAddress.message}
            </p>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">Start Date</label>
            <input
              type="date"
              {...register("startDate", { required: "Start date is required" })}
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.startDate ? "border-red-500" : "border-slate-600"
              }`}
            />
            {errors.startDate && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <span>⚠️</span> {errors.startDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">End Date</label>
            <input
              type="date"
              {...register("endDate", { required: "End date is required" })}
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.endDate ? "border-red-500" : "border-slate-600"
              }`}
            />
            {errors.endDate && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <span>⚠️</span> {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || isWriting || isConfirming}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 rounded-lg hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 flex items-center justify-center gap-2 transition duration-300 shadow-lg hover:shadow-green-500/50"
        >
          {loading || isWriting || isConfirming ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>✓</span>
              <span>Create Project</span>
            </>
          )}
        </button>

        {/* Status Messages */}
        {isConfirming && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-center font-medium">
            ⏳ Transaction confirming...
          </div>
        )}
        {isConfirmed && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center font-medium">
            ✓ Transaction confirmed!
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center font-medium">
            ✕ {error.message}
          </div>
        )}
      </form>

      <ToastContainer />
    </div>
  );
};

export default AssignContract;
