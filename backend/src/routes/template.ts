import express from 'express';
import { auth } from '../middleware/auth';
const router = express.Router();
router.get('/', auth, async (req: any, res) => {
  try {
    const templates = [
      {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and professional design with modern typography and color accents',
        preview: '/templates/modern-preview.png',
        category: 'modern',
        features: ['Colorful accents', 'Modern fonts', 'Clean layout'],
        isPremium: false
      },
      {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional layout with timeless appeal, perfect for conservative industries',
        preview: '/templates/classic-preview.png',
        category: 'professional',
        features: ['Traditional layout', 'Formal styling', 'Conservative design'],
        isPremium: false
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'Eye-catching design perfect for designers, artists, and creative professionals',
        preview: '/templates/creative-preview.png',
        category: 'creative',
        features: ['Creative elements', 'Color gradients', 'Unique layout'],
        isPremium: true
      },
      {
        id: 'minimal',
        name: 'Minimal',
        description: 'Simple and clean design focusing on content with plenty of white space',
        preview: '/templates/minimal-preview.png',
        category: 'minimal',
        features: ['Clean design', 'Lots of whitespace', 'Content focused'],
        isPremium: false
      },
      {
        id: 'executive',
        name: 'Executive',
        description: 'Sophisticated design perfect for senior positions and executive roles',
        preview: '/templates/executive-preview.png',
        category: 'executive',
        features: ['Premium styling', 'Executive layout', 'Professional appeal'],
        isPremium: true
      },
      {
        id: 'tech',
        name: 'Tech Pro',
        description: 'Modern template designed for software developers and tech professionals',
        preview: '/templates/tech-preview.png',
        category: 'modern',
        features: ['Code-friendly', 'Skills emphasis', 'Project showcase'],
        isPremium: false
      },
      {
        id: 'academic',
        name: 'Academic',
        description: 'Perfect for researchers, professors, and academic professionals',
        preview: '/templates/academic-preview.png',
        category: 'professional',
        features: ['Publication focus', 'Research emphasis', 'Academic styling'],
        isPremium: false
      },
      {
        id: 'startup',
        name: 'Startup',
        description: 'Dynamic design for entrepreneurs and startup professionals',
        preview: '/templates/startup-preview.png',
        category: 'modern',
        features: ['Dynamic layout', 'Innovation focus', 'Bold design'],
        isPremium: true
      }
    ];
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
router.get('/:id', auth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const template = {
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      description: `Template description for ${id}`,
      preview: `/templates/${id}-preview.png`,
      category: 'professional',
      sections: ['personalInfo', 'experience', 'education', 'skills', 'projects'],
      customizations: {
        colors: ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#ea580c'],
        fonts: ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins'],
        spacing: ['compact', 'normal', 'spacious']
      }
    };
    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
export default router; 