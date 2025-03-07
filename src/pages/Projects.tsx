import useProjects from '../hooks/useProjects'

const Projects = () => {
  const { data: projects, error, isLoading } = useProjects()

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error al cargar los proyectos</div>

  return (
    <div className="flex flex-col items-center justify-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold">Mis Proyectos</h1>
      <div className="projects-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <div key={project.id} className="card rounded-lg bg-gray-100 p-6 shadow-md">
            <h2 className="text-2xl font-semibold">{project.name}</h2>
            <p className="mt-2 text-lg text-gray-500">{project.description}</p>
            <p className="mt-2 text-sm text-gray-500">Lenguaje: {project.language}</p>
            {project.homepage && (
              <a
                href={project.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
              >
                Visitar Página
              </a>
            )}
            <a
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
            >
              Ver en GitHub
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects
