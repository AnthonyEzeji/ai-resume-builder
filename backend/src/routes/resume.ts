import express from 'express';
import { body, validationResult } from 'express-validator';
import Resume from '../models/Resume';
import { auth } from '../middleware/auth';
import { generatePDF } from '../services/pdfService';
const router = express.Router();
router.get('/', auth, async (req: any, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .sort({ updatedAt: -1 });
    res.json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
router.get('/:id', auth, async (req: any, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
router.post('/', [
  auth,
  body('title').notEmpty().withMessage('Title is required'),
  body('personalInfo.firstName').notEmpty().withMessage('First name is required'),
  body('personalInfo.lastName').notEmpty().withMessage('Last name is required'),
  body('personalInfo.email').isEmail().withMessage('Valid email is required'),
  body('personalInfo.summary').notEmpty().withMessage('Summary is required')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    const resumeData = {
      ...req.body,
      userId: req.user.id,
      experience: req.body.experience || [],
      education: req.body.education || [],
      skills: req.body.skills || [],
      projects: req.body.projects || []
    };
    const resume = new Resume(resumeData);
    await resume.save();
    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: resume
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
router.put('/:id', auth, async (req: any, res) => {
  try {
    let resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    resume = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json({
      success: true,
      message: 'Resume updated successfully',
      data: resume
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
router.delete('/:id', auth, async (req: any, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    await Resume.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
router.post('/:id/duplicate', auth, async (req: any, res) => {
  try {
    const originalResume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!originalResume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    const resumeData = originalResume.toObject();
    delete (resumeData as any)._id;
    delete (resumeData as any).createdAt;
    delete (resumeData as any).updatedAt;
    resumeData.title = `${resumeData.title} (Copy)`;
    resumeData.userId = req.user.id;
    const newResume = new Resume(resumeData);
    await newResume.save();
    res.status(201).json({
      success: true,
      message: 'Resume duplicated successfully',
      data: newResume
    });
  } catch (error) {
    console.error('Duplicate resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
router.get('/:id/export/pdf', auth, async (req: any, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    const pdfBuffer = await generatePDF(resume);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF'
    });
  }
});
export default router; 