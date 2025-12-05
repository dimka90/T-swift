import { FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';

export const TransactionStatus = ({ isConfirming, isConfirmed, error, txHash }) => {
  if (!isConfirming && !isConfirmed && !error) return null;

  return (
    <div className="space-y-3">
      {isConfirming && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-400 flex items-center gap-3 animate-pulse">
          <FiClock className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Transaction Confirming</p>
            <p className="text-xs opacity-75">Please wait while your transaction is being processed...</p>
          </div>
        </div>
      )}

      {isConfirmed && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 flex items-center gap-3">
          <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Transaction Confirmed!</p>
            {txHash && (
              <p className="text-xs opacity-75 font-mono break-all">
                Hash: {txHash.slice(0, 20)}...
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Transaction Failed</p>
            <p className="text-xs opacity-75 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};
