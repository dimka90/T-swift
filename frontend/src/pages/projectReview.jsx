// // import React, { useState, useEffect } from "react";
// // import { useReadContract,useAccount } from "wagmi";
// // import { wagmiContractConfig } from "../lib/wagmiContractConfig";
// // // import {useContractorData} from "../components/read";
// // import useContractorData from "../components/read";

// // function ReviewMilestone (){
// //   const { address } = useAccount()
// //   const { data: contractorbSubMittedReport, error} = useReadContract({
// //     ...wagmiContractConfig,
// //     functionName: "getSubmittedProject",
// //    args: [address]
// //   });

// //   return (
    
   
// //     <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg font-sans">
// //       {/* Title */}
// //       <h2 className="text-2xl font-bold text-center mb-6">Review Milestone</h2>

// //       {error && error.message && error.message} 
// //       {/* Description */}
// //       <div className="mb-6">
// //         <h3 className="text-lg font-semibold mb-2">Description </h3>
// //         {/* <p className="text-gray-700 leading-relaxed">{description}</p> */}
// //         <p className="text-gray-700 leading-relaxed">description  {contractorbSubMittedReport[0].description}
// //         </p> 
// //       </div>

// //       {/* Image */}
// //       <div className="mb-6">
// //         {/* <h3 className="text-lg font-semibold mb-2">Image</h3>
// //         {image ? (
// //           <img
// //             src={image}
// //             alt="Milestone"
// //             className="w-full h-64 object-cover rounded-lg shadow-md"
// //           />
// //         ) : (
// //           <p className="text-gray-500">No image available</p>
// //         )} */}
// //       </div>

// //       {/* Buttons */}
// //       <div className="flex justify-between mt-6">
// //         <button
// //           // onClick={handleApprove}
// //           className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
// //         >
// //           Approve
// //         </button>
// //         <button
// //           // onClick={handleReject}
// //           className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
// //         >
// //           Reject
// //         </button>


// //       </div>
// //     </div>
// //   );
// // };

// // export default ReviewMilestone;

// import React from "react";
// import { useReadContract, useAccount } from "wagmi";
// import { wagmiContractConfig } from "../lib/wagmiContractConfig";

// function ReviewMilestone() {
//   const { address } = useAccount();

//   // Fetch data from the smart contract
//   const { data: contractorbSubMittedReport, error, isLoading } = useReadContract({
//     ...wagmiContractConfig,
//     functionName: "getSubmittedProject",
//     args: [address],
//   });

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   if (!contractorbSubMittedReport || contractorbSubMittedReport.length === 0) {
//     return <div>No submitted projects found.</div>;
//   }

//   return (
//     <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg font-sans">
//       {/* Title */}
//       <h2 className="text-2xl font-bold text-center mb-6">Review Milestones</h2>

//       {/* Render each project */}
//       <div className="space-y-6">
//         {contractorbSubMittedReport.map((report, index) => {
//           {console.log(report.imageCid)}
//           const imageUrl = `https://bronze-acute-porpoise-162.mypinata.cloud/ipfs/${report.imageCid}`; // Construct IPFS URL
//           console.log(imageUrl)
//           return (
//             <div key={index} className="border p-4 rounded-lg shadow-sm">
//               {/* Project Title */}
//               <h3 className="text-lg font-semibold mb-2">
//                 Project {index + 1}
//               </h3>

//               {/* Description */}
//               <div className="mb-4">
//                 <h4 className="font-medium">Description</h4>
//                 <p className="text-gray-700 leading-relaxed">{report.description}</p>
//               </div>

//               {/* Image */}
//               <div className="mb-4">
//                 <h4 className="font-medium">Image</h4>
//                 {report.image ? (
//                   <img
//                     src={imageUrl}
//                     alt={`Milestone ${index + 1}`}
//                     className="w-full h-64 object-cover rounded-lg shadow-md"
//                   />
//                 ) : (
//                   <p className="text-gray-500">No image available</p>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-between">
//                 <button
//                   // Add your handleApprove logic here
//                   className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
//                 >
//                   Approve
//                 </button>
//                 <button
//                   // Add your handleReject logic here
//                   className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default ReviewMilestone;



import React, { useEffect, useState } from "react";
import { useReadContract, useAccount } from "wagmi";
import { wagmiContractConfig } from "../lib/wagmiContractConfig";

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjMTg5ZWQ3MC1jYjczLTRhMjItYmIxNS01NDlkNDMyZDBkMWEiLCJlbWFpbCI6ImRpbWtheWlscml0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIzYmM1YWE1ZmUwMTJiOWIzZmU5ZSIsInNjb3BlZEtleVNlY3JldCI6IjQ0ZGM0OWRiYTE4NjZjMjQyOTYxNmEwODlmOTA0N2E1MTNlM2Y1ZTA4NzQyNDlhMmE4MzhmMjRmNDg0ZmQ2MjAiLCJleHAiOjE3NjYwMjk5MDl9.oWF_RWkRkrP_Vp24LhhIngZPDUQJdDxAdRXyGfYHN3Y";

async function getSignedUrl(ipfsCid) {
  try {
    const payload = JSON.stringify({
      url: `https://bronze-acute-porpoise-162.mypinata.cloudfiles/${ipfsCid}?img-width=500&img-height=500&img-format=webp`,
      expires: 500000,
      date: Math.floor(Date.now() / 1000),
      method: "GET",
    });

    const request = await fetch("https://api.pinata.cloud/v3/files/sign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: payload,
    });

    const response = await request.json();
    return response.signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
}

function ReviewMilestone() {
  const { address } = useAccount();
  const [signedUrls, setSignedUrls] = useState({});

  const { data: contractorbSubMittedReport, error, isLoading } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getSubmittedProject",
    args: [address],
  });

  useEffect(() => {
    const fetchSignedUrls = async () => {
      console.log(contractorbSubMittedReport)
      if (contractorbSubMittedReport) {
        const urls = {};
        for (let report of contractorbSubMittedReport) {
          if (report.imageCid) {
            const signedUrl = await getSignedUrl(report.imageCid);
            if (signedUrl) {
              urls[report.imageCid] = signedUrl;
            }
          }
        }
        setSignedUrls(urls);
      }
    };
    fetchSignedUrls();
  }, [contractorbSubMittedReport]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!contractorbSubMittedReport || contractorbSubMittedReport.length === 0) {
    return <div>No submitted projects found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg font-sans">
      <h2 className="text-2xl font-bold text-center mb-6">Review Milestones</h2>

      <div className="space-y-6">
        {contractorbSubMittedReport.map((report, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Project {index + 1}</h3>
            <div className="mb-4">
              <h4 className="font-medium">Description</h4>
              <p className="text-gray-700 leading-relaxed">{report.description}</p>
            </div>
            <div className="mb-4">
              <h4 className="font-medium">Image</h4>
              {signedUrls[report.imageCid] ? (
                <img
                  src={`https://gateway.pinata.cloud/ipfs/${report.imageCid}`}
                  alt={`Milestone ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              ) : (
                <p className="text-gray-500">No image available</p>
              )}
            </div>
            <div className="flex justify-between">
              <button className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300">
                Approve
              </button>
              <button className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewMilestone;

