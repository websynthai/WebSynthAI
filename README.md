
<div align="center">
    
[![PyPI - License](https://img.shields.io/pypi/l/agentlab?style=flat-square)]([https://opensource.org/licenses/MIT](http://www.apache.org/licenses/LICENSE-2.0))
[![GitHub star chart](https://img.shields.io/github/stars/websynthai/WebSynthAI?style=flat-square)](https://star-history.com/#websynthai/WebSynthAI)
[![Latest Release](https://img.shields.io/github/v/release/websynthai/WebSynthAI?style=flat-square)](https://github.com/websynthai/WebSynthAI/releases)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen?style=flat-square)](https://github.com/websynthai/WebSynthAI/issues)

</div>

# 🎨 WebSynthAI

<div align="center">
  <h3>Your Open-Source AI UI Generator</h3>
  <p>Transform text prompts into beautiful UI components powered by multiple AI providers</p>
</div>

<div align="center">
  <a href="#-what-is-websynthai">What is WebSynthAI?</a> •
  <a href="#-features">Features</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-environment-setup">Environment Setup</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-contributing">Contributing</a>
</div>


## ✨ What is WebSynthAI?

WebSynthAI is an open-source tool that uses AI to build complete websites from a single prompt. While it works for many purposes, it’s particularly suited for creating DeFi dashboards, NFT marketplaces, and other crypto-related applications. With support for AI-powered Solana components and popular frameworks, WebSynthAI simplifies web development by automating the creation and customization of UI components.


### Key Highlights

- 🎯 **Multi-Framework Support**: Generate components for shadcn/ui, NextUI, and more
- 🤖 **Multiple AI Providers**: Choose from OpenAI, Anthropic, Google AI, Mistral, etc.
- 🎨 **Advanced Customization**: Full control over themes, styles, and responsive design
- 🔄 **Version Control**: Track changes, fork components, and collaborate seamlessly

## 🚀 Features

### UI Generation
- Generate components from text prompts or images
- Support for multiple UI frameworks
- Real-time preview and editing
- Responsive design analyzer

### AI Integration
- Multiple provider support
- Custom model selection
- Optimized prompts for UI generation
- Advanced context understanding

### Developer Tools
- Code copy functionality
- Component forking
- Theme management
- Version control
- Collaborative development

## 🎬 Demo  

See how **WebSynthAI** can generate a fully functional website in less than a minute with just a single prompt!  

### **Example Prompt:**  
📝 *"Design a hype-driven site for a DeFi launch with the theme **Sonic Hedgefund**."*  

### **Generated Website Preview:**  
[![Generated Website](https://github.com/user-attachments/assets/e777945b-867c-4e84-abb8-48da7543cece)](https://www.websynthai.com/)

🚀 **[Try it yourself](https://your-demo-link.com)** and bring your ideas to life instantly!


## 🛠 Getting Started

### Prerequisites
- Node.js 18.x or later
- PostgreSQL database
- Git

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/WebSynthAI.git
cd WebSynthAI
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Copy the contents from `.env.example`
   - Fill in your configuration values

4. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to start generating UI components!

## 🔧 Environment Setup

Create a `.env.local` file with:

```env
# Database
DATABASE_URL=postgresql_url_here

# Authentication
AUTH_SECRET=your_auth_secret
AUTH_GITHUB_ID=your_auth_github_id
AUTH_GITHUB_SECRET=your_auth_github_secret

# Optional: Redis for view count
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

## 🤖 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com), [NextUI](https://nextui.org)
- **Database**: PostgreSQL with [Prisma](https://prisma.io)
- **Authentication**: [NextAuth.js](https://next-auth.js.org)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs)
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai)

## 🤝 Contributing

We welcome contributions! Check out our [Contributing Guide](CONTRIBUTING.md) to get started.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
