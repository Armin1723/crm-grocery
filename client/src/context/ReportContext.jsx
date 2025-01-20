import { createContext, useContext, useState } from "react";

const ReportContext = createContext();

export const useReport = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
  });

  const [selectedRange, setSelectedRange] = useState("");

  const value = {
    dateRange,
    setDateRange,
    selectedRange,
    setSelectedRange,
  };
  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  );
};
