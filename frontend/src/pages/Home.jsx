import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { FiArrowRight, FiTrendingUp, FiShield, FiUsers, FiZap } from "react-icons/fi";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();
  const { isConnected } = useAppKitAccount();

  const handleButtonClick = (path) => {
    if (!isConnected) {
      toast.error("Please connect your wallet to proceed!", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      navigate(path);
    }
  };

  const features = [
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Transparent & Secure",
      description: "Blockchain-backed contracts ensure complete transparency and immutability of all transactions."
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: "Real-time Tracking",
      description: "Monitor project progress, milestones, and payments in real-time with live updates."
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Seamless Collaboration",
      description: "Connect agencies, contractors, and stakeholders on a unified platform."
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: "Instant Payments",
      description: "Automated milestone-based payments with ERC20 token integration."
    }
  ];

  const stats = [
    { number: "100%", label: "Transparent" },
    { number: "24/7", label: "Available" },
    { number: "0ms", label: "Latency" },
    { number: "∞", label: "Scalable" }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-screen">
      <ToastContainer />
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
                className="group px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start as Contractor
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleButtonClick("/agency-dashboard")}
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-lg border border-slate-700 hover:border-green-500/50 hover:bg-slate-700/50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start as Agency
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6 text-center hover:border-green-500/30 transition-colors">
                <div className="text-3xl font-bold text-green-400 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg">Everything you need for seamless contract management</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
              >
                <div className="text-green-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Simple, transparent, and efficient</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Register", desc: "Contractors register with verification documents" },
              { step: "2", title: "Create Projects", desc: "Agencies create and fund projects on-chain" },
              { step: "3", title: "Complete & Earn", desc: "Submit milestones and receive instant payments" }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white text-center mb-2">{item.title}</h3>
                <p className="text-gray-400 text-center text-sm">{item.desc}</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-6 -right-4 text-green-500/30">
                    <FiArrowRight className="w-8 h-8" />
                  </div>
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
