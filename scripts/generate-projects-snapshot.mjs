import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const snapshotPath = path.join(repoRoot, 'src/data/projects-snapshot.json')
const excludedProjectIds = new Set([334629076])

async function readExistingSnapshot() {
  try {
    const content = await readFile(snapshotPath, 'utf8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

async function githubRequest(url, headers) {
  const response = await fetch(url, { headers })

  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status} ${response.statusText}) for ${url}`)
  }

  return response.json()
}

function normalizeProject(project) {
  return {
    id: project.id,
    name: project.name,
    full_name: project.full_name,
    owner: project.owner
      ? {
          login: project.owner.login,
          avatar_url: project.owner.avatar_url,
          html_url: project.owner.html_url,
        }
      : undefined,
    html_url: project.html_url,
    description: project.description,
    languages: project.languages ?? {},
    created_at: project.created_at,
    updated_at: project.updated_at,
    pushed_at: project.pushed_at,
    homepage: project.homepage,
    stargazers_count: project.stargazers_count ?? 0,
    watchers_count: project.watchers_count ?? 0,
    language: project.language ?? null,
    forks_count: project.forks_count ?? 0,
    archived: project.archived ?? false,
    disabled: project.disabled ?? false,
    topics: Array.isArray(project.topics) ? project.topics : [],
    visibility: project.visibility ?? 'public',
    default_branch: project.default_branch ?? 'main',
  }
}

async function generateSnapshot() {
  const githubToken = process.env.VITE_GITHUB_TOKEN ?? ''
  const githubUsername = process.env.VITE_GITHUB_USERNAME ?? ''
  const existingSnapshot = await readExistingSnapshot()

  if (!githubUsername) {
    if (existingSnapshot) {
      console.warn('VITE_GITHUB_USERNAME is not set. Reusing existing projects snapshot.')
      return existingSnapshot
    }

    throw new Error('VITE_GITHUB_USERNAME is required when no existing projects snapshot is available')
  }

  const headers = {
    Accept: 'application/vnd.github.v3+json',
    ...(githubToken ? { Authorization: `token ${githubToken}` } : {}),
  }

  try {
    const repositories = await githubRequest(
      `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
      headers,
    )

    const normalizedProjects = await Promise.all(
      repositories
        .filter((project) => !excludedProjectIds.has(project.id))
        .map(async (project) => {
          try {
            const languages = await githubRequest(project.languages_url, headers)

            return normalizeProject({
              ...project,
              languages,
            })
          } catch (error) {
            console.warn(`Failed to load languages for ${project.name}: ${String(error)}`)
            return normalizeProject({
              ...project,
              languages: {},
            })
          }
        }),
    )

    normalizedProjects.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )

    return {
      generatedAt: new Date().toISOString(),
      source: 'generated',
      projects: normalizedProjects,
    }
  } catch (error) {
    if (existingSnapshot) {
      console.warn(`Snapshot refresh failed. Reusing existing snapshot. ${String(error)}`)
      return existingSnapshot
    }

    throw error
  }
}

async function main() {
  const snapshot = await generateSnapshot()

  await mkdir(path.dirname(snapshotPath), { recursive: true })
  await writeFile(`${snapshotPath}`, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')

  console.info(
    `Projects snapshot written to ${path.relative(repoRoot, snapshotPath)} with ${snapshot.projects.length} projects.`,
  )
}

await main()
