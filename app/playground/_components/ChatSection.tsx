import { Messages } from "../[projectId]/page";

type Props = {
  messages: Messages[];
};

const ChatSection = ({ messages }: Props) => {
  return (
    <div className="w-96 h-[90vh] shadow p-4">
      {/* Message */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
        {messages?.length === 0 ? (
          <p className="text-gray-400 text-center">No Messages Yet</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-gray-100 text-black"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
    </div>
  );
};
export default ChatSection;
