'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export interface StatItem {
  label: string
  value: string
  helper?: string
  accent?: 'success' | 'warning' | 'default'
  icon?: React.ReactNode
}

const accentStyles: Record<NonNullable<StatItem['accent']>, string> = {
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  default: 'bg-slate-100 text-slate-700 border-slate-200',
}

export interface StatsGridProps {
  stats: StatItem[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  const [highlightIndex, setHighlightIndex] = useState(0)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          className={cn('border transition-shadow hover:shadow-md', index === highlightIndex && 'ring-2 ring-primary/40')}
          onMouseEnter={() => setHighlightIndex(index)}
          onFocus={() => setHighlightIndex(index)}
          tabIndex={0}
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            {stat.icon && <span className="text-muted-foreground">{stat.icon}</span>}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
            {stat.helper && (
              <p
                className={cn(
                  'mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
                  accentStyles[stat.accent ?? 'default'],
                )}
              >
                {stat.helper}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


