import { useLogger } from '@nuxt/kit'
import type { ConsolaInstance } from 'consola'

export const consolador: ConsolaInstance = useLogger('nuxt-feature-flags')
