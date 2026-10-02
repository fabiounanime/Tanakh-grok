const TAB_KEY = 'biblia-tanakh:activeTab';

export function getSavedTab() {
  const t = localStorage.getItem(TAB_KEY);
  if (t === 'original' || t === 'transliteration' || t === 'portuguese') return t;
  return 'portuguese';
}

export function saveTab(tab) {
  localStorage.setItem(TAB_KEY, tab);
}
