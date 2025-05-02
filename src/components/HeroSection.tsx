
import { Button } from "@/components/ui/button";
import { Book, GraduationCap, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  return (
    <section className="relative py-12 lg:py-20 overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block">
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <GraduationCap size={18} />
                <span>教育创新技术</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              重新定义<span className="text-primary"> AI </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                教学体验
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              超越传统AI的智能教学助手，为教师提供高质量教学资源自动化生成与管理。
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Button size="lg" className="gap-2">
                <Book size={18} />
                了解更多
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                功能演示
              </Button>
            </div>
            
            <div className="pt-6 flex items-center gap-6 text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 border-background",
                      i % 2 === 0 ? "bg-primary/80" : "bg-secondary/80"
                    )}
                  />
                ))}
              </div>
              <p className="text-sm">已有<span className="font-bold text-foreground">1,000+</span>教师使用</p>
            </div>
          </div>
          
          <div className="relative h-[400px] lg:h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Traditional AI icon */}
              <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                <div className="p-4 bg-white/90 shadow-lg rounded-lg border border-gray-200 w-40 h-40 flex flex-col items-center justify-center">
                  <Brain size={40} className="text-gray-500 mb-2" />
                  <span className="font-medium text-center">传统AI</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">通用型能力</span>
                </div>
              </div>
              
              {/* Your AI Teaching Assistant icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="p-6 bg-white/95 shadow-xl rounded-lg border border-primary/30 w-48 h-48 flex flex-col items-center justify-center animate-float">
                  <GraduationCap size={48} className="text-primary mb-2" />
                  <span className="font-bold text-center">教学AI助手</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">专业教育功能</span>
                </div>
              </div>
              
              {/* Feature bubbles */}
              <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2">
                <div className="flex flex-col gap-3">
                  {["高质量试卷", "专业讲义", "PPT大纲", "自动检索"].map((feature, i) => (
                    <div 
                      key={feature} 
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium shadow-md",
                        "bg-gradient-to-r", 
                        i % 2 === 0 ? "from-primary/80 to-primary/60 text-white" : "from-secondary/80 to-secondary/60 text-white",
                        `animate-float`
                      )}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Connection lines using SVG */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                {/* Connect traditional AI to center */}
                <line 
                  x1="25%" y1="25%" 
                  x2="50%" y2="50%" 
                  stroke="url(#lineGradient)" 
                  strokeWidth="2" 
                  strokeDasharray="4,4" 
                />
                {/* Connect features to center */}
                <line 
                  x1="75%" y1="75%" 
                  x2="50%" y2="50%" 
                  stroke="url(#lineGradient)" 
                  strokeWidth="2" 
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
