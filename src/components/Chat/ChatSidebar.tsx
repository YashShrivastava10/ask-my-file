import { Chat } from "@/types/ChatTyping";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "../ui";
import { ChatList } from "./ChatList";

export const ChatSidebar = ({ chats }: { chats: Chat[] }) => {
  return (
    <div className="flex flex-col gap-0 pb-4 pr-0 md:pr-4 pt-0 pl-0 h-full md:overflow-hidden md:overflow-y-scroll">
      <div className="sticky top-0 z-20 md:static bg-background flex items-center justify-between pb-4">
        <h3>Chats</h3>
        <div className="flex gap-4 md:hidden">
          <Button className="rounded-full">
            <Plus />
            <span className="">New Upload</span>
          </Button>
          {/* <Select>
            <SelectTrigger className="md:w-[32ch] w-full rounded-full">
              <div className="flex items-center">
                <ArrowDownWideNarrow className="mr-2 h-4 w-4" />
                <span>
                  <span className="font-thin">Sort by: </span>
                  <span className="font-medium"></span>
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((sort) => (
                <SelectItem key={sort} value={sort}>
                  {sort}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>
      </div>
      <div className="flex flex-col gap-4 h-full">
        {!chats.length ? (
          <div className="text-center py-8">
            <div className="mb-4 rounded-full bg-muted-foreground p-4 mx-auto w-fit">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your first document to start chatting with your files
            </p>
          </div>
        ) : (
          chats.map((chat) => <ChatList key={chat.docId} chat={chat} />)
        )}
      </div>
    </div>
  );
};
