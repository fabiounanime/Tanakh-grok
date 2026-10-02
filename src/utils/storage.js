const TAB_KEY = 'biblia-tanakh:activeTab';

const TAB_KEYS = new Set(['portuguese', 'hebrew', 'transliteration']);

export function getSavedTab() {
  const saved = localStorage.getItem(TAB_KEY);
  // Migrate the former tab key while preserving the user's preference.
  if (saved === 'original') return 'hebrew';
  return TAB_KEYS.has(saved) ? saved : 'portuguese';
}

export function saveTab(tab) {
  if (TAB_KEYS.has(tab)) localStorage.setItem(TAB_KEY, tab);
}
