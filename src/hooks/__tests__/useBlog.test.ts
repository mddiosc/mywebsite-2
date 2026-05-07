import { describe, it, expect } from 'vitest'

import { parseFrontmatterLine, parseFrontmatterValue, parseFrontmatter } from '../useBlog'

describe('parseFrontmatterLine', () => {
  it('parses a normal key value line', () => {
    expect(parseFrontmatterLine('title: Hello World')).toEqual(['title', 'Hello World'])
  })

  it('trims leading and trailing whitespace', () => {
    expect(parseFrontmatterLine('  title  :  Hello  ')).toEqual(['title', 'Hello'])
  })

  it('returns null for empty string', () => {
    expect(parseFrontmatterLine('')).toBeNull()
  })

  it('returns null for comment lines', () => {
    expect(parseFrontmatterLine('# comment')).toBeNull()
  })

  it('returns null for lines without a colon', () => {
    expect(parseFrontmatterLine('title Hello')).toBeNull()
  })

  it('keeps values containing colons', () => {
    expect(parseFrontmatterLine('date: 2024-01-01')).toEqual(['date', '2024-01-01'])
  })
})

describe('parseFrontmatterValue', () => {
  it('returns plain strings unchanged', () => {
    expect(parseFrontmatterValue('Hello World')).toBe('Hello World')
  })

  it('strips double quotes from strings', () => {
    expect(parseFrontmatterValue('"Hello"')).toBe('Hello')
  })

  it('strips single quotes from strings', () => {
    expect(parseFrontmatterValue("'Hello'")).toBe('Hello')
  })

  it('parses true as boolean', () => {
    expect(parseFrontmatterValue('true')).toBe(true)
  })

  it('parses false as boolean', () => {
    expect(parseFrontmatterValue('false')).toBe(false)
  })

  it('parses arrays of plain values', () => {
    expect(parseFrontmatterValue('[a, b, c]')).toEqual(['a', 'b', 'c'])
  })

  it('parses arrays with quoted values', () => {
    expect(parseFrontmatterValue("['a', 'b']")).toEqual(['a', 'b'])
  })

  it('parses empty arrays', () => {
    expect(parseFrontmatterValue('[]')).toEqual([])
  })

  it('parses single item arrays', () => {
    expect(parseFrontmatterValue('[only]')).toEqual(['only'])
  })

  it('keeps numeric strings as strings', () => {
    expect(parseFrontmatterValue('42')).toBe('42')
  })

  it('keeps date strings as strings', () => {
    expect(parseFrontmatterValue('2024-01-01')).toBe('2024-01-01')
  })
})

describe('parseFrontmatter', () => {
  it('parses full frontmatter correctly', () => {
    const input = `---\ntitle: Hello\ndescription: Example post\ndate: 2024-01-01\nauthor: Jane Doe\ntags: [a, b, c]\nfeatured: true\n---\nContent here`

    expect(parseFrontmatter(input)).toEqual({
      meta: {
        title: 'Hello',
        description: 'Example post',
        date: '2024-01-01',
        author: 'Jane Doe',
        tags: ['a', 'b', 'c'],
        featured: true,
      },
      content: 'Content here',
    })
  })

  it('returns original content when no frontmatter exists', () => {
    const content = 'Just markdown content\nwith two lines'
    expect(parseFrontmatter(content)).toEqual({ meta: {}, content })
  })

  it('handles empty frontmatter', () => {
    expect(parseFrontmatter('---\n---\nSome content')).toEqual({
      meta: {},
      content: 'Some content',
    })
  })

  it('parses minimal fields', () => {
    expect(parseFrontmatter('---\ntitle: Minimal\ndate: 2024-01-01\n---\nBody')).toEqual({
      meta: {
        title: 'Minimal',
        date: '2024-01-01',
      },
      content: 'Body',
    })
  })

  it('preserves content newlines after frontmatter', () => {
    expect(parseFrontmatter('---\ntitle: Test\n---\nLine 1\nLine 2\nLine 3')).toEqual({
      meta: { title: 'Test' },
      content: 'Line 1\nLine 2\nLine 3',
    })
  })

  it('parses metadata even when markdown content is empty after closing delimiter', () => {
    expect(
      parseFrontmatter('---\ntitle: Standalone\ndate: 2024-01-01\nfeatured: true\n---'),
    ).toEqual({
      meta: { title: 'Standalone', date: '2024-01-01', featured: true },
      content: '',
    })
  })
})
