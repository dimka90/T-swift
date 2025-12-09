import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiUpload, FiX, FiCheckCircle, FiLoader, FiAlertCircle } from "react-icons/fi";
import { wagmiContractConfig } from '../lib/wagmiContractConfig';
import { TransactionStatus } from './TransactionStatus';

function MilestoneForm() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const location = useLocation();
  const { projectId, milestone } = location.state || {};

  const {
    data: transactionData,
    writeContract,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: transactionData?.hash,
  });

  const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjMTg5ZWQ3MC1jYjczLTRhMjItYmIxNS01NDlkNDMyZDBkMWEiLCJlbWFpbCI6ImRpbWtheWlscml0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4ODU3NTA4MTU4ZjkyY2IxNjAyZCIsInNjb3BlZEtleVNlY3JldCI6ImU2NzUzOWU0NTBhMDYxNTcyOWY4MTJhNWYxZGE5YTMzN2MxMTU3YjEyODI1OTkyOGI0N2I4MDM4NjJhNGZjZDgiLCJleHAiOjE3NjU4NjczNTB9.92HXWr-vzSXsIIVXz4WTp4dP9IhwU0TZryfv7frORHY";

  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageCid, setImageCid] = useState("");

  useEffect(() => {
    if (!isConnected) {
      toast.error("Please connect your wallet", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    }
  }, [isConnected, navigate]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Project submitted successfully!", {
        position: "top-right",
        autoClose: 5000,
      });
      resetForm();
      setTimeout(() => navigate("/contractor-dashboard"), 2000);
    }
  }, [isConfirmed, navigate]);

  const uploadImageToIPFS = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        body: formData,
      });

      const data = await response.json();
      return data.IpfsHash;
    } catch (error) {
      console.error('Error uploading image to IPFS:', error);
      throw error;
    }
  };

  const handleImageChange = async (e) => {
    const fileList = Array.from(e.target.files);
    
    if (fileList.length === 0) return;

    // Validate file sizes
    const maxSize = 1 * 1024 * 1024; // 1MB
    const invalidFiles = fileList.filter(file => file.size > maxSize);
    
    if (invalidFiles.length > 0) {
      toast.error("Some files exceed 1MB limit", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const previews = fileList.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);

    try {
      setIsSubmitting(true);
      setUploadProgress(0);

      // Upload first file to IPFS
      const uploadedCid = await uploadImageToIPFS(fileList[0]);
      setImageCid(uploadedCid);
      setImages(fileList);
      setUploadProgress(100);

      toast.success("Image uploaded successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload image", {
        position: "top-right",
        autoClose: 5000,
      });
      setPreviewImages([]);
      setImages([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index) => {
    setPreviewImages(previewImages.filter((_, i) => i !== index));
    setImages(images.filter((_, i) => i !== index));
    if (previewImages.length === 1) {
      setImageCid("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error("Please connect your wallet", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a description", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!imageCid) {
      toast.error("Please upload at least one image", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!projectId) {
      toast.error("Project ID is missing", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      writeContract({
        ...wagmiContractConfig,
        functionName: 'SubmitProject',
        args: [
          projectId,
          description,
          imageCid,
        ],
      });

      toast.info("Transaction submitted. Awaiting confirmation...", {
        position: "top-right",
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Error: ${error.message || "Failed to submit"}`, {
        position: "top-right",
        autoClose: 5000,
      });
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDescription("");
    setImages([]);
    setPreviewImages([]);
    setUploadProgress(0);
    setImageCid("");
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <span className="text-blue-400 text-sm font-semibold">📋 Submit Deliverables</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Submit Project</h1>
          <p className="text-gray-400 text-lg">
            Submit your project deliverables for review and approval
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Info */}
            {projectId && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 text-sm">
                <p>Project ID: <span className="font-mono font-semibold">{projectId}</span></p>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                📝 Project Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you've delivered, key features, and any important notes..."
                rows="5"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
              <p className="text-xs text-gray-400 mt-2">
                Provide detailed information about your deliverables
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                🖼️ Upload Evidence
              </label>
              <div className="relative">
                <input
                  id="images"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  multiple
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition cursor-pointer ${
                    isSubmitting
                      ? "border-gray-600 bg-slate-700/30 cursor-not-allowed"
                      : "border-slate-600/50 hover:border-blue-500/50 bg-slate-700/20 hover:bg-slate-700/40"
                  }`}
                >
                  <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-white font-medium">Click to upload images</p>
                  <p className="text-gray-400 text-sm mt-1">
                    JPG, JPEG, PNG • Max 1MB per file
                  </p>
                </label>
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-400">Uploading...</p>
                    <p className="text-sm font-semibold text-blue-400">{uploadProgress}%</p>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden border border-slate-600">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-3">Uploaded Images</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {previewImages.map((src, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={src}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded-lg border border-slate-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                        {uploadProgress === 100 && index === 0 && (
                          <div className="absolute top-1 left-1 p-1 bg-green-600 text-white rounded-lg">
                            <FiCheckCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isWriting || isConfirming}
              className="w-full mt-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 flex items-center justify-center gap-2 transition duration-300 shadow-lg hover:shadow-blue-500/50 disabled:shadow-none transform hover:scale-105 disabled:scale-100"
            >
              {isSubmitting || isWriting || isConfirming ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  <span>{isConfirming ? "Confirming..." : "Processing..."}</span>
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-5 h-5" />
                  <span>Submit Project</span>
                </>
              )}
            </button>

            {/* Transaction Status */}
            <TransactionStatus
              isConfirming={isConfirming}
              isConfirmed={isConfirmed}
              error={writeError?.message}
              txHash={transactionData?.hash}
            />
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-medium mb-2">Before You Submit</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>✓ Ensure all deliverables are complete and meet requirements</li>
                <li>✓ Include clear evidence/screenshots of your work</li>
                <li>✓ Provide detailed description of what you've delivered</li>
                <li>✓ Double-check all information before submitting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MilestoneForm;
