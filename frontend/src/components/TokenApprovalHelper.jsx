import { useState } from 'react';
import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
];

export const TokenApprovalHelper = ({ tokenAddress, spenderAddress, requiredAmount, onApprovalComplete }) => {
  const { address } = useAccount();
  const [isApproving, setIsApproving] = useState(false);

  const { data: allowance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address, spenderAddress],
    enabled: !!address && !!tokenAddress && !!spenderAddress,
  });

  const { writeContract, isPending } = useWriteContract();

  const handleApprove = async () => {
    if (!tokenAddress || !spenderAddress) {
      toast.error('Token or spender address not configured');
      return;
    }

    try {
      setIsApproving(true);
      const approvalAmount = BigInt(requiredAmount) * BigInt(2); // Approve 2x for safety

      writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spenderAddress, approvalAmount],
      });

      toast.success('Approval transaction submitted!');
      setTimeout(() => {
        onApprovalComplete?.();
        setIsApproving(false);
      }, 3000);
    } catch (err) {
      toast.error(`Approval failed: ${err.message}`);
      setIsApproving(false);
    }
  };

  const hasAllowance = allowance && BigInt(allowance) >= BigInt(requiredAmount);

  if (hasAllowance) {
    return (
      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 flex items-center gap-3">
        <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm">Token approval confirmed. Ready to proceed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 flex items-start gap-3">
        <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-sm">Token Approval Required</p>
          <p className="text-xs opacity-75 mt-1">
            You need to approve the contract to spend tokens on your behalf.
          </p>
        </div>
      </div>
      <button
        onClick={handleApprove}
        disabled={isApproving || isPending}
        className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
      >
        {isApproving || isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Approving...
          </>
        ) : (
          'Approve Tokens'
        )}
      </button>
    </div>
  );
};
