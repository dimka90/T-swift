import { useNavigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();
  const { isConnected } = useAppKitAccount();

  const handleButtonClick = (path) => {
    if (!isConnected) {
      toast.error("Please connect your wallet to proceed!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    navigate(path);
  };

  const features = [
    {
      title: "Transparent",
      description: "Blockchain-backed contracts ensure complete transparency",
      icon: "🔍"
    },
    {
      title: "Secure",
      description: "Military-grade encryption and smart contract security",
      icon: "🔒"
    },
    {
      title: "Fast",
      description: "Instant milestone tracking and payment processing",
      icon: "⚡"
    },
    {
      title: "Scalable",
      description: "Handle projects of any size with ease",
      icon: "📈"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-screen">
      <ToastContainer />
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-4 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full hover:border-green-500/60 transition-colors duration-300">
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
                className="group px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Start as Contractor
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button
                onClick={() => handleButtonClick("/agency-dashboard")}
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-lg border border-slate-700 hover:border-green-500/50 hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-105"
              >
                Start as Agency
                <span className="inline-block ml-2">→</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              { number: "100%", label: "Transparent" },
              { number: "24/7", label: "Available" },
              { number: "0ms", label: "Latency" },
              { number: "∞", label: "Scalable" }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6 text-center hover:border-green-500/30 transition-all duration-300 transform hover:scale-105 hover:bg-slate-800/70"
              >
                <div className="text-3xl font-bold text-green-400 mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Tswift?</h2>
            <p className="text-gray-400 text-lg">Enterprise-grade procurement management powered by blockchain</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-8 hover:border-green-500/30 transition-all duration-300 transform hover:scale-105 hover:bg-slate-800/70 group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Register", desc: "Agencies and contractors register with verified credentials" },
              { step: "2", title: "Create Projects", desc: "Agencies create and assign projects to contractors" },
              { step: "3", title: "Track & Complete", desc: "Monitor milestones and process payments on-chain" }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-8 hover:border-green-500/30 transition-all duration-300 transform hover:scale-105 hover:bg-slate-800/70">
                  <div className="text-5xl font-bold text-green-500/20 mb-4 group-hover:text-green-500/40 transition-colors">{item.step}</div>
                  <h3 className="text-2xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-center text-sm">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-green-500/30 text-2xl">→</div>
                )}
              </div>
            ))}
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
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Home;
