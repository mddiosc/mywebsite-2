import { useQuery } from '@tanstack/react-query'

interface User {
  name: string
  email: string
}

function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'email' in data &&
    typeof (data as User).name === 'string' &&
    typeof (data as User).email === 'string'
  )
}

const fetchUser = async (): Promise<User> => {
  const res = await fetch('https://api.example.com/user/1')
  if (!res.ok) throw new Error('Error fetching user')
  const data: unknown = await res.json()

  if (isUser(data)) {
    return data
  }
  throw new Error('Invalid response format')
}

export function UserProfile() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ['user'],
    queryFn: fetchUser,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading user</div>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{user?.name}</h1>
      <p className="text-gray-600">{user?.email}</p>
    </div>
  )
}
