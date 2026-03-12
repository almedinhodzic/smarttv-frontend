import { useEffect, useState, useCallback } from 'preact/hooks'
import { route } from 'preact-router'
import { useVodStore } from '@/stores/vodStore'
import { useSessionStore } from '@/stores/sessionStore'
import { isSpatialEnabled } from '@/spatial'
import { Loader } from '@/components/Loader'
import { VodCategoryBar } from '@/components/VodCategoryBar'
import { VodCard } from '@/components/VodCard'

const CHIP_W = 280
const CHIP_GAP = 16

export function VOD() {
  const user = useSessionStore((s) => s.user)
  const selectedProfile = useSessionStore((s) => s.selectedProfile)

  const libraries = useVodStore((s) => s.libraries)
  const categories = useVodStore((s) => s.categories)
  const selectedCategoryIndex = useVodStore((s) => s.selectedCategoryIndex)
  const rows = useVodStore((s) => s.rows)
  const isLoadingCategories = useVodStore((s) => s.isLoadingCategories)
  const isLoadingContents = useVodStore((s) => s.isLoadingContents)
  const isLoadingLibraries = useVodStore((s) => s.isLoadingLibraries)
  const error = useVodStore((s) => s.error)
  const libraryId = useVodStore((s) => s.libraryId)
  const fetchLibraries = useVodStore((s) => s.fetchLibraries)
  const fetchCategories = useVodStore((s) => s.fetchCategories)
  const fetchCategoryData = useVodStore((s) => s.fetchCategoryData)
  const setSelectedCategoryIndex = useVodStore((s) => s.setSelectedCategoryIndex)

  const [focusArea, setFocusArea] = useState<'categories' | 'rows'>('categories')
  const [rowIndex, setRowIndex] = useState(0)
  const [colIndex, setColIndex] = useState(0)
  const [catScrollOffset, setCatScrollOffset] = useState(0)
  const [rowScrollOffsets, setRowScrollOffsets] = useState<number[]>([])
  const [contentScrollY, setContentScrollY] = useState(0)

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

  // Scroll category bar
  useEffect(() => {
    const x = selectedCategoryIndex * (CHIP_W + CHIP_GAP)
    const maxVisible = 1500
    if (x + CHIP_W > -catScrollOffset + maxVisible) {
      setCatScrollOffset(-(x - maxVisible + CHIP_W + CHIP_GAP))
    } else if (x < -catScrollOffset) {
      setCatScrollOffset(-x)
    }
  }, [selectedCategoryIndex])

  // Reset when rows change
  useEffect(() => {
    setRowIndex(0)
    setColIndex(0)
    setContentScrollY(0)
    setRowScrollOffsets(rows.map(() => 0))
  }, [rows])

  // Scroll content area vertically to keep focused row visible
  useEffect(() => {
    const ROW_H = 360
    const TITLED_ROW_H = 400
    const maxVisible = 600
    let y = 0
    for (let i = 0; i < rowIndex; i++) {
      y += rows[i]?.title ? TITLED_ROW_H : ROW_H
    }
    if (y > -contentScrollY + maxVisible) {
      setContentScrollY(-(y - maxVisible + ROW_H))
    } else if (y < -contentScrollY) {
      setContentScrollY(-y)
    }
  }, [rowIndex])

  // Scroll current row horizontally
  useEffect(() => {
    if (rows.length === 0) return
    const CARD_W = 340
    const CARD_GAP = 24
    const maxVisible = 1400
    const x = colIndex * (CARD_W + CARD_GAP)
    const offsets = [...rowScrollOffsets]
    const current = offsets[rowIndex] || 0
    if (x + CARD_W > -current + maxVisible) {
      offsets[rowIndex] = -(x - maxVisible + CARD_W + CARD_GAP)
    } else if (x < -current) {
      offsets[rowIndex] = -x
    }
    setRowScrollOffsets(offsets)
  }, [colIndex, rowIndex])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!isSpatialEnabled()) return

    if (focusArea === 'categories') {
      switch (e.key) {
        case 'ArrowLeft':
          if (selectedCategoryIndex > 0) {
            e.preventDefault()
            e.stopImmediatePropagation()
            const newIdx = selectedCategoryIndex - 1
            setSelectedCategoryIndex(newIdx)
            if (categories[newIdx] && profileId && libraryId) {
              fetchCategoryData(profileId, libraryId, categories[newIdx])
            }
          }
          break

        case 'ArrowRight':
          e.preventDefault()
          e.stopImmediatePropagation()
          if (selectedCategoryIndex < categories.length - 1) {
            const newIdx = selectedCategoryIndex + 1
            setSelectedCategoryIndex(newIdx)
            if (categories[newIdx] && profileId && libraryId) {
              fetchCategoryData(profileId, libraryId, categories[newIdx])
            }
          }
          break

        case 'ArrowDown':
          e.preventDefault()
          e.stopImmediatePropagation()
          if (rows.length > 0) {
            setFocusArea('rows')
            setRowIndex(0)
            setColIndex(0)
          }
          break

        case 'Escape':
        case 'Back':
          e.preventDefault()
          e.stopImmediatePropagation()
          route('/')
          break
      }
    } else if (focusArea === 'rows') {
      const currentRow = rows[rowIndex]
      if (!currentRow) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          e.stopImmediatePropagation()
          if (colIndex > 0) {
            setColIndex((c) => c - 1)
          }
          break

        case 'ArrowRight':
          e.preventDefault()
          e.stopImmediatePropagation()
          if (colIndex < currentRow.contents.length - 1) {
            setColIndex((c) => c + 1)
          }
          break

        case 'ArrowUp':
          e.preventDefault()
          e.stopImmediatePropagation()
          if (rowIndex > 0) {
            const newRow = rowIndex - 1
            setRowIndex(newRow)
            // Clamp col to new row length
            const maxCol = rows[newRow].contents.length - 1
            if (colIndex > maxCol) setColIndex(maxCol)
          } else {
            setFocusArea('categories')
          }
          break

        case 'ArrowDown':
          e.preventDefault()
          e.stopImmediatePropagation()
          if (rowIndex < rows.length - 1) {
            const newRow = rowIndex + 1
            setRowIndex(newRow)
            const maxCol = rows[newRow].contents.length - 1
            if (colIndex > maxCol) setColIndex(maxCol)
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
  }, [focusArea, selectedCategoryIndex, rowIndex, colIndex, categories, rows, profileId, libraryId, fetchCategoryData, setSelectedCategoryIndex])

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
          <div class="vod-section-label">Categories</div>
          <VodCategoryBar
            categories={categories}
            selectedIndex={selectedCategoryIndex}
            focused={focusArea === 'categories'}
            scrollOffset={catScrollOffset}
          />

          <div class="vod-rows-container">
            {isLoadingContents && <Loader message="Loading..." />}

            {!isLoadingContents && rows.length === 0 && (
              <p class="text-muted" style={{ fontSize: '22px', padding: '40px 0' }}>
                No content in this category
              </p>
            )}

            {!isLoadingContents && rows.length > 0 && (
              <div
                class="vod-rows"
                style={{ transform: `translateY(${contentScrollY}px)` }}
              >
                {rows.map((row, ri) => (
                  <div key={row.categoryId} class="vod-row">
                    {row.title && <div class="vod-row-title">{row.title}</div>}
                    <div class="vod-row-scroll-container">
                      <div
                        class="vod-row-scroll"
                        style={{ transform: `translateX(${rowScrollOffsets[ri] || 0}px)` }}
                      >
                        {row.contents.map((item, ci) => (
                          <VodCard
                            key={item.id}
                            content={item}
                            focused={focusArea === 'rows' && rowIndex === ri && colIndex === ci}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
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
