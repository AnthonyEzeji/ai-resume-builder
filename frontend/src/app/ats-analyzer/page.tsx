'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  DocumentTextIcon, 
  SparklesIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
export default function ATSAnalyzerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedResume, setSelectedResume] = useState<string>('');
  const [resumes, setResumes] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchResumes();
  }, [user, router]);
  const fetchResumes = async () => {
    try {
      const response = await api.get('/resume');
      setResumes(response.data.data);
    } catch (error) {
      toast.error('Failed to load resumes');
    }
  };
  const analyzeResume = async () => {
    if (!selectedResume) {
      toast.error('Please select a resume to analyze');
      return;
    }
    setIsAnalyzing(true);
    try {
      const response = await api.post('/ats/analyze', {
        resumeId: selectedResume
      });
      setAnalysis(response.data.data);
      toast.success('ATS analysis completed');
    } catch (error) {
      toast.error('Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
    }
  };
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
    return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
  };
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <SparklesIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">ATS Analyzer</h1>
                <p className="text-gray-600">Check your resume's compatibility with ATS systems</p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Resume to Analyze</h2>
          {resumes.length === 0 ? (
            <div className="text-center py-8">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes found</h3>
              <p className="text-gray-600 mb-4">Create a resume first to analyze it with ATS</p>
              <Link
                href="/resume/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Resume
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  onClick={() => setSelectedResume(resume._id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedResume === resume._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{resume.title}</h3>
                      <p className="text-sm text-gray-600">
                        Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                      </p>
                      {resume.atsScore && (
                        <div className="flex items-center mt-1">
                          {getScoreIcon(resume.atsScore)}
                          <span className={`ml-2 text-sm font-semibold ${getScoreColor(resume.atsScore)}`}>
                            ATS Score: {resume.atsScore}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 capitalize">{resume.template}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-center mt-6">
                <button
                  onClick={analyzeResume}
                  disabled={!selectedResume || isAnalyzing}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
                </button>
              </div>
            </div>
          )}
        </div>
        {}
        {analysis && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">ATS Analysis Results</h2>
            {}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                    {analysis.atsScore}%
                  </div>
                  <p className="text-gray-600">Overall ATS Score</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    analysis.atsScore >= 80 ? 'bg-green-500' :
                    analysis.atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${analysis.atsScore}%` }}
                ></div>
              </div>
            </div>
            {}
            {analysis.atsAnalysis && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.atsAnalysis.keywordMatch)}`}>
                    {analysis.atsAnalysis.keywordMatch}%
                  </div>
                  <div className="text-sm text-gray-600">Keyword Match</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.atsAnalysis.formatScore)}`}>
                    {analysis.atsAnalysis.formatScore}%
                  </div>
                  <div className="text-sm text-gray-600">Format Score</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.atsAnalysis.contentScore)}`}>
                    {analysis.atsAnalysis.contentScore}%
                  </div>
                  <div className="text-sm text-gray-600">Content Score</div>
                </div>
              </div>
            )}
            {}
            {analysis.atsAnalysis?.suggestions && analysis.atsAnalysis.suggestions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Improvement Suggestions</h3>
                <ul className="space-y-2">
                  {analysis.atsAnalysis.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></span>
                      <span className="text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">What this score means:</h4>
              {analysis.atsScore >= 80 ? (
                <p className="text-green-700">
                  Excellent! Your resume is highly compatible with ATS systems and should pass through most filters successfully.
                </p>
              ) : analysis.atsScore >= 60 ? (
                <p className="text-yellow-700">
                  Good score, but there's room for improvement. Consider implementing the suggestions above to increase your chances.
                </p>
              ) : (
                <p className="text-red-700">
                  Your resume needs significant improvements to pass ATS filters. Focus on the suggestions above to increase your score.
                </p>
              )}
            </div>
            {}
            <div className="mt-6 text-center">
              <Link
                href={`/resume/${selectedResume}/edit`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Resume
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 