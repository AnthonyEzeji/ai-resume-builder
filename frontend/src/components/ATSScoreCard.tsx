'use client'
import { useState } from 'react'
import { 
  SparklesIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
interface ATSScoreCardProps {
  resume: any
  onAnalyze: () => void
}
export default function ATSScoreCard({ resume, onAnalyze }: ATSScoreCardProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      await onAnalyze()
    } finally {
      setIsAnalyzing(false)
    }
  }
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }
  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircleIcon className="h-5 w-5 text-green-600" />
    if (score >= 60) return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
    return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
  }
  if (!resume.atsScore && !resume.atsAnalysis) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2 text-blue-600" />
            ATS Analysis
          </h3>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </div>
        <p className="text-gray-600 text-sm">
          Get AI-powered analysis of your resume's compatibility with Applicant Tracking Systems.
        </p>
      </div>
    )
  }
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2 text-blue-600" />
          ATS Analysis
        </h3>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
        </button>
      </div>
      {}
      {resume.atsScore && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Overall ATS Score</h4>
            <div className={`flex items-center px-3 py-1 rounded-full ${getScoreBgColor(resume.atsScore)}`}>
              {getScoreIcon(resume.atsScore)}
              <span className={`ml-2 font-semibold ${getScoreColor(resume.atsScore)}`}>
                {resume.atsScore}%
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                resume.atsScore >= 80 ? 'bg-green-500' :
                resume.atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${resume.atsScore}%` }}
            ></div>
          </div>
        </div>
      )}
      {}
      {resume.atsAnalysis && (
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-gray-900 flex items-center">
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Detailed Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Keyword Match</span>
                <span className={`text-sm font-semibold ${getScoreColor(resume.atsAnalysis.keywordMatch)}`}>
                  {resume.atsAnalysis.keywordMatch}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${
                    resume.atsAnalysis.keywordMatch >= 80 ? 'bg-green-500' :
                    resume.atsAnalysis.keywordMatch >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${resume.atsAnalysis.keywordMatch}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Format Score</span>
                <span className={`text-sm font-semibold ${getScoreColor(resume.atsAnalysis.formatScore)}`}>
                  {resume.atsAnalysis.formatScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${
                    resume.atsAnalysis.formatScore >= 80 ? 'bg-green-500' :
                    resume.atsAnalysis.formatScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${resume.atsAnalysis.formatScore}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Content Score</span>
                <span className={`text-sm font-semibold ${getScoreColor(resume.atsAnalysis.contentScore)}`}>
                  {resume.atsAnalysis.contentScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${
                    resume.atsAnalysis.contentScore >= 80 ? 'bg-green-500' :
                    resume.atsAnalysis.contentScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${resume.atsAnalysis.contentScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {}
      {resume.atsAnalysis?.suggestions && resume.atsAnalysis.suggestions.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 flex items-center mb-3">
            <LightBulbIcon className="h-4 w-4 mr-2" />
            Improvement Suggestions
          </h4>
          <div className="space-y-2">
            {resume.atsAnalysis.suggestions.map((suggestion: string, index: number) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {}
      {resume.atsScore && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">What this score means:</h4>
          {resume.atsScore >= 80 ? (
            <p className="text-sm text-green-700">
              Excellent! Your resume is highly compatible with ATS systems and should pass through most filters successfully.
            </p>
          ) : resume.atsScore >= 60 ? (
            <p className="text-sm text-yellow-700">
              Good score, but there's room for improvement. Consider implementing the suggestions above to increase your chances.
            </p>
          ) : (
            <p className="text-sm text-red-700">
              Your resume needs significant improvements to pass ATS filters. Focus on the suggestions above to increase your score.
            </p>
          )}
        </div>
      )}
    </div>
  )
} 