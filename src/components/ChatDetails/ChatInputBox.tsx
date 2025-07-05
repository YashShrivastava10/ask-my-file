"use client";

import { ArrowUpIcon } from "lucide-react";
import { Button } from "../ui";

export const ChatInputBox = () => {
  return (
    <div className="sticky bottom-0 bg-background md:bg-transparent w-full z-10 pb-10 input-box">
      <div className="w-full max-w-5xl h-fit px-4 mx-auto">
        <div className="flex bg-card p-3 rounded-4xl items-end">
          <textarea
            id="chat-input"
            className="w-full resize-none max-h-60 min-h-9 leading-9 focus:outline-none px-3 md:placeholder:text-sm placeholder:text-xs"
            autoFocus
            placeholder="Ask me anything about document"
            rows={1}
            onInput={(e) => {
              const target = e.currentTarget;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <Button size="icon" className="rounded-full group">
            <ArrowUpIcon className="rotate-45 group-hover:rotate-0 transition-all duration-300" />
          </Button>
        </div>
      </div>
    </div>
  );
};
