// Mock types for testing
export interface FlagsSchema {
  [key: string]: any
}

export interface ResolvedFlag {
  enabled: boolean
  value?: boolean | number | string | null
  variant?: string
}

export interface ResolvedFlags {
  [key: string]: ResolvedFlag
}
