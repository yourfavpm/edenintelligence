import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import ProductDemo from "@/components/landing/ProductDemo";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import ComingSoon from "@/components/landing/ComingSoon";
import HowItWorks from "@/components/landing/HowItWorks";
import SearchDemo from "@/components/landing/SearchDemo";
import Security from "@/components/landing/Security";
import UseCases from "@/components/landing/UseCases";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <SocialProof />
      <ProductDemo />
      <FeaturesGrid />
      <ComingSoon />
      <HowItWorks />
      <SearchDemo />
      <Security />
      <UseCases />
      <FinalCTA />
      <Footer />
    </main>
  );
}
