'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { 
  PlusIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  UserIcon,
  CogIcon,
  ArrowRightIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline'
import { api } from '@/lib/api'

interface Resume {
  _id: string
  title: string
  template: string
  atsScore?: number
  updatedAt: string
  isPublic: boolean
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load resumes",
      })
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
    try {
      await api.delete(`/resume/${id}`)
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      })
      fetchResumes()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete resume",
      })
    }
  }

  const duplicateResume = async (id: string) => {
    try {
      await api.post(`/resume/${id}/duplicate`)
      toast({
        title: "Success",
        description: "Resume duplicated successfully",
      })
      fetchResumes()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to duplicate resume",
      })
    }
  }

  const getScoreBadgeVariant = (score?: number) => {
    if (!score) return "secondary"
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  const getScoreColor = (score?: number) => {
    if (!score) return "text-muted-foreground"
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <DocumentTextIcon className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  AI Resume Builder
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="default" asChild>
                <Link href="/resume/new">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Resume
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/templates">
                      <DocumentTextIcon className="mr-2 h-4 w-4" />
                      Templates
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/ats-analyzer">
                      <SparklesIcon className="mr-2 h-4 w-4" />
                      ATS Analyzer
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <CogIcon className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your resume building progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
              <DocumentTextIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResumes}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalResumes > 0 ? '+1 from last month' : 'Create your first resume'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average ATS Score</CardTitle>
              <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
                {stats.averageScore}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.averageScore >= 80 ? 'Excellent performance' : 'Room for improvement'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <ArrowTrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentActivity}</div>
              <p className="text-xs text-muted-foreground">
                Resumes updated this week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">My Resumes</h2>
            <p className="text-muted-foreground">
              Manage and edit your professional resumes
            </p>
          </div>
          <Button asChild>
            <Link href="/resume/new">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create New Resume
            </Link>
          </Button>
        </div>

        {resumes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <DocumentTextIcon className="h-16 w-16 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No resumes yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Create your first resume to get started on your career journey
                </p>
              </div>
              <Button asChild>
                <Link href="/resume/new">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Your First Resume
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {resumes.map((resume) => (
              <Card key={resume._id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg line-clamp-1">{resume.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {resume.template}
                        </Badge>
                        {resume.isPublic && (
                          <Badge variant="secondary" className="text-xs">
                            Public
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                      <EllipsisHorizontalIcon className="h-4 w-4" />
                    </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/resume/${resume._id}/edit`}>
                            <EyeIcon className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateResume(resume._id)}>
                          <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => deleteResume(resume._id)}
                          className="text-destructive"
                        >
                          <TrashIcon className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {resume.atsScore && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">ATS Score</span>
                      <Badge variant={getScoreBadgeVariant(resume.atsScore)}>
                        {resume.atsScore}%
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Updated {new Date(resume.updatedAt).toLocaleDateString()}
                  </div>
                  
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/resume/${resume._id}/edit`}>
                      Edit Resume
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Explore more features to enhance your resume building experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" asChild className="h-auto p-4">
                <Link href="/templates" className="flex flex-col items-center space-y-2">
                  <DocumentTextIcon className="h-8 w-8 text-primary" />
                  <div className="text-center">
                    <div className="font-medium">Browse Templates</div>
                    <div className="text-xs text-muted-foreground">Explore professional designs</div>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="h-auto p-4">
                <Link href="/ats-analyzer" className="flex flex-col items-center space-y-2">
                  <SparklesIcon className="h-8 w-8 text-primary" />
                  <div className="text-center">
                    <div className="font-medium">ATS Analyzer</div>
                    <div className="text-xs text-muted-foreground">Check resume compatibility</div>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="h-auto p-4">
                <Link href="/profile" className="flex flex-col items-center space-y-2">
                  <UserIcon className="h-8 w-8 text-primary" />
                  <div className="text-center">
                    <div className="font-medium">Profile Settings</div>
                    <div className="text-xs text-muted-foreground">Manage your account</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 