import { render } from 'preact'
import { App } from './App'
import { platformInit } from '@/platform'
import { spatialInit } from '@/spatial'
import { useSessionStore } from '@/stores/sessionStore'
import { useChannelStore } from '@/stores/channelStore'
import './styles/global.css'

// Init platform (register keys, keep alive, etc.)
const platform = platformInit()
console.log('Platform:', platform)
console.log('SDK initialized, base URL:', import.meta.env.VITE_API_BASE_URL)

// Init spatial navigation
spatialInit()

// Restore session from localStorage + inject token into SDK
useSessionStore.getState().init()

// Load saved favorites
useChannelStore.getState().loadFavorites()

// Mount app
render(<App />, document.getElementById('app')!)
