#!/usr/bin/env node
import fs from 'node:fs/promises'
import process from 'node:process'
import {
  bumpVersion,
  determineSemverChange,
  generateMarkDown,
  getGitDiff,
  loadChangelogConfig,
  parseCommits,
} from 'changelogen'

async function main() {
  const releaseType = process.argv[2]?.toLowerCase()
  const validTypes = ['major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease']

  if (releaseType && !validTypes.includes(releaseType)) {
    console.error('Error: Invalid release type. Valid options:', validTypes.join(', '))
    process.exit(1)
  }

  try {
    // Load configuration
    const config = await loadChangelogConfig(process.cwd())

    // Get git commits
    const lastTag = await getLastGitTag()
    const rawCommits = await getGitDiff(lastTag)
    const parsedCommits = parseCommits(rawCommits, config)

    // Determine version bump type
    const bumpType = releaseType || determineSemverChange(parsedCommits, config)
    if (!bumpType) {
      console.log('No significant changes detected, skipping version bump')
      return
    }

    // Bump version
    const newVersion = await bumpVersion(parsedCommits, config, {
      type: bumpType,
      preid: 'beta',
    })

    if (!newVersion) {
      console.log('Version bump aborted')
      return
    }

    // Generate changelog
    const changelog = await generateMarkDown(parsedCommits, {
      ...config,
      newVersion,
    })

    // Update CHANGELOG.md
    const currentChangelog = await fs.readFile('CHANGELOG.md', 'utf8').catch(() => '')
    await fs.writeFile('CHANGELOG.md', `${changelog}\n\n${currentChangelog}`)

    // Update package.json version
    const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'))
    pkg.version = newVersion
    await fs.writeFile('package.json', JSON.stringify(pkg, null, 2))

    console.log(`Successfully released v${newVersion}!`)
    console.log('\nChangelog:')
    console.log(changelog)
  }
  catch (error) {
    console.error('Release failed:', error.message)
    process.exit(1)
  }
}

// Helper function to get last git tag (mock implementation)
async function getLastGitTag() {
  // In real usage, implement actual git tag retrieval
  return 'HEAD'
}

main()
