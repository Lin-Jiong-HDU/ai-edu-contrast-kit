
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import ComparisonTable from "@/components/ComparisonTable";
import FeatureShowcase from "@/components/FeatureShowcase";
import Footer from "@/components/Footer";
import { GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple Navigation */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <GraduationCap size={24} />
            <span className="font-bold text-xl">教学AI助手</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">首页</a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">功能</a>
            <a href="#comparison" className="text-muted-foreground hover:text-foreground transition-colors">对比</a>
          </nav>
          
          <div>
            <Button>立即体验</Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <HeroSection />
        <FeatureShowcase />
        <ComparisonTable />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
