'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  BarChart3, 
  Calendar, 
  DollarSign, 
  Target,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  Globe,
  Clock
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Project {
  id: string
  name: string
  company: string
  industry: string
  budget: number
  status: 'active' | 'completed' | 'draft'
  createdAt: string
  lastModified: string
  metrics: {
    impressions: number
    clicks: number
    conversions: number
    roas: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // Load projects from localStorage
    const savedProjects = localStorage.getItem('spendr_projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      // Generate sample projects
      const sampleProjects: Project[] = [
        {
          id: '1',
          name: 'Q4 Marketing Campaign',
          company: 'TechCorp Inc.',
          industry: 'Technology',
          budget: 50000,
          status: 'active',
          createdAt: '2024-01-15',
          lastModified: '2024-01-20',
          metrics: {
            impressions: 125000,
            clicks: 3200,
            conversions: 180,
            roas: 2.4
          }
        },
        {
          id: '2',
          name: 'Holiday Sales Push',
          company: 'RetailMax',
          industry: 'Retail',
          budget: 25000,
          status: 'completed',
          createdAt: '2023-12-01',
          lastModified: '2023-12-31',
          metrics: {
            impressions: 89000,
            clicks: 2100,
            conversions: 95,
            roas: 1.8
          }
        },
        {
          id: '3',
          name: 'Brand Awareness Campaign',
          company: 'StartupXYZ',
          industry: 'SaaS',
          budget: 15000,
          status: 'draft',
          createdAt: '2024-01-10',
          lastModified: '2024-01-18',
          metrics: {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            roas: 0
          }
        }
      ]
      setProjects(sampleProjects)
      localStorage.setItem('projects', JSON.stringify(sampleProjects))
    }
    setIsLoading(false)
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateProject = () => {
    router.push('/campaign-setup')
  }

  const handleViewProject = (projectId: string) => {
    router.push(`/dashboard?project=${projectId}`)
  }

  const handleEditProject = (projectId: string) => {
    router.push(`/campaign-setup?edit=${projectId}`)
  }

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId)
    setProjects(updatedProjects)
    localStorage.setItem('projects', JSON.stringify(updatedProjects))
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.name}
              </h1>
              <p className="text-gray-600">
                Manage your marketing campaigns and track performance
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">
                {projects.filter(p => p.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg ROAS</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.length > 0 
                  ? (projects.reduce((sum, p) => sum + p.metrics.roas, 0) / projects.length).toFixed(1)
                  : '0.0'
                }x
              </div>
              <p className="text-xs text-muted-foreground">
                Return on ad spend
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.reduce((sum, p) => sum + p.metrics.conversions, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
            <Button onClick={handleCreateProject} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>

          {projects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 text-center mb-6">
                  Get started by creating your first marketing campaign
                </p>
                <Button onClick={handleCreateProject} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                        <CardDescription className="mb-2">{project.company}</CardDescription>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Project Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span>${project.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span>{project.industry}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{new Date(project.lastModified).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Metrics */}
                      {project.status !== 'draft' && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium mb-2">Performance</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span>Impressions:</span>
                              <span className="font-medium">{project.metrics.impressions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Clicks:</span>
                              <span className="font-medium">{project.metrics.clicks.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Conversions:</span>
                              <span className="font-medium">{project.metrics.conversions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>ROAS:</span>
                              <span className="font-medium">{project.metrics.roas}x</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProject(project.id)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProject(project.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
