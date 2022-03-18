import React from "react";

const PlayingIcon = () => {
  return (
    <div className="w-full aspect-square flex items-end justify-between">
      {[...Array(5).keys()].map((i) => (
        <span
          key={i}
          className={`w-0.5 bg-emerald-500 animate-[equalize_2s_linear_alternate_infinite]`}
          style={{ animationDelay: `${-1.9 - i}s` }}
        />
      ))}
    </div>
  );
};

export default PlayingIcon;
