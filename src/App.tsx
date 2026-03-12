import Router, { route } from 'preact-router'
import { useEffect, useCallback, useState } from 'preact/hooks'
import { useSessionStore } from '@/stores/sessionStore'
import { setOnEdge, focusFirst } from '@/spatial'
import { Sidebar } from '@/components/Sidebar'
import { Navbar } from '@/components/Navbar'
import { SettingsPanel } from '@/components/SettingsPanel'
import { FpsMonitor } from '@/components/FpsMonitor'
import { Home } from '@/pages/Home'
import { LiveTV } from '@/pages/LiveTV'
import { VOD } from '@/pages/VOD'
import { EPG } from '@/pages/EPG'
import { Search } from '@/pages/Search'
import { Auth } from '@/pages/Auth'
import { Profiles } from '@/pages/Profiles'

const HIDDEN_SIDEBAR_ROUTES = ['/auth', '/profiles', '/player']

function shouldHideSidebar(path: string): boolean {
  return HIDDEN_SIDEBAR_ROUTES.some((r) => path === r || path.startsWith(r + '/'))
}

export function App() {
  const [currentPath, setCurrentPath] = useState('/')
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated)
  const selectedProfile = useSessionStore((s) => s.selectedProfile)
  const refreshIfNeeded = useSessionStore((s) => s.refreshIfNeeded)

  const showSidebar = !shouldHideSidebar(currentPath)
  const showNavbar = currentPath === '/'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [navbarFocused, setNavbarFocused] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Open sidebar on left edge, navbar on up edge (home only)
  useEffect(() => {
    if (!showSidebar) {
      setOnEdge(null)
      return
    }
    setOnEdge((dir) => {
      if (dir === 'left') setSidebarOpen(true)
      if (dir === 'up' && showNavbar) setNavbarFocused(true)
    })
    return () => setOnEdge(null)
  }, [showSidebar, showNavbar])

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false)
    setTimeout(() => focusFirst(), 50)
  }, [])

  const handleNavbarBlur = useCallback(() => {
    setNavbarFocused(false)
    setTimeout(() => focusFirst(), 50)
  }, [])

  const handleOpenSettings = useCallback(() => {
    setSettingsOpen(true)
  }, [])

  const handleCloseSettings = useCallback(() => {
    setSettingsOpen(false)
    setTimeout(() => focusFirst(), 50)
  }, [])

  const handleRouteChange = useCallback(async (e: { url: string }) => {
    const path = e.url
    setCurrentPath(path)

    // Auth page — if already logged in, redirect to profiles
    if (path === '/auth') {
      if (isAuthenticated) {
        route('/profiles', true)
        return
      }
      return
    }

    // Not authenticated — redirect to auth
    if (!isAuthenticated) {
      route('/auth', true)
      return
    }

    // Token refresh check
    const valid = await refreshIfNeeded()
    if (!valid) {
      route('/auth', true)
      return
    }

    // Profile required (except /profiles itself)
    if (path !== '/profiles' && !selectedProfile?.id) {
      route('/profiles', true)
      return
    }
  }, [isAuthenticated, selectedProfile, refreshIfNeeded])

  // Initial redirect on mount
  useEffect(() => {
    if (!isAuthenticated) {
      route('/auth', true)
    } else if (!selectedProfile?.id) {
      route('/profiles', true)
    }
  }, [])

  return (
    <div id="app-root">
      <FpsMonitor />
      <Navbar
        visible={showNavbar}
        hasFocus={navbarFocused}
        onBlur={handleNavbarBlur}
        onOpenSidebar={() => { setNavbarFocused(false); setSidebarOpen(true) }}
      />
      {showSidebar && (
        <Sidebar
          visible={showSidebar}
          open={sidebarOpen}
          activePath={currentPath}
          onClose={handleCloseSidebar}
          onOpenSettings={handleOpenSettings}
        />
      )}
      <SettingsPanel open={settingsOpen} onClose={handleCloseSettings} />
      <Router onChange={handleRouteChange}>
        <Auth path="/auth" />
        <Profiles path="/profiles" />
        <Home path="/" />
        <LiveTV path="/live" />
        <VOD path="/vod" />
        <EPG path="/epg" />
        <Search path="/search" />
      </Router>
    </div>
  )
}
