import { Chat } from "@/types/ChatTyping";
import { ArrowRight, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { Card } from "../ui";

export const ChatList = ({ chat }: { chat: Chat }) => {
  const { docId, metadata } = chat;
  return (
    <Card>
      <Link href={`/chat/${docId}`}>
        <div className="flex items-start gap-3">
          <div className="rounded-full p-2 bg-primary/10">
            <FileText className="size-4 text-primary" />
          </div>
          <div className="min-w-0 w-full">
            <div className="flex items-center justify-between w-full gap-2">
              <h3 className="font-medium text-sm truncate">
                {metadata.fileName}
              </h3>
              <ArrowRight className="text-muted-foreground size-4 flex-shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {/* {metadata.summary} */}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {/* {metadata.timeAgo} */}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};
