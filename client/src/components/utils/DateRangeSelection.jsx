import React from "react";

const DateRangeSelection = ({
  dateRange = {
    startDate: "",
    endDate: "",
  },
  setDateRange = () => {},
}) => {
  const [selectedRange, setSelectedRange] = React.useState("");
  const handleDropdownChange = (value) => {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset();

    let startDate, endDate;

    today.setHours(0, 0, 0, 0);
    today.setMinutes(today.getMinutes() - timezoneOffset);

    switch (value) {
      case "today":
        startDate = endDate = today.toISOString().split("T")[0];
        break;
      case "thisWeek":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setMinutes(weekStart.getMinutes() - timezoneOffset);
        startDate = weekStart.toISOString().split("T")[0];
        endDate = today.toISOString().split("T")[0];
        break;
      case "thisMonth":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        monthStart.setHours(0, 0, 0, 0);
        monthStart.setMinutes(monthStart.getMinutes() - timezoneOffset);
        startDate = monthStart.toISOString().split("T")[0];
        endDate = today.toISOString().split("T")[0];
        break;
      case "thisYear":
        const yearStart = new Date(today.getFullYear(), 0, 1);
        yearStart.setHours(0, 0, 0, 0);
        yearStart.setMinutes(yearStart.getMinutes() - timezoneOffset);
        startDate = yearStart.toISOString().split("T")[0];
        endDate = today.toISOString().split("T")[0];
        break;
      default:
        startDate = endDate = "";
    }

    setSelectedRange(value);
    setDateRange({ startDate, endDate });
  };

  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSelectedRange("");
  };

  return (
    <div className="flex max-md:flex-col max-md:gap-2 w-full justify-between mt-2 no-print text-xs">
      <div className="flex-1">
        <label
          htmlFor="rangeSelect"
          className="block font-medium text-[var(--color-text-light)]"
        >
          Date Range
        </label>
        <select
          id="rangeSelect"
          value={selectedRange}
          onChange={(e) => handleDropdownChange(e.target.value)}
          className="mt-1 block rounded-md shadow-sm bg-transparent p-2 border border-neutral-500/50 outline-none w-full md:w-2/3"
        >
          <option value="" className="!bg-[var(--color-card)]" disabled>
            Select a range
          </option>
          <option value="today" className="!bg-[var(--color-card)]">
            Today
          </option>
          <option value="thisWeek" className="!bg-[var(--color-card)]">
            This Week
          </option>
          <option value="thisMonth" className="!bg-[var(--color-card)]">
            This Month
          </option>
          <option value="thisYear" className="!bg-[var(--color-card)]">
            This Year
          </option>
        </select>
      </div>
      <div className="flex gap-2 tab:gap-4 flex-1">
        <div className="w-1/2">
          <label
            htmlFor="startDate"
            className="block text-[var(--color-text-light)]"
          >
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            className="mt-1 block text-xs w-full rounded-md shadow-sm bg-transparent p-2 border border-neutral-500/50 outline-none"
            value={dateRange.startDate}
            onChange={(e) => handleDateChange("startDate", e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="endDate"
            className="block text-[var(--color-text-light)]"
          >
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            className="mt-1 block text-xs w-full rounded-md shadow-sm bg-transparent p-2 border border-neutral-500/50 outline-none"
            value={dateRange.endDate}
            onChange={(e) => handleDateChange("endDate", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelection;
