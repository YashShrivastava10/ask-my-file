import { ChatDetailsType } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui";

export const ChatDetailsHeader = ({
  mockDocument,
}: {
  mockDocument: ChatDetailsType;
}) => {
  return (
    <div className="flex items-center gap-2 md:gap-4 min-w-0">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/chat">
          <ArrowLeft />
        </Link>
      </Button>
      <label className="truncate">{mockDocument.title}</label>
    </div>
  );
};
