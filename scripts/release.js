#!/usr/bin/env node
import { execSync } from 'node:child_process'

// Parse command line arguments
const args = process.argv.slice(2)
const bumpType = args.find(arg => arg.startsWith('--'))

if (!bumpType) {
  console.error('Please specify a version bump type:')
  console.error('--major, --minor, --patch, --premajor, --preminor, --prepatch, --prerelease')
  process.exit(1)
}

const isValidType = [
  '--major',
  '--minor',
  '--patch',
  '--premajor',
  '--preminor',
  '--prepatch',
  '--prerelease'].includes(bumpType)
if (!isValidType) {
  console.error(`Invalid bump type: ${bumpType}`)
  process.exit(1)
}

execSync(`release ${bumpType}`)
execSync('npm publish')
execSync('git push --follow-tags')
