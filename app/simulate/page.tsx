'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  Eye, 
  ArrowLeft,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  Image as ImageIcon,
  Video,
  FileText
} from 'lucide-react'

interface CampaignData {
  budget: string
  productDescription: string
  targetAudience: string
  region: string
  campaignDuration: string
  usp: string
  demographics: string
  companyName: string
  industry: string
}

interface AdCreative {
  id: string
  type: 'image' | 'video' | 'text'
  title: string
  description: string
  imageUrl?: string
  videoUrl?: string
}

export default function SimulatePage() {
  const router = useRouter()
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null)
  const [adCreatives, setAdCreatives] = useState<AdCreative[]>([])
  const [selectedCreative, setSelectedCreative] = useState<AdCreative | null>(null)
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  useEffect(() => {
    const data = localStorage.getItem('spendr_campaign_data')
    if (data) {
      const parsed = JSON.parse(data)
      setCampaignData(parsed)
      
      // Generate sample ad creatives based on campaign data
      const creatives = generateSampleCreatives(parsed)
      setAdCreatives(creatives)
      setSelectedCreative(creatives[0])
    } else {
      router.push('/')
    }
  }, [router])

  const generateSampleCreatives = (data: CampaignData): AdCreative[] => {
    return [
      {
        id: '1',
        type: 'image',
        title: `${data.companyName} - ${data.usp}`,
        description: data.productDescription.substring(0, 100) + '...',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'
      },
      {
        id: '2',
        type: 'video',
        title: `Discover ${data.companyName}`,
        description: 'Watch how we can help you achieve your goals',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
      },
      {
        id: '3',
        type: 'text',
        title: `${data.companyName} - Perfect for ${data.targetAudience}`,
        description: data.usp
      }
    ]
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const newCreative: AdCreative = {
        id: Date.now().toString(),
        type: file.type.startsWith('video/') ? 'video' : 'image',
        title: `${campaignData?.companyName} - New Creative`,
        description: 'Uploaded creative',
        imageUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        videoUrl: file.type.startsWith('video/') ? URL.createObjectURL(file) : undefined
      }
      setAdCreatives(prev => [...prev, newCreative])
    }
  }

  const FacebookSimulation = () => {
    const getDeviceClass = () => {
      switch (deviceView) {
        case 'mobile': return 'max-w-sm mx-auto'
        case 'tablet': return 'max-w-2xl mx-auto'
        default: return 'max-w-4xl mx-auto'
      }
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Facebook</CardTitle>
              <CardDescription>Social media platform with news feed ads</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Visit Site
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`${getDeviceClass()} border rounded-lg bg-white shadow-lg`}>
            {/* Facebook Header */}
            <div className="bg-white border-b border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center font-bold text-sm">f</div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Facebook Content */}
            <div className="bg-gray-50 p-4">
              {/* Story Section */}
              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 bg-gray-200 rounded-full h-8"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                </div>
              </div>

              {/* Ad Placement */}
              {selectedCreative && (
                <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded h-4 w-24 mb-1"></div>
                      <div className="bg-gray-200 rounded h-3 w-16"></div>
                    </div>
                    <div className="text-xs text-gray-500">Sponsored</div>
                  </div>
                  
                  {selectedCreative.type === 'image' && selectedCreative.imageUrl && (
                    <div>
                      <img 
                        src={selectedCreative.imageUrl} 
                        alt={selectedCreative.title}
                        className="w-full h-64 object-cover rounded mb-3"
                      />
                      <h3 className="font-semibold text-sm mb-1">{selectedCreative.title}</h3>
                      <p className="text-xs text-gray-600 mb-3">{selectedCreative.description}</p>
                    </div>
                  )}

                  {selectedCreative.type === 'video' && selectedCreative.videoUrl && (
                    <div>
                      <video 
                        src={selectedCreative.videoUrl}
                        className="w-full h-64 object-cover rounded mb-3"
                        controls
                      />
                      <h3 className="font-semibold text-sm mb-1">{selectedCreative.title}</h3>
                      <p className="text-xs text-gray-600 mb-3">{selectedCreative.description}</p>
                    </div>
                  )}

                  {selectedCreative.type === 'text' && (
                    <div>
                      <h3 className="font-semibold text-sm mb-2">{selectedCreative.title}</h3>
                      <p className="text-xs text-gray-600 mb-3">{selectedCreative.description}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-gray-500">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <span className="text-xs">Like</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <span className="text-xs">Comment</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <span className="text-xs">Share</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* More Posts */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded h-4 w-32 mb-1"></div>
                    <div className="bg-gray-200 rounded h-3 w-20"></div>
                  </div>
                </div>
                <div className="bg-gray-200 rounded h-32 w-full"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const GoogleSimulation = () => {
    const getDeviceClass = () => {
      switch (deviceView) {
        case 'mobile': return 'max-w-sm mx-auto'
        case 'tablet': return 'max-w-2xl mx-auto'
        default: return 'max-w-4xl mx-auto'
      }
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Google Search</CardTitle>
              <CardDescription>Search engine with text and display ads</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Visit Site
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`${getDeviceClass()} border rounded-lg bg-white shadow-lg`}>
            {/* Google Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-8 bg-blue-500 rounded text-white flex items-center justify-center font-bold text-sm">Google</div>
                <div className="flex-1 bg-gray-100 rounded-full h-10 flex items-center px-4">
                  <div className="w-4 h-4 bg-gray-400 rounded-full mr-3"></div>
                  <span className="text-gray-500 text-sm">Search for products and services</span>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Google Content */}
            <div className="p-4">
              {/* Search Results */}
              <div className="space-y-4">
                {/* Ad Placement */}
                {selectedCreative && (
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                    <div className="text-xs text-green-600 font-medium mb-2">Ad</div>
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <h3 className="text-lg text-blue-600 hover:underline cursor-pointer mb-1">
                          {selectedCreative.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{selectedCreative.description}</p>
                        <div className="text-xs text-gray-500">www.example.com</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular Search Results */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg text-blue-600 hover:underline cursor-pointer">How to optimize your marketing campaigns</h3>
                    <p className="text-sm text-gray-600">Learn the best practices for digital marketing and campaign optimization...</p>
                    <div className="text-xs text-gray-500">www.marketingtips.com</div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg text-blue-600 hover:underline cursor-pointer">Digital Marketing Guide 2024</h3>
                    <p className="text-sm text-gray-600">Complete guide to digital marketing strategies and tools...</p>
                    <div className="text-xs text-gray-500">www.digitalmarketing.com</div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg text-blue-600 hover:underline cursor-pointer">Campaign Management Tools</h3>
                    <p className="text-sm text-gray-600">Top tools for managing and optimizing your marketing campaigns...</p>
                    <div className="text-xs text-gray-500">www.campaigntools.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const InstagramSimulation = () => {
    const getDeviceClass = () => {
      switch (deviceView) {
        case 'mobile': return 'max-w-sm mx-auto'
        case 'tablet': return 'max-w-2xl mx-auto'
        default: return 'max-w-4xl mx-auto'
      }
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Instagram</CardTitle>
              <CardDescription>Visual platform with story and feed ads</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Visit Site
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`${getDeviceClass()} border rounded-lg bg-white shadow-lg`}>
            {/* Instagram Header */}
            <div className="bg-white border-b border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-white flex items-center justify-center font-bold text-sm">📷</div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* Instagram Content */}
            <div className="bg-gray-50">
              {/* Stories */}
              <div className="bg-white p-4 mb-1">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-full border-2 border-pink-500"></div>
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              {/* Ad Placement */}
              {selectedCreative && (
                <div className="bg-white mb-1">
                  <div className="flex items-center gap-3 p-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded h-3 w-20 mb-1"></div>
                      <div className="bg-gray-200 rounded h-2 w-16"></div>
                    </div>
                    <div className="text-xs text-gray-500">Sponsored</div>
                  </div>
                  
                  {selectedCreative.type === 'image' && selectedCreative.imageUrl && (
                    <div>
                      <img 
                        src={selectedCreative.imageUrl} 
                        alt={selectedCreative.title}
                        className="w-full h-80 object-cover"
                      />
                    </div>
                  )}

                  {selectedCreative.type === 'video' && selectedCreative.videoUrl && (
                    <div>
                      <video 
                        src={selectedCreative.videoUrl}
                        className="w-full h-80 object-cover"
                        controls
                      />
                    </div>
                  )}

                  {selectedCreative.type === 'text' && (
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-2">{selectedCreative.title}</h3>
                      <p className="text-xs text-gray-600">{selectedCreative.description}</p>
                    </div>
                  )}

                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-gray-300 rounded"></div>
                        <div className="w-5 h-5 bg-gray-300 rounded"></div>
                        <div className="w-5 h-5 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                    <div className="text-sm font-medium mb-1">{selectedCreative.title}</div>
                    <div className="text-xs text-gray-600">{selectedCreative.description}</div>
                  </div>
                </div>
              )}

              {/* Regular Posts */}
              <div className="bg-white mb-1">
                <div className="flex items-center gap-3 p-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded h-3 w-24 mb-1"></div>
                    <div className="bg-gray-200 rounded h-2 w-16"></div>
                  </div>
                </div>
                <div className="bg-gray-200 h-80 w-full"></div>
                <div className="p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                  </div>
                  <div className="bg-gray-200 rounded h-3 w-32 mb-1"></div>
                  <div className="bg-gray-200 rounded h-2 w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const LinkedInSimulation = () => {
    const getDeviceClass = () => {
      switch (deviceView) {
        case 'mobile': return 'max-w-sm mx-auto'
        case 'tablet': return 'max-w-2xl mx-auto'
        default: return 'max-w-4xl mx-auto'
      }
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">LinkedIn</CardTitle>
              <CardDescription>Professional network with sponsored content</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Visit Site
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`${getDeviceClass()} border rounded-lg bg-white shadow-lg`}>
            {/* LinkedIn Header */}
            <div className="bg-white border-b border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center font-bold text-sm">in</div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* LinkedIn Content */}
            <div className="bg-gray-50 p-4">
              {/* Ad Placement */}
              {selectedCreative && (
                <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded h-4 w-32 mb-1"></div>
                      <div className="bg-gray-200 rounded h-3 w-20"></div>
                    </div>
                    <div className="text-xs text-gray-500">Promoted</div>
                  </div>
                  
                  {selectedCreative.type === 'image' && selectedCreative.imageUrl && (
                    <div>
                      <img 
                        src={selectedCreative.imageUrl} 
                        alt={selectedCreative.title}
                        className="w-full h-48 object-cover rounded mb-3"
                      />
                      <h3 className="font-semibold text-sm mb-1">{selectedCreative.title}</h3>
                      <p className="text-xs text-gray-600 mb-3">{selectedCreative.description}</p>
                    </div>
                  )}

                  {selectedCreative.type === 'video' && selectedCreative.videoUrl && (
                    <div>
                      <video 
                        src={selectedCreative.videoUrl}
                        className="w-full h-48 object-cover rounded mb-3"
                        controls
                      />
                      <h3 className="font-semibold text-sm mb-1">{selectedCreative.title}</h3>
                      <p className="text-xs text-gray-600 mb-3">{selectedCreative.description}</p>
                    </div>
                  )}

                  {selectedCreative.type === 'text' && (
                    <div>
                      <h3 className="font-semibold text-sm mb-2">{selectedCreative.title}</h3>
                      <p className="text-xs text-gray-600 mb-3">{selectedCreative.description}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-gray-500">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <span className="text-xs">Like</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <span className="text-xs">Comment</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <span className="text-xs">Share</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Regular Posts */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded h-4 w-32 mb-1"></div>
                    <div className="bg-gray-200 rounded h-3 w-20"></div>
                  </div>
                </div>
                <div className="bg-gray-200 rounded h-32 w-full mb-3"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-500">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <span className="text-xs">Like</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <span className="text-xs">Comment</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <span className="text-xs">Share</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!campaignData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ad Simulation
            </h1>
            <p className="text-gray-600">
              See how your ads would look across different platforms
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Ad Creatives Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Ad Creatives
                </CardTitle>
                <CardDescription>
                  Upload and manage your ad creatives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Button */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload your ad creative</p>
                  <Input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="text-xs"
                  />
                </div>

                {/* Creative List */}
                <div className="space-y-2">
                  {adCreatives.map((creative) => (
                    <div
                      key={creative.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCreative?.id === creative.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedCreative(creative)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {creative.type === 'image' && <ImageIcon className="h-4 w-4 text-blue-500" />}
                        {creative.type === 'video' && <Video className="h-4 w-4 text-red-500" />}
                        {creative.type === 'text' && <FileText className="h-4 w-4 text-green-500" />}
                        <span className="text-sm font-medium">{creative.title}</span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {creative.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Simulation Area */}
          <div className="lg:col-span-3">
            {/* Device Selector */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Device View:</span>
                    <div className="flex gap-2">
                      <Button
                        variant={deviceView === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDeviceView('desktop')}
                        className="flex items-center gap-2"
                      >
                        <Monitor className="h-4 w-4" />
                        Desktop
                      </Button>
                      <Button
                        variant={deviceView === 'tablet' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDeviceView('tablet')}
                        className="flex items-center gap-2"
                      >
                        <Tablet className="h-4 w-4" />
                        Tablet
                      </Button>
                      <Button
                        variant={deviceView === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDeviceView('mobile')}
                        className="flex items-center gap-2"
                      >
                        <Smartphone className="h-4 w-4" />
                        Mobile
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedCreative ? `Showing: ${selectedCreative.title}` : 'No creative selected'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Simulations */}
            <Tabs defaultValue="facebook" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="facebook">Facebook</TabsTrigger>
                <TabsTrigger value="google">Google</TabsTrigger>
                <TabsTrigger value="instagram">Instagram</TabsTrigger>
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              </TabsList>

              <TabsContent value="facebook">
                <FacebookSimulation />
              </TabsContent>

              <TabsContent value="google">
                <GoogleSimulation />
              </TabsContent>

              <TabsContent value="instagram">
                <InstagramSimulation />
              </TabsContent>

              <TabsContent value="linkedin">
                <LinkedInSimulation />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
