
import { GraduationCap, Brain, CheckCheck, FileText, FilePlus, Presentation, FileSearch } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FeatureCard from "./FeatureCard";
import AnimatedIcon from "./AnimatedIcon";

const ComparisonTable = () => {
  const features = [
    {
      id: 1,
      title: "考试试卷",
      traditional: {
        title: "传统AI试卷生成",
        description: "基础题型组合，有限的题库，质量参差不齐，需要大量人工修改。",
        icon: <FileText />
      },
      enhanced: {
        title: "高质量试卷生成",
        description: "智能化定制试卷，根据教学目标自动生成高质量、符合教学大纲的多样化题目。",
        icon: <FileText />
      }
    },
    {
      id: 2,
      title: "讲义制作",
      traditional: {
        title: "基础讲义模板",
        description: "模板化内容，缺乏针对性，格式单一，内容深度不足。",
        icon: <FilePlus />
      },
      enhanced: {
        title: "高质量讲义生成",
        description: "根据教学主题智能整合关键知识点，生成结构清晰、内容丰富的专业讲义。",
        icon: <FilePlus />
      }
    },
    {
      id: 3,
      title: "PPT大纲",
      traditional: {
        title: "简单PPT框架",
        description: "仅提供基础的PPT结构，需要教师大量填充内容和设计。",
        icon: <Presentation />
      },
      enhanced: {
        title: "完整PPT大纲生成",
        description: "自动生成逻辑完整的PPT大纲，包含关键内容要点和教学流程设计。",
        icon: <Presentation />
      }
    },
    {
      id: 4,
      title: "资料检索",
      traditional: {
        title: "基础信息搜索",
        description: "提供简单的关键词搜索，需要人工筛选和整理内容。",
        icon: <FileSearch />
      },
      enhanced: {
        title: "智能资料查询与整理",
        description: "自动检索、筛选和整理相关教学资源，提供综合性资料库并生成结构化内容。",
        icon: <FileSearch />
      }
    }
  ];

  return (
    <section className="py-12" id="comparison">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-10">功能对比</h2>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-10">
          <div className="p-4">
            <Card className="border-gray-300 p-6 h-full">
              <div className="flex items-center justify-center mb-4">
                <AnimatedIcon icon={<Brain />} color="bg-gray-600" size="lg" animation="none" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">传统AI</h3>
              <p className="text-muted-foreground text-center mb-4">
                一般性功能，缺乏教育专业性
              </p>
              <Separator className="my-4 bg-gray-300" />
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-gray-500">•</span>
                  <span>通用型AI，未针对教育场景优化</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-gray-500">•</span>
                  <span>需要大量人工干预和调整</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-gray-500">•</span>
                  <span>输出内容质量不稳定</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-gray-500">•</span>
                  <span>有限的教育资源整合能力</span>
                </li>
              </ul>
            </Card>
          </div>
          
          <div className="p-4">
            <Card className="border-primary p-6 h-full bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="flex items-center justify-center mb-4">
                <AnimatedIcon icon={<GraduationCap />} color="bg-primary" size="lg" />
              </div>
              <h3 className="text-2xl font-bold text-center text-primary mb-2">教学AI助手</h3>
              <p className="text-muted-foreground text-center mb-4">
                专为教育场景设计的智能助手
              </p>
              <Separator className="my-4 bg-primary/30" />
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-primary"><CheckCheck size={18} /></span>
                  <span>专业教育内容生成能力</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary"><CheckCheck size={18} /></span>
                  <span>教学资源自动化生成与管理</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary"><CheckCheck size={18} /></span>
                  <span>高质量的教学内容一键生成</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary"><CheckCheck size={18} /></span>
                  <span>智能网络资源检索与整合</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {features.map((feature) => (
            <div key={feature.id} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FeatureCard
                title={feature.traditional.title}
                description={feature.traditional.description}
                icon={feature.traditional.icon}
                type="traditional"
              />
              <FeatureCard
                title={feature.enhanced.title}
                description={feature.enhanced.description}
                icon={feature.enhanced.icon}
                type="enhanced"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
