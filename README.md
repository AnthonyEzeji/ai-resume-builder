# AI Resume Builder

A full-stack TypeScript application for creating professional resumes with AI-powered ATS (Applicant Tracking System) optimization and scoring.

## 🚀 Features

### Core Features
- **AI-Powered ATS Scoring**: Real-time analysis of resume compatibility with ATS systems
- **Professional Templates**: Multiple professionally designed resume templates
- **Smart Analytics**: Track resume performance and get optimization suggestions
- **Multiple Export Formats**: Download resumes in PDF, DOCX, and plain text
- **User Authentication**: Secure user registration and login system
- **Resume Management**: Create, edit, duplicate, and organize multiple resumes

### AI Features
- **Keyword Analysis**: Extract and match keywords from job descriptions
- **Content Optimization**: AI-powered suggestions for improving resume content
- **Format Validation**: Check resume format compliance with ATS requirements
- **Smart Suggestions**: Personalized recommendations based on job requirements

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js** framework
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **OpenAI API** for AI-powered features
- **Natural Language Processing** for keyword extraction
- **PDF Generation** with Puppeteer

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Zod** for validation
- **Framer Motion** for animations
- **React Beautiful DnD** for drag-and-drop
- **Axios** for API communication

## 📁 Project Structure

```
ai-resume-builder/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── models/         # Mongoose data models
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic and AI services
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and API client
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Helper functions
│   ├── package.json
│   └── tsconfig.json
└── package.json           # Root package.json for workspace management
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-resume-builder
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**

   Create `.env` file in the backend directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ai-resume-builder
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both:
   - Backend server on `http://localhost:5000`
   - Frontend server on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password

### Resume Endpoints
- `GET /api/resume` - Get all user resumes
- `GET /api/resume/:id` - Get specific resume
- `POST /api/resume` - Create new resume
- `PUT /api/resume/:id` - Update resume
- `DELETE /api/resume/:id` - Delete resume
- `POST /api/resume/:id/duplicate` - Duplicate resume

### ATS Analysis Endpoints
- `POST /api/ats/analyze` - Analyze resume for ATS compatibility
- `POST /api/ats/optimize` - Get AI optimization suggestions
- `POST /api/ats/keywords` - Extract keywords from job description

### User Management Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password

### Template Endpoints
- `GET /api/template` - Get all available templates
- `GET /api/template/:id` - Get specific template details

## 🎨 Features in Detail

### AI-Powered ATS Scoring
The application uses advanced NLP and AI techniques to analyze resumes:

1. **Keyword Matching**: Extracts keywords from job descriptions and matches them with resume content
2. **Format Analysis**: Checks resume structure, fonts, and layout for ATS compatibility
3. **Content Quality**: Analyzes professional tone, action verbs, and quantifiable achievements
4. **Real-time Scoring**: Provides instant feedback with scores from 0-100

### Resume Templates
- **Modern**: Clean and professional design
- **Classic**: Traditional layout with timeless appeal
- **Creative**: Unique design for creative professionals
- **Minimal**: Simple and clean design focusing on content
- **Executive**: Sophisticated design for senior positions

### Export Functionality
- **PDF Export**: High-quality PDF generation optimized for ATS
- **DOCX Export**: Microsoft Word format for easy editing
- **Plain Text**: Simple text format for copy-paste applications
- **Custom Styling**: Color schemes and font customization

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Database Schema

#### User Model
```typescript
{
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  avatar?: string,
  isEmailVerified: boolean,
  lastLogin?: Date
}
```

#### Resume Model
```typescript
{
  userId: ObjectId,
  title: string,
  template: string,
  personalInfo: {
    firstName: string,
    lastName: string,
    email: string,
    phone?: string,
    location?: string,
    summary: string
  },
  experience: Array<{
    jobTitle: string,
    company: string,
    startDate: Date,
    endDate?: Date,
    description: string,
    achievements: string[]
  }>,
  education: Array<{
    degree: string,
    institution: string,
    startDate: Date,
    endDate?: Date,
    gpa?: number
  }>,
  skills: Array<{
    name: string,
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert',
    category: string
  }>,
  atsScore?: number,
  atsAnalysis?: {
    keywordMatch: number,
    formatScore: number,
    contentScore: number,
    suggestions: string[]
  }
}
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB database (MongoDB Atlas recommended)
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, Vercel, AWS, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@airesumebuilder.com or create an issue in the repository.

## 🔮 Roadmap

- [ ] Advanced AI content generation
- [ ] Cover letter builder
- [ ] Job application tracking
- [ ] Resume analytics dashboard
- [ ] Team collaboration features
- [ ] Mobile application
- [ ] Integration with job boards
- [ ] Advanced template customization
- [ ] Multi-language support
- [ ] Enterprise features

---

Built with ❤️ using Next.js, Express.js, and AI technologies 