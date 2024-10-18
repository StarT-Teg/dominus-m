import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'

const container = document.getElementById('root');
const root = createRoot(container);
const queryClient = new QueryClient()

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App/>
        </QueryClientProvider>
    </StrictMode>,
)
