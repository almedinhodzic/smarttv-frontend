const CATEGORY_LABELS: Record<string, string> = {
  GENRE_ACTION: 'Action',
  GENRE_ADVENTURE: 'Adventure',
  GENRE_ALTERNATIVE: 'Alternative',
  GENRE_BIOGRAPHY: 'Biography',
  GENRE_BLUES: 'Blues',
  GENRE_CHILDRENS: "Children's",
  GENRE_CLASSICAL: 'Classical',
  GENRE_COMEDY: 'Comedy',
  GENRE_COUNTRY: 'Country',
  GENRE_CRIME: 'Crime',
  GENRE_DOCUMENTARY: 'Documentary',
  GENRE_DRAMA: 'Drama',
  GENRE_ELECTRONIC: 'Electronic',
  GENRE_FAMILY: 'Family',
  GENRE_FANTASY: 'Fantasy',
  GENRE_FOLK: 'Folk',
  GENRE_HISTORY: 'History',
  GENRE_HOLIDAYS: 'Holidays',
  GENRE_HORROR: 'Horror',
  GENRE_INSTRUMENTAL: 'Instrumental',
  GENRE_JAZZ: 'Jazz',
  GENRE_LATIN: 'Latin',
  GENRE_MUSIC: 'Music',
  GENRE_MUSICAL: 'Musical',
  GENRE_MYSTERY: 'Mystery',
  GENRE_NOIR: 'Noir',
  GENRE_POPROCK: 'Pop/Rock',
  GENRE_RAP: 'Rap',
  GENRE_REALITY: 'Reality',
  GENRE_REGGAE: 'Reggae',
  GENRE_RNB: 'R&B',
  GENRE_ROMANCE: 'Romance',
  GENRE_SCIFI: 'Sci-Fi',
  GENRE_SPORT: 'Sport',
  GENRE_THRILLER: 'Thriller',
  GENRE_VARIOUS: 'Various',
  GENRE_VOCAL: 'Vocal',
  GENRE_WAR: 'War',
  GENRE_WESTERN: 'Western',
}

export function formatCategoryLabel(raw: string): string {
  if (CATEGORY_LABELS[raw]) return CATEGORY_LABELS[raw]

  // Fallback: strip GENRE_ prefix, title-case the rest
  const stripped = raw.replace(/^GENRE_/i, '')
  return stripped.charAt(0).toUpperCase() + stripped.slice(1).toLowerCase()
}
