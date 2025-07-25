'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  PencilIcon, 
  ShareIcon, 
  DocumentArrowDownIcon,
  ChartBarIcon,
  EyeIcon,
  CalendarIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
interface Resume {
  _id: string;
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
  experience: Array<{
    jobTitle: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    gpa?: number;
    honors?: string;
    relevantCoursework?: string[];
  }>;
  skills: Array<{
    name: string;
    level: string;
    category: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    githubUrl?: string;
    startDate?: string;
    endDate?: string;
  }>;
  languages?: string[];
  certifications?: string[];
  atsScore?: number;
  atsAnalysis?: {
    keywordMatch: number;
    formatScore: number;
    contentScore: number;
    suggestions: string[];
  };
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}
export default function ResumeViewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const resumeId = params.id as string;
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (resumeId) {
      fetchResume();
    }
  }, [user, resumeId, router]);
  const fetchResume = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/resume/${resumeId}`);
      if (response.data.success) {
        setResume(response.data.data);
      } else {
        setError('Resume not found');
      }
    } catch (error: any) {
      console.error('Error fetching resume:', error);
      if (error.response?.status === 404) {
        setError('Resume not found');
      } else {
        setError('Failed to load resume');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const response = await api.get(`/resume/${resumeId}/export/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resume?.title || 'resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setError('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resume?.title,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };
  const getSkillColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'beginner': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  if (!user) {
    return <div>Loading...</div>;
  }
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }
  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The resume you\'re looking for doesn\'t exist.'}</p>
          <Link 
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{resume.title}</h1>
                <p className="text-sm text-gray-600">
                  Last updated {formatDate(resume.updatedAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {resume.atsScore !== undefined && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                  <ChartBarIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    ATS Score: {resume.atsScore}%
                  </span>
                </div>
              )}
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShareIcon className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
              </button>
              <Link
                href={`/resume/${resumeId}/edit`}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PencilIcon className="w-5 h-5" />
                <span>Edit Resume</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {}
          <div className="border-b border-gray-200 pb-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {resume.personalInfo.firstName} {resume.personalInfo.lastName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
              {resume.personalInfo.email && (
                <div className="flex items-center space-x-1">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>{resume.personalInfo.email}</span>
                </div>
              )}
              {resume.personalInfo.phone && (
                <div className="flex items-center space-x-1">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{resume.personalInfo.phone}</span>
                </div>
              )}
              {resume.personalInfo.location && (
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{resume.personalInfo.location}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mb-6">
              {resume.personalInfo.linkedin && (
                <a 
                  href={resume.personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  LinkedIn
                </a>
              )}
              {resume.personalInfo.github && (
                <a 
                  href={resume.personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  GitHub
                </a>
              )}
              {resume.personalInfo.website && (
                <a 
                  href={resume.personalInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Website
                </a>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed">
              {resume.personalInfo.summary}
            </p>
          </div>
          {}
          {resume.experience && resume.experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
              <div className="space-y-6">
                {resume.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{exp.jobTitle}</h3>
                        <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                        {exp.location && <p className="text-gray-600">{exp.location}</p>}
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{exp.description}</p>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {}
          {resume.education && resume.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
              <div className="space-y-4">
                {resume.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-green-200 pl-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-lg text-green-600 font-medium">{edu.institution}</p>
                        {edu.location && <p className="text-gray-600">{edu.location}</p>}
                        {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                        {edu.honors && <p className="text-gray-600">{edu.honors}</p>}
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate!)}</p>
                      </div>
                    </div>
                    {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Relevant Coursework:</p>
                        <p className="text-gray-700">{edu.relevantCoursework.join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {}
          {resume.skills && resume.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
              <div className="space-y-4">
                {Object.entries(
                  resume.skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = [];
                    acc[skill.category].push(skill);
                    return acc;
                  }, {} as Record<string, typeof resume.skills>)
                ).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillColor(skill.level)}`}
                        >
                          {skill.name} ({skill.level})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {}
          {resume.projects && resume.projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
              <div className="space-y-6">
                {resume.projects.map((project, index) => (
                  <div key={index} className="border-l-4 border-purple-200 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                      <div className="flex space-x-2">
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {}
          {resume.languages && resume.languages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {resume.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}
          {}
          {resume.certifications && resume.certifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Certifications</h2>
              <ul className="space-y-2">
                {resume.certifications.map((cert, index) => (
                  <li key={index} className="text-gray-700 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {}
        {resume.atsAnalysis && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">ATS Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{resume.atsAnalysis.keywordMatch}%</div>
                <div className="text-sm text-gray-600">Keyword Match</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{resume.atsAnalysis.formatScore}%</div>
                <div className="text-sm text-gray-600">Format Score</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{resume.atsAnalysis.contentScore}%</div>
                <div className="text-sm text-gray-600">Content Score</div>
              </div>
            </div>
            {resume.atsAnalysis.suggestions && resume.atsAnalysis.suggestions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggestions for Improvement</h3>
                <ul className="space-y-2">
                  {resume.atsAnalysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2"></span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 