'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { 
  ArrowLeftIcon, 
  EyeIcon, 
  DocumentArrowDownIcon,
  SparklesIcon,
  CheckIcon,
  SwatchIcon
} from '@heroicons/react/24/outline'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import ResumeForm from '@/components/ResumeForm'
import ResumePreview from '@/components/ResumePreview'
import ATSScoreCard from '@/components/ATSScoreCard'
import TemplateSelector from '@/components/TemplateSelector'
interface Resume {
  _id: string
  title: string
  template: string
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    location?: string
    linkedin?: string
    github?: string
    website?: string
    summary: string
  }
  experience: Array<{
    jobTitle: string
    company: string
    location?: string
    startDate: string
    endDate?: string
    current: boolean
    description: string
    achievements: string[]
  }>
  education: Array<{
    degree: string
    institution: string
    location?: string
    startDate: string
    endDate?: string
    current: boolean
    gpa?: number
    honors?: string
    relevantCoursework?: string[]
  }>
  skills: Array<{
    name: string
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    category: string
  }>
  projects?: Array<{
    name: string
    description: string
    technologies: string[]
    url?: string
    githubUrl?: string
    startDate?: string
    endDate?: string
  }>
  atsScore?: number
  atsAnalysis?: {
    keywordMatch: number
    formatScore: number
    contentScore: number
    suggestions: string[]
  }
}
export default function ResumeEditorPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const resumeId = params.id as string
  const [resume, setResume] = useState<Resume | null>(null)
  const [isEditing, setIsEditing] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showATS, setShowATS] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])
  useEffect(() => {
    if (user && resumeId) {
      fetchResume()
    }
  }, [user, resumeId])
  const fetchResume = async () => {
    try {
      const response = await api.get(`/resume/${resumeId}`)
      setResume(response.data.data)
    } catch (error) {
      toast.error('Failed to load resume')
      router.push('/dashboard')
    }
  }
  const saveResume = async (updatedResume: Partial<Resume>) => {
    setIsSaving(true)
    try {
      const response = await api.put(`/resume/${resumeId}`, updatedResume)
      setResume(response.data.data)
      toast.success('Resume saved successfully')
    } catch (error) {
      toast.error('Failed to save resume')
    } finally {
      setIsSaving(false)
    }
  }
  const analyzeATS = async () => {
    if (!resume) return
    try {
      const response = await api.post('/ats/analyze', {
        resumeId: resume._id
      })
      setResume(response.data.data.resume)
      setShowATS(true)
      toast.success('ATS analysis completed')
    } catch (error) {
      toast.error('Failed to analyze resume')
    }
  }
  const downloadPDF = async () => {
    try {
      const response = await api.get(`/resume/${resumeId}/export/pdf`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${resume?.title || 'resume'}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('PDF downloaded successfully')
    } catch (error) {
      toast.error('Failed to download PDF')
    }
  }
  const changeTemplate = async (templateId: string) => {
    if (!resume) return
    try {
      const updatedResume = { ...resume, template: templateId }
      await saveResume(updatedResume)
      setShowTemplateSelector(false)
      toast.success('Template changed successfully')
    } catch (error) {
      toast.error('Failed to change template')
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  if (!user || !resume) {
    return null
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{resume.title}</h1>
                <p className="text-sm text-gray-600">Resume Editor</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <SwatchIcon className="h-4 w-4 mr-2" />
                Change Template
              </button>
              <button
                onClick={() => setShowATS(!showATS)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                ATS Score
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                {isEditing ? 'Preview' : 'Edit'}
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {}
          <div className="space-y-6">
            {}
            {showTemplateSelector && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Change Template</h2>
                  <button
                    onClick={() => setShowTemplateSelector(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <TemplateSelector
                  selectedTemplate={resume?.template || 'modern'}
                  onTemplateSelect={changeTemplate}
                  currentResume={resume}
                  size="small"
                  columns={2}
                  showPreview={true}
                />
              </div>
            )}
            {isEditing ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Edit Resume</h2>
                  {isSaving && (
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Saving...
                    </div>
                  )}
                </div>
                <ResumeForm 
                  resume={resume} 
                  onSave={saveResume}
                  isSaving={isSaving}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Resume Preview</h2>
                <ResumePreview resume={resume} />
              </div>
            )}
            {}
            {showATS && (
              <ATSScoreCard 
                resume={resume}
                onAnalyze={analyzeATS}
              />
            )}
          </div>
          {}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Preview</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <ResumePreview resume={resume} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 