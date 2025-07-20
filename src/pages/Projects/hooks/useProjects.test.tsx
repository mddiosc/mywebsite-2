// /**
//  * Tests for useProjects hook - Optimized version
//  *
//  * Critical testing for:
//  * - GitHub API integration
//  * - Project statistics calculation
//  * - Data filtering and processing
//  * - Error handling
//  * - Language data fetching
//  */

// import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// import { renderHook, waitFor } from '@testing-library/react'

// import { useProjects } from './useProjects'

// import {
//   mockGitHubProjectBase,
//   createMockProject,
//   mockProjects,
//   createQueryClientWrapper,
//   setupGitHubTestEnv,
//   cleanupGitHubTestEnv,
//   expectAuthHeaders,
//   authScenarios,
// } from '../__tests__/test-utils'

// // Create a proper mock function
// const mockAxiosGet = vi.fn()

// // Mock axios instance with typed mock
// vi.mock('@/lib/axios', () => ({
//   axiosInstance: {
//     get: mockAxiosGet,
//   },
// }))

// describe('useProjects', () => {
//   beforeEach(() => {
//     vi.clearAllMocks()
//     mockAxiosGet.mockClear()
//     setupGitHubTestEnv()
//   })

//   afterEach(() => {
//     vi.clearAllMocks()
//     cleanupGitHubTestEnv()
//   })

//   describe('successful data fetching', () => {
//     it('should fetch projects with language data successfully', async () => {
//       // Mock successful API responses
//       mockAxiosGet
//         .mockResolvedValueOnce({ data: [mockGitHubProjectBase] })
//         .mockResolvedValueOnce({ data: mockGitHubProjectBase.languages })

//       const { result } = renderHook(() => useProjects(), {
//         wrapper: createQueryClientWrapper(),
//       })

//       // Initially should be loading
//       expect(result.current.isLoading).toBe(true)
//       expect(result.current.data).toBeUndefined()

//       // Wait for data to load
//       await waitFor(() => {
//         expect(result.current.isLoading).toBe(false)
//       })

//       // Verify successful fetch
//       expect(result.current.data).toHaveLength(1)
//       expect(result.current.data?.[0]).toMatchObject({
//         id: mockGitHubProjectBase.id,
//         name: mockGitHubProjectBase.name,
//         languages: mockGitHubProjectBase.languages,
//       })
//       expect(result.current.error).toBeNull()
//     })

//     it('should filter out project with specific ID (334629076)', async () => {
//       // Mock API responses with filtered project
//       mockAxiosGet
//         .mockResolvedValueOnce({ data: [mockGitHubProjectBase, mockProjects.filtered] })
//         .mockResolvedValueOnce({ data: mockGitHubProjectBase.languages })
//         .mockResolvedValueOnce({ data: mockProjects.filtered.languages })

//       const { result } = renderHook(() => useProjects(), {
//         wrapper: createQueryClientWrapper(),
//       })

//       await waitFor(() => {
//         expect(result.current.isLoading).toBe(false)
//       })

//       // Should only include non-filtered project
//       expect(result.current.data).toHaveLength(1)
//       expect(result.current.data?.[0]?.id).toBe(mockGitHubProjectBase.id)
//       expect(result.current.data?.find((p) => p.id === 334629076)).toBeUndefined()
//     })
//   })

//   describe('statistics calculation', () => {
//     it('should calculate project statistics correctly', async () => {
//       const project1 = createMockProject({ stargazers_count: 10, forks_count: 2 })
//       const project2 = createMockProject({
//         id: 987654321,
//         stargazers_count: 5,
//         forks_count: 3,
//         language: 'JavaScript',
//         homepage: null,
//         topics: ['vue', 'javascript'],
//         languages: { JavaScript: 8000, CSS: 1000 },
//       })

//       mockAxiosGet
//         .mockResolvedValueOnce({ data: [project1, project2] })
//         .mockResolvedValueOnce({ data: project1.languages })
//         .mockResolvedValueOnce({ data: project2.languages })

//       const { result } = renderHook(() => useProjects(), {
//         wrapper: createQueryClientWrapper(),
//       })

//       await waitFor(() => {
//         expect(result.current.isLoading).toBe(false)
//       })

//       const { statistics } = result.current

//       expect(statistics.totalProjects).toBe(2)
//       expect(statistics.totalStars).toBe(15) // 10 + 5
//       expect(statistics.totalForks).toBe(5) // 2 + 3
//       expect(statistics.projectsWithDemos).toBe(1) // Only project1 has homepage
//       expect(statistics.uniqueTechnologies).toBe(3) // TypeScript, JavaScript, CSS
//       expect(statistics.technologiesList).toEqual(['CSS', 'JavaScript', 'TypeScript'])
//       expect(statistics.uniqueTopics).toBe(5) // react, typescript, testing, vue, javascript
//       expect(statistics.allTopics).toEqual(['javascript', 'react', 'testing', 'typescript', 'vue'])
//     })

//     it('should handle empty projects array', async () => {
//       mockAxiosGet.mockResolvedValueOnce({ data: [] })

//       const { result } = renderHook(() => useProjects(), {
//         wrapper: createQueryClientWrapper(),
//       })

//       await waitFor(() => {
//         expect(result.current.isLoading).toBe(false)
//       })

//       const { statistics } = result.current

//       expect(statistics.totalProjects).toBe(0)
//       expect(statistics.totalStars).toBe(0)
//       expect(statistics.totalForks).toBe(0)
//       expect(statistics.projectsWithDemos).toBe(0)
//       expect(statistics.uniqueTechnologies).toBe(0)
//       expect(statistics.technologiesList).toEqual([])
//       expect(statistics.uniqueTopics).toBe(0)
//       expect(statistics.allTopics).toEqual([])
//     })
//   })

//   describe('error handling', () => {
//     it('should handle GitHub API errors', async () => {
//       const error = new Error('GitHub API rate limit exceeded')
//       mockAxiosGet.mockRejectedValueOnce(error)

//       const { result } = renderHook(() => useProjects(), {
//         wrapper: createQueryClientWrapper(),
//       })

//       await waitFor(() => {
//         expect(result.current.isLoading).toBe(false)
//       })

//       expect(result.current.error).toBeTruthy()
//       expect(result.current.data).toBeUndefined()
//     })

//     it('should handle language fetch errors gracefully', async () => {
//       // Main API succeeds, language API fails
//       mockAxiosGet
//         .mockResolvedValueOnce({ data: [mockGitHubProjectBase] })
//         .mockRejectedValueOnce(new Error('Language API error'))

//       const { result } = renderHook(() => useProjects(), {
//         wrapper: createQueryClientWrapper(),
//       })

//       await waitFor(() => {
//         expect(result.current.isLoading).toBe(false)
//       })

//       // Should still return project data without languages
//       expect(result.current.data).toHaveLength(1)
//       expect(result.current.data?.[0]?.languages).toEqual({})
//       expect(result.current.error).toBeNull()
//     })
//   })

//   describe('authentication handling', () => {
//     it('should include authorization header when token is provided', async () => {
//       mockAxiosGet
//         .mockResolvedValueOnce({ data: [mockGitHubProjectBase] })
//         .mockResolvedValueOnce({ data: mockGitHubProjectBase.languages })

//       const { result } = renderHook(() => useProjects(), {
//         wrapper: createQueryClientWrapper(),
//       })

//       await waitFor(() => {
//         expect(result.current.isLoading).toBe(false)
//       })

//       // Verify authorization header was included
//       expectAuthHeaders(mockAxiosGet.mock.calls[0] as unknown[], true)
//     })

//     it('should not include authorization header when token is placeholder', async () => {
//       vi.stubEnv('VITE_GITHUB_TOKEN', authScenarios.placeholderToken.token)

//       mockAxiosGet
//         .mockResolvedValueOnce({ data: [mockGitHubProjectBase] })
//         .mockResolvedValueOnce({ data: mockGitHubProjectBase.languages })

//       const { result } = renderHook(() => useProjects(), {
//         wrapper: createQueryClientWrapper(),
//       })

//       await waitFor(() => {
//         expect(result.current.isLoading).toBe(false)
//       })

//       // Verify no authorization header when token is placeholder
//       expect(mockAxiosGet).toHaveBeenCalledWith(
//         'https://api.github.com/users/testuser/repos',
//         expect.objectContaining({
//           // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//           headers: expect.not.objectContaining({
//             Authorization: 'any-token-value',
//           }),
//         }),
//       )
//     })
//   })
// })
