const { getCachedValue, setCachedValue } = require('../config/cache');
const { state } = require('../utils/store');

function normalizePrompt(prompt) {
  return prompt.toLowerCase().trim();
}

function formatPrice(value) {
  return `Rs ${value.toLocaleString('en-IN')}`;
}

function buildTravelReply() {
  const picks = state.travel.slice(0, 3);
  return {
    reply: `I would start with ${picks[0].title} for the fare, ${picks[1].title} for the stay, and ${picks[2].title} for a complete plan. Based on your profile, this fits a compact weekend trip with strong social and cafe coverage.`,
    chips: ['Show Goa travel deals', 'Find beach stays', 'Open travel module'],
  };
}

function buildFoodReply() {
  const picks = state.restaurants.slice(0, 2);
  return {
    reply: `Near ${state.session.user.city}, I would prioritize ${picks[0].name} for quick healthy delivery and ${picks[1].name} for a heavier dinner plan. Both match your current preference for fast decisions and good repeat value.`,
    chips: ['Open food module', 'Add top bowl to cart', 'Find late-night dining'],
  };
}

function buildShoppingReply() {
  const picks = state.products.slice(0, 2);
  return {
    reply: `The strongest shopping picks today are ${picks[0].name} at ${formatPrice(picks[0].price)} and ${picks[1].name} at ${formatPrice(picks[1].price)}. I ranked them because your saves skew toward fashion-first utility buys with deal sensitivity.`,
    chips: ['Open shopping module', 'See fashion deals', 'Add top product to cart'],
  };
}

function buildEntertainmentReply() {
  const picks = state.events.slice(0, 2);
  return {
    reply: `For tonight, ${picks[0].title} is the cleanest premium movie option and ${picks[1].title} gives you a better social vibe. I would chain one of these with a nearby food stop for a tighter plan.`,
    chips: ['Open entertainment', 'Book movie tickets', 'Plan Friday night'],
  };
}

function buildGenericReply() {
  return {
    reply: `I can help across travel, food, shopping, and entertainment. Your current profile leans toward ${state.session.user.preferredCategories.join(', ')}, with the strongest recent signal being ${state.recommendations[0].toLowerCase()}`,
    chips: ['Plan my Goa trip', 'Best food near me', 'Weekend shopping deals'],
  };
}

function buildAssistantResponse(prompt) {
  const normalized = normalizePrompt(prompt);

  if (
    normalized.includes('trip') ||
    normalized.includes('travel') ||
    normalized.includes('goa') ||
    normalized.includes('flight') ||
    normalized.includes('hotel')
  ) {
    return buildTravelReply();
  }

  if (
    normalized.includes('food') ||
    normalized.includes('restaurant') ||
    normalized.includes('eat') ||
    normalized.includes('dinner') ||
    normalized.includes('cafe')
  ) {
    return buildFoodReply();
  }

  if (
    normalized.includes('shop') ||
    normalized.includes('fashion') ||
    normalized.includes('deal') ||
    normalized.includes('buy') ||
    normalized.includes('electronics')
  ) {
    return buildShoppingReply();
  }

  if (
    normalized.includes('movie') ||
    normalized.includes('event') ||
    normalized.includes('show') ||
    normalized.includes('entertainment') ||
    normalized.includes('night')
  ) {
    return buildEntertainmentReply();
  }

  return buildGenericReply();
}

async function getAssistantReply(prompt) {
  const cacheKey = `assistant:${normalizePrompt(prompt)}`;
  const cached = await getCachedValue(cacheKey);
  if (cached) {
    return cached;
  }

  const response = buildAssistantResponse(prompt);
  await setCachedValue(cacheKey, response, 300);
  return response;
}

module.exports = {
  getAssistantReply,
};
