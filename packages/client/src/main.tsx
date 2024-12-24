import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { queryClient, trpc, trpcClient } from './utils/trpc'

function Dummy() {
  const hi = trpc.hi.useQuery()
  const what = trpc.what.useQuery()
  const something = trpc.something.useQuery()
  const login = trpc.login.useMutation({
    onSuccess: (data) => {
      console.log({ data })
    },
  })

  return (
    <div>
      <pre>{JSON.stringify(what.data, null, 2)}</pre>
      <pre>{JSON.stringify(hi.data, null, 2)}</pre>
      <pre>{JSON.stringify(hi, null, 2)}</pre>
      <button
        onClick={() =>
          login.mutate({
            email: 'test@gmail.com',
            password: 'testtesttest',
          })
        }
      >
        Login
      </button>
    </div>
  )
}

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Dummy />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
