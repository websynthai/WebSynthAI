# 🎨 v0.diy

<div align="center">
  <h3>Your Open-Source AI UI Generator</h3>
  <p>Transform text prompts into beautiful UI components powered by multiple AI providers</p>
</div>

<div align="center">
  <a href="#-features">Features</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</div>

## ✨ What is v0.diy?

v0.diy is an open-source alternative to v0.dev that puts the power of AI-driven UI generation in your hands. Create, customize, and manage UI components using your preferred frameworks and AI providers.

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

## 🛠 Getting Started

### Prerequisites
- Node.js 18.x or later
- PostgreSQL database
- Git

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/v0.diy.git
cd v0.diy
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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [v0.dev](https://v0.dev) for inspiration
- [Vercel](https://vercel.com) for the AI SDK
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [NextUI](https://nextui.org) for additional components
