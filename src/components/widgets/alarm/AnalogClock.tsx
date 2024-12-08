import React from 'react';
import { Keyboard } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalogClockProps {
  mode: 'hour' | 'minute';
  value: number;
  onChange: (value: number) => void;
  onSwitchMode: () => void;
}

export default function AnalogClock({ mode, value, onChange, onSwitchMode }: AnalogClockProps) {
  const getNumbers = () => {
    if (mode === 'hour') {
      return Array.from({ length: 12 }, (_, i) => i + 1);
    } else {
      return Array.from({ length: 12 }, (_, i) => i * 5);
    }
  };

  const getHandRotation = () => {
    if (mode === 'hour') {
      // For hours, each number represents 30 degrees (360/12)
      // Subtract 90 to start from 12 o'clock position
      return (value - 3) * 30;
    } else {
      // For minutes, each minute represents 6 degrees (360/60)
      // Subtract 90 to start from 12 o'clock position
      return (value / 5 - 3) * 30;
    }
  };

  const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    // Calculate angle from center
    let angle = Math.atan2(y, x) * 180 / Math.PI + 90;
    if (angle < 0) angle += 360;

    if (mode === 'hour') {
      // Convert angle to hour (1-12)
      let hour = Math.round(angle / 30);
      if (hour === 0) hour = 12;
      if (hour > 12) hour = 1;
      onChange(hour);
    } else {
      // Convert angle to minutes (0-55, step 5)
      let minute = Math.round(angle / 6);
      if (minute === 60) minute = 0;
      minute = Math.round(minute / 5) * 5;
      onChange(minute);
    }
  };

  return (
    <div className="relative w-64 h-64 mx-auto">
      <div 
        className="absolute inset-0 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 cursor-pointer"
        onClick={handleClockClick}
      >
        {getNumbers().map((num) => {
          // Calculate position for perfect circle alignment
          // Adjust angle to start from 12 o'clock (subtract 90 degrees)
          const angle = ((num * (mode === 'hour' ? 30 : 6)) - 90) * (Math.PI / 180);
          // Increase radius to 47 for perfect boundary alignment
          const radius = 47;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          
          return (
            <div
              key={num}
              className={`absolute text-base font-semibold transition-colors ${
                value === num ? 'text-primary' : 'text-gray-300'
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {num.toString().padStart(2, '0')}
            </div>
          );
        })}

        <motion.div
          className="absolute w-1 bg-primary origin-bottom rounded-full"
          style={{
            height: mode === 'hour' ? '35%' : '40%',
            left: '50%',
            bottom: '50%',
            transformOrigin: 'bottom center'
          }}
          animate={{ rotate: getHandRotation() }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        <div className="absolute w-3 h-3 bg-primary rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10" />
      </div>

      <button
        onClick={onSwitchMode}
        className="absolute bottom-4 left-4 p-2 rounded-full hover:bg-gray-700/50 transition-colors"
      >
        <Keyboard className="w-5 h-5 text-gray-300" />
      </button>
    </div>
  );
}