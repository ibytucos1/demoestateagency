'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, CheckCircle2, XCircle, AlertCircle, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImportResult {
  success: number
  skipped: number
  errors: Array<{
    row: number
    error: string
    data: Record<string, any>
  }>
}

export function CSVImportPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file')
        return
      }
      setFile(selectedFile)
      setError(null)
      setResult(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }

    setUploading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/listings/import', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import CSV')
      }

      setResult(data.results)
      
      // Refresh the listings page after successful import
      if (data.results.success > 0) {
        setTimeout(() => {
          router.push('/admin/listings')
          router.refresh()
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import CSV')
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = [
      [
        'title',
        'slug',
        'status',
        'type',
        'price',
        'currency',
        'bedrooms',
        'bathrooms',
        'propertyType',
        'addressLine1',
        'city',
        'postcode',
        'lat',
        'lng',
        'description',
        'features',
      ],
      [
        'Modern Family Home',
        'modern-family-home-london',
        'active',
        'sale',
        '425000',
        'GBP',
        '4',
        '2',
        'house',
        '123 Oak Avenue',
        'London',
        'SW1A 1AA',
        '51.5074',
        '-0.1278',
        'A beautifully presented four-bedroom family home.',
        'parking,garden,garage',
      ],
      [
        'Luxury Apartment',
        'luxury-apartment-city',
        'active',
        'rent',
        '1850',
        'GBP',
        '2',
        '1',
        'apartment',
        '45 High Street',
        'Bristol',
        'BS1 2CD',
        '',
        '',
        'Stunning two-bedroom apartment in the city centre.',
        'parking,balcony,elevator',
      ],
    ]

    const csv = csvContent.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'property-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Import Properties from CSV</h1>
        <p className="text-gray-600">
          Upload a CSV file to bulk import properties. All imported listings will be searchable.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
              <CardDescription>
                Select a CSV file containing property data. Download the template below for the correct format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="csv-file"
                    className={cn(
                      'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                      file
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 hover:bg-gray-50',
                      uploading && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {file ? (
                        <>
                          <FileText className="w-12 h-12 text-primary mb-2" />
                          <p className="mb-2 text-sm font-semibold text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">CSV files only</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button type="submit" disabled={!file || uploading}>
                    {uploading ? 'Importing...' : 'Import Properties'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={downloadTemplate}
                    disabled={uploading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>CSV Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Required Columns:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• title</li>
                  <li>• slug</li>
                  <li>• type (sale/rent/commercial)</li>
                  <li>• price</li>
                  <li>• addressLine1</li>
                  <li>• city</li>
                  <li>• description</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Optional Columns:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• status (draft/active/sold/let)</li>
                  <li>• currency (default: GBP)</li>
                  <li>• bedrooms</li>
                  <li>• bathrooms</li>
                  <li>• propertyType</li>
                  <li>• postcode</li>
                  <li>• lat, lng</li>
                  <li>• features (comma-separated)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">{result.success} successful</span>
              </div>
              {result.skipped > 0 && (
                <div className="flex items-center gap-2 text-amber-600">
                  <XCircle className="h-5 w-5" />
                  <span className="font-semibold">{result.skipped} skipped</span>
                </div>
              )}
            </div>

            {result.errors.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h3 className="font-semibold text-sm">Errors ({result.errors.length})</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left border-b border-gray-200">Row</th>
                        <th className="px-4 py-2 text-left border-b border-gray-200">Error</th>
                        <th className="px-4 py-2 text-left border-b border-gray-200">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.errors.map((err, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="px-4 py-2 font-mono">{err.row}</td>
                          <td className="px-4 py-2 text-red-600">{err.error}</td>
                          <td className="px-4 py-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {err.data.title || err.data.slug || 'N/A'}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

