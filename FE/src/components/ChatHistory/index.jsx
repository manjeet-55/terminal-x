import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

const ChatHistory = ({ chatHistory }) => {
  return (
    <div className="h-[calc(100vh-240px)] overflow-y-auto bg-transparent p-2 rounded-lg">
      {chatHistory.map((entry, index) => (
        <div
          key={index}
          className={`p-2 my-2 rounded-lg ${
            entry.type === "user" ? "bg-red-200" : "bg-green-200"
          }`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.message}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

ChatHistory.propTypes = {
  chatHistory: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ChatHistory;
