import React, { useState } from "react";
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Assign a Contract
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              {...register("description", { required: "Description is required" })}
              placeholder="Enter contract description"
              className={`mt-1 p-2 block w-full rounded-md border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Budget</label>
            <input
              type="number"
              {...register("budget", { required: "Budget is required", min: 1 })}
              placeholder="Enter budget"
              className={`mt-1 p-2 block w-full rounded-md border ${
                errors.budget ? "border-red-500" : "border-gray-300"
              } focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.budget && (
              <p className="mt-1 text-sm text-red-500">{errors.budget.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contractor Address</label>
            <input
              type="text"
              {...register("contractorAddress", { required: "Contractor address is required" })}
              placeholder="Enter contractor address"
              className={`mt-1 p-2 block w-full rounded-md border ${
                errors.contractorAddress ? "border-red-500" : "border-gray-300"
              } focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.contractorAddress && (
              <p className="mt-1 text-sm text-red-500">{errors.contractorAddress.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              {...register("startDate", { required: "Start date is required" })}
              className={`mt-1 p-2 block w-full rounded-md border ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              } focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              {...register("endDate", { required: "End date is required" })}
              className={`mt-1 p-2 block w-full rounded-md border ${
                errors.endDate ? "border-red-500" : "border-gray-300"
              } focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center transition duration-300"
            // disabled={loading || isWriting || isConfirming}
          >
            {loading || isWriting || isConfirming ? (
              <div className="loader border-4 border-t-4 border-white rounded-full w-5 h-5 animate-spin"></div>
            ) : (
              "Assign Contract"
            )}
          </button>
        </form>

        {isConfirming && <p className="mt-4 text-yellow-500">Transaction confirming...</p>}
        {isConfirmed && <p className="mt-4 text-green-500">Transaction confirmed!</p>}
        {error && <p className="mt-4 text-red-500">{error.message}</p>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AssignContract;
