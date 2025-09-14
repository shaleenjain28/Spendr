'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft,
  Upload,
  Star,
  TrendingUp,
  Target,
  Eye,
  MessageSquare,
  Zap,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Lightbulb,
  FileText,
  Image as ImageIcon
} from 'lucide-react'
import { evaluateAd, AdAnalysisResult } from '@/lib/ad-analyzer'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export default function RateAdPage() {
  const router = useRouter()
  const [adText, setAdText] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AdAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!adText.trim()) return
    
    setIsAnalyzing(true)
    
    // Simulate analysis delay
    setTimeout(() => {
      const result = evaluateAd(adText)
      setAnalysisResult(result)
      setIsAnalyzing(false)
    }, 1500)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    if (percentage >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getBandColor = (band: string) => {
    switch (band) {
      case 'Excellent': return 'bg-green-100 text-green-800 border-green-200'
      case 'Good': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Average': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Weak': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const sampleAds = [
    "New summer collection just dropped. Shop now and save on trending styles!",
    "Upgrade to premium today for instant access. Try it free—limited time.",
    "We sell clothes.",
    "Discover handcrafted linen shirts designed for Indian summers. Breathable, durable, and refined—order yours today."
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Ad Rating & Analysis
                </h1>
                <p className="text-gray-600">
                  Get AI-powered analysis and improvement suggestions for your ads
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Text Ad
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Image Ad
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Enter Your Ad Text</CardTitle>
                    <CardDescription>
                      Paste your ad copy here for AI analysis and scoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Enter your ad text here..."
                      value={adText}
                      onChange={(e) => setAdText(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-gray-500">
                        {adText.length} characters, {adText.split(/\s+/).filter(w => w.length > 0).length} words
                      </span>
                      <Button 
                        onClick={handleAnalyze}
                        disabled={!adText.trim() || isAnalyzing}
                        className="flex items-center gap-2"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <BarChart3 className="h-4 w-4" />
                            Analyze Ad
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Sample Ads */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Try Sample Ads</CardTitle>
                    <CardDescription>
                      Click on any sample to analyze it
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {sampleAds.map((ad, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => setAdText(ad)}
                        >
                          <div className="text-sm font-medium mb-1">Sample Ad {index + 1}</div>
                          <div className="text-sm text-gray-600">{ad}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="image" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Image Ad</CardTitle>
                    <CardDescription>
                      Upload an image ad for analysis (OCR text extraction coming soon)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Upload your image ad</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                    
                    {uploadedImage && (
                      <div className="mt-4">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded ad" 
                          className="max-w-full h-64 object-contain border rounded-lg"
                        />
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 text-yellow-800">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Image Analysis Coming Soon</span>
                          </div>
                          <p className="text-sm text-yellow-700 mt-1">
                            For now, please extract the text from your image and use the Text Ad tab for analysis.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysisResult && (
              <>
                {/* Overall Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Overall Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{analysisResult.total}/100</div>
                      <Badge className={`text-lg px-4 py-2 ${getBandColor(analysisResult.band)}`}>
                        {analysisResult.band}
                      </Badge>
                      <div className="mt-4">
                        <Progress value={analysisResult.total} className="h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Scores */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Detailed Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(analysisResult.scores).map(([key, score]) => {
                      const maxScore = key === 'readability' ? 20 : 
                                     key === 'length_conciseness' ? 15 :
                                     key === 'emotion' ? 20 :
                                     key === 'power_words' ? 15 :
                                     key === 'cta' ? 15 : 15;
                      
                      return (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium capitalize">
                              {key.replace('_', ' ')}
                            </span>
                            <span className={`text-sm font-bold ${getScoreColor(score, maxScore)}`}>
                              {score}/{maxScore}
                            </span>
                          </div>
                          <Progress value={(score / maxScore) * 100} className="h-2" />
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                {/* Improvement Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Improvement Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-blue-800">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!analysisResult && (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to Analyze?
                  </h3>
                  <p className="text-gray-600">
                    Enter your ad text and click "Analyze Ad" to get detailed insights and improvement suggestions.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Analysis Details */}
        {analysisResult && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analysis Breakdown
              </CardTitle>
              <CardDescription>
                Detailed explanation of each scoring criterion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Readability</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Measures how easy your ad is to read. Higher scores indicate simpler language and shorter sentences.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Length & Conciseness</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Evaluates optimal word count (10-25 words). Too short lacks impact, too long loses attention.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Emotional Impact</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Analyzes emotional tone and sentiment. Positive emotions drive better engagement and conversions.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Power Words</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Counts persuasive words like "free", "exclusive", "limited" that grab attention and create urgency.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Call-to-Action</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Checks for action verbs like "buy", "shop", "get" that tell customers what to do next.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium">Uniqueness</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Measures how different your ad is from generic marketing language. Unique ads stand out better.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


