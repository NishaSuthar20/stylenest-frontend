import HeroSection from "../components/HeroSection";
import BrandSlider from "../components/BrandSlider";
import MensSection from "../components/MensSection";
import WomenSection from "../components/WomensSection";
import Trending from "../components/Trending";
import OfferBanner from "../components/OfferBanner";
import Features from "../components/Features";
import Footer from "../components/Footer";
import RecentlyViewed from "../components/RecentlyViewed";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <BrandSlider />
      <MensSection />
      <WomenSection />
      <Trending />
      <OfferBanner/>
      <Features />
       <RecentlyViewed /> 
      <Footer />
    </div>
  );
}

