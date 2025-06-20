
import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { FeaturedImageCard } from '../components/FeaturedImageCard';
import { HeroSection } from '../components/HeroSection';
import { ContentSection } from '../components/ContentSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream via-foggy-blue/20 to-dusty-rose/20">
      <Header />
      
      <div className="container mx-auto px-4 py-8 space-y-16">
        <HeroSection />
        
        <div className="max-w-4xl mx-auto space-y-12 animate-gentle-fade">
          <ContentSection 
            title="My Vision"
            content="Capturing moments and objects that tell stories, preserving memories that last a lifetime."
          />
          
          <ContentSection 
            title="The Looking Glass"
            content="Discover perspectives from my point of view."
          />
          
          <ContentSection 
            title="My Hope"
            content="It is my hope that this may give all those who visit, a look through my eyes."
          />
          
          <FeaturedImageCard />
          
          <ContentSection 
            title="Acclamations"
            content="Though I created this gallery, it is not mine alone—it is a tapestry woven from many hands, perspectives, and unseen contributions. I cannot claim all the praise, only the privilege of sharing these captured moments."
          />
          
          <ContentSection 
            title="Acknowledgments"
            content="Though unnamed, your influence lingers in the frames, the colors, and the stories told. This gallery exists because of you."
          />
          
          <div className="text-center pt-8">
            <Link 
              to="/gallery"
              className="inline-flex items-center px-8 py-4 bg-dusty-rose text-warm-cream rounded-2xl font-poppins font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-gentle-fade"
            >
              Explore Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
