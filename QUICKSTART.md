# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB running (local or cloud)
- OpenAI API key (optional for AI features)

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd ai-resume-builder

# Run the installation script
./install.sh
```

### 3. Configuration
Edit `backend/.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-resume-builder
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key  # Optional
FRONTEND_URL=http://localhost:3000
```

### 4. Start Development
```bash
# Start both frontend and backend
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 🎯 Key Features to Try

### 1. User Registration & Login
- Navigate to http://localhost:3000/register
- Create a new account
- Login and explore the dashboard

### 2. Resume Builder
- Create a new resume
- Fill in personal information, experience, education, and skills
- Choose from different templates

### 3. AI-Powered ATS Analysis
- Add a job description
- Get real-time ATS scoring
- View optimization suggestions

### 4. Export Functionality
- Download resume in PDF format
- Export to different templates
- Share your resume

## 🔧 Development Commands

### Backend
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
```

### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Both (from root)
```bash
npm run dev          # Start both servers
npm run build        # Build both applications
npm run start        # Start production servers
```

## 📁 Project Structure Overview

```
ai-resume-builder/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── middleware/     # Express middleware
│   └── package.json
├── frontend/               # Next.js app
│   ├── src/
│   │   ├── app/           # Pages and layouts
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities and API client
│   └── package.json
└── package.json           # Workspace management
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes on ports 3000 and 5000
   lsof -ti:3000 | xargs kill -9
   lsof -ti:5000 | xargs kill -9
   ```

2. **MongoDB connection failed**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Try: `mongodb://localhost:27017/ai-resume-builder`

3. **Node modules issues**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **TypeScript errors**
   ```bash
   # Check types
   npm run type-check
   ```

## 📚 Next Steps

1. **Explore the Codebase**
   - Check out the API routes in `backend/src/routes/`
   - Review React components in `frontend/src/components/`
   - Understand the data models in `backend/src/models/`

2. **Add Features**
   - Create new resume templates
   - Add more AI analysis features
   - Implement additional export formats

3. **Deploy**
   - Set up production environment
   - Configure CI/CD pipeline
   - Deploy to your preferred platform

## 🆘 Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review API endpoints in the backend routes
- Check the console for error messages
- Create an issue in the repository

---

Happy coding! 🚀 