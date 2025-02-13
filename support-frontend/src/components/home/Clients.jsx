import React from "react";

const Clients = () => {
  return (
    <div className="flex-1 overflow-y-scroll md:overflow-y-hidden flex flex-col p-3 w-full">
      {/* <ChipNav chips={chipData} baseUrl="/purchases" /> */}
      <div className="flex-1 flex w-full flex-col md:flex-row gap-3 overflow-y-auto ">
        <div className="flex-1 max-sm:min-h-fit overflow-y-scroll">
          {/* <Outlet /> */}
          Clients
        </div>
      </div>
    </div>
  );
};

export default Clients;
