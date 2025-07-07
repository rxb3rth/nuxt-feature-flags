// Mock types for testing
export interface FlagsSchema {
  [key: string]: unknown
}

export interface ResolvedFlag {
  enabled: boolean
  value?: boolean | number | string | null
  variant?: string
}

export interface ResolvedFlags {
  [key: string]: ResolvedFlag
}
