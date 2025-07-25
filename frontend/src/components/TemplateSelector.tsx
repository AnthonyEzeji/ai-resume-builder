'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckIcon, EyeIcon, SparklesIcon, StarIcon } from '@heroicons/react/24/outline'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

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
  columns?: 1 | 2 | 3 | 4 | 5
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
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const { toast } = useToast()

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
  }, [templates, selectedCategory])

  const fetchTemplates = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/template')
      setTemplates(response.data.data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load templates",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId)
  }

  const getCardSize = () => {
    switch (size) {
      case 'small': return 'p-3'
      case 'large': return 'p-8'
      default: return 'p-6'
    }
  }

  const getPreviewSize = () => {
    switch (size) {
      case 'small': return 'h-32'
      case 'large': return 'h-48'
      default: return 'h-40'
    }
  }

  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-1 md:grid-cols-2'
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      case 5: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  const renderTemplatePreview = (template: Template) => {
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

    const baseStyle = previewStyles[template.id as keyof typeof previewStyles] || previewStyles.modern

    return (
      <div className={`${getPreviewSize()} ${baseStyle} rounded-lg relative overflow-hidden`}>
        <div className="h-full p-4 text-xs space-y-2">
          <div className="h-3 bg-current opacity-20 rounded w-2/3"></div>
          <div className="h-2 bg-current opacity-15 rounded w-1/2"></div>
          <div className="space-y-1 mt-3">
            <div className="h-1 bg-current opacity-10 rounded w-full"></div>
            <div className="h-1 bg-current opacity-10 rounded w-3/4"></div>
            <div className="h-1 bg-current opacity-10 rounded w-5/6"></div>
          </div>
          <div className="space-y-1 mt-3">
            <div className="h-1 bg-current opacity-10 rounded w-2/3"></div>
            <div className="h-1 bg-current opacity-10 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className={`grid ${getGridCols()} gap-4`}>
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id
                ? 'ring-2 ring-primary shadow-lg bg-primary/5'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            {template.isPremium && (
              <Badge className="absolute top-2 left-2 z-10 bg-yellow-500 hover:bg-yellow-600">
                <StarIcon className="w-3 h-3 mr-1" />
                PRO
              </Badge>
            )}
            
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-primary text-primary-foreground rounded-full p-1">
                  <CheckIcon className="w-4 h-4" />
                </div>
              </div>
            )}

            <CardHeader className={getCardSize()}>
              {showPreview && renderTemplatePreview(template)}
            </CardHeader>

            <CardContent className={`${getCardSize()} pt-0`}>
              <div className="space-y-2">
                <CardTitle className={`${size === 'small' ? 'text-sm' : 'text-base'} font-semibold`}>
                  {template.name}
                </CardTitle>
                
                {size !== 'small' && (
                  <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </CardDescription>
                )}

                {template.features && template.features.length > 0 && size !== 'small' && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                          {feature}
                        </Badge>
                      ))}
                      {template.features.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{template.features.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                  
                  {showPreview && currentResume && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPreviewTemplate(template)
                          }}
                        >
                          <EyeIcon className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Preview: {template.name}</DialogTitle>
                          <DialogDescription>
                            See how your resume would look with this template
                          </DialogDescription>
                        </DialogHeader>
                        <div className="bg-muted p-8 rounded-lg">
                          <div className="bg-white shadow-lg mx-auto max-w-2xl">
                            <div className="p-8 text-sm">
                              <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold">{currentResume?.personalInfo?.firstName} {currentResume?.personalInfo?.lastName}</h1>
                                <p className="text-muted-foreground">{currentResume?.personalInfo?.email}</p>
                              </div>
                              <p className="text-xs text-muted-foreground text-center">
                                This is a preview showing how your resume data would appear in the {template.name} template.
                              </p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <SparklesIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try selecting a different category or check back later for new templates.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 