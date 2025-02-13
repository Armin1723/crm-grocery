import React from "react";

const Avatar = ({
  image,
  width = 24,
  fallbackImage = "",
  alt = "avatar",
  withBorder = true,
}) => {
  return (
    <img
      src={image || fallbackImage || "https://github.com/shadcn.png"}
      alt={alt}
      loading="lazy"
      style={{
        width: `${width}px`,
      }}
      className={` bg-[var(--bg-primary)] max-sm:w-8 aspect-square rounded-full ${
        withBorder && "border"
      } border-neutral-500 shadow-md object-contain`}
    />
  );
};

export default Avatar;
