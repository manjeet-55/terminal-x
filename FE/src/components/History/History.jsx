// import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "../Button";

const History = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [processList, setProcessList] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);


  const toggleHistoryPopup = () => {
    setIsHistoryOpen((prev) => !prev);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  useEffect(() => {
    const savedCommandHistory =
      JSON.parse(localStorage.getItem("commandHistory")) || [];
    setCommandHistory(savedCommandHistory);
  }, []);

  const filteredCommandHistory = commandHistory.filter((entry) => {
    if (!selectedDate) return true;
    const entryDate = new Date(entry.timestamp);
    const selected = new Date(selectedDate);
    return (
      entryDate.getFullYear() === selected.getFullYear() &&
      entryDate.getMonth() === selected.getMonth() &&
      entryDate.getDate() === selected.getDate()
    );
  });

  const clearHistory = () => {
    localStorage.removeItem("commandHistory");
    setCommandHistory([]);
  };

  const fetchProcesses = async () => {
    try {
      const response = await fetch("/api/processes");
      const processes = await response.json();
      setProcessList(processes);
    } catch (error) {
      console.error("Error fetching processes:", error);
    }
  };

  const toggleProcessPopup = async () => {
    setIsProcessOpen((prev) => !prev);
    if (!isProcessOpen) {
      await fetchProcesses();
    }
  };

  const clearProcessList = () => {
    setProcessList([]);
  };

  
  return (
    <>
      <div className="bg-gray-800 px-4 py-4">
        <div className="flex flex-row justify-end gap-x-4">
        <Button
            onClick={toggleHistoryPopup}
            variant="primary"
          >History
            </Button>
            <Button
            onClick={toggleProcessPopup}
            variant="primary"
          >Process
            </Button>
        
         
        </div>
      </div>
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Command History</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
            />
            <div className="max-h-60 overflow-y-auto">
              {filteredCommandHistory.length > 0 ? (
                filteredCommandHistory.map((entry, index) => (
                  <div
                    key={index}
                    className="p-2 bg-gray-100 rounded-lg shadow-sm"
                  >
                    <p className="text-gray-700">{entry.command}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">
                  No commands for selected date
                </div>
              )}
            </div>
            
            <Button
                onClick={clearHistory}
                variant="secondary"
                >Clear History
            </Button>
           
             <Button
                onClick={toggleHistoryPopup}
                variant="primary"
                >Close
            </Button>
          </div>
        </div>
      )}

      {/* Process Popup */}
      {isProcessOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Running Processes</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Process ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Port
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processList.map((process, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {process.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {process.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {process.port}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {process.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button
              onClick={clearProcessList}
              variant="secondary"
              > Clear Processes
            </Button>
           
            
            <Button
              onClick={toggleProcessPopup}
              variant="primary"
              >Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default History;
