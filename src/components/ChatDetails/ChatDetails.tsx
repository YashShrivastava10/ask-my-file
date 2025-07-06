"use client";

import { MetaData } from "@/app/chat/[chat_id]/page";
import {
  BookOpenText,
  EllipsisVertical,
  MessageSquareText,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui";
import { ChatDetailsHeader } from "./ChatDetailsHeader";
import { ChatInfo } from "./ChatInfo";
import { ChatInputBox } from "./ChatInputBox";
import { ChatSession } from "./ChatSession";
import { ChatSummary } from "./ChatSummary";

type ChatDetailsProps = {
  metadata: MetaData;
  docId: string;
  // summary: ""
};

const ChatDetails = ({ metadata, docId }: ChatDetailsProps) => {
  const [sidebarWidth, setSidebarWidth] = useState(600);
  const isResizing = useRef(false);

  const startResizing = () => {
    isResizing.current = true;
  };

  const stopResizing = () => {
    isResizing.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = Math.min(Math.max(e.clientX, 240), 600);
    setSidebarWidth(newWidth);
  };

  const { fileName } = metadata;

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  return (
    <div className="h-[calc(100vh-81px)] w-full flex p-4 pt-0 pb-0 md:pb-4 overflow-hidden overflow-y-scroll">
      {/* Left Sidebar */}
      <div
        className="hidden md:flex flex-col gap-4 h-full overflow-hidden overflow-y-auto relative"
        style={{ width: `${sidebarWidth}px` }}
      >
        <ChatDetailsHeader fileName={fileName} />
        <ChatSummary docId={docId} key={docId} />
        <ChatInfo metadata={metadata} />
        <div
          className="absolute z-20 right-0.5 top-1/2 -translate-y-1/2"
          onMouseDown={startResizing}
        >
          <div className="bg-primary/10 h-8 w-3 flex items-center justify-center rounded-full">
            <EllipsisVertical className="text-primary cursor-col-resize" />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="hidden md:flex flex-col items-center bg-primary/5 rounded-xl h-full flex-1">
        <ChatSession />
        <ChatInputBox />
      </div>
      <div className="md:hidden w-full h-full">
        <Tabs defaultValue="summary" className="w-full h-full">
          <div className="flex justify-between sticky top-0 bg-background">
            <ChatDetailsHeader fileName={fileName} />
            <TabsList>
              <TabsTrigger value="summary">
                <span className="hidden xs:block">Summary</span>
                <span className="block xs:hidden">
                  <BookOpenText className="size-5" />
                </span>
              </TabsTrigger>
              <TabsTrigger value="chat">
                <span className="hidden xs:block">Chat</span>
                <span className="block xs:hidden">
                  <MessageSquareText className="size-5" />
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="summary">
            <ChatSummary docId={docId} key={docId} />
            <ChatInfo metadata={metadata} />
          </TabsContent>

          <TabsContent value="chat" className="h-full flex flex-col">
            <ChatSession />
            <ChatInputBox />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChatDetails;
