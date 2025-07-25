import mongoose, { Document, Schema } from 'mongoose';
export interface IExperience {
  jobTitle: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  achievements: string[];
}
export interface IEducation {
  degree: string;
  institution: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  gpa?: number;
  honors?: string;
  relevantCoursework?: string[];
}
export interface ISkill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}
export interface IProject {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  startDate?: Date;
  endDate?: Date;
}
export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  template: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    summary: string;
  };
  experience: IExperience[];
  education: IEducation[];
  skills: ISkill[];
  projects?: IProject[];
  languages?: string[];
  certifications?: string[];
  customSections?: Array<{
    title: string;
    content: string;
  }>;
  atsScore?: number;
  atsAnalysis?: {
    keywordMatch: number;
    formatScore: number;
    contentScore: number;
    suggestions: string[];
  };
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const experienceSchema = new Schema<IExperience>({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  current: { type: Boolean, default: false },
  description: { type: String, required: true },
  achievements: [String]
});
const educationSchema = new Schema<IEducation>({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  location: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  current: { type: Boolean, default: false },
  gpa: Number,
  honors: String,
  relevantCoursework: [String]
});
const skillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  level: { 
    type: String, 
    required: true,
    enum: ['beginner', 'intermediate', 'advanced', 'expert']
  },
  category: { type: String, required: true }
});
const projectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [String],
  url: String,
  githubUrl: String,
  startDate: Date,
  endDate: Date
});
const resumeSchema = new Schema<IResume>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  template: {
    type: String,
    required: true,
    default: 'modern'
  },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    website: String,
    summary: { type: String, required: true }
  },
  experience: [experienceSchema],
  education: [educationSchema],
  skills: [skillSchema],
  projects: [projectSchema],
  languages: [String],
  certifications: [String],
  customSections: [{
    title: String,
    content: String
  }],
  atsScore: {
    type: Number,
    min: 0,
    max: 100
  },
  atsAnalysis: {
    keywordMatch: Number,
    formatScore: Number,
    contentScore: Number,
    suggestions: [String]
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ isPublic: 1, createdAt: -1 });
export default mongoose.model<IResume>('Resume', resumeSchema); 