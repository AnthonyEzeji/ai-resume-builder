'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, BriefcaseIcon, AcademicCapIcon, WrenchScrewdriverIcon, CommandLineIcon } from '@heroicons/react/24/outline'

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

  const { register, handleSubmit, control, watch, formState: { errors }, setValue } = useForm({
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

  const addExperience = () => {
    appendExperience({
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: ''
    })
  }

  const addEducation = () => {
    appendEducation({
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      honors: ''
    })
  }

  const addSkill = () => {
    appendSkill({
      name: '',
      level: 'intermediate',
      category: ''
    })
  }

  const addProject = () => {
    appendProject({
      name: '',
      description: '',
      technologies: '',
      url: '',
      githubUrl: ''
    })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information Section */}
        <Card>
          <Collapsible 
            open={expandedSections.personalInfo} 
            onOpenChange={() => toggleSection('personalInfo')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BriefcaseIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Your basic contact details</CardDescription>
                    </div>
                  </div>
                  {expandedSections.personalInfo ? (
                    <ChevronUpIcon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register('personalInfo.firstName', { required: 'First name is required' })}
                      placeholder="John"
                    />
                    {(errors.personalInfo as any)?.firstName && (
                      <p className="text-sm text-destructive">{(errors.personalInfo as any).firstName?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register('personalInfo.lastName', { required: 'Last name is required' })}
                      placeholder="Doe"
                    />
                    {(errors.personalInfo as any)?.lastName && (
                      <p className="text-sm text-destructive">{(errors.personalInfo as any).lastName?.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('personalInfo.email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    placeholder="john@example.com"
                  />
                  {(errors.personalInfo as any)?.email && (
                    <p className="text-sm text-destructive">{(errors.personalInfo as any).email?.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      {...register('personalInfo.phone')}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      {...register('personalInfo.location')}
                      placeholder="New York, NY"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      {...register('personalInfo.website')}
                      placeholder="https://johndoe.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      {...register('personalInfo.linkedin')}
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    {...register('personalInfo.summary')}
                    placeholder="Write a compelling summary of your professional background..."
                    className="min-h-[100px]"
                  />
                  {(errors.personalInfo as any)?.summary && (
                    <p className="text-sm text-destructive">{(errors.personalInfo as any).summary?.message}</p>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Experience Section */}
        <Card>
          <Collapsible 
            open={expandedSections.experience} 
            onOpenChange={() => toggleSection('experience')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BriefcaseIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Work Experience</CardTitle>
                      <CardDescription>Your professional work history</CardDescription>
                    </div>
                    <Badge variant="secondary">{experienceFields.length}</Badge>
                  </div>
                  {expandedSections.experience ? (
                    <ChevronUpIcon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {experienceFields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-muted/20">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Experience {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-destructive"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Job Title *</Label>
                        <Input
                          {...register(`experience.${index}.jobTitle`, { required: 'Job title is required' })}
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company *</Label>
                        <Input
                          {...register(`experience.${index}.company`, { required: 'Company is required' })}
                          placeholder="Tech Corp"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          {...register(`experience.${index}.location`)}
                          placeholder="New York, NY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          {...register(`experience.${index}.startDate`)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          {...register(`experience.${index}.endDate`)}
                          disabled={watch(`experience.${index}.current`)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        {...register(`experience.${index}.current`)}
                        onCheckedChange={(checked) => setValue(`experience.${index}.current`, checked)}
                      />
                      <Label>Currently working here</Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Job Description</Label>
                      <Textarea
                        {...register(`experience.${index}.description`)}
                        placeholder="Describe your role and responsibilities..."
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Key Achievements</Label>
                      <Textarea
                        {...register(`experience.${index}.achievements`)}
                        placeholder="List your key achievements and accomplishments..."
                        className="min-h-[60px]"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExperience}
                  className="w-full"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Education Section */}
        <Card>
          <Collapsible 
            open={expandedSections.education} 
            onOpenChange={() => toggleSection('education')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <AcademicCapIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Education</CardTitle>
                      <CardDescription>Your educational background</CardDescription>
                    </div>
                    <Badge variant="secondary">{educationFields.length}</Badge>
                  </div>
                  {expandedSections.education ? (
                    <ChevronUpIcon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {educationFields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-muted/20">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Education {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className="text-destructive"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Degree *</Label>
                        <Input
                          {...register(`education.${index}.degree`, { required: 'Degree is required' })}
                          placeholder="Bachelor of Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Institution *</Label>
                        <Input
                          {...register(`education.${index}.institution`, { required: 'Institution is required' })}
                          placeholder="University of Technology"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          {...register(`education.${index}.location`)}
                          placeholder="Boston, MA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          {...register(`education.${index}.startDate`)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          {...register(`education.${index}.endDate`)}
                          disabled={watch(`education.${index}.current`)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        {...register(`education.${index}.current`)}
                        onCheckedChange={(checked) => setValue(`education.${index}.current`, checked)}
                      />
                      <Label>Currently studying</Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>GPA</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="4"
                          {...register(`education.${index}.gpa`)}
                          placeholder="3.8"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Honors/Awards</Label>
                        <Input
                          {...register(`education.${index}.honors`)}
                          placeholder="Magna Cum Laude"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addEducation}
                  className="w-full"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Skills Section */}
        <Card>
          <Collapsible 
            open={expandedSections.skills} 
            onOpenChange={() => toggleSection('skills')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <WrenchScrewdriverIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Skills</CardTitle>
                      <CardDescription>Your technical and soft skills</CardDescription>
                    </div>
                    <Badge variant="secondary">{skillFields.length}</Badge>
                  </div>
                  {expandedSections.skills ? (
                    <ChevronUpIcon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {skillFields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-muted/20">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Skill {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSkill(index)}
                        className="text-destructive"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Skill Name *</Label>
                        <Input
                          {...register(`skills.${index}.name`, { required: 'Skill name is required' })}
                          placeholder="JavaScript"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Proficiency Level</Label>
                        <Select
                          value={watch(`skills.${index}.level`)}
                          onValueChange={(value) => setValue(`skills.${index}.level`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Input
                          {...register(`skills.${index}.category`)}
                          placeholder="Programming Languages"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSkill}
                  className="w-full"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Projects Section */}
        <Card>
          <Collapsible 
            open={expandedSections.projects} 
            onOpenChange={() => toggleSection('projects')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CommandLineIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Projects</CardTitle>
                      <CardDescription>Your notable projects and work</CardDescription>
                    </div>
                    <Badge variant="secondary">{projectFields.length}</Badge>
                  </div>
                  {expandedSections.projects ? (
                    <ChevronUpIcon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {projectFields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-muted/20">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Project {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeProject(index)}
                        className="text-destructive"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Project Name *</Label>
                      <Input
                        {...register(`projects.${index}.name`, { required: 'Project name is required' })}
                        placeholder="E-commerce Platform"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        {...register(`projects.${index}.description`)}
                        placeholder="Describe the project, your role, and what you accomplished..."
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Technologies Used</Label>
                      <Input
                        {...register(`projects.${index}.technologies`)}
                        placeholder="React, Node.js, MongoDB, AWS"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Project URL</Label>
                        <Input
                          type="url"
                          {...register(`projects.${index}.url`)}
                          placeholder="https://project-demo.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GitHub URL</Label>
                        <Input
                          type="url"
                          {...register(`projects.${index}.githubUrl`)}
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addProject}
                  className="w-full"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <Separator />

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={isSaving}
            size="lg"
          >
            {isSaving ? 'Saving...' : 'Save Resume'}
          </Button>
        </div>
      </form>
    </div>
  )
} 