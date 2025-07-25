import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Resume from '../models/Resume';
import { auth } from '../middleware/auth';
import { analyzeResume } from '../services/atsService';
const router = express.Router();
router.post('/analyze', [
  auth,
  body('resumeId').notEmpty().withMessage('Resume ID is required'),
  body('jobDescription').optional().isString()
], async (req: any, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    const { resumeId, jobDescription } = req.body;
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user.id
    });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    const analysis = await analyzeResume(resume, jobDescription);
    resume.atsScore = analysis.overallScore;
    resume.atsAnalysis = {
      keywordMatch: analysis.keywordMatch,
      formatScore: analysis.formatScore,
      contentScore: analysis.contentScore,
      suggestions: analysis.suggestions
    };
    await resume.save();
    res.json({
      success: true,
      data: {
        resume,
        analysis
      }
    });
  } catch (error) {
    console.error('ATS analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during analysis'
    });
  }
});
router.post('/optimize', [
  auth,
  body('resumeId').notEmpty().withMessage('Resume ID is required'),
  body('jobDescription').notEmpty().withMessage('Job description is required')
], async (req: any, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    const { resumeId, jobDescription } = req.body;
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user.id
    });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    const suggestions = await getOptimizationSuggestions(resume, jobDescription);
    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during optimization'
    });
  }
});
router.post('/keywords', [
  auth,
  body('jobDescription').notEmpty().withMessage('Job description is required')
], async (req: any, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    const { jobDescription } = req.body;
    const keywords = await extractKeywords(jobDescription);
    res.json({
      success: true,
      data: keywords
    });
  } catch (error) {
    console.error('Keyword extraction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during keyword extraction'
    });
  }
});
async function getOptimizationSuggestions(resume: any, jobDescription: string) {
  return {
    summary: [
      'Make your summary more specific to the target role',
      'Include quantifiable achievements',
      'Focus on relevant skills and experience'
    ],
    experience: [
      'Use action verbs to start bullet points',
      'Include metrics and quantifiable results',
      'Tailor descriptions to match job requirements'
    ],
    skills: [
      'Prioritize skills mentioned in the job description',
      'Include both technical and soft skills',
      'Remove outdated or irrelevant skills'
    ]
  };
}
async function extractKeywords(jobDescription: string) {
  const commonKeywords = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL',
    'AWS', 'Docker', 'Kubernetes', 'Git', 'Agile', 'Scrum',
    'Leadership', 'Communication', 'Problem Solving', 'Teamwork'
  ];
  return {
    technical: commonKeywords.filter(k => /[A-Z]/.test(k)),
    soft: commonKeywords.filter(k => !/[A-Z]/.test(k)),
    industry: ['Software Development', 'Web Development', 'Data Science']
  };
}
export default router; 