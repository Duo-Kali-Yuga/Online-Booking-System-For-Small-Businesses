import HeroSection from '../features/marketing/components/HeroSection';
import LandingNavbar from '../features/marketing/components/LandingNavbar';
import FeaturesSection from '../features/marketing/components/FeaturesSection';
import HowItWorksSection from '../features/marketing/components/HowItWorks';
import MovingInfoStrip from "../components/ui/MovingInfo"



const Landing = () => {
  return (
    <div className="min-h-screen bg-surface-50 overflow-hidden">

      {/* Navbar - Glassmorphism applied */}
      <LandingNavbar/>

      {/* Hero Section */}
      <HeroSection/>

      <MovingInfoStrip/>

      {/* Feature Section */}
      <FeaturesSection/>

      <HowItWorksSection/>


    </div>
  );
};

export default Landing;