interface PJAXOptions {
  selector: string
  container: string
  timeout: number
  cache: boolean
  caseSize: number
  debug: boolean
}

interface PageContent {
  url: string
  title: string
  content: string
  timestamp: number
}

interface DEFAULT_PJAX_OPTIONS {}

interface NavigationEvent {
  from: string
  to: string
  timestamp: string
  type: "click" | "popstate"
}

interface NavigationResult {
  success: boolean
  url: string
  deration: number
  cached: boolean
  error: Error
}

interface CacheEntry {
  content: PageContent
  expiry: number
  hitCount: number
}

interface CacheStats {
  size: number
}
