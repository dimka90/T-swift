import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-toastify';

export const useContractInteraction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);

  const { data: transactionData, writeContract, isPending: isWriting } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: transactionData?.hash,
  });

  const executeTransaction = useCallback(
    async (contractConfig, functionName, args, onSuccess) => {
      try {
        setIsLoading(true);
        setError(null);

        writeContract({
          ...contractConfig,
          functionName,
          args,
        });

        toast.info('Transaction submitted. Awaiting confirmation...', {
          position: 'top-right',
          autoClose: 5000,
        });

        setTxHash(transactionData?.hash);
      } catch (err) {
        const errorMessage = err?.message || 'Transaction failed';
        setError(errorMessage);
        toast.error(`Error: ${errorMessage}`, {
          position: 'top-right',
          autoClose: 5000,
        });
        setIsLoading(false);
      }
    },
    [writeContract, transactionData?.hash]
  );

  return {
    isLoading: isLoading || isWriting || isConfirming,
    error,
    txHash,
    isConfirmed,
    isConfirming,
    isWriting,
    executeTransaction,
  };
};
