"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFile } from "@/hooks/useFile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { File, FileText, ImageIcon, Loader2, Upload } from "lucide-react";
import MotionWrapper from "../common/MotionWrapper";

export const FileUploader = () => {
  const {
    isDragOver,
    isUploading,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
  } = useFile();

  return (
    <section className="container mx-auto px-4 py-16">
      <MotionWrapper viewport={{ once: true }} className="mx-auto max-w-2xl">
        <Card
          className={cn(
            "relative overflow-hidden rounded-2xl border-2 border-dashed border-muted-foreground p-12 transition-all duration-300",
            isDragOver && "border-primary bg-primary/10",
            isUploading && "pointer-events-none opacity-75"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center text-center">
            {isUploading ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="rounded-full bg-primary/10 p-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <p className="text-lg font-medium">Processing your file...</p>
              </motion.div>
            ) : (
              <>
                <motion.div
                  className="mb-6 rounded-full bg-primary/10 p-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Upload className="h-12 w-12 text-primary" />
                </motion.div>

                <h3 className="mb-2 text-xl font-semibold">
                  Drop your file here
                </h3>
                <p className="mb-6 text-muted-foreground">
                  or click to browse from your device
                </p>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />

                <Button asChild size="lg" className="rounded-full">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Choose File
                  </label>
                </Button>

                <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>PDF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    <span>DOCX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>Images</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </MotionWrapper>
    </section>
  );
};
