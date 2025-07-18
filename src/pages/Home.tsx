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
      
      <div className="container mx-auto px-4 pt-32 py-8 pb-32 space-y-16">
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
      
      {/* Floating Glassmorphism Footer */}
      <footer className="fixed bottom-4 left-4 right-4 z-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 shadow-2xl animate-gentle-fade">
            <div className="text-center">
              <p className="font-inter text-charcoal/90 text-sm">
                © 2025 Memoir Gallery. 
                <a 
                  href="https://jonesclavery.netlify.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 text-dusty-rose hover:text-charcoal transition-colors duration-300 font-medium"
                >
                  Designed and coded by Jones
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
