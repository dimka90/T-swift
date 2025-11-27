// import { useWriteContract } from 'wagmi'

// import { WagmiAbi} from '../wagmiAbi'
import  { useState } from 'react';

//  export default function WriteContract()
// {
//     const { writeContract } = useWriteContract();
//     try {
//         const formattedMilestones = milestones.map((milestone) => ({
//           description: milestone.description,
//           paymentAmount: ethers.utils.parseEther(milestone.paymentAmount.toString()), // Convert to wei
//           dueDate: new Date(milestone.dueDate).getTime(),
//           startDate: new Date(milestone.startDate).getTime(),
//         }));
  
//         const tx = writeContract({
//           functionName: 'createProject',
//           args: [
//             data.description,
//             ethers.utils.parseEther(data.budget.toString()), // Convert to wei
//             0, // initial balance
//             data.contractorAddress,
//             new Date(data.startDate).getTime(),
//             new Date(data.endDate).getTime(),
//             formattedMilestones,
//           ],
//         });
  
//         console.log('Transaction sent:', tx.hash);
//         await tx.wait();
//         console.log('Transaction confirmed:', tx.hash);
//       } catch (error) {
//         console.error('Error submitting transaction:', error);
//       }
    
//     }


function WriteContract({ data, milestones }) {
    const [loading, setLoading] = useState(false);
    
    const { writeAsync } = useContractWrite({
      address: '0xabDe84F6FfC9f44C978bD9dA76319316EeeA01BB',
      abi: WagmiAbi,
      functionName: 'createProject',
    });
  
    const handleWrite = async () => {
      try {
        setLoading(true);
        const formattedMilestones = milestones.map((milestone) => ({
          description: milestone.description,
          paymentAmount: ethers.utils.parseEther(milestone.paymentAmount.toString()), // Convert to wei
          dueDate: Math.floor(new Date(milestone.dueDate).getTime() / 1000), // Convert to Unix timestamp
          startDate: Math.floor(new Date(milestone.startDate).getTime() / 1000), // Convert to Unix timestamp
        }));
  
        const args = [
          data.description,
          ethers.utils.parseEther(data.budget.toString()), // Budget in wei
          0, // Initial balance
          data.contractorAddress,
          Math.floor(new Date(data.startDate).getTime() / 1000), // Unix timestamp
          Math.floor(new Date(data.endDate).getTime() / 1000), // Unix timestamp
          formattedMilestones,
        ];
  
        const tx = await writeAsync({ args });
        console.log('Transaction sent:', tx.hash);
  
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt.transactionHash);
      } catch (error) {
        console.error('Error submitting transaction:', error);
      } finally {
        setLoading(false);
      }
    };
}  