import Image from "next/image";
import Header from "@/components/Header";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import Pricing from "@/components/Home/Pricing";
import Callto from "@/components/Home/Callto";
import Footer from "@/components/Home/Footer";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Pricing />
      <Callto />
      <Footer />
    </div>
  );
}
