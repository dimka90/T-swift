import { useReadContract, useAccount} from 'wagmi'
import {wagmiContractConfig} from "../lib/wagmiContractConfig";

export default function useContractorData(functionName) {
  const { address } = useAccount()
  const { data: contractor} = useReadContract({
    ...wagmiContractConfig,
    functionName: functionName,
    args: [address],
  });
  return contractor;

}

// import { useReadContract, useAccount } from "wagmi";
// import { useEffect, useState } from "react";

// export default function useContractorData(functionName) {
//   const { address } = useAccount(); // Detect connected wallet
//   const [contractorData, setContractorData] = useState(null);

//   // Call the contract read function
//   const { data, refetch } = useReadContract({
//     ...wagmiContractConfig, // Replace this with your contract configuration
//     functionName: functionName,
//     args: [address], // Pass wallet address as argument
//   });

//   // Update state when data is fetched
//   useEffect(() => {
//     if (data) {
//       setContractorData(data);
//     }
//   }, [data]);

//   // Refetch data whenever the wallet address changes
//   useEffect(() => {
//     if (address) {
//       refetch();
//     }
//   }, [address, refetch]);

//   return contractorData;
// }


// import { useReadContract } from "wagmi";
// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// function ContractorProjects() {
//   // Fetch projects for a contractor
//   const { data: contractorProjects, isLoading, isError } = useReadContract({
//     ...wagmiContractConfig,
//     functionName: "getContractorsProject",
//     args: ["0x1864cdF30E6B98240e4b3eF88bfF5cD5d5BdEF40"], // Replace with the contractor's Ethereum address
//   });

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-xl font-bold mb-4">Contractor Projects</h1>
//       {isLoading ? (
//         <p>Loading projects...</p>
//       ) : isError ? (
//         <p>Error fetching projects. Please try again.</p>
//       ) : contractorProjects && contractorProjects.length > 0 ? (
//         contractorProjects.map((project, index) => (
//           <div key={index} className="border p-4 mb-4 rounded shadow">
//             <h2 className="text-lg font-semibold">
//               Project #{project.projectId}: {project.description}
//             </h2>
//             <p>
//               <strong>Budget:</strong> {project.budget} wei
//             </p>
//             <p>
//               <strong>Balance:</strong> {project.currentBalance} wei
//             </p>
//             <p>
//               <strong>Start Date:</strong>{" "}
//               {new Date(project.startDate * 1000).toLocaleDateString()}
//             </p>
//             <p>
//               <strong>End Date:</strong>{" "}
//               {new Date(project.endDate * 1000).toLocaleDateString()}
//             </p>
//             <p>
//               <strong>Status:</strong>{" "}
//               {project.completed ? (
//                 <FaCheckCircle className="inline text-green-500" />
//               ) : (
//                 <FaTimesCircle className="inline text-red-500" />
//               )}
//             </p>

//             <h3 className="mt-4 text-md font-semibold">Milestones</h3>
//             {project.mileStone && project.mileStone.length > 0 ? (
//               <ul className="list-disc pl-5">
//                 {project.mileStone.map((milestone, i) => (
//                   <li key={milestone.milestoneId} className="mb-2">
//                     <p>
//                       <strong>Description:</strong> {milestone.description}
//                     </p>
//                     <p>
//                       <strong>Payment:</strong> {milestone.paymentAmount} wei
//                     </p>
//                     <p>
//                       <strong>Due Date:</strong>{" "}
//                       {new Date(milestone.dueDate * 1000).toLocaleDateString()}
//                     </p>
//                     <p>
//                       <strong>Status:</strong>{" "}
//                       {milestone.completed ? (
//                         <FaCheckCircle className="inline text-green-500" />
//                       ) : (
//                         <FaTimesCircle className="inline text-red-500" />
//                       )}
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No milestones for this project.</p>
//             )}
//           </div>
//         ))
//       ) : (
//         <p>No projects found for this contractor.</p>
//       )}
//     </div>
//   );
// }

// export default ContractorProjects;
