import { useNavigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();
  const { isConnected } = useAppKitAccount();

  const handleButtonClick = (path) => {
    if (!isConnected) {
      alert("Please connect your wallet to proceed!");
      return;
    }
    navigate(path);
  };

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
              <span className="text-green-400 text-sm font-semibold">🚀 Powered by Blockchain</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Decentralized <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Procurement</span> Reimagined
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Transform government contracts with transparency, accountability, and trust. From project creation to completion, every milestone is recorded on-chain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleButtonClick("/dashboard")}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
              >
                Start as Contractor
              </button>
              <button
                onClick={() => handleButtonClick("/agency-dashboard")}
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-lg border border-slate-700 hover:border-green-500/50 hover:bg-slate-700/50 transition-all duration-300"
              >
                Start as Agency
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-y border-slate-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Procurement?</h2>
          <p className="text-gray-300 text-lg mb-8">Join the future of transparent, blockchain-based contract management</p>
          <button
            onClick={() => handleButtonClick("/dashboard")}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
          >
            Get Started Now
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

export default Home;
