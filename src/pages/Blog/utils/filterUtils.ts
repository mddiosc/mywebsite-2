import type { BlogPost } from '../../../types/blog'
import type { FilterState } from '../components/BlogFilters'

export function filterAndSortPosts(posts: BlogPost[], filters: FilterState): BlogPost[] {
  let filteredPosts = [...posts]

  // Apply search filter
  if (filters.search.trim()) {
    const searchTerm = filters.search.toLowerCase().trim()
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.meta.title.toLowerCase().includes(searchTerm) ||
        post.meta.description.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.meta.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )
  }

  // Apply featured filter
  if (filters.showFeatured) {
    filteredPosts = filteredPosts.filter((post) => post.meta.featured)
  }

  // Apply tags filter
  if (filters.selectedTags.length > 0) {
    filteredPosts = filteredPosts.filter((post) =>
      filters.selectedTags.some((selectedTag) => post.meta.tags.includes(selectedTag)),
    )
  }

  // Apply sorting
  filteredPosts.sort((a, b) => {
    switch (filters.sortBy) {
      case 'date-desc':
        return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
      case 'date-asc':
        return new Date(a.meta.date).getTime() - new Date(b.meta.date).getTime()
      case 'reading-time':
        return a.readingTime - b.readingTime
      case 'title':
        return a.meta.title.localeCompare(b.meta.title)
      default:
        return 0
    }
  })

  return filteredPosts
}

// Get statistics for filtered results
export function getFilteredStats(allPosts: BlogPost[], filteredPosts: BlogPost[]) {
  return {
    total: allPosts.length,
    filtered: filteredPosts.length,
    hidden: allPosts.length - filteredPosts.length,
    hasResults: filteredPosts.length > 0,
  }
}
