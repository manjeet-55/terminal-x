import React, { useRef, useEffect, useState } from 'react';
import './InputBox.css'; // Use a separate CSS file for styling

const InputBox = ({ onEnter }) => {
  const inputRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
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
        const transcript = event.results[0][0].transcript;
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
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (onEnter) {
          onEnter(inputRef.current.value);
        }
        inputRef.current.value = '';
      }
    };

    const inputBox = inputRef.current;
    inputBox.addEventListener('keydown', handleKeyDown);

    return () => {
      inputBox.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEnter]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="w-full bg-black/90  p-[18px] px-5 pr-8 flex justify-between items-center">
      <input
        type="text"
        ref={inputRef}
        placeholder="Enter command and press Enter"
        className='bg-transparent w-[100%] outline-none text-white/80 placeholder:text-white/70 break-all'
      />
      <button
        onClick={() => {
          if (isListening) {
            stopListening();
          } else {
            startListening();
          }
        }}
        className={"text-white/90"}
      >
        {isListening ? 'Stop' : 'Mic'}
      </button>
    </div>
  );
};

export default InputBox;
