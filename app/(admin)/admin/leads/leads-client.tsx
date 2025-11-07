'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LeadDetailDialog } from '@/components/lead-detail-dialog'
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  FileText, 
  Phone, 
  Globe, 
  MessageSquare,
  Search,
  Download,
  Filter,
  X
} from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  source: string
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
  Listing: {
    title: string
    slug: string
  } | null
  AssignedUser: {
    id: string
    name: string | null
    email: string
  } | null
}

interface Agent {
  id: string
  name: string | null
  email: string
}

interface Metrics {
  totalLeads: number
  statusCounts: {
    new: number
    contacted: number
    qualified: number
    converted: number
    archived: number
  }
  leadsLast7Days: number
  leadsLast30Days: number
  sourceCounts: {
    form: number
    phone: number
    portal: number
    valuation: number
    contact: number
  }
  whatsappClicksTotal: number
  whatsappClicksLast7Days: number
  whatsappClicksLast30Days: number
  uniqueWhatsappUsersCount: number
}

interface LeadsClientProps {
  initialLeads: Lead[]
  agents: Agent[]
  metrics: Metrics
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800 border-blue-300',
  contacted: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  qualified: 'bg-purple-100 text-purple-800 border-purple-300',
  converted: 'bg-green-100 text-green-800 border-green-300',
  archived: 'bg-gray-100 text-gray-800 border-gray-300',
}

const statusLabels = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  converted: 'Converted',
  archived: 'Archived',
}

export function LeadsClient({ initialLeads, agents, metrics }: LeadsClientProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Refresh leads
  const refreshLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      if (response.ok) {
        // For now, just reload the page to get fresh data
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to refresh leads:', error)
    }
  }

  // Filter and search leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          (lead.phone && lead.phone.toLowerCase().includes(query)) ||
          lead.message.toLowerCase().includes(query)
        
        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter !== 'all' && lead.status !== statusFilter) {
        return false
      }

      // Source filter
      if (sourceFilter !== 'all' && lead.source !== sourceFilter) {
        return false
      }

      return true
    })
  }, [leads, searchQuery, statusFilter, sourceFilter])

  const handleLeadClick = (leadId: string) => {
    setSelectedLeadId(leadId)
    setDialogOpen(true)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setSourceFilter('all')
  }

  const hasFilters = searchQuery || statusFilter !== 'all' || sourceFilter !== 'all'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Button asChild>
          <a href="/api/leads/export">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </a>
        </Button>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time leads
            </p>
          </CardContent>
        </Card>

        {/* Leads Last 7 Days */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.leadsLast7Days}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.leadsLast30Days} in last 30 days
            </p>
          </CardContent>
        </Card>

        {/* New Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.statusCounts.new}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        {/* Converted */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.statusCounts.converted}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successful conversions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Lead Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(metrics.statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2">
                <Badge className={statusColors[status as keyof typeof statusColors]}>
                  {statusLabels[status as keyof typeof statusLabels]}
                </Badge>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Source Breakdown */}
      {(metrics.sourceCounts.phone > 0 || metrics.sourceCounts.portal > 0 || metrics.sourceCounts.valuation > 0 || metrics.sourceCounts.contact > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {metrics.sourceCounts.form > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.sourceCounts.form}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <FileText className="h-3 w-3" />
                    Property Forms
                  </div>
                </div>
              )}
              {metrics.sourceCounts.contact > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.sourceCounts.contact}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <MessageSquare className="h-3 w-3" />
                    Contact
                  </div>
                </div>
              )}
              {metrics.sourceCounts.valuation > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.sourceCounts.valuation}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <FileText className="h-3 w-3" />
                    Valuation
                  </div>
                </div>
              )}
              {metrics.sourceCounts.phone > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.sourceCounts.phone}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Phone className="h-3 w-3" />
                    Phone
                  </div>
                </div>
              )}
              {metrics.sourceCounts.portal > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.sourceCounts.portal}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Globe className="h-3 w-3" />
                    Portal
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp Metrics */}
      {metrics.whatsappClicksTotal > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              WhatsApp Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold">{metrics.whatsappClicksTotal}</div>
                <div className="text-sm text-muted-foreground">Total Clicks</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{metrics.whatsappClicksLast7Days}</div>
                <div className="text-sm text-muted-foreground">Last 7 Days</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {metrics.whatsappClicksLast30Days} in last 30 days
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">{metrics.uniqueWhatsappUsersCount}</div>
                <div className="text-sm text-muted-foreground">Unique Users (30d)</div>
                <div className="text-xs text-muted-foreground mt-1">
                  People who clicked WhatsApp links
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, phone, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="form">Property Form</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
                <SelectItem value="valuation">Valuation</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="portal">Portal</SelectItem>
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {hasFilters ? `${filteredLeads.length} Lead${filteredLeads.length !== 1 ? 's' : ''}` : 'All Leads'}
          </h2>
        </div>
        
        <div className="grid gap-4">
          {filteredLeads.map((lead) => (
            <Card 
              key={lead.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleLeadClick(lead.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{lead.name}</h3>
                          <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                            {statusLabels[lead.status as keyof typeof statusLabels]}
                          </Badge>
                          {lead.Listing ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Property Enquiry
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              General Enquiry
                            </Badge>
                          )}
                        </div>

                        {/* Property Information - Highlighted */}
                        {lead.Listing && (
                          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <div>
                                <div className="text-xs text-blue-600 font-medium">PROPERTY ENQUIRY</div>
                                <a 
                                  href={`/listing/${lead.Listing.slug}`} 
                                  className="font-semibold text-blue-700 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {lead.Listing.title}
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-1 text-sm">
                          <p>
                            <strong>Email:</strong>{' '}
                            <a 
                              href={`mailto:${lead.email}`} 
                              className="text-blue-600 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {lead.email}
                            </a>
                          </p>
                          {lead.phone && (
                            <p>
                              <strong>Phone:</strong>{' '}
                              <a 
                                href={`tel:${lead.phone}`}
                                className="text-blue-600 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {lead.phone}
                              </a>
                            </p>
                          )}
                          {lead.AssignedUser && (
                            <p>
                              <strong>Assigned to:</strong> {lead.AssignedUser.name || lead.AssignedUser.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm line-clamp-2">{lead.message}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="capitalize">
                        <strong>Source:</strong> {lead.source}
                      </span>
                      <span>
                        <strong>Received:</strong> {new Date(lead.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredLeads.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">
                  {hasFilters ? 'No leads match your filters.' : 'No leads yet.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Lead Detail Dialog */}
      <LeadDetailDialog
        leadId={selectedLeadId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdate={refreshLeads}
        agents={agents}
      />
    </div>
  )
}

