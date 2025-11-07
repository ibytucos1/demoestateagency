'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Tag, 
  FileText,
  ExternalLink,
  Loader2
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

interface LeadDetailDialogProps {
  leadId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
  agents: { id: string; name: string | null; email: string }[]
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

export function LeadDetailDialog({ 
  leadId, 
  open, 
  onOpenChange, 
  onUpdate,
  agents 
}: LeadDetailDialogProps) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [assignedTo, setAssignedTo] = useState<string | null>(null)

  useEffect(() => {
    if (leadId && open) {
      fetchLead()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId, open])

  const fetchLead = async () => {
    if (!leadId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/leads/${leadId}`)
      if (response.ok) {
        const data = await response.json()
        setLead(data)
        setStatus(data.status)
        setNotes(data.notes || '')
        setAssignedTo(data.assignedTo)
      }
    } catch (error) {
      console.error('Failed to fetch lead:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!leadId) return

    setSaving(true)
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes: notes || null,
          assignedTo: assignedTo || null,
        }),
      })

      if (response.ok) {
        onUpdate()
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Failed to update lead:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!leadId || !confirm('Are you sure you want to delete this lead?')) return

    setSaving(true)
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onUpdate()
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Failed to delete lead:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lead Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : lead ? (
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact Information</h3>
              
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium">{lead.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <a 
                    href={`mailto:${lead.email}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>

              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <a 
                      href={`tel:${lead.phone}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {lead.phone}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Message</div>
                  <div className="text-sm bg-gray-50 p-3 rounded-md border">
                    {lead.message}
                  </div>
                </div>
              </div>

              {lead.Listing && (
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Property</div>
                    <a 
                      href={`/listing/${lead.Listing.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      {lead.Listing.title}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Source</div>
                  <Badge variant="outline" className="capitalize">
                    {lead.source}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Received</div>
                  <div className="text-sm">
                    {new Date(lead.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Management */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-lg">Lead Management</h3>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select 
                  value={assignedTo || 'unassigned'} 
                  onValueChange={(value: string) => setAssignedTo(value === 'unassigned' ? null : value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name || agent.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Add internal notes about this lead..."
                  className="mt-1"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t pt-6">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={saving}
              >
                Delete Lead
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Lead not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

