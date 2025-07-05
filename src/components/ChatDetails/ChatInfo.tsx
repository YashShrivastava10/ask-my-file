import { ChatDetailsType } from "@/types";
import { Card } from "../ui";

export const ChatInfo = ({
  mockDocument,
}: {
  mockDocument: ChatDetailsType;
}) => {
  return (
    <div className="space-y-2 p-4 pl-0 pt-0 md:pr-4 pr-0">
      <h3>Metadata</h3>
      <Card>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Pages:</span>
          <span>{mockDocument.metadata.pages}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Size:</span>
          <span>{mockDocument.metadata.size}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Uploaded:</span>
          <span>{mockDocument.metadata.uploadDate}</span>
        </div>
      </Card>
    </div>
  );
};
