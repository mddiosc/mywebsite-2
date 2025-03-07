import { useQuery } from '@tanstack/react-query'

interface Todo {
  id: number
  title: string
}

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos')
  return res.json() as Promise<Todo[]>
}

export function ExampleComponent() {
  const { data, isLoading, error } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error al cargar los datos</div>

  return (
    <div>
      <h1>Lista de Todos</h1>
      <ul>{data?.slice(0, 5).map((todo: Todo) => <li key={todo.id}>{todo.title}</li>)}</ul>
    </div>
  )
}
