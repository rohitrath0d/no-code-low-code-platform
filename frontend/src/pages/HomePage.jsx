import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Brain, 
  MessageSquare,
  FileText,
  Search,
  Bot,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';
import Navigation from '../components/Navigation';

const Home = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: Brain,
      title: "Intelligent Workflows",
      description: "Create sophisticated AI-powered workflows with drag-and-drop simplicity"
    },
    {
      icon: MessageSquare,
      title: "Smart Chat Interface",
      description: "Interactive conversations powered by your custom knowledge base"
    },
    {
      icon: FileText,
      title: "Document Processing",
      description: "Upload and extract insights from PDFs and documents automatically"
    },
    {
      icon: Search,
      title: "Web Integration",
      description: "Seamlessly integrate web search and real-time data retrieval"
    }
  ];

  // const stats = [
  //   { label: "Active Users", value: "10K+", icon: Users },
  //   { label: "Workflows Created", value: "25K+", icon: Bot },
  //   { label: "Success Rate", value: "99.9%", icon: TrendingUp },
  //   { label: "Enterprise Ready", value: "100%", icon: Shield }
  // ];

  const gradientColor = "bg-gradient-to-r from-primary via-purple-500 to-blue-500";

  return (
    <div className="min-h-screen bg-background bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100">
     

      {/* Navigation */}
      {/* <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 ${gradientColor} rounded-lg flex items-center justify-center`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FlowCraft AI</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">Features</a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-smooth">About</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-smooth">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className={`${gradientColor} text-white border-0 shadow-glow`}>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav> */}

      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 glass-effect" variant="secondary">
              <Zap className="w-4 h-4 mr-2" />
              No-Code AI Workflow Builder
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Build Intelligent
              <br />
              Workflows Visually
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create powerful AI-driven applications without coding. Connect components, 
              upload documents, and deploy intelligent workflows in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild className={`${gradientColor} text-white border-0 shadow-glow transition-bounce hover:scale-105`}>
                {/* <Link to="/workflow"> */}
                <Link to="/register">
                  Start Building
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              {/* <Button size="lg" variant="outline" className="glass-effect transition-smooth hover:shadow-md">
                Watch Demo
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} 
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className={`w-12 h-12 ${gradientColor} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section id="features" 
        // className=""
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build and deploy intelligent workflows
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`bg-gradient-to-r from-purple-100-100 via-purple-100 to-blue-100 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-1 ${hoveredFeature === index ? 'shadow-glow' : ''}`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${gradientColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users already building the future with FlowCraft AI
          </p>
          <Button size="lg" asChild className={`${gradientColor} text-white border-0 shadow-glow transition-bounce hover:scale-105`}>
            <Link to="/register">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12 bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4 ">
                <div className={`w-8 h-8 ${gradientColor} rounded-lg flex items-center justify-center`}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">FlowCraft AI</span>
              </div>
              <p className="text-muted-foreground">
                Building the future of intelligent workflow automation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Careers</a></li>
              </ul>
            </div>

            <div id='contact'>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 FlowCraft AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
