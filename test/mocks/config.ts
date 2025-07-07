// Mock config for testing
export default {
  simpleFlag: true,
  disabledFlag: false,
  abTestFlag: {
    enabled: true,
    value: 'control',
    variants: [
      { name: 'control', weight: 50, value: 'control' },
      { name: 'treatment', weight: 50, value: 'treatment' },
    ],
  },
  gradualRollout: {
    enabled: true,
    variants: [
      { name: 'disabled', weight: 80, value: false },
      { name: 'enabled', weight: 20, value: true },
    ],
  },
}
