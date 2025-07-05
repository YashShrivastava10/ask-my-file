import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import MotionWrapper from "../common/MotionWrapper";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <MotionWrapper className="mx-auto max-w-4xl">
        <MotionWrapper
          tag="h1"
          className="mb-6 text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Ask your files{" "}
          <span className="bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
            anything.
          </span>
        </MotionWrapper>

        <MotionWrapper
          tag="p"
          className="mb-8 text-xl sm:text-2xl"
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Upload a document and get instant summary + Q&A using AI.
        </MotionWrapper>

        <MotionWrapper transition={{ duration: 0.6, delay: 0.3 }}>
          <Button size="lg" asChild className="rounded-full font-semibold">
            <Link href="/chat" className="flex items-center gap-2">
              Start Chatting
              <ArrowRight />
            </Link>
          </Button>
        </MotionWrapper>

        <MotionWrapper
          className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>PDF, DOCX, Images</span>
          </div>
        </MotionWrapper>
      </MotionWrapper>
    </section>
  );
}
