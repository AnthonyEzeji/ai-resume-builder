'use client'
import { useState, useEffect } from 'react'
import { CheckIcon, EyeIcon, SparklesIcon, StarIcon } from '@heroicons/react/24/outline'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
interface Template {
  id: string
  name: string
  description: string
  preview: string
  category: string
  features?: string[]
  isPremium?: boolean
}
interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateSelect: (templateId: string) => void
  currentResume?: any 
  showPreview?: boolean
  size?: 'small' | 'medium' | 'large'
  columns?: number
}
export default function TemplateSelector({ 
  selectedTemplate, 
  onTemplateSelect, 
  currentResume,
  showPreview = true,
  size = 'medium',
  columns = 3
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'modern', name: 'Modern' },
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
    { id: 'executive', name: 'Executive' },
    { id: 'minimal', name: 'Minimal' }
  ]
  useEffect(() => {
    fetchTemplates()
  }, [])
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredTemplates(templates)
    } else {
      setFilteredTemplates(templates.filter(template => template.category === selectedCategory))
    }
  }, [selectedCategory, templates])
  const fetchTemplates = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/template')
      if (response.data.success) {
        setTemplates(response.data.data)
        setFilteredTemplates(response.data.data)
      } else {
        toast.error('Failed to load templates')
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to load templates')
    } finally {
      setIsLoading(false)
    }
  }
  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId)
  }
  const getCardSize = () => {
    switch (size) {
      case 'small':
        return 'p-3'
      case 'large':
        return 'p-6'
      default:
        return 'p-4'
    }
  }
  const getPreviewSize = () => {
    switch (size) {
      case 'small':
        return 'aspect-[3/4] h-24'
      case 'large':
        return 'aspect-[3/4] h-48'
      default:
        return 'aspect-[3/4] h-32'
    }
  }
  const getGridCols = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1'
      case 2:
        return 'grid-cols-1 md:grid-cols-2'
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      case 5:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'
      default: 
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }
  const renderTemplatePreview = (template: Template) => {
    // For now, we'll use placeholder previews
    // In a real implementation, you'd generate actual preview images
    const previewStyles = {
      modern: 'bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500',
      classic: 'bg-gradient-to-br from-gray-50 to-white border-t-2 border-gray-400',
      minimal: 'bg-white border border-gray-200',
      creative: 'bg-gradient-to-br from-purple-50 to-pink-50 border-l-4 border-purple-500',
      executive: 'bg-gradient-to-br from-gray-900 to-gray-700 text-white',
      tech: 'bg-gray-900 text-green-400 border-l-4 border-green-400',
      academic: 'bg-gradient-to-br from-blue-50 to-white border-t-2 border-blue-600',
      startup: 'bg-gradient-to-br from-orange-50 to-yellow-50 border-l-4 border-orange-500'
    }
    const previewStyle = previewStyles[template.id as keyof typeof previewStyles] || previewStyles.modern
    return (
      <div className={`${getPreviewSize()} ${previewStyle} rounded-lg flex flex-col justify-center items-center text-center p-2`}>
        <div className="w-full space-y-1">
          <div className="h-2 bg-current opacity-60 rounded w-3/4 mx-auto"></div>
          <div className="h-1 bg-current opacity-40 rounded w-1/2 mx-auto"></div>
          <div className="h-1 bg-current opacity-40 rounded w-2/3 mx-auto"></div>
          <div className="space-y-1 mt-2">
            <div className="h-1 bg-current opacity-30 rounded w-full"></div>
            <div className="h-1 bg-current opacity-30 rounded w-4/5"></div>
            <div className="h-1 bg-current opacity-30 rounded w-3/5"></div>
          </div>
        </div>
      </div>
    )
  }
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className={`grid ${getGridCols()} gap-4`}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      {}
      <div className={`grid ${getGridCols()} gap-4`}>
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={`relative border-2 rounded-lg ${getCardSize()} cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            {}
            {template.isPremium && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full flex items-center z-10">
                <StarIcon className="w-3 h-3 mr-1" />
                PRO
              </div>
            )}
            {}
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-10">
                <CheckIcon className="w-4 h-4 text-white" />
              </div>
            )}
            {}
            {showPreview && renderTemplatePreview(template)}
            {}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`font-semibold text-gray-900 ${size === 'small' ? 'text-sm' : 'text-base'}`}>
                  {template.name}
                </h3>
                {template.id === 'creative' && (
                  <SparklesIcon className="w-4 h-4 text-purple-500" />
                )}
              </div>
              <p className={`text-gray-600 mb-2 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
                {template.description}
              </p>
              {}
              {template.features && template.features.length > 0 && size !== 'small' && (
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 2).map((feature, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{template.features.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className={`inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded ${size === 'small' ? 'text-xs' : 'text-xs'}`}>
                  {template.category}
                </span>
                {showPreview && currentResume && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewTemplate(template.id)
                    }}
                    className="text-blue-600 hover:text-blue-700 p-1"
                    title="Preview with your data"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredTemplates.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No templates found in this category.</p>
        </div>
      )}
      {}
      {previewTemplate && currentResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Preview: {templates.find(t => t.id === previewTemplate)?.name}
              </h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {}
              <div className="text-center text-gray-500">
                Template preview with your resume data would appear here
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 