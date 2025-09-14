'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  BarChart3, 
  ArrowRight, 
  Sparkles, 
  TrendingUp,
  Target,
  Zap,
  Users,
  Globe,
  Lightbulb,
  Eye,
  Star,
  Monitor
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push('/landing')
      return
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleAIOptimization = () => {
    router.push('/ai-optimizer')
  }

  const handleComparison = () => {
    router.push('/campaign-setup')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pt-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            $pendr
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-Powered Marketing Campaign Optimization Platform
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI-Powered
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Data-Driven
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Optimized
            </div>
          </div>
          
        </div>

        {/* Main Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* AI Optimization Path */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-300 cursor-pointer" onClick={handleAIOptimization}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-900">AI-Powered Optimization</CardTitle>
              <CardDescription className="text-lg">
                Get the ideal spending structure from our AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Instant AI Analysis</h4>
                    <p className="text-sm text-gray-600">Get immediate recommendations for optimal budget allocation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Channel Optimization</h4>
                    <p className="text-sm text-gray-600">AI determines the best channels and spending distribution</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Performance Predictions</h4>
                    <p className="text-sm text-gray-600">See expected ROI and conversion improvements</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-400 transition-colors" size="lg">
                  Get AI Optimization
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Path */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-300 cursor-pointer" onClick={handleComparison}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-900">Compare & Analyze</CardTitle>
              <CardDescription className="text-lg">
                Compare with previous data and get suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Campaign Setup</h4>
                    <p className="text-sm text-gray-600">Input your campaign details for comprehensive analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Detailed Dashboard</h4>
                    <p className="text-sm text-gray-600">View predictions, shortcomings, and optimization opportunities</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Smart Suggestions</h4>
                    <p className="text-sm text-gray-600">Get specific recommendations with case studies</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full group-hover:bg-green-50 group-hover:border-green-400 transition-colors" size="lg">
                  Start Campaign Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Simulate Ad Path */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-300 cursor-pointer" onClick={() => router.push('/simulate')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl text-purple-900">Simulate your ad</CardTitle>
              <CardDescription className="text-lg">
                Preview how your ads will look across different platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Platform Preview</h4>
                    <p className="text-sm text-gray-600">See how your ads appear on Facebook, Google, Instagram, and LinkedIn</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Monitor className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Device Simulation</h4>
                    <p className="text-sm text-gray-600">Preview across desktop, tablet, and mobile devices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-time Testing</h4>
                    <p className="text-sm text-gray-600">Upload your creatives and see instant previews</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full group-hover:bg-purple-50 group-hover:border-purple-400 transition-colors" size="lg">
                  Simulate Ad
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rate Ad Path */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-300 cursor-pointer" onClick={() => router.push('/rate-ad')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl text-orange-900">Rate your ad</CardTitle>
              <CardDescription className="text-lg">
                Get AI-powered analysis and improvement suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">AI Ad Analysis</h4>
                    <p className="text-sm text-gray-600">Comprehensive scoring based on readability, emotion, and effectiveness</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Improvement Suggestions</h4>
                    <p className="text-sm text-gray-600">Get specific recommendations to boost ad performance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Performance Metrics</h4>
                    <p className="text-sm text-gray-600">Detailed breakdown of CTA, power words, and uniqueness scores</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full group-hover:bg-orange-50 group-hover:border-orange-400 transition-colors" size="lg">
                  Rate Ad
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl">What You'll Get</CardTitle>
            <CardDescription className="text-center">
              Comprehensive marketing insights and optimization tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mx-auto mb-3 p-3 bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Campaign Analysis</h3>
                <p className="text-sm text-gray-600">Detailed breakdown of your marketing strategy with predictions</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 p-3 bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Performance Optimization</h3>
                <p className="text-sm text-gray-600">AI-powered recommendations to improve ROI and conversions</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 p-3 bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold mb-2">Strategy Comparison</h3>
                <p className="text-sm text-gray-600">Compare different approaches and see real-time impact</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
