'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import TemplateSelector from '@/components/TemplateSelector';
interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
}
interface ResumeFormData {
  title: string;
  template: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
    summary: string;
  };
  experience: Array<{
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa: number | undefined;
    honors: string;
  }>;
  skills: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    url: string;
    githubUrl: string;
  }>;
}
export default function NewResumePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [formData, setFormData] = useState<ResumeFormData>({
    title: '',
    template: 'modern',
    personalInfo: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: []
  });
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchTemplates();
    const urlParams = new URLSearchParams(window.location.search);
    const templateParam = urlParams.get('template');
    if (templateParam) {
      setFormData(prev => ({ ...prev, template: templateParam }));
      setStep(2); 
    }
  }, [user, router]);
  const fetchTemplates = async () => {
    try {
      const response = await api.get('/template');
      setTemplates(response.data.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };
  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('personalInfo.')) {
      const personalField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [personalField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  const handleTemplateSelect = (templateId: string) => {
    setFormData(prev => ({
      ...prev,
      template: templateId
    }));
  };
  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.title.trim().length > 0;
      case 2:
        return formData.template.length > 0;
      case 3:
        return (
          formData.personalInfo.firstName.trim().length > 0 &&
          formData.personalInfo.lastName.trim().length > 0 &&
          formData.personalInfo.email.trim().length > 0 &&
          formData.personalInfo.summary.trim().length > 0
        );
      default:
        return true;
    }
  };
  const handleNextStep = () => {
    if (validateStep(step)) {
      setError('');
      setStep(step + 1);
    } else {
      setError('Please fill in all required fields');
    }
  };
  const handlePrevStep = () => {
    setError('');
    setStep(step - 1);
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/resume', formData);
      if (response.data.success) {
        router.push(`/resume/${response.data.data._id}/edit`);
      } else {
        setError(response.data.message || 'Failed to create resume');
      }
    } catch (error: any) {
      console.error('Create resume error:', error);
      if (error.response?.data?.errors) {
        setError(error.response.data.errors.map((e: any) => e.msg).join(', '));
      } else {
        setError(error.response?.data?.message || 'Failed to create resume');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Name Your Resume</h2>
        <p className="text-gray-600">Give your resume a descriptive title</p>
      </div>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Resume Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="e.g., Software Engineer Resume, Marketing Manager CV"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleNextStep}
          disabled={!validateStep(1)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Template</h2>
        <p className="text-gray-600">Select a design that matches your style</p>
      </div>
      <TemplateSelector
        selectedTemplate={formData.template}
        onTemplateSelect={handleTemplateSelect}
        size="medium"
        columns={3}
        showPreview={true}
      />
      <div className="flex justify-between">
        <button
          onClick={handlePrevStep}
          className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNextStep}
          disabled={!validateStep(2)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Fill in your basic details</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.personalInfo.firstName}
            onChange={(e) => handleInputChange('personalInfo.firstName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.personalInfo.lastName}
            onChange={(e) => handleInputChange('personalInfo.lastName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo.email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo.phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.personalInfo.location}
            onChange={(e) => handleInputChange('personalInfo.location', e.target.value)}
            placeholder="City, State/Country"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn URL
          </label>
          <input
            type="url"
            value={formData.personalInfo.linkedin}
            onChange={(e) => handleInputChange('personalInfo.linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            value={formData.personalInfo.github}
            onChange={(e) => handleInputChange('personalInfo.github', e.target.value)}
            placeholder="https://github.com/username"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={formData.personalInfo.website}
            onChange={(e) => handleInputChange('personalInfo.website', e.target.value)}
            placeholder="https://yourwebsite.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Summary <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.personalInfo.summary}
            onChange={(e) => handleInputChange('personalInfo.summary', e.target.value)}
            rows={4}
            placeholder="Write a brief summary of your professional background and key achievements..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex justify-between">
        <button
          onClick={handlePrevStep}
          className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!validateStep(3) || isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Creating Resume...' : 'Create Resume'}
        </button>
      </div>
    </div>
  );
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link 
              href="/dashboard" 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      i <= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
} 