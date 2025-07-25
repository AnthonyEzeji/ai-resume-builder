'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  PlusIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  UserIcon,
  CogIcon,
  ArrowRightIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
interface Resume {
  _id: string
  title: string
  template: string
  atsScore?: number
  updatedAt: string
  isPublic: boolean
}
export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [stats, setStats] = useState({
    totalResumes: 0,
    averageScore: 0,
    recentActivity: 0
  })
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])
  useEffect(() => {
    if (user) {
      fetchResumes()
      fetchStats()
    }
  }, [user])
  const fetchResumes = async () => {
    try {
      const response = await api.get('/resume')
      setResumes(response.data.data)
    } catch (error) {
      toast.error('Failed to load resumes')
    }
  }
  const fetchStats = async () => {
    try {
      const totalResumes = resumes.length
      const averageScore = resumes.length > 0 
        ? Math.round(resumes.reduce((sum, resume) => sum + (resume.atsScore || 0), 0) / resumes.length)
        : 0
      const recentActivity = resumes.filter(r => {
        const date = new Date(r.updatedAt)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return date > weekAgo
      }).length
      setStats({ totalResumes, averageScore, recentActivity })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }
  const deleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return
    try {
      await api.delete(`/resume/${id}`)
      toast.success('Resume deleted successfully')
      fetchResumes()
    } catch (error) {
      toast.error('Failed to delete resume')
    }
  }
  const duplicateResume = async (id: string) => {
    try {
      await api.post(`/resume/${id}/duplicate`)
      toast.success('Resume duplicated successfully')
      fetchResumes()
    } catch (error) {
      toast.error('Failed to duplicate resume')
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  if (!user) {
    return null
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AI Resume Builder</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.firstName}!</span>
              <Link 
                href="/profile"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                <UserIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Resumes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalResumes}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average ATS Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentActivity}</p>
              </div>
            </div>
          </div>
        </div>
        {}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
          <Link
            href="/resume/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Resume
          </Link>
        </div>
        {}
        {resumes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">Create your first resume to get started</p>
            <Link
              href="/resume/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Your First Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{resume.title}</h3>
                    <div className="flex items-center space-x-2">
                      {resume.isPublic && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Public
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Template:</span>
                      <span className="ml-2 capitalize">{resume.template}</span>
                    </div>
                    {resume.atsScore && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">ATS Score:</span>
                        <span className={`ml-2 font-semibold ${
                          resume.atsScore >= 80 ? 'text-green-600' :
                          resume.atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {resume.atsScore}%
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Updated:</span>
                      <span className="ml-2">
                        {new Date(resume.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Link
                        href={`/resume/${resume._id}/edit`}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Edit"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => duplicateResume(resume._id)}
                        className="text-gray-600 hover:text-gray-700 p-1"
                        title="Duplicate"
                      >
                        <DocumentDuplicateIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteResume(resume._id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <Link
                      href={`/resume/${resume._id}/edit`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                    >
                      Edit Resume
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/templates"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Browse Templates</h3>
                <p className="text-sm text-gray-600">Explore professional designs</p>
              </div>
            </Link>
            <Link
              href="/ats-analyzer"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <ChartBarIcon className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">ATS Analyzer</h3>
                <p className="text-sm text-gray-600">Check resume compatibility</p>
              </div>
            </Link>
            <Link
              href="/profile"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <CogIcon className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Manage your account</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 