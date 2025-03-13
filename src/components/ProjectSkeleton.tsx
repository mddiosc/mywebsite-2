const ProjectSkeleton = () => {
  return (
    <div className="group relative flex h-full animate-pulse flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Header skeleton */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="h-4 w-1/2 rounded bg-gray-300"></div>
        <div className="flex items-center">
          <div className="mr-1.5 h-3 w-3 flex-shrink-0 rounded-full bg-gray-300"></div>
          <div className="h-3 w-16 rounded bg-gray-300"></div>
        </div>
      </div>

      {/* Body skeleton */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 rounded bg-gray-300"></div>
          <div className="h-3 w-full rounded bg-gray-300"></div>
          <div className="h-3 w-5/6 rounded bg-gray-300"></div>
        </div>

        {/* Topics skeleton */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 2, 3].map((tag) => (
            <div key={tag} className="h-6 w-16 rounded-md bg-gray-300"></div>
          ))}
        </div>

        {/* Footer skeleton */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-5 w-5 rounded bg-gray-300"></div>
            <div className="ml-1 h-3 w-6 rounded bg-gray-300"></div>
          </div>
          <div className="h-3 w-16 rounded bg-gray-300"></div>
        </div>
      </div>
    </div>
  )
}

export default ProjectSkeleton
