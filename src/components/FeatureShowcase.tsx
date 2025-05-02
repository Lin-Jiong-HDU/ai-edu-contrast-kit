
import { FileText, Presentation, List, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedIcon from "./AnimatedIcon";

const FeatureShowcase = () => {
  const features = [
    {
      id: "exams",
      title: "高质量试卷自动生成",
      icon: <FileText className="h-5 w-5" />,
      description: "针对不同学科、难度和教学目标，一键生成专业水准的试卷",
      benefits: [
        "智能题型组合，符合教学大纲要求",
        "可调节难度系数，满足不同班级需求",
        "自动生成标准答案和评分标准",
        "提供多样化试卷模板，一键套用"
      ],
      image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: "notes",
      title: "专业讲义自动生成",
      icon: <List className="h-5 w-5" />,
      description: "根据教学主题智能整合关键知识点，生成结构清晰的专业讲义",
      benefits: [
        "内容全面且结构合理，一键生成完整讲义",
        "支持多种格式导出，方便教学使用",
        "可定制内容深度，适应不同教学对象",
        "自动引用权威资料，提高内容可靠性"
      ],
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
    },
    {
      id: "ppt",
      title: "PPT大纲智能生成",
      icon: <Presentation className="h-5 w-5" />,
      description: "自动生成逻辑完整的PPT大纲，包含关键内容要点和教学流程设计",
      benefits: [
        "智能规划教学流程，提升授课效果",
        "自动生成符合教学目标的内容大纲",
        "提供专业知识架构，减轻备课负担",
        "灵活调整内容重点，适应不同教学需求"
      ],
      image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
    },
    {
      id: "research",
      title: "网络资料自动检索整理",
      icon: <FileSearch className="h-5 w-5" />,
      description: "智能搜索、筛选和整合相关教学资源，提供综合性资料库",
      benefits: [
        "多渠道资源整合，获取最新研究成果",
        "智能筛选权威资料，保证内容质量",
        "自动分类整理，形成结构化知识库",
        "定制化内容提取，满足特定教学需求"
      ],
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80"
    }
  ];

  return (
    <section className="py-16 bg-accent/30" id="features">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">智能教学助手功能</h2>
          <p className="text-muted-foreground">
            全面升级教学体验，为教育工作者提供高效智能的教学资源准备工具
          </p>
        </div>

        <Tabs defaultValue="exams" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {features.map((feature) => (
                <TabsTrigger key={feature.id} value={feature.id} className="flex gap-2">
                  {feature.icon}
                  <span className="hidden md:inline">{feature.id === "exams" ? "试卷" : feature.id === "notes" ? "讲义" : feature.id === "ppt" ? "PPT" : "资料"}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {features.map((feature) => (
            <TabsContent key={feature.id} value={feature.id} className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <Card className="overflow-hidden shadow-lg border-0">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-64 object-cover object-center"
                  />
                </Card>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <AnimatedIcon icon={feature.icon} />
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h4 className="font-semibold">主要优势</h4>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="mt-8">立即体验</Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default FeatureShowcase;
