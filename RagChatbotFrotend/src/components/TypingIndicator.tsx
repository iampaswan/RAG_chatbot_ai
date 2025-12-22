const WaveTyping: React.FC = () => {
  return (
    <div className="flex items-center space-x-1">
      <span className="text-gray-500 text-md mr-3 "> <strong>Please wait </strong></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-[ping_1s_ease-in-out_infinite]"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-[ping_1s_ease-in-out_infinite] [animation-delay:200ms]"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-[ping_1s_ease-in-out_infinite] [animation-delay:400ms]"></span>
    </div>
  );
};


export default WaveTyping;