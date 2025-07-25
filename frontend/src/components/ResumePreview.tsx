'use client'
import { format } from 'date-fns'
interface ResumePreviewProps {
  resume: any
  template?: string
}
export default function ResumePreview({ resume, template = 'modern' }: ResumePreviewProps) {
  if (!resume) {
    return (
      <div className="bg-white p-8 text-center text-gray-500">
        <p>No resume data to preview</p>
      </div>
    )
  }
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      return format(new Date(dateString), 'MMM yyyy')
    } catch {
      return dateString
    }
  }
  const getDateRange = (startDate: string, endDate?: string, current?: boolean) => {
    const start = formatDate(startDate)
    const end = current ? 'Present' : formatDate(endDate || '')
    return `${start} - ${end}`
  }
  const renderModernTemplate = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto font-sans">
      {}
      <div className="border-b-2 border-blue-600 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}
        </h1>
        <p className="text-lg text-gray-600 mb-2">{resume.personalInfo?.email}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {resume.personalInfo?.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo?.location && <span>{resume.personalInfo.location}</span>}
          {resume.personalInfo?.linkedin && (
            <a href={resume.personalInfo.linkedin} className="text-blue-600 hover:underline">
              LinkedIn
            </a>
          )}
          {resume.personalInfo?.github && (
            <a href={resume.personalInfo.github} className="text-blue-600 hover:underline">
              GitHub
            </a>
          )}
        </div>
      </div>
      {}
      {resume.personalInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{resume.personalInfo.summary}</p>
        </div>
      )}
      {}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Experience</h2>
          <div className="space-y-4">
            {resume.experience.map((exp: any, index: number) => (
              <div key={index} className="border-l-4 border-blue-600 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-sm text-gray-600">
                    {getDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-gray-700 font-medium mb-1">{exp.company}</p>
                {exp.location && <p className="text-sm text-gray-600 mb-2">{exp.location}</p>}
                <p className="text-gray-700 mb-2">{exp.description}</p>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {exp.achievements.map((achievement: string, i: number) => (
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
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
          <div className="space-y-4">
            {resume.education.map((edu: any, index: number) => (
              <div key={index} className="border-l-4 border-green-600 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                  <span className="text-sm text-gray-600">
                    {getDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                <p className="text-gray-700 font-medium mb-1">{edu.institution}</p>
                {edu.location && <p className="text-sm text-gray-600 mb-1">{edu.location}</p>}
                <div className="flex gap-4 text-sm text-gray-600">
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  {edu.honors && <span>{edu.honors}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {resume.skills.map((skill: any, index: number) => (
              <div key={index} className="bg-gray-100 px-3 py-2 rounded">
                <span className="font-medium text-gray-900">{skill.name}</span>
                <span className="text-sm text-gray-600 ml-2 capitalize">({skill.level})</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects</h2>
          <div className="space-y-4">
            {resume.projects.map((project: any, index: number) => (
              <div key={index} className="border-l-4 border-purple-600 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                <p className="text-gray-700 mb-2">{project.description}</p>
                {project.technologies && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                  </p>
                )}
                <div className="flex gap-4 text-sm">
                  {project.githubUrl && (
                    <a href={project.githubUrl} className="text-blue-600 hover:underline">
                      GitHub
                    </a>
                  )}
                  {project.url && (
                    <a href={project.url} className="text-blue-600 hover:underline">
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
  const renderClassicTemplate = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto font-serif">
      {}
      <div className="text-center border-b border-gray-300 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}
        </h1>
        <p className="text-lg text-gray-600 mb-2">{resume.personalInfo?.email}</p>
        <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600">
          {resume.personalInfo?.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo?.location && <span>{resume.personalInfo.location}</span>}
          {resume.personalInfo?.linkedin && (
            <a href={resume.personalInfo.linkedin} className="text-blue-600 hover:underline">
              LinkedIn
            </a>
          )}
        </div>
      </div>
      {}
      {resume.personalInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{resume.personalInfo.summary}</p>
        </div>
      )}
      {}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {resume.experience.map((exp: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-sm text-gray-600 italic">
                    {getDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-gray-700 font-semibold mb-1">{exp.company}</p>
                {exp.location && <p className="text-sm text-gray-600 mb-2 italic">{exp.location}</p>}
                <p className="text-gray-700 mb-2">{exp.description}</p>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                    {exp.achievements.map((achievement: string, i: number) => (
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
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            Education
          </h2>
          <div className="space-y-4">
            {resume.education.map((edu: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                  <span className="text-sm text-gray-600 italic">
                    {getDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                <p className="text-gray-700 font-semibold mb-1">{edu.institution}</p>
                {edu.location && <p className="text-sm text-gray-600 italic mb-1">{edu.location}</p>}
                <div className="flex gap-4 text-sm text-gray-600">
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  {edu.honors && <span>{edu.honors}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill: any, index: number) => (
              <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                {skill.name} ({skill.level})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
  const renderMinimalTemplate = () => (
    <div className="bg-white p-6 max-w-4xl mx-auto font-sans">
      {}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-1">
          {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}
        </h1>
        <p className="text-gray-600 mb-2">{resume.personalInfo?.email}</p>
        <div className="text-sm text-gray-500 space-x-4">
          {resume.personalInfo?.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo?.location && <span>{resume.personalInfo.location}</span>}
        </div>
      </div>
      {}
      {resume.personalInfo?.summary && (
        <div className="mb-8 text-center">
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">{resume.personalInfo.summary}</p>
        </div>
      )}
      {}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 uppercase tracking-wide">Experience</h2>
          <div className="space-y-6">
            {resume.experience.map((exp: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-sm text-gray-500">
                    {getDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{exp.company}</p>
                <p className="text-sm text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 uppercase tracking-wide">Education</h2>
          <div className="space-y-4">
            {resume.education.map((edu: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                  <span className="text-sm text-gray-500">
                    {getDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {}
      {resume.skills && resume.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4 uppercase tracking-wide">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill: any, index: number) => (
              <span key={index} className="text-sm text-gray-700">
                {skill.name}
                {index < resume.skills.length - 1 && <span className="mx-1">•</span>}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
  const renderTechTemplate = () => (
    <div className="bg-gray-900 text-white p-8 max-w-4xl mx-auto font-mono">
      {}
      <div className="border-b-2 border-green-400 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-green-400 mb-2">
          {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}
        </h1>
        <p className="text-lg text-gray-300 mb-2">{resume.personalInfo?.email}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          {resume.personalInfo?.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo?.location && <span>{resume.personalInfo.location}</span>}
          {resume.personalInfo?.github && (
            <a href={resume.personalInfo.github} className="text-green-400 hover:underline">
              GitHub
            </a>
          )}
        </div>
      </div>
      {}
      {resume.personalInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-green-400 mb-2">$ whoami</h2>
          <p className="text-gray-300 leading-relaxed">{resume.personalInfo.summary}</p>
        </div>
      )}
      {}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-green-400 mb-4">$ skills --list</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {resume.skills.map((skill: any, index: number) => (
              <div key={index} className="bg-gray-800 px-3 py-2 rounded border-l-4 border-green-400">
                <span className="font-medium text-white">{skill.name}</span>
                <span className="text-sm text-gray-400 ml-2">[{skill.level}]</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-green-400 mb-4">$ cat experience.log</h2>
          <div className="space-y-4">
            {resume.experience.map((exp: any, index: number) => (
              <div key={index} className="bg-gray-800 p-4 rounded border-l-4 border-blue-400">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-blue-400">{exp.jobTitle}</h3>
                  <span className="text-sm text-gray-400">
                    {getDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-gray-300 font-medium mb-1">{exp.company}</p>
                <p className="text-gray-400 mb-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
  const renderExecutiveTemplate = () => (
    <div className="bg-gradient-to-br from-gray-50 to-white p-8 max-w-4xl mx-auto font-serif">
      {}
      <div className="text-center border-b-4 border-gray-800 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}
        </h1>
        <p className="text-lg text-gray-700 mb-2">{resume.personalInfo?.email}</p>
        <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600">
          {resume.personalInfo?.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo?.location && <span>{resume.personalInfo.location}</span>}
          {resume.personalInfo?.linkedin && (
            <a href={resume.personalInfo.linkedin} className="text-gray-800 hover:underline">
              LinkedIn Profile
            </a>
          )}
        </div>
      </div>
      {}
      {resume.personalInfo?.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            EXECUTIVE SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            {resume.personalInfo.summary}
          </p>
        </div>
      )}
      {}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-6">
            {resume.experience.map((exp: any, index: number) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-800">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-sm text-gray-600 font-medium">
                    {getDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-gray-800 font-semibold mb-2 text-lg">{exp.company}</p>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
  const selectedTemplate = resume.template || template
  switch (selectedTemplate) {
    case 'classic':
      return renderClassicTemplate()
    case 'minimal':
      return renderMinimalTemplate()
    case 'tech':
      return renderTechTemplate()
    case 'executive':
      return renderExecutiveTemplate()
    case 'academic':
    case 'startup':
      return renderClassicTemplate() 
    case 'modern':
    default:
      return renderModernTemplate()
  }
} 