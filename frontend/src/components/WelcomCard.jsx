function WelcomeCard() {
  const currentDate = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  return (
    <div className="w-full space-y-4">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 text-white rounded-lg p-6 backdrop-blur-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-400 mb-2">{formattedDate}</p>
            <h2 className="text-3xl font-bold mb-2">Welcome back! 👋</h2>
            <p className="text-gray-300">Stay updated in your Contractor portal</p>
          </div>
          <div className="text-5xl">🏗️</div>
        </div>
      </div>

      {/* Balance Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm mb-2">Available Balance</p>
            <p className="text-3xl font-bold text-green-400">0 <span className="text-lg text-gray-400">LSK</span></p>
          </div>
          <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-green-500/50">
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeCard;
