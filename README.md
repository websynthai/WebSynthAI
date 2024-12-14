# v0.diy

An open-source alternative to v0.dev that integrates various AI providers for UI component generation. This project offers a comprehensive set of features for creating, managing, and customizing UI components using different frameworks and design systems.

## ✨ Features

- 🎨 Multi-Framework UI Generation
  - shadcn/ui components
  - NextUI components
  - Tailwind CSS styling
- 🤖 Multiple AI Provider Support
  - OpenAI
  - Anthropic
  - Google AI
  - Mistral
  - And more...
- 📱 Advanced UI Tools
  - Responsive design analyzer
  - Code copy functionality
  - Component forking
  - Unlimited UI modifications
  - Theme management
- 🔄 Version Control
  - Fork and modify existing components
  - Track changes and updates
  - Collaborative development

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- Git

### Installation

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

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🔧 Environment Configuration

Create a `.env.local` file with the following configuration:

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

## 🤖 AI Model Providers

This project leverages the [Vercel AI SDK](https://sdk.vercel.ai/providers/ai-sdk-providers) for AI model integration. Supported providers include:

- OpenAI
- Anthropic
- Google AI
- Mistral
- Custom providers through Vertex AI

## 📚 Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, NextUI
- **Database**: PostgreSQL with Prisma
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **AI Integration**: Vercel AI SDK

## 🌟 Key Features Explained

### UI Generation
- Support for multiple UI frameworks
- AI-powered component generation
- Custom theme support
- Responsive design tools

### Version Control
- Fork existing components
- Track changes
- Collaborative development

### Theme Management
- Custom theme creation
- Real-time preview
- Theme export/import

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
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
- 
