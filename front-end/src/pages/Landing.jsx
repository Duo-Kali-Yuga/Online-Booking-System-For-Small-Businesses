import HeroSection from '../features/marketing/components/HeroSection';
import LandingNavbar from '../features/marketing/components/LandingNavbar';
import FeaturesSection from '../features/marketing/components/FeaturesSection';


const Landing = () => {
  return (
    <div className="min-h-screen bg-surface-50 overflow-hidden">
      {/* Navbar - Glassmorphism applied */}
      <LandingNavbar/>

      {/* Hero Section */}
      <HeroSection/>

      {/* Feature Section */}
      <FeaturesSection/>

    </div>
  );
};

export default Landing;