
import { useWriteContract,  useWaitForTransactionReceipt,useAccount,} from 'wagmi'
import axios from "axios";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { wagmiContractConfig } from '../lib/wagmiContractConfig';

function MilestoneForm() {
    const {
        data: transactionData,
        writeContract,
        isLoading: isWriting,
      error
    
      } = useWriteContract(
    
      );

      const uploadImageToIPFS = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        console.log(file)
    
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
        }
      };

    
      
      const { isLoading: isConfirming, isSuccess: isConfirmed } =useWaitForTransactionReceipt({
        hash: transactionData?.hash,
      });
    
  const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjMTg5ZWQ3MC1jYjczLTRhMjItYmIxNS01NDlkNDMyZDBkMWEiLCJlbWFpbCI6ImRpbWtheWlscml0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4ODU3NTA4MTU4ZjkyY2IxNjAyZCIsInNjb3BlZEtleVNlY3JldCI6ImU2NzUzOWU0NTBhMDYxNTcyOWY4MTJhNWYxZGE5YTMzN2MxMTU3YjEyODI1OTkyOGI0N2I4MDM4NjJhNGZjZDgiLCJleHAiOjE3NjU4NjczNTB9.92HXWr-vzSXsIIVXz4WTp4dP9IhwU0TZryfv7frORHY"; // Pinata JWT Token
  const location = useLocation();
  const { projectId, milestone } = location.state || {}; // Retrieve state
  console.log("Project ID:", projectId);
  // console.log("Milestone:", milestone);

  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // Uploaded image info
  const [previewImages, setPreviewImages] = useState([]); // Image Previews
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
  const [ImgCid,setImageCid] = useState("");

  // Handle Description Input
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Handle Image Upload
  const handleImageChange = async (e) => {
    const fileList = Array.from(e.target.files); // Convert files to an array
    const previews = fileList.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews); // Generate and display image previews

    try {
      setIsSubmitting(true);

      // Upload each file to Pinata
      const uploadedFiles = await Promise.all(
        fileList.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("name", file.name);

          // const imageCID = await uploadImageToIPFS(file);
          // console.log(imageCID)
          // const imageURL = `https://gateway.pinata.cloud/ipfs/${imageCID}`;
          // console.log("Contractor URL:", imageURL);
          // const config = {
          //   method: "post",
          //   url: "https://uploads.pinata.cloud/v3/files",
          //   headers: {
          //     Authorization: `Bearer ${JWT}`,
          //   },
          //   data,
          // };

          // const metadata = {
          //   name: file.name,
          //   description: description,
          //   image: imageURL,
          // };

          // const metadataCID = await uploadMetadataToIPFS(metadata);
          // console.log(metadataCID)

          // const metadataURL = `https://gateway.pinata.cloud/ipfs/${metadataCID}`;
          // console.log("Metadata URL:", metadataURL);

    
          // const response = await axios.request(config);
          const response = await uploadImageToIPFS(file);
          console.log("Response", response)
          setImages(response); 
          // console.log("Uploaded File Data:", response.data);

          // console.log("I have a cid", response.data.cid)
          // console.log("I am the second Id", response.data.data.cid)

          // if(response){
          //   setImageCid(response.data.data.cid)
          // }

          // return {
          //   fileName: file.name,
          //   pinataId: response.data.data.id,
          //   cid: response.data.data.cid,
          // };
        })
      );

      // Set uploaded files to state
      console.log("All Uploaded Files:", uploadedFiles);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("Project ID:", projectId);
    // console.log("Current Milestone:", milestone);
    // console.log("Description:", description);
    // console.log("Uploaded Images:", images);
    // const data = new FormData();
    // data.append("file", file);
    // data.append("name", file.name);

    const imageCID = images;

    console.log(imageCID)

    writeContract(
        {...wagmiContractConfig,
         functionName: 'SubmitProject',
       args: [
        projectId,
        description,
        imageCID,
       ],
     });
     const resetForm = () => {
      setDescription("");
      setImages([]);
      setPreviewImages([]);
      setLoadingProgress(0);
    };
resetForm();  
  };

  
  return (
    <div className="flex justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 w-[55%] mt-20 h-[40em]">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Submit Proeject for Review
        </h2>

        {/* Description Input */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Add description here"
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300 outline-none"
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label htmlFor="images" className="block text-gray-700 mb-1">
            Add image(s)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              id="images"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="images"
              className="cursor-pointer text-blue-600 hover:underline"
            >
              Click to upload
            </label>
            <p className="text-gray-500 text-sm mt-2">
              JPG, JPEG, PNG less than 1MB
            </p>
          </div>

          {/* Image Preview */}
          {previewImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {previewImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index}`}
                  className="w-full h-20 object-cover rounded-lg shadow"
                />
              ))}
            </div>
          )}
        </div>

        {/* Loading Progress */}
        {loadingProgress > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-gray-600 text-sm mt-1">{loadingProgress}%</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white font-semibold py-2 rounded-lg shadow-md transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isSubmitting ? "Uploading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default MilestoneForm;
