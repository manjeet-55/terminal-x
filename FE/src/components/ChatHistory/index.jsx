import PropTypes from "prop-types";

const ChatHistory = ({ chatHistory }) => {
  return (
    <div className="h-30rem w-full text-black">
      {chatHistory.map((entry, index) => (
        <div key={index}>{entry.message}</div>
      ))}
    </div>
  );
};

ChatHistory.propTypes = {
  chatHistory: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ChatHistory;
