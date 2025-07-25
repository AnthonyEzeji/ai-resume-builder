'use client'
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
interface ResumeFormProps {
  resume: any
  onSave: (data: any) => void
  isSaving: boolean
}
export default function ResumeForm({ resume, onSave, isSaving }: ResumeFormProps) {
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    experience: true,
    education: true,
    skills: true,
    projects: true
  })
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      ...resume,
      experience: resume?.experience || [],
      education: resume?.education || [],
      skills: resume?.skills || [],
      projects: resume?.projects || []
    }
  })
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'experience'
  })
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education'
  })
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills'
  })
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: 'projects'
  })
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }))
  }
  const onSubmit = (data: any) => {
    onSave(data)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('personalInfo')}
          className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          {expandedSections.personalInfo ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {expandedSections.personalInfo && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  {...register('personalInfo.firstName', { required: 'First name is required' })}
                  className="input"
                />
                {(errors.personalInfo as any)?.firstName && (
                  <p className="text-red-600 text-sm mt-1">{(errors.personalInfo as any).firstName?.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  {...register('personalInfo.lastName', { required: 'Last name is required' })}
                  className="input"
                />
                {(errors.personalInfo as any)?.lastName && (
                  <p className="text-red-600 text-sm mt-1">{(errors.personalInfo as any).lastName?.message}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                {...register('personalInfo.email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="input"
              />
              {errors.personalInfo?.email && (
                <p className="text-red-600 text-sm mt-1">{errors.personalInfo.email.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  {...register('personalInfo.phone')}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  {...register('personalInfo.location')}
                  className="input"
                  placeholder="City, State"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  {...register('personalInfo.linkedin')}
                  className="input"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub
                </label>
                <input
                  type="url"
                  {...register('personalInfo.github')}
                  className="input"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  {...register('personalInfo.website')}
                  className="input"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Summary *
              </label>
              <textarea
                {...register('personalInfo.summary', { required: 'Summary is required' })}
                rows={4}
                className="textarea"
                placeholder="Brief professional summary highlighting your key strengths and career objectives..."
              />
              {errors.personalInfo?.summary && (
                <p className="text-red-600 text-sm mt-1">{errors.personalInfo.summary.message}</p>
              )}
            </div>
          </div>
        )}
      </div>
      {}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('experience')}
          className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
          {expandedSections.experience ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {expandedSections.experience && (
          <div className="p-6 space-y-4">
            {experienceFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      {...register(`experience.${index}.jobTitle`, { required: 'Job title is required' })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company *
                    </label>
                    <input
                      type="text"
                      {...register(`experience.${index}.company`, { required: 'Company is required' })}
                      className="input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      {...register(`experience.${index}.location`)}
                      className="input"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        {...register(`experience.${index}.startDate`, { required: 'Start date is required' })}
                        className="input"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        {...register(`experience.${index}.endDate`)}
                        className="input"
                        disabled={watch(`experience.${index}.current`)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register(`experience.${index}.current`)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Currently working here</span>
                  </label>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    {...register(`experience.${index}.description`, { required: 'Description is required' })}
                    rows={3}
                    className="textarea"
                    placeholder="Describe your role and responsibilities..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Achievements
                  </label>
                  <textarea
                    {...register(`experience.${index}.achievements`)}
                    rows={3}
                    className="textarea"
                    placeholder="List your key achievements and accomplishments..."
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendExperience({
                jobTitle: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
                achievements: []
              })}
              className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Experience
            </button>
          </div>
        )}
      </div>
      {}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('education')}
          className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          {expandedSections.education ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {expandedSections.education && (
          <div className="p-6 space-y-4">
            {educationFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree *
                    </label>
                    <input
                      type="text"
                      {...register(`education.${index}.degree`, { required: 'Degree is required' })}
                      className="input"
                      placeholder="e.g., Bachelor of Science in Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution *
                    </label>
                    <input
                      type="text"
                      {...register(`education.${index}.institution`, { required: 'Institution is required' })}
                      className="input"
                      placeholder="e.g., University of California"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      {...register(`education.${index}.location`)}
                      className="input"
                      placeholder="City, State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      {...register(`education.${index}.startDate`, { required: 'Start date is required' })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      {...register(`education.${index}.endDate`)}
                      className="input"
                      disabled={watch(`education.${index}.current`)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register(`education.${index}.current`)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Currently studying</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      {...register(`education.${index}.gpa`)}
                      className="input"
                      placeholder="3.8"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Honors & Awards
                  </label>
                  <input
                    type="text"
                    {...register(`education.${index}.honors`)}
                    className="input"
                    placeholder="e.g., Magna Cum Laude, Dean's List"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendEducation({
                degree: '',
                institution: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                gpa: undefined,
                honors: '',
                relevantCoursework: []
              })}
              className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Education
            </button>
          </div>
        )}
      </div>
      {}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('skills')}
          className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
          {expandedSections.skills ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {expandedSections.skills && (
          <div className="p-6 space-y-4">
            {skillFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    {...register(`skills.${index}.name`, { required: 'Skill name is required' })}
                    className="input"
                    placeholder="e.g., JavaScript"
                  />
                </div>
                <div className="w-32">
                  <select
                    {...register(`skills.${index}.level`)}
                    className="input"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div className="w-32">
                  <input
                    type="text"
                    {...register(`skills.${index}.category`)}
                    className="input"
                    placeholder="Category"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendSkill({
                name: '',
                level: 'intermediate',
                category: ''
              })}
              className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Skill
            </button>
          </div>
        )}
      </div>
      {}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('projects')}
          className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
          {expandedSections.projects ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {expandedSections.projects && (
          <div className="p-6 space-y-4">
            {projectFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">Project {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    {...register(`projects.${index}.name`, { required: 'Project name is required' })}
                    className="input"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    {...register(`projects.${index}.description`, { required: 'Description is required' })}
                    rows={3}
                    className="textarea"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Technologies
                    </label>
                    <input
                      type="text"
                      {...register(`projects.${index}.technologies`)}
                      className="input"
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      {...register(`projects.${index}.githubUrl`)}
                      className="input"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Live URL
                  </label>
                  <input
                    type="url"
                    {...register(`projects.${index}.url`)}
                    className="input"
                    placeholder="https://..."
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendProject({
                name: '',
                description: '',
                technologies: [],
                url: '',
                githubUrl: '',
                startDate: '',
                endDate: ''
              })}
              className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Project
            </button>
          </div>
        )}
      </div>
      {}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Resume'}
        </button>
      </div>
    </form>
  )
} 