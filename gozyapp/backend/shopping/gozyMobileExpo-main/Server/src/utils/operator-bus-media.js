/** Curated operator bus photos (refreshed on each API call with fetchedAt). */
const OPERATOR_PHOTO_POOL = {
  'mythri-tours-and-travels': [
    'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1593481/pexels-photo-1593481.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  'vrl-travels': [
    'https://images.pexels.com/photos/1593481/pexels-photo-1593481.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  'srs-travels': [
    'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  'orange-tours': [
    'https://images.pexels.com/photos/1593481/pexels-photo-1593481.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  'kallada-travels': [
    'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  'intrcity-smartbus': [
    'https://images.pexels.com/photos/1593481/pexels-photo-1593481.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  'zingbus': [
    'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  'apsrtc': [
    'https://images.pexels.com/photos/1593481/pexels-photo-1593481.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  'ksrtc': [
    'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  'msrtc': [
    'https://images.pexels.com/photos/1593481/pexels-photo-1593481.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  _default: [
    'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1593481/pexels-photo-1593481.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
};

function normalizeOperatorSlug(operator) {
  return operator
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function resolveOperatorSlug(operator) {
  const slug = normalizeOperatorSlug(operator);
  if (OPERATOR_PHOTO_POOL[slug]) return slug;

  const partial = Object.keys(OPERATOR_PHOTO_POOL).find(
    (key) => key !== '_default' && (slug.includes(key) || key.includes(slug)),
  );
  return partial || '_default';
}

function hashBusId(busId) {
  return busId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function getOperatorBusPhotos({ operator, busId }) {
  const slug = resolveOperatorSlug(operator || '');
  const pool = OPERATOR_PHOTO_POOL[slug] || OPERATOR_PHOTO_POOL._default;
  const offset = busId ? hashBusId(busId) % pool.length : 0;
  const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];

  return {
    operator: operator || 'Bus Operator',
    operatorSlug: slug,
    fetchedAt: new Date().toISOString(),
    photos: rotated.map((url, index) => ({
      id: `${slug}-${index}`,
      url,
      caption: operator,
    })),
  };
}

module.exports = {
  getOperatorBusPhotos,
  normalizeOperatorSlug,
};
