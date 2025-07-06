import { MetaData } from "@/app/chat/[chat_id]/page";
import { formatDateToDDMMYYYY } from "@/utils";
import { Card } from "../ui";

export const ChatInfo = ({ metadata }: { metadata: MetaData }) => {
  return (
    <div className="space-y-2 p-4 pl-0 pt-0 md:pr-4 pr-0">
      <h3>Metadata</h3>
      <Card>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Pages:</span>
          <span>{metadata.pages}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Size:</span>
          <span>{metadata.fileSize}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Uploaded:</span>
          <span>{formatDateToDDMMYYYY(metadata.uploadedAt)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Last Modified:</span>
          <span>{formatDateToDDMMYYYY(metadata.lastModified)}</span>
        </div>
        {metadata.role && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Document Type</span>
            <span>{formatDateToDDMMYYYY(metadata.role)}</span>
          </div>
        )}
      </Card>
    </div>
  );
};
