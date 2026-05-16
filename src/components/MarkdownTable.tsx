import { isValidElement, type ReactElement, type ReactNode } from 'react'

interface MarkdownTableProps {
  readonly children?: ReactNode
}

interface TableCell {
  readonly content: ReactNode
  readonly key: string
  readonly text: string
}

interface TableRow {
  readonly cells: TableCell[]
  readonly key: string
}

function toNodeArray(node: ReactNode): ReactNode[] {
  if (Array.isArray(node)) {
    return node.flatMap(toNodeArray)
  }

  if (node === null || node === undefined || typeof node === 'boolean') {
    return []
  }
  return [node]
}

function uniqueKey(base: string, seen: Map<string, number>): string {
  const normalizedBase = base.trim() || 'empty'
  const count = seen.get(normalizedBase) ?? 0
  seen.set(normalizedBase, count + 1)

  return count === 0 ? normalizedBase : `${normalizedBase}-${String(count)}`
}

function getNodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join(' ')
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getNodeText(node.props.children)
  }

  return ''
}

function collectRows(node: ReactNode): TableRow[] {
  const rows: TableRow[] = []
  const seenRows = new Map<string, number>()

  for (const child of toNodeArray(node)) {
    if (!isValidElement<{ children?: ReactNode }>(child)) {
      continue
    }

    if (child.type !== 'tr') {
      rows.push(...collectRows(child.props.children))
      continue
    }

    const seenCells = new Map<string, number>()
    const cells = toNodeArray(child.props.children)
      .filter((cell): cell is ReactElement<{ children?: ReactNode }> => isValidElement(cell))
      .map((cell) => {
        const text = getNodeText(cell.props.children)

        return {
          content: cell.props.children,
          key: uniqueKey(text, seenCells),
          text,
        }
      })

    if (cells.length > 0) {
      const rowText = cells.map((cell) => cell.text).join('|')
      rows.push({ cells, key: uniqueKey(rowText, seenRows) })
    }
  }

  return rows
}

export function MarkdownTable({ children }: MarkdownTableProps) {
  const [headerRow, ...rows] = collectRows(children)
  const headers = headerRow?.cells ?? []

  return (
    <div className="not-prose my-6">
      <div className="hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm sm:block dark:border-gray-700 dark:bg-gray-900/60">
        <table className="w-full table-auto border-separate border-spacing-0 text-left text-sm text-gray-700 dark:text-gray-200 [&_td:nth-child(2)]:whitespace-nowrap [&_td:nth-child(3)]:whitespace-nowrap">
          {children}
        </table>
      </div>

      <div className="space-y-3 sm:hidden">
        {rows.map((row) => (
          <div
            key={row.key}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/60"
          >
            {row.cells.map((cell, cellIndex) => (
              <div
                key={cell.key}
                className="border-b border-gray-100 py-2 first:pt-0 last:border-b-0 last:pb-0 dark:border-gray-800"
              >
                <div className="mb-1 text-[0.68rem] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  {headers[cellIndex]?.text ?? `Columna ${String(cellIndex + 1)}`}
                </div>
                <div className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                  {cell.content}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function MarkdownTableHead({ children }: MarkdownTableProps) {
  return (
    <thead className="bg-gray-50 text-xs tracking-wide text-gray-600 uppercase dark:bg-gray-800/80 dark:text-gray-300">
      {children}
    </thead>
  )
}

export function MarkdownTableHeader({ children }: MarkdownTableProps) {
  return (
    <th className="border-b border-gray-200 px-4 py-3 font-semibold first:rounded-tl-2xl last:rounded-tr-2xl dark:border-gray-700">
      {children}
    </th>
  )
}

export function MarkdownTableCell({ children }: MarkdownTableProps) {
  return (
    <td className="border-b border-gray-100 px-4 py-3 align-top leading-relaxed last:min-w-64 dark:border-gray-800">
      {children}
    </td>
  )
}
