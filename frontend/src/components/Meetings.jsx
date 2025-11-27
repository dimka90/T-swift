function Meeting() {
    return (
      <div>
        <h2 className="text-[20px] font-semibold">Meetings</h2>
        <div className="bg-white p-2 rounded-2xl">
          <div>
            <h3 className="font-semibold">Stand-up meeting</h3>
            <div className="flex gap-2">
              <p className="leading-6 text-[#666666] text-sm">
                Sorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <div className="text-sm">
                <p className="font-bold text-[#475467]">06/08/2024</p>
                <p className="text-center font-bold text-[#475467]">9:00am</p>
                <button className="text-[#01644C] text-[14px]">Reschedule</button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Stand-up meeting</h3>
            <div className="flex gap-2">
              <p className="leading-6 text-[#666666] text-sm">
                Sorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <div className="text-sm">
                <p className="font-bold text-[#475467]">06/08/2024</p>
                <p className="text-center font-bold text-[#475467]">9:00am</p>
                <button className="text-slate-900 text-[14px]">Reschedule</button>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button className="bg-gradient-to-r from-slate-600 to-slate-900 rounded-3xl py-2 px-5 text-[14px] text-white">
              Schedule a meeting
            </button>
            <button className="text-slate-900 text-[14px]">See all</button>
          </div>
        </div>
      </div>
    );
  }
  
  export default Meeting;
  