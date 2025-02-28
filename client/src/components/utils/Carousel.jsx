import React, { useRef, useState, useEffect } from "react";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

const Carousel = ({
  items,
  renderItem,
  loadMore = () => {},
  hasMore = false,
  loading = false,
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [items]);
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction * 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Left Button */}
      {canScrollLeft && (
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-e-lg bg-neutral-500/50"
          onClick={() => scroll(-1)}
        >
          <FaChevronCircleLeft size={24} />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex w-full overflow-x-auto scroll-snap snap-x snap-mandatory scrollbar-hide items-stretch "
        onScroll={checkScroll}
      >
        {items?.length === 0 && <p className="p-4">No items found</p>}

        {items?.map((item, index) => (
          <div
            key={index}
            className="flex flex-col min-w-full w-full md:w-1/2 md:min-w-[50%] xl:w-1/3 xl:min-w-[33%] rounded-md p-2 snap-start min-h-full items-stretch flex-shrink-0"
          >
            {renderItem(item)}
          </div>
        ))}
        {hasMore && (
          <div className="flex flex-col min-w-full w-full md:w-1/2 md:min-w-[50%] xl:w-1/3 xl:min-w-[33%] rounded-md px-4 py-2 snap-start min-h-full flex-shrink-0">
            <div className="flex justify-center items-center h-full w-full p-4 mb-4 rounded-md border-neutral-500/50 ">
              <button
                onClick={loadMore}
                className="text-accent hover:text-accentDark"
              >
                {loading ? <div className="spinner"></div> : "Load More"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Button */}
      {canScrollRight && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-s-lg bg-neutral-500/50"
          onClick={() => scroll(1)}
        >
          <FaChevronCircleRight size={24} />
        </button>
      )}
    </div>
  );
};

export default Carousel;
