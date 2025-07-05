import { ChatListType } from "@/types";
import { Clock, FileText } from "lucide-react";
import Link from "next/link";
import { Card } from "../ui";

export const ChatList = ({ chat }: { chat: ChatListType }) => {
  return (
    <Card>
      <Link href={`/chat/${chat.id}`}>
        <div className="flex items-start gap-3">
          <div className="rounded-full p-2 bg-primary/10">
            <FileText className="size-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{chat.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {chat.preview}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              {chat.timestamp}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};
