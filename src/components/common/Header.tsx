import { FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  return (
    <header className="bg-background sticky top-0 z-10">
      <div className="mx-auto px-4 py-2">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="rounded-lg bg-primary p-2">
              <FileText className="size-5 text-white" />
            </div>
            AskMyFile
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/chat">My Chats</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
