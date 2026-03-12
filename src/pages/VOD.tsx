import { useEffect, useState, useCallback } from 'preact/hooks'
import { route } from 'preact-router'
import { useVodStore } from '@/stores/vodStore'
import { useSessionStore } from '@/stores/sessionStore'
import { isSpatialEnabled } from '@/spatial'
import { Loader } from '@/components/Loader'
import { VodCategoryBar } from '@/components/VodCategoryBar'
import { VodCard } from '@/components/VodCard'

const GRID_COLS = 5
const CHIP_W = 220
const CHIP_GAP = 12

export function VOD() {
  const user = useSessionStore((s) => s.user)
  const selectedProfile = useSessionStore((s) => s.selectedProfile)

  const libraries = useVodStore((s) => s.libraries)
  const categories = useVodStore((s) => s.categories)
  const selectedCategoryIndex = useVodStore((s) => s.selectedCategoryIndex)
  const contents = useVodStore((s) => s.contents)
  const isLoadingCategories = useVodStore((s) => s.isLoadingCategories)
  const isLoadingContents = useVodStore((s) => s.isLoadingContents)
  const isLoadingLibraries = useVodStore((s) => s.isLoadingLibraries)
  const error = useVodStore((s) => s.error)
  const libraryId = useVodStore((s) => s.libraryId)
  const fetchLibraries = useVodStore((s) => s.fetchLibraries)
  const fetchCategories = useVodStore((s) => s.fetchCategories)
  const fetchCategoryContents = useVodStore((s) => s.fetchCategoryContents)
  const setSelectedCategoryIndex = useVodStore((s) => s.setSelectedCategoryIndex)

  const [focusArea, setFocusArea] = useState<'categories' | 'grid'>('categories')
  const [gridIndex, setGridIndex] = useState(0)
  const [catScrollOffset, setCatScrollOffset] = useState(0)
  const [gridScrollY, setGridScrollY] = useState(0)

  const profileId = selectedProfile?.idProfile ? String(selectedProfile.idProfile) : selectedProfile?.id || ''

  // Fetch libraries on mount
  useEffect(() => {
    const regionId = user?.regionIds?.[0]
    if (!regionId) return
    const lang = selectedProfile?.language || 'en'
    if (libraries.length === 0) {
      fetchLibraries(regionId, lang)
    }
  }, [user, selectedProfile])

  // Once libraries loaded, fetch first library's categories
  useEffect(() => {
    if (libraries.length > 0 && profileId && categories.length === 0) {
      fetchCategories(profileId, libraries[0].id)
    }
  }, [libraries, profileId])

  // Scroll category bar to keep selected visible
  useEffect(() => {
    const x = selectedCategoryIndex * (CHIP_W + CHIP_GAP)
    const maxVisible = 1600
    if (x + CHIP_W > -catScrollOffset + maxVisible) {
      setCatScrollOffset(-(x - maxVisible + CHIP_W + CHIP_GAP))
    } else if (x < -catScrollOffset) {
      setCatScrollOffset(-x)
    }
  }, [selectedCategoryIndex])

  // Scroll grid to keep focused row visible
  useEffect(() => {
    const row = Math.floor(gridIndex / GRID_COLS)
    const rowH = 300
    const maxVisibleRows = 2
    const y = row * rowH
    if (y > -gridScrollY + rowH * maxVisibleRows) {
      setGridScrollY(-(y - rowH * (maxVisibleRows - 1)))
    } else if (y < -gridScrollY) {
      setGridScrollY(-y)
    }
  }, [gridIndex])

  // Reset grid index when contents change
  useEffect(() => {
    setGridIndex(0)
    setGridScrollY(0)
  }, [contents])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!isSpatialEnabled()) return

    if (focusArea === 'categories') {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          e.stopImmediatePropagation()
          if (selectedCategoryIndex > 0) {
            const newIdx = selectedCategoryIndex - 1
            setSelectedCategoryIndex(newIdx)
            if (categories[newIdx] && profileId && libraryId) {
              fetchCategoryContents(profileId, libraryId, categories[newIdx].id)
            }
          }
          // if at 0, let spatial nav edge open sidebar
          break

        case 'ArrowRight':
          e.preventDefault()
          e.stopImmediatePropagation()
          if (selectedCategoryIndex < categories.length - 1) {
            const newIdx = selectedCategoryIndex + 1
            setSelectedCategoryIndex(newIdx)
            if (categories[newIdx] && profileId && libraryId) {
              fetchCategoryContents(profileId, libraryId, categories[newIdx].id)
            }
          }
          break

        case 'ArrowDown':
          e.preventDefault()
          e.stopImmediatePropagation()
          if (contents.length > 0) {
            setFocusArea('grid')
            setGridIndex(0)
          }
          break

        case 'Escape':
        case 'Back':
          e.preventDefault()
          e.stopImmediatePropagation()
          route('/')
          break
      }
    } else if (focusArea === 'grid') {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          e.stopImmediatePropagation()
          if (gridIndex % GRID_COLS > 0) {
            setGridIndex((i) => i - 1)
          }
          break

        case 'ArrowRight':
          e.preventDefault()
          e.stopImmediatePropagation()
          if (gridIndex % GRID_COLS < GRID_COLS - 1 && gridIndex < contents.length - 1) {
            setGridIndex((i) => i + 1)
          }
          break

        case 'ArrowUp':
          e.preventDefault()
          e.stopImmediatePropagation()
          if (gridIndex >= GRID_COLS) {
            setGridIndex((i) => i - GRID_COLS)
          } else {
            setFocusArea('categories')
          }
          break

        case 'ArrowDown':
          e.preventDefault()
          e.stopImmediatePropagation()
          if (gridIndex + GRID_COLS < contents.length) {
            setGridIndex((i) => i + GRID_COLS)
          }
          break

        case 'Escape':
        case 'Back':
          e.preventDefault()
          e.stopImmediatePropagation()
          setFocusArea('categories')
          break
      }
    }
  }, [focusArea, selectedCategoryIndex, gridIndex, categories, contents, profileId, libraryId, fetchCategoryContents, setSelectedCategoryIndex])

  useEffect(() => {
    document.addEventListener('keydown', handleKey, true)
    return () => document.removeEventListener('keydown', handleKey, true)
  }, [handleKey])

  const isLoading = isLoadingLibraries || isLoadingCategories

  return (
    <div class="page page-vod page-with-sidebar">
      <h1 class="page-title">Movies & VOD</h1>

      {isLoading && <Loader message="Loading VOD..." />}
      {error && <p class="text-error" style={{ fontSize: '24px' }}>{error}</p>}

      {!isLoading && !error && categories.length > 0 && (
        <>
          <VodCategoryBar
            categories={categories}
            selectedIndex={selectedCategoryIndex}
            focused={focusArea === 'categories'}
            scrollOffset={catScrollOffset}
          />

          <div class="vod-grid-container">
            {isLoadingContents && <Loader message="Loading..." />}

            {!isLoadingContents && contents.length === 0 && (
              <p class="text-muted" style={{ fontSize: '22px', padding: '40px 0' }}>
                No content in this category
              </p>
            )}

            {!isLoadingContents && contents.length > 0 && (
              <div
                class="vod-grid"
                style={{ transform: `translateY(${gridScrollY}px)` }}
              >
                {contents.map((item, i) => (
                  <VodCard
                    key={item.id}
                    content={item}
                    focused={focusArea === 'grid' && gridIndex === i}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {!isLoading && !error && categories.length === 0 && (
        <p class="text-muted" style={{ fontSize: '22px' }}>No VOD categories available</p>
      )}
    </div>
  )
}
