import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import ComparisonTable from "@/components/ComparisonTable";
import FeatureShowcase from "@/components/FeatureShowcase";
import Footer from "@/components/Footer";
import { GraduationCap, Menu } from "lucide-react";
import { useState, useEffect } from "react";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Function to open the AI chat interface
  const openAIChat = () => {
    // Access the Coze Web SDK from the window object
    const cozeWebSDK = (window as any).cozeWebSDK;
    if (cozeWebSDK) {
      try {
        console.log("Opening AI chat interface...");
        cozeWebSDK.show();
      } catch (error) {
        console.error('Failed to open AI chat interface:', error);
      }
    } else {
      console.error('Coze Web SDK not initialized or not found');
    }
  };
  
  // Make sure the SDK is initialized
  useEffect(() => {
    // Check if the SDK initialization has happened in the window
    if (!(window as any).cozeWebSDK) {
      // If not initialized yet, listen for the load event
      window.addEventListener('load', () => {
        console.log("Window loaded, checking for Coze SDK...");
        if (!(window as any).cozeWebSDK) {
          console.error("Coze SDK not found after window load");
        }
      });
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile-friendly Navigation */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-14 md:h-16 items-center justify-between">
          <div className="flex items-center gap-1.5 md:gap-2 text-primary">
            <GraduationCap size={22} className="md:size-24" />
            <span className="font-bold text-lg md:text-xl">范小教AI助手</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">首页</a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">功能</a>
            <a href="#comparison" className="text-muted-foreground hover:text-foreground transition-colors">对比</a>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={22} />
            </Button>
          </div>
          
          {/* Call to Action Button */}
          <div className="hidden md:block">
            <Button onClick={openAIChat}>立即体验</Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b shadow-md md:hidden">
            <div className="flex flex-col py-2">
              <a 
                href="#" 
                className="px-4 py-2.5 text-foreground hover:bg-muted/50" 
                onClick={() => setMobileMenuOpen(false)}
              >
                首页
              </a>
              <a 
                href="#features" 
                className="px-4 py-2.5 text-foreground hover:bg-muted/50" 
                onClick={() => setMobileMenuOpen(false)}
              >
                功能
              </a>
              <a 
                href="#comparison" 
                className="px-4 py-2.5 text-foreground hover:bg-muted/50" 
                onClick={() => setMobileMenuOpen(false)}
              >
                对比
              </a>
              <div className="px-4 py-2.5">
                <Button className="w-full" onClick={openAIChat}>立即体验</Button>
              </div>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1">
        <HeroSection openAIChat={openAIChat} />
        <FeatureShowcase openAIChat={openAIChat} />
        <ComparisonTable />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
