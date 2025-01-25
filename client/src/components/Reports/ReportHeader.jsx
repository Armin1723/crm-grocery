import { FaPrint, FaFileDownload } from "react-icons/fa";
import { formatDate } from "../utils";
import { useReport } from "../../context/ReportContext";

const ReportHeader = ({
  title = "",
  printRef = {},
  handleDownload = () => {},
}) => {
  const { dateRange, setDateRange, selectedRange, setSelectedRange } =
    useReport();

  const handleDropdownChange = (value) => {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset();

    let startDate, endDate;

    // Reset the time to midnight (00:00:00)
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

  const handlePrint = () => {
    if (printRef.current) {
      let printContents = printRef.current.innerHTML;
      const printWindow = window.open("", "_blank");

      const tailwindCSSStyles = document.querySelector(
        'link[rel="stylesheet"]'
      )?.href;

      // List of classnames you want to omit
      const classesToRemove = [
        "overflow-x-auto",
        "overflow-y-auto",
        "overflow-hidden",
        "max-h-[60vh]",
        "sticky",
        "shadow",
      ];

      // Dynamically remove these classnames from the HTML
      classesToRemove.forEach((className) => {
        const regex = new RegExp(`\\b${className}\\b`, "g"); // Match the class exactly
        printContents = printContents.replace(regex, ""); // Remove it
      });

      // Get the compiled Tailwind CSS styles (from a built file)
      const tailwindCSS =
        document.querySelector("style[data-vite-dev-id]")?.innerHTML || "";

      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>${title} Report - Grocery CRM - ${
        formatDate(dateRange?.startDate) +
        " to " +
        formatDate(dateRange?.endDate)
      }</title>
          <link rel="stylesheet" href="${tailwindCSSStyles}" />
            <style>
            ${tailwindCSS}

            /* General print styles */
            @media print {
              body {
                margin: 0.5in;
                font-family: 'Outfit', sans-serif;
              }

              /* Ensure no page breaks inside the table */
              table {
                border-collapse: collapse;
              }

              tr, th, td {
                page-break-inside: avoid; /* Prevent rows from breaking in the middle */
              }

              /* For multi-page tables */
              table, thead, tbody {
                page-break-inside: auto; /* Allows table to span multiple pages */
              }

              /* Space between pages */
              .page {
                page-break-after: always;
                margin-bottom: 1in;
              }

              /* no-print class */
              .no-print, body button {
                display: none;
              }
            }
          </style>
          </head>
          <body onload="window.print(); window.close();">
            <header class="bg-[var(--color-card)] rounded-lg flex flex-col gap-2 items-center">
              <img src="/logo.png" alt="Grocery CRM" loading={lazy} class="h-16" />
              <h1 class="text-xl md
              :text-2xl lg:text-3xl font-bold capitalize">${title} Report - Grocery</h1>
              <p>Generated on: ${new Date().toLocaleString()}</p>
              <p>Date Range: ${
                formatDate(dateRange?.startDate) +
                " to " +
                formatDate(dateRange?.endDate)
              }</p>
            </header>

            ${printContents}
            
            <footer class="w-full flex flex-col items-center justify-center gap-2 mt-4">
              <p class="text-center text-xs italic text-[var(--color-text-light)]">
                End of Report
              </p>
              <hr class="text-[var(--color-text)]" />
            </footer>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <header className="bg-[var(--color-card)] text-xs md:text-sm rounded-lg p-4 max-sm:p-2 sticky -top-3 md:top-0 z-[20] no-print">
      <div className="flex justify-between items-center ">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold capitalize">
          {title} Report
        </h1>
        <div className="space-x-4">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-1.5 gap-2 bg-gradient-to-br from-blue-800/80 to-blue-500/80 text-white rounded-lg hover:bg-gradient-to-b transition-colors"
          >
            <FaPrint className="" />
            <span className="max-md:hidden">Print Report</span>
          </button>
          {handleDownload && (
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-1.5 gap-2 bg-gradient-to-br from-green-800/80 to-green-500/80 text-white rounded-lg hover:bg-gradient-to-b transition-colors"
            >
              <FaFileDownload className="" />
              <span className="max-md:hidden">Download CSV</span>
            </button>
          )}
        </div>
      </div>
      <div className="flex max-md:flex-col max-md:gap-2 w-full justify-between mt-4 no-print">
        <div className="flex-1">
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
