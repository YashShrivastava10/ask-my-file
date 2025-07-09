import { ChatSidebar } from "@/components/Chat/ChatSidebar";
import NewUplaod from "@/components/Chat/NewUplaod";
import { FileUploader } from "@/components/Home/FileUploader";
import { Chat } from "@/types/ChatTyping";
import { MessageSquare } from "lucide-react";

type API_Response = {
  status: boolean;
  message: string;
  data: Chat[] | [];
};

const ChatListPage = async () => {
  const response = await fetch(`${process.env.WEB_URI}/api/chats`);

  const result: API_Response = await response.json();

  if (!result.status) throw new Error(result.message);

  const chats = result.data;
  return (
    <div className="h-[calc(100vh-80px-36px)] md:h-[calc(100vh-81px)] w-full flex p-4 pt-0 overflow-hidden overflow-y-auto">
      <div className="w-full md:w-64 xl:w-96 md:flex flex-col h-full transition-all">
        <NewUplaod />
        <ChatSidebar chats={chats} />
      </div>
      <div className="hidden md:flex flex-col p-4 items-center justify-center flex-1 bg-primary/5 rounded-xl">
        <div className="flex flex-col gap-6 items-center">
          <div className="bg-primary/10 p-6 mx-auto w-fit text-primary group-hover:bg-primary/20 rounded-full group-hover:scale-105 transition-all size-24 xl:size-30">
            <MessageSquare className="size-full" />
          </div>
          <p className="font-medium md:text-3xl xl:text-4xl text-center">
            Ready to analyze your next document?
          </p>
          <p className="md:text-lg xl:text-xl text-center">
            Upload a new file to start chatting or select an existing
            conversation from the sidebar
          </p>
        </div>
        <FileUploader />
      </div>
    </div>
  );
};

export default ChatListPage;
