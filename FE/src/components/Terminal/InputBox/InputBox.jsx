import React, { useRef, useEffect, useState } from 'react';
import './InputBox.css'; // Use a separate CSS file for styling
import Button from '../../Button';

const InputBox = ({ onSend, currentTerminal, commandOutput = [] }) => {
  const inputRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize SpeechRecognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      recognitionRef.current = 'SpeechRecognition' in window
        ? new SpeechRecognition()
        : new webkitSpeechRecognition();

      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.continuous = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        if (inputRef.current) {
          inputRef.current.value = transcript;
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('SpeechRecognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Automatically execute the command after stopping
        if (inputRef.current && onSend) {
          onSend(inputRef.current.value, currentTerminal);
          inputRef.current.value = ''; // Clear input after sending
        }
      };
    } else {
      console.warn('SpeechRecognition not supported in this browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
      }
    };
  }, [onSend, currentTerminal]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (onSend) {
          onSend(inputRef.current.value, currentTerminal);
          inputRef.current.value = ''; // Clear input after sending
        }
      }
    };

    const inputBox = inputRef.current;
    inputBox.addEventListener('keydown', handleKeyDown);

    return () => {
      inputBox.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSend, currentTerminal]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleProcessClick = () => {
    if (onSend) {
      // Execute the command
      onSend('ps -a', currentTerminal);

      // Display the modal after a delay
      setTimeout(() => {
        setShowModal(true);
      }, 1000); // 1-second delay
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="w-[100%] rounded-md bg-black/90 p-[10px] px-5 pr-8 flex justify-between items-center">
      <input
        type="text"
        ref={inputRef}
        placeholder="Enter command and press Enter"
        className="bg-gray-800 rounded-xl mr-2 p-[8px] w-[100%] outline-none text-white/80 placeholder:text-white/70 break-all"
        aria-label="Command input box"
      />

      <Button
        onClick={handleProcessClick}
        variant="primary"
      >
        Process
      </Button>

      <Button
        onClick={() => {
          if (isListening) {
            stopListening();
          } else {
            startListening();
          }
        }}
        variant="secondary"
      >
        {isListening ? 'Stop' : 'Mic'}
      </Button>

      {/* Modal for displaying the command output */}
      {showModal && (
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
                {commandOutput.map((process, index) => (
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
              onClick={closeModal}
              variant="secondary"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputBox;
