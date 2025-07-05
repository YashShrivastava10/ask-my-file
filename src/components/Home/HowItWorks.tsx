import { Card } from "@/components/ui/card";
import { FileSearch, MessageSquare, Upload } from "lucide-react";
import MotionWrapper from "../common/MotionWrapper";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Drop your PDF, DOCX, or image file",
  },
  {
    icon: FileSearch,
    title: "Summarize",
    description: "AI analyzes and creates an instant summary",
  },
  {
    icon: MessageSquare,
    title: "Ask",
    description: "Chat with your document and get answers",
  },
];

export const HowItWorks = () => {
  return (
    <section className="container mx-auto px-4 py-20">
      <MotionWrapper viewport={{ once: true }} className="text-center">
        <h2 className="mb-4 text-3xl font-bold">How it Works</h2>
        <p className="mb-12 text-lg">Get started in three simple steps</p>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <MotionWrapper
              key={index}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="relative p-8 text-center hover:shadow-lg transition-shadow group h-full gap-4 bg-primary/5">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {index + 1}
                  </div>
                </div>

                <div className="flex justify-center">
                  <step.icon className="p-2 bg-primary/10 size-12 text-primary group-hover:bg-primary/20 rounded-full group-hover:scale-105 transition-all" />
                </div>

                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p>{step.description}</p>
              </Card>
            </MotionWrapper>
          ))}
        </div>
      </MotionWrapper>
    </section>
  );
};
