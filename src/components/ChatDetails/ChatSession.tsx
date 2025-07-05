import { User } from "lucide-react";

const mockMessages = [
  {
    id: 1,
    role: "assistant" as const,
    content:
      "I've analyzed your document. Here's a summary: This annual report shows strong financial performance with 15% revenue growth and strategic market expansion. What would you like to know more about?",
    timestamp: "2:30 PM",
  },
  {
    id: 2,
    role: "user" as const,
    content: "What were the main revenue drivers this year?",
    timestamp: "2:31 PM",
  },
  {
    id: 3,
    role: "assistant" as const,
    content:
      "Based on the report, the main revenue drivers were: 1) 25% growth in digital services, 2) Expansion into Asian markets contributing $50M, 3) New product launches accounting for 18% of total revenue, and 4) Improved customer retention rates of 92%.",
    timestamp: "2:31 PM",
  },
  {
    id: 4,
    role: "user" as const,
    content:
      "Based on the report, the main revenue drivers were: 1) 25% growth in digital services, 2) Expansion into Asian markets contributing $50M, 3) New product launches accounting for 18% of total revenue, and 4) Improved customer retention rates of 92%.",
    timestamp: "2:31 PM",
  },
  {
    id: 5,
    role: "assistant" as const,
    content:
      "Based on the report, the main revenue drivers were: 1) 25% growth in digital services, 2) Expansion into Asian markets contributing $50M, 3) New product launches accounting for 18% of total revenue, and 4) Improved customer retention rates of 92%.",
    timestamp: "2:31 PM",
  },
  {
    id: 6,
    role: "user" as const,
    content:
      "Based on the report, the main revenue drivers were: 1) 25% growth in digital services, 2) Expansion into Asian markets contributing $50M, 3) New product launches accounting for 18% of total revenue, and 4) Improved customer retention rates of 92%.",
    timestamp: "2:31 PM",
  },
  {
    id: 7,
    role: "assistant" as const,
    content:
      "Based on the report, the main revenue drivers were: 1) 25% growth in digital services, 2) Expansion into Asian markets contributing $50M, 3) New product launches accounting for 18% of total revenue, and 4) Improved customer retention rates of 92%.",
    timestamp: "2:31 PM",
  },
  {
    id: 8,
    role: "user" as const,
    content:
      "Based on the report, the main revenue drivers were: 1) 25% growth in digital services, 2) Expansion into Asian markets contributing $50M, 3) New product launches accounting for 18% of total revenue, and 4) Improved customer retention rates of 92%.",
    timestamp: "2:31 PM",
  },
  {
    id: 9,
    role: "assistant" as const,
    content:
      "Based on the report, the main revenue drivers were: 1) 25% growth in digital services, 2) Expansion into Asian markets contributing $50M, 3) New product launches accounting for 18% of total revenue, and 4) Improved customer retention rates of 92%.",
    timestamp: "2:31 PM",
  },
];

export const ChatSession = () => {
  return (
    <div className="flex-1 flex flex-col items-center md:overflow-hidden w-full md:overflow-y-scroll">
      {/* Messages */}
      <div className="flex-1 p-0 md:p-6 space-y-4 max-w-5xl">
        {mockMessages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`w-full md:max-w-7/10 p-6 rounded-xl  ${
                message.role === "user" ? "bg-card" : ""
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className="text-xs mt-2">{message.timestamp}</p>
            </div>
            {message.role === "user" && (
              <div className="hidden xs:flex rounded-full bg-primary/10 p-2 h-fit">
                <User className="size-4 text-primary" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
