import { ChatDetailsType } from "@/types";
import { Card } from "../ui";

export const ChatSummary = ({
  mockDocument,
}: {
  mockDocument: ChatDetailsType;
}) => {
  return (
    <div className="gap-2 flex flex-col p-4 pl-0 pt-0 md:pr-4 pr-0">
      <h3>Summary</h3>
      <Card>
        <p className="text-sm leading-relaxed">{mockDocument.summary}</p>
      </Card>
    </div>
  );
};
