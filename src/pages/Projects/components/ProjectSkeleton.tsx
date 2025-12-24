const ProjectSkeleton = () => {
  return (
    <div className="group relative flex h-full animate-pulse flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Image skeleton */}
      <div className="aspect-h-4 aspect-w-3 sm:aspect-none bg-gray-200 sm:h-48">
        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
          <div className="h-16 w-16 rounded bg-gray-300"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-col gap-2">
          {/* Title skeleton */}
          <div className="h-6 w-3/4 rounded bg-gray-300"></div>
          {/* Description skeleton - fixed height to match actual card */}
          <div className="flex min-h-18 flex-col gap-2">
            <div className="h-4 w-full rounded bg-gray-300"></div>
            <div className="h-4 w-5/6 rounded bg-gray-300"></div>
            <div className="h-4 w-4/5 rounded bg-gray-300"></div>
          </div>
        </div>

        <div className="mt-4 flex flex-1 flex-col justify-between">
          <div className="flex flex-col gap-3">
            {/* Languages skeleton */}
            <div className="flex flex-col gap-2">
              <div className="h-3 w-20 rounded bg-gray-300"></div>
              <div className="h-2 w-full rounded bg-gray-300"></div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  <div className="h-3 w-16 rounded bg-gray-300"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  <div className="h-3 w-12 rounded bg-gray-300"></div>
                </div>
              </div>
            </div>

            {/* Topics skeleton - Fixed height container */}
            <div className="h-16">
              <div className="flex flex-wrap gap-1">
                {[1, 2, 3].map((tag) => (
                  <div key={tag} className="h-6 w-16 rounded-md bg-gray-300"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom section skeleton */}
          <div className="flex flex-col gap-3">
            {/* Date skeleton */}
            <div className="h-4 w-32 rounded bg-gray-300"></div>
            {/* Footer skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                <div className="flex items-center gap-x-1">
                  <div className="h-4 w-4 rounded bg-gray-300"></div>
                  <div className="h-3 w-4 rounded bg-gray-300"></div>
                </div>
                <div className="flex items-center gap-x-1">
                  <div className="h-4 w-4 rounded bg-gray-300"></div>
                  <div className="h-3 w-4 rounded bg-gray-300"></div>
                </div>
              </div>
              <div className="h-7 w-16 rounded-md bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectSkeleton
