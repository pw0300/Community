import type { Cohort } from './types'

const DEFAULT_LOCALE = 'en-US'

export const formatCurrency = (value: number, currency = 'USD') =>
  new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)

export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    month: 'short',
    day: 'numeric',
    ...(options ?? {}),
  }).format(date)

export const formatDateRange = (start: Date, end: Date, timeZone?: string) => {
  const formatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    month: 'short',
    day: 'numeric',
    timeZone,
  })
  const sameMonth = start.getMonth() === end.getMonth()
  const sameDay = start.toDateString() === end.toDateString()

  if (sameDay) {
    return formatter.format(start)
  }

  if (sameMonth) {
    return `${formatter.format(start)}–${end.getDate()}`
  }

  return `${formatter.format(start)} – ${formatter.format(end)}`
}

export const formatDateTime = (date: Date, timeZone?: string) =>
  new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  }).format(date)

export const getTimeUntil = (date: Date) => {
  const diff = date.getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const minutes = Math.floor(diff / 1000 / 60)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`
  }

  return `${Math.max(remainingMinutes, 1)}m`
}

export const isCohortLive = (cohort: Cohort) => {
  const now = Date.now()
  return now >= cohort.startDate.getTime() && now <= cohort.endDate.getTime()
}

export const getSeatsLabel = (cohort: Cohort) => {
  if (cohort.seatsLeft <= 0) return 'Waitlist'
  if (cohort.seatsLeft <= 4) return `${cohort.seatsLeft} seats left`
  return `${cohort.seatsLeft} open`
}

export const summariseDelivery = (cohort: Cohort) =>
  `${cohort.deliveryMode === 'online' ? 'Online' : cohort.deliveryMode === 'offline' ? 'Offline' : 'Mixed'} · ${
    cohort.format === 'group' ? 'Group' : '1-to-1'
  } · ${cohort.sessionType === 'single' ? 'Single session' : 'Multi-session'}`

export const formatRelativeTime = (date: Date) => {
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return 'Just now'
  const minutes = Math.floor(diff / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export const generateHoldExpiry = (minutes = 15) => {
  const expires = new Date()
  expires.setMinutes(expires.getMinutes() + minutes)
  return expires
}

export const sortBySoonest = <T extends { startDate: Date }>(cohorts: T[]) =>
  [...cohorts].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

export const unique = <T>(items: T[]) => Array.from(new Set(items))
