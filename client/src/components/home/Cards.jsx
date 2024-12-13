import React, { useEffect, useState } from "react";
import Card from "./Card";
import { FaChartLine, FaShoppingCart } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { BsInboxesFill } from "react-icons/bs";
import { GoChevronDown } from "react-icons/go";

const Cards = () => {
  const cardsData = [
    {
      title: "Sales",
      icon: FaChartLine,
      count: 100,
      color: "darkCyan",
      to: "/sales",
      increase: 43,
    },
    {
      title: "Purchases",
      icon: FaShoppingCart,
      count: 100,
      color: "seaGreen",
      to: "/purchases",
      increase: 43,
    },
    {
      title: "Products",
      icon: AiFillProduct,
      count: 300,
      color: "rebeccaPurple",
      to: "/products",
      increase: -12,
    },
    {
      title: "Inventory",
      icon: BsInboxesFill,
      count: 500,
      color: "darkOrange",
      to: "/inventory",
      increase: 23,
    },
  ];

  const [expanded, setExpanded] = useState(true);

  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () =>{
    try{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/stats`);
      if(response.ok){
        const data = await response.json();
        setStats(data.stats);
      }else{
        const data = await response.json();
        throw new Error(data.message || 'Something went wrong');
      }
    }catch(err){
      console.log(err);
    }
  }
  fetchStats();
  },[]);
  
  return (
    <div className="cards-page flex flex-col gap-2 my-2 w-full">
      <div
        className={` ${
          expanded ? "max-h-screen" : "max-h-0 "
        } transition-all duration-500 ease-in-out max-w-screen overflow-hidden flex items-center overflow-x-scroll snap-x snap-mandatory hide-scrollbar my-2 select-none`}
      >
        {cardsData.map((item, index) => {
          const chartData = stats ? stats[item?.title?.toLowerCase()] : [];
          return <Card data={item} key={index} chartData={chartData} index={index} />;
        })}

      </div>
      <div className="border-t border-neutral-500/50 relative">
        <div
          onClick={() => setExpanded((prev) => !prev)}
          className={`absolute right-4 -translate-y-1/2 p-1 rounded-full bg-[var(--color-sidebar)] border-2 border-neutral-500/50 flex items-center justify-center transition-all duration-600 ease-in-out cursor-pointer ${
            expanded ? "rotate-180" : ""
          }`}
        >
          <GoChevronDown title="Show Cards"/>
        </div>
      </div>
    </div>
  );
};

export default Cards;
