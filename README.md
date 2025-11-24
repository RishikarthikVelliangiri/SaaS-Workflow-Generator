# 🚀 SaaS Workflow Generator

An AI-powered tool for generating comprehensive SaaS architecture workflows and tech stack recommendations using advanced AI models.

![SaaS Workflow Generator](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue)
![Vite](https://img.shields.io/badge/Vite-6.0.1-purple)

## ✨ Features

- **🤖 AI-Powered Architecture Generation**: Generate complete SaaS architecture workflows using AI
- **📊 Interactive Workflow Visualization**: Visual representation of your architecture components
- **🔧 Tech Stack Recommendations**: AI-curated technology suggestions based on your requirements
- **📝 Component Details**: Detailed explanations for each architectural component
- **🎯 Requirements Gathering**: Intelligent form to capture your project needs
- **📈 Architecture Stats**: Real-time analysis of your architecture complexity
- **🔐 Secure API Key Management**: User-provided API keys with no server-side storage

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **AI Integration**: OpenRouter API (OpenAI models)
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- An OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RishikarthikVelliangiri/SaaS-Workflow-Generator.git
   cd SaaS-Workflow-Generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## 🔑 API Key Setup

1. Visit [OpenRouter](https://openrouter.ai) and create an account
2. Generate an API key (starts with `sk-or-`)
3. Enter your API key in the application when prompted
4. Your key is stored securely in memory only (not persisted)

## 📖 How to Use

1. **Enter API Key**: Provide your OpenRouter API key
2. **Describe Your Project**: Enter your SaaS idea and requirements
3. **Configure Requirements**: Answer questions about authentication, database, scaling, etc.
4. **Generate Architecture**: AI creates your workflow and tech stack simultaneously
5. **Explore Components**: Click on workflow components for detailed explanations
6. **Review Tech Stack**: See AI-recommended technologies with explanations
7. **Export Summary**: Get a comprehensive project summary

## 🏗️ Architecture

The application follows a clean, modular architecture:

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── ApiKeyInput.tsx # Secure API key management
│   ├── RequirementsGathering.tsx
│   ├── WorkflowVisualization.tsx
│   └── ...
├── pages/              # Main application pages
├── utils/              # Utility functions and API calls
├── hooks/              # Custom React hooks
└── lib/                # Library configurations
```

## 🔒 Security

- ✅ No hardcoded API keys or secrets
- ✅ User-provided API key system
- ✅ Client-side only architecture
- ✅ Input validation and sanitization
- ✅ Protection against prompt injection
- ✅ Secure memory-only key storage

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. **Deploy** - No environment variables needed!

### Other Platforms

The app works on any static hosting platform:
- Netlify
- Surge
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai) for AI model access
- [OpenAI](https://openai.com) model usage via OpenRouter
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Lucide](https://lucide.dev) for icons

## 📊 Demo

🔗 **Live Demo**: [Coming Soon]

## 📧 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

---
