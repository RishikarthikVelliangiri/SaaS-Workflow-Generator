
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface CodeFile {
  name: string;
  language: string;
  content: string;
  description: string;
}

const codeFiles: CodeFile[] = [
  {
    name: 'package.json',
    language: 'json',
    description: 'Project dependencies and scripts',
    content: `{
  "name": "my-saas-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@auth0/nextjs-auth0": "^3.0.0",
    "stripe": "^12.0.0",
    "prisma": "^5.0.0"
  }
}`
  },
  {
    name: 'app/page.tsx',
    language: 'typescript',
    description: 'Main application page',
    content: `import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';

export default function Home() {
  return (
    <UserProvider>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
      </div>
    </UserProvider>
  );
}`
  },
  {
    name: 'components/Navbar.tsx',
    language: 'typescript',
    description: 'Navigation component with authentication',
    content: `import { useUser } from '@auth0/nextjs-auth0/client';

export function Navbar() {
  const { user, isLoading } = useUser();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">My SaaS</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <a href="/api/auth/logout">Logout</a>
            ) : (
              <a href="/api/auth/login">Login</a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}`
  },
  {
    name: 'api/stripe/webhook.ts',
    language: 'typescript',
    description: 'Stripe webhook handler',
    content: `import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send('Webhook signature verification failed');
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Handle successful payment
      break;
    default:
      console.log(\`Unhandled event type \${event.type}\`);
  }

  res.status(200).json({ received: true });
}`
  }
];

const documentationSections = [
  {
    title: 'Getting Started',
    content: `1. Install dependencies: npm install
2. Set up environment variables in .env.local
3. Run the development server: npm run dev
4. Open http://localhost:3000 in your browser`
  },
  {
    title: 'Environment Variables',
    content: `AUTH0_SECRET=your-auth0-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...`
  },
  {
    title: 'Deployment',
    content: `Deploy to Vercel:
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with automatic deployments enabled`
  }
];

interface CodeGenerationProps {
  onComplete: () => void;
  onBack: () => void;
}

const CodeGeneration: React.FC<CodeGenerationProps> = ({ onComplete, onBack }) => {
  const [selectedFile, setSelectedFile] = React.useState(0);

  const downloadCode = () => {
    // Simulate code download
    const blob = new Blob([JSON.stringify(codeFiles, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saas-project-code.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel p-8 mb-6 animate-fade-in">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Your Generated Code
          </h2>
          <p className="text-xl text-muted-foreground">
            Complete starter code for your SaaS application with all selected features integrated.
          </p>
        </div>

        <Tabs defaultValue="code" className="space-y-6">
          <TabsList className="glass-card p-1">
            <TabsTrigger value="code" className="px-6 py-3">Code Files</TabsTrigger>
            <TabsTrigger value="docs" className="px-6 py-3">Documentation</TabsTrigger>
            <TabsTrigger value="deploy" className="px-6 py-3">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* File List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold gradient-text">Project Files</h3>
                {codeFiles.map((file, index) => (
                  <Card
                    key={index}
                    className={`glass-card p-4 cursor-pointer transition-all duration-300 hover:bg-white/20 ${
                      selectedFile === index ? 'neon-border bg-white/10' : ''
                    }`}
                    onClick={() => setSelectedFile(index)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{file.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {file.language}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{file.description}</p>
                  </Card>
                ))}
              </div>

              {/* Code Preview */}
              <div className="lg:col-span-3">
                <Card className="glass-panel p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg">{codeFiles[selectedFile].name}</h4>
                    <Badge className="bg-neon-blue/20 text-neon-blue">
                      {codeFiles[selectedFile].language}
                    </Badge>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                      {codeFiles[selectedFile].content}
                    </pre>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentationSections.map((section, index) => (
                <Card key={index} className="glass-panel p-6">
                  <h3 className="text-xl font-semibold gradient-text mb-4">
                    {section.title}
                  </h3>
                  <div className="bg-black/40 rounded-lg p-4">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                      {section.content}
                    </pre>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deploy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-panel p-6">
                <h3 className="text-xl font-semibold gradient-text mb-4">
                  Deployment Options
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <div>
                      <h4 className="font-semibold">Vercel</h4>
                      <p className="text-sm text-muted-foreground">Recommended for Next.js</p>
                    </div>
                    <Badge className="bg-neon-blue/20 text-neon-blue">Recommended</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <div>
                      <h4 className="font-semibold">Netlify</h4>
                      <p className="text-sm text-muted-foreground">Great for static sites</p>
                    </div>
                    <Badge variant="outline">Alternative</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <div>
                      <h4 className="font-semibold">AWS</h4>
                      <p className="text-sm text-muted-foreground">Full control & scaling</p>
                    </div>
                    <Badge variant="outline">Advanced</Badge>
                  </div>
                </div>
              </Card>

              <Card className="glass-panel p-6">
                <h3 className="text-xl font-semibold gradient-text mb-4">
                  Next Steps
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-neon-blue rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="text-sm">Download and extract your code</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-neon-purple rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="text-sm">Set up your development environment</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-neon-cyan rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span className="text-sm">Configure your services (Auth0, Stripe)</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-neon-blue rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <span className="text-sm">Deploy to your chosen platform</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="glass-card border-white/20 hover:bg-white/10 px-8 py-6"
          >
            Back to Tech Stack
          </Button>
          
          <div className="flex space-x-4">
            <Button
              onClick={downloadCode}
              variant="outline"
              className="glass-card border-neon-blue/50 hover:bg-neon-blue/10 px-8 py-6 neon-glow"
            >
              Download Code
            </Button>
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-cyan px-8 py-6 neon-glow"
            >
              View Summary
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGeneration;
