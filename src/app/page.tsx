import { FileUploader } from "@/components/Home/FileUploader";
import { Hero } from "@/components/Home/Hero";
import { HowItWorks } from "@/components/Home/HowItWorks";

const Home = () => {
  return (
    <>
      <Hero />
      <FileUploader />
      <HowItWorks />
    </>
  );
};

export default Home;
