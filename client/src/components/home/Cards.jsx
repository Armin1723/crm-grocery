import React from "react";
import Card from "./Card";
import { FaChartLine, FaShoppingCart } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { BsInboxesFill } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";

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

  const { data: stats, isFetching: loading} = useQuery({
    queryKey: ["cardStats"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/stats`,{
        credentials: 'include',
      });
      const data = await response.json();
      return data.stats;
    },
    staleTime: 1000 * 60 * 5,
  })
  
  return (
    <div className="cards-page flex flex-col gap-2 mt-2 w-full">
      <div
        className={`transition-all duration-500 ease-in-out max-w-screen overflow-hidden flex items-center overflow-x-scroll snap-x snap-mandatory hide-scrollbar my-2 select-none`}
      >
        {cardsData.map((item, index) => {
          const chartData = stats ? stats[item?.title?.toLowerCase()] : [];
          return <Card data={item} key={index} chartData={chartData} index={index} />;
        })}

      </div>
    </div>
  );
};

export default Cards;
