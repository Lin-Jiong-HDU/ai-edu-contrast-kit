
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Function to open the AI chat interface
  const openAIChat = () => {
    const chatInterface = document.getElementById('position_demo');
    if (chatInterface) {
      // Call the Coze Web SDK to open the chat interface
      const cozeWebSDK = (window as any).CozeWebSDK;
      if (cozeWebSDK && cozeWebSDK.WebChatClient) {
        try {
          cozeWebSDK.webChatClient.show();
        } catch (error) {
          console.error('Failed to open AI chat interface:', error);
        }
      } else {
        console.error('Coze Web SDK not found');
      }
    }
  };

  return (
    <footer className="bg-muted/40 py-12">
      <div className="container">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2 text-primary">
            <GraduationCap size={24} />
            <span className="font-bold text-xl">范小教AI助手</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">关于我们</h3>
            <p className="text-muted-foreground">
              专注于教育科技领域的创新应用，为教育工作者提供智能化教学工具。
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">主要功能</h3>
            <ul className="space-y-2">
              <li>高质量试卷生成</li>
              <li>专业讲义自动化</li>
              <li>PPT大纲智能创建</li>
              <li>教学资源智能检索</li>
            </ul>
          </div>
          
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <div className="flex flex-col items-center md:items-end gap-2">
              <Button variant="outline" size="sm" onClick={openAIChat}>
                技术支持
              </Button>
              <Button variant="outline" size="sm" onClick={openAIChat}>
                产品反馈
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AI思政实验室 - 版权所有
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              隐私政策
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              使用条款
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
