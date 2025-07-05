"use client";

import { useFile } from "@/hooks/useFile";
import { Plus } from "lucide-react";
import { Button } from "../ui";

const NewUplaod = () => {
  const { handleFileSelect } = useFile();
  return (
    <div className="sticky top-0 pb-4 pr-4 pt-4 hidden md:flex">
      <input
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      <Button className="w-full rounded-full" asChild>
        <label htmlFor="file-upload" className="cursor-pointer">
          <Plus />
          New Upload
        </label>
      </Button>
    </div>
  );
};

export default NewUplaod;
