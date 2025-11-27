import image3 from "../assets/image3.png";

function WelcomeCard() {

  const currentDate = new Date();

  // Options for formatting the date
  const options = { year: "numeric", month: "long", day: "numeric" };

  // Format the date
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  return (
    <div className="w-full">
      <div className="bg-gradient-to-r  from-slate-600 to-slate-900 text-white flex px-3 rounded-lg mb-1">
        <div className="flex flex-col mt-5">
          <p className="text-sm opacity-75">{formattedDate}</p>
          <p className="text-[20px] font-semibold">Welcome back!</p>
          <p className="text-sm opacity-75">Stay updated in your Contractor portal</p>
        </div>
        <div>
          <img src={image3} alt="" />
        </div>
      </div>
      <div className="bg-gradient-to-r  from-slate-600 to-slate-900 text-white flex justify-between  py-2 px-3 rounded-lg">
        <div className="flex flex-col gap-1 mt-5 mb-2">
          <p className="text-[15px] font-semibold">Available Balance</p>
          <p className="text-[15px] font-semibold">0<span className="opacity-75"> LSK</span></p>
        </div>
        <div className="self-end mb-4">
          <button className="bg-gradient-to-r  from-slate-600 to-slate-900 border rounded-3xl py-2.5 px-7 text-[14px]">Withdraw</button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeCard;
