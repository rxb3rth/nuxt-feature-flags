export interface Flag<T = boolean> {
  value: T
  explanation?: {
    reason: 'STATIC' | 'TARGETING_MATCH' | 'DEFAULT'
    rule?: string
  }
}

export interface EvaluationContext {
  [key: string]: unknown
}

export type FlagDefinition =
  | boolean
  | ((context: EvaluationContext) => boolean)
