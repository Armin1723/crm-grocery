import { useState } from "react";
import { FaPrint, FaFileDownload } from "react-icons/fa";

const ReportHeader = ({
  onPrint = () => {},
  onDownload = () => {}, 
  title = "",
  dateRange= {},
  setDateRange = () => {},
}) => {
  const [selectedRange, setSelectedRange] = useState("");

  const handleDropdownChange = (value) => {
    const today = new Date();
    let startDate, endDate;

    switch (value) {
      case "today":
        startDate = endDate = today.toISOString().split("T")[0];
        break;
      case "thisWeek":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        startDate = weekStart.toISOString().split("T")[0];
        endDate = today.toISOString().split("T")[0];
        break;
      case "thisMonth":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate = monthStart.toISOString().split("T")[0];
        endDate = today.toISOString().split("T")[0];
        break;
      case "thisYear":
        const yearStart = new Date(today.getFullYear(), 0, 1);
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
    <header className="bg-[var(--color-card)] rounded-lg p-6 sticky top-0 z-[20]">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{title}</h1>
        <div className="space-x-4">
          <button
            onClick={onPrint}
            className="inline-flex items-center px-3 py-1.5 gap-2 bg-gradient-to-br from-blue-800/80 to-blue-500/80 text-white rounded-lg hover:bg-gradient-to-b transition-colors"
          >
            <FaPrint className="" />
            <span className="max-md:hidden">Print Report</span>
          </button>
          <button
            onClick={onDownload}
            className="inline-flex items-center px-3 py-1.5 gap-2 bg-gradient-to-br from-green-800/80 to-green-500/80 text-white rounded-lg hover:bg-gradient-to-b transition-colors"
          >
            <FaFileDownload className="" />
            <span className="max-md:hidden">Download CSV</span>
          </button>
        </div>
      </div>
      <div className="flex max-md:flex-col max-md:gap-2 w-full justify-between mt-4">
        <div className="flex-1 ">
          <label
            htmlFor="rangeSelect"
            className="block text-sm font-medium text-[var(--color-text-light)]"
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
            <option value="today" className="!bg-[var(--color-card)]">Today</option>
            <option value="thisWeek" className="!bg-[var(--color-card)]">This Week</option>
            <option value="thisMonth" className="!bg-[var(--color-card)]">This Month</option>
            <option value="thisYear" className="!bg-[var(--color-card)]">This Year</option>
          </select>
        </div>
        <div className="flex gap-4 flex-1">
          <div className="flex-1">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-[var(--color-text-light)]"
            >
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              className="mt-1 block w-full rounded-md shadow-sm bg-transparent p-2 border border-neutral-500/50 outline-none"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange("startDate", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-[var(--color-text-light)]"
            >
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              className="mt-1 block w-full rounded-md shadow-sm bg-transparent p-2 border border-neutral-500/50 outline-none"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange("endDate", e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ReportHeader;
