// ─── Core Config ────────────────────────────────────────────────────────────

export interface MetaTagsConfig {
  // Page identity
  title?: string
  titleTemplate?: string        // e.g. "%s | MySite" — %s replaced by title
  description?: string
  keywords?: string[]           // rendered as comma-separated meta[name=keywords]
  author?: string
  generator?: string            // e.g. "Next.js"

  // Indexing
  canonical?: string            // absolute or relative URL
  robots?: RobotsDirective | string
  googlebot?: string            // separate googlebot directive if needed

  // Site identity
  siteName?: string
  baseUrl?: string              // used to resolve relative canonical/OG URLs
  locale?: string               // e.g. "en_US" — sets og:locale
  alternateLocales?: string[]   // og:locale:alternate

  // Open Graph
  og?: OGConfig

  // Twitter Card
  twitter?: TwitterConfig

  // Structured data
  jsonLd?: JsonLdInput | JsonLdInput[]

  // Internationalization
  hreflang?: HreflangEntry[]

  // PWA
  pwa?: PWAConfig

  // Security
  security?: SecurityConfig

  // Performance hints
  hints?: ResourceHintConfig[]

  // Environment
  env?: EnvConfig

  // Misc
  themeColor?: string           // <meta name="theme-color">
  viewport?: string             // defaults to "width=device-width, initial-scale=1"
  charset?: string              // defaults to "UTF-8"
  extra?: ExtraTag[]            // escape hatch for arbitrary tags
}

// ─── Open Graph ─────────────────────────────────────────────────────────────

export type OGType =
  | 'website' | 'article' | 'profile' | 'book'
  | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station'
  | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other'

export interface OGConfig {
  title?: string                // auto-derived from MetaTagsConfig.title
  description?: string          // auto-derived from MetaTagsConfig.description
  type?: OGType                 // defaults to "website"
  url?: string                  // auto-derived from canonical
  siteName?: string             // auto-derived from MetaTagsConfig.siteName
  locale?: string               // auto-derived from MetaTagsConfig.locale

  // Image
  image?: string | OGImage | OGImage[]
  imageAlt?: string             // shorthand when image is a string

  // Video (og:video)
  video?: OGVideo | OGVideo[]

  // Audio (og:audio)
  audio?: string

  // Article-specific
  publishedTime?: string        // ISO 8601
  modifiedTime?: string         // ISO 8601
  expirationTime?: string       // ISO 8601
  author?: string | string[]
  section?: string
  tag?: string | string[]

  // Profile-specific
  firstName?: string
  lastName?: string
  username?: string
  gender?: 'male' | 'female'

  // Book-specific
  isbn?: string
  releaseDate?: string
}

export interface OGImage {
  url: string
  secureUrl?: string
  type?: string                 // e.g. "image/jpeg"
  width?: number
  height?: number
  alt?: string
}

export interface OGVideo {
  url: string
  secureUrl?: string
  type?: string                 // e.g. "video/mp4"
  width?: number
  height?: number
}

// ─── Twitter Card ────────────────────────────────────────────────────────────

export type TwitterCard = 'summary' | 'summary_large_image' | 'app' | 'player'

export interface TwitterConfig {
  card?: TwitterCard            // auto-derived: summary_large_image if og.image set
  site?: string                 // @username of the website
  creator?: string              // @username of the content creator
  title?: string                // auto-derived from og.title
  description?: string          // auto-derived from og.description
  image?: string                // auto-derived from og.image
  imageAlt?: string
  // App card
  appNameIphone?: string
  appIdIphone?: string
  appUrlIphone?: string
  appNameIpad?: string
  appIdIpad?: string
  appUrlIpad?: string
  appNameGoogleplay?: string
  appIdGoogleplay?: string
  appUrlGoogleplay?: string
  // Player card
  playerUrl?: string
  playerWidth?: number
  playerHeight?: number
  playerStreamContentType?: string
}

// ─── hreflang ───────────────────────────────────────────────────────────────

export interface HreflangEntry {
  lang: string                  // e.g. "en", "fr", "x-default"
  href: string                  // absolute URL
}

// ─── PWA ────────────────────────────────────────────────────────────────────

export interface PWAConfig {
  themeColor?: string           // <meta name="theme-color">
  backgroundColor?: string      // used in manifest
  manifest?: string             // path to manifest.json: <link rel="manifest">
  appleIcon?: string | AppleIcon[]
  appleStatusBarStyle?: 'default' | 'black' | 'black-translucent'
  mobileWebAppCapable?: boolean // <meta name="mobile-web-app-capable">
  appleWebAppCapable?: boolean  // <meta name="apple-mobile-web-app-capable">
  appleWebAppTitle?: string
  msTileColor?: string
  msTileImage?: string
  applicationName?: string
}

export interface AppleIcon {
  href: string
  sizes?: string                // e.g. "180x180"
}

// ─── Security ────────────────────────────────────────────────────────────────

export interface SecurityConfig {
  contentSecurityPolicy?: string | CSPObject
  xFrameOptions?: 'DENY' | 'SAMEORIGIN'
  xContentTypeOptions?: boolean     // adds "nosniff"
  referrerPolicy?: ReferrerPolicy
  permissionsPolicy?: string
}

export type ReferrerPolicy =
  | 'no-referrer' | 'no-referrer-when-downgrade'
  | 'origin' | 'origin-when-cross-origin'
  | 'same-origin' | 'strict-origin'
  | 'strict-origin-when-cross-origin' | 'unsafe-url'

export interface CSPObject {
  defaultSrc?: string[]
  scriptSrc?: string[]
  styleSrc?: string[]
  imgSrc?: string[]
  connectSrc?: string[]
  fontSrc?: string[]
  objectSrc?: string[]
  mediaSrc?: string[]
  frameSrc?: string[]
  reportUri?: string
  upgradeInsecureRequests?: boolean
  [key: string]: string[] | boolean | string | undefined
}

// ─── Resource Hints ─────────────────────────────────────────────────────────

export type ResourceHintRel =
  | 'preload' | 'prefetch' | 'preconnect'
  | 'dns-prefetch' | 'prerender' | 'modulepreload'

export type ResourceHintAs =
  | 'script' | 'style' | 'image' | 'font'
  | 'fetch' | 'document' | 'audio' | 'video' | 'worker'

export interface ResourceHintConfig {
  rel: ResourceHintRel
  href: string
  as?: ResourceHintAs
  type?: string
  crossOrigin?: 'anonymous' | 'use-credentials'
  media?: string
  imageSrcset?: string
  imageSizes?: string
}

// ─── Robots ──────────────────────────────────────────────────────────────────

export interface RobotsDirective {
  index?: boolean
  follow?: boolean
  noarchive?: boolean
  nosnippet?: boolean
  noimageindex?: boolean
  notranslate?: boolean
  nositelinkssearchbox?: boolean
  maxSnippet?: number           // max-snippet:<n>
  maxImagePreview?: 'none' | 'standard' | 'large'
  maxVideoPreview?: number
  unavailableAfter?: string     // ISO date
}

// ─── Environment ─────────────────────────────────────────────────────────────

export interface EnvConfig {
  noindexOn?: string[]          // env names where noindex is forced, e.g. ["staging", "preview"]
  currentEnv?: string           // defaults to process.env.NODE_ENV or VERCEL_ENV
}

// ─── Extra Tags ──────────────────────────────────────────────────────────────

export interface ExtraTag {
  tag: 'meta' | 'link' | 'script'
  attributes: Record<string, string>
}

// ─── Provider ────────────────────────────────────────────────────────────────

export interface MetaTagsDefaults extends MetaTagsConfig {
  titleTemplate?: string        // e.g. "%s | MySite"
  defaultOgImage?: string
}

// ─── JSON-LD Structured Data Schemas ─────────────────────────────────────────

export interface ArticleSchema {
  headline: string
  description?: string
  author: { name: string; url?: string } | Array<{ name: string; url?: string }>
  publisher: { name: string; logo: string }
  datePublished: string
  dateModified?: string
  image: string
  url?: string
}

export interface ProductSchema {
  name: string
  description?: string
  image: string
  brand?: string
  sku?: string
  price: number
  currency: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  url?: string
  rating?: { value: number; count: number }
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface BreadcrumbSchema {
  items: BreadcrumbItem[]
}

export interface OrganizationSchema {
  name: string
  url: string
  logo: string
  description?: string
  foundingDate?: string
  sameAs?: string[]
  contactPoint?: {
    type: string
    telephone: string
    contactType: string
  }
}

export interface PersonSchema {
  name: string
  url?: string
  image?: string
  jobTitle?: string
  worksFor?: { name: string; url?: string }
  sameAs?: string[]
  knowsAbout?: string[]
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQSchema {
  questions: FAQItem[]
}

export interface EventSchema {
  name: string
  startDate: string
  endDate?: string
  location: { name: string; address: string }
  organizer: { name: string; url?: string }
  description?: string
  image?: string
  offers?: { price: number; currency: string; availability?: string }
  eventStatus?: 'EventCancelled' | 'EventMovedOnline' | 'EventPostponed' | 'EventRescheduled' | 'EventScheduled'
  eventAttendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode'
}

export interface RecipeInstruction {
  text: string
}

export interface RecipeSchema {
  name: string
  description?: string
  author: string
  image: string
  prepTime?: string
  cookTime?: string
  totalTime?: string
  servings?: string
  calories?: string
  ingredients: string[]
  instructions: RecipeInstruction[]
  rating?: { value: number; count: number }
}

export interface VideoObjectSchema {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  duration?: string
  contentUrl?: string
  embedUrl?: string
}

export interface SoftwareApplicationSchema {
  name: string
  applicationCategory: string
  operatingSystem?: string
  url?: string
  offers?: { price: number; currency: string }
  description?: string
  downloadUrl?: string
  softwareVersion?: string
}

export interface LocalBusinessSchema {
  name: string
  image: string
  url: string
  telephone: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  geo?: { lat: number; lng: number }
  openingHours?: string[]
  priceRange?: string
}

export interface ReviewSchema {
  itemName: string
  reviewBody: string
  ratingValue: number
  reviewerName: string
  datePublished?: string
}

export type JsonLdInput =
  | { schema: 'Article'; data: ArticleSchema }
  | { schema: 'Product'; data: ProductSchema }
  | { schema: 'Breadcrumb'; data: BreadcrumbSchema }
  | { schema: 'Organization'; data: OrganizationSchema }
  | { schema: 'Person'; data: PersonSchema }
  | { schema: 'FAQ'; data: FAQSchema }
  | { schema: 'Event'; data: EventSchema }
  | { schema: 'Recipe'; data: RecipeSchema }
  | { schema: 'VideoObject'; data: VideoObjectSchema }
  | { schema: 'SoftwareApplication'; data: SoftwareApplicationSchema }
  | { schema: 'LocalBusiness'; data: LocalBusinessSchema }
  | { schema: 'Review'; data: ReviewSchema }
  | { raw: Record<string, any> }

export interface ResolvedTag {
  tag: 'title' | 'meta' | 'link' | 'script';
  attributes: Record<string, string>;
  content?: string;
}
