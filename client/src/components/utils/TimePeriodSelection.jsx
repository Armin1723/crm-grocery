import React from "react";

const timePeriods = [
    {
        label: "Today",
        value: "day",
    },
    {
        label: "This Week",
        value: "week",
    },
    {
        label: "This Month",
        value: "month",
    },
    {
        label: "This Year",
        value: "year",
    },
]

const TimePeriodSelection = ({ timePeriod, setTimePeriod }) => {
  return (
    <div className="my-2">
      <select
        name="timePeriod"
        className={`w-fit max-w-[200px] border border-neutral-500/50 text-[var(--color-text-light)] rounded-md bg-transparent outline-none p-2 px-3 cursor-pointer`}
        onChange={(e) => setTimePeriod(e.target.value)}
      >
        <option value="" className="!bg-[var(--color-card)]">
          {"Select duration"}
        </option>
        {timePeriods.map((time) => (
          <option
            key={time.label}
            value={time.value}
            className="!bg-[var(--color-card)]"
          >
            {time.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimePeriodSelection;