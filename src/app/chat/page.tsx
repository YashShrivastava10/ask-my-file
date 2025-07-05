import { ChatSidebar } from "@/components/Chat/ChatSidebar";
import NewUplaod from "@/components/Chat/NewUplaod";
import { FileUploader } from "@/components/Home/FileUploader";
import { MessageSquare } from "lucide-react";

const ChatListPage = () => {
  return (
    <div className="h-[calc(100vh-80px-36px)] md:h-[calc(100vh-81px)] w-full flex p-4 pt-0 overflow-hidden overflow-y-auto">
      <div className="w-full md:w-64 xl:w-96 md:flex flex-col h-full transition-all">
        <NewUplaod />
        <ChatSidebar />
      </div>
      <div className="hidden md:flex flex-col p-4 items-center justify-center flex-1 bg-primary/5 rounded-xl">
        <div className="flex flex-col gap-6 items-center">
          <MessageSquare className="p-4 bg-primary/10 size-24 xl:size-30 text-primary group-hover:bg-primary/20 rounded-full group-hover:scale-105 transition-all" />
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
