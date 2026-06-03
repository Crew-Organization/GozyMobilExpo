const { seedData } = require('../data/seed');

const clone = (value) => JSON.parse(JSON.stringify(value));
const state = clone(seedData);
const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

function getBootstrap() {
  return {
    feed: state.feed,
    matches: state.matches,
    conversations: state.conversations,
    walletBalance: state.walletBalance,
    transactions: state.transactions,
    bookings: state.bookings,
    dashboard: state.dashboard,
    notifications: state.notifications,
    recommendations: state.recommendations,
    sections: state.sections,
    travel: state.travel,
    restaurants: state.restaurants,
    products: state.products,
    events: state.events,
    assistantMessages: state.assistantMessages,
  };
}

function getExperienceById(experienceId) {
  return state.feed.find((item) => item.id === experienceId);
}

function addAssistantMessage(message) {
  const nextMessage = {
    id: makeId(message.role === 'assistant' ? 'assistant' : 'assistant-user'),
    createdAt: new Date().toISOString(),
    ...message,
  };
  state.assistantMessages.push(nextMessage);
  return nextMessage;
}

function recordAssistantExchange(prompt, response) {
  addAssistantMessage({
    role: 'user',
    text: prompt,
  });

  return addAssistantMessage({
    role: 'assistant',
    text: response.reply,
    chips: response.chips,
  });
}

function updateSessionProfile(profile) {
  state.session.user = {
    ...state.session.user,
    ...profile,
  };
  return state.session.user;
}

function addNotification(notification) {
  const nextNotification = {
    id: makeId('notif'),
    createdAt: new Date().toISOString(),
    read: false,
    ...notification,
  };
  state.notifications.unshift(nextNotification);
  return nextNotification;
}

function addTransaction(transaction) {
  const nextTransaction = {
    id: makeId('txn'),
    createdAt: new Date().toISOString(),
    status: 'completed',
    ...transaction,
  };
  state.transactions.unshift(nextTransaction);
  return nextTransaction;
}

function addMessage(conversationId, senderId, text) {
  const conversation = state.conversations.find((item) => item.id === conversationId);
  if (!conversation) {
    return null;
  }

  const nextMessage = {
    id: makeId('msg'),
    senderId,
    text,
    kind: 'text',
    createdAt: new Date().toISOString(),
  };
  conversation.messages.push(nextMessage);
  conversation.lastMessage = text;
  return { conversation, message: nextMessage };
}

function markNotificationRead(notificationId) {
  const notification = state.notifications.find((item) => item.id === notificationId);
  if (notification) {
    notification.read = true;
  }
  return notification;
}

function applySwipe(experienceId, direction) {
  const experience = getExperienceById(experienceId);
  if (!experience) {
    return null;
  }

  if (direction === 'right') {
    state.dashboard.savedCount += 1;
    state.dashboard.recentActivity.unshift(`Saved ${experience.title}`);
    state.dashboard.recentActivity = state.dashboard.recentActivity.slice(0, 3);
    state.recommendations.unshift(
      `Because you saved ${experience.title}, Gozy will surface more ${experience.category.toLowerCase()} picks nearby.`,
    );
    state.recommendations = state.recommendations.slice(0, 3);
  }

  return experience;
}

function likeMatch(matchId) {
  const match = state.matches.find((item) => item.id === matchId);
  if (!match) {
    return null;
  }

  addNotification({
    title: `You matched with ${match.name}`,
    body: `Shared interests: ${match.interests.slice(0, 2).join(', ')}.`,
    kind: 'match',
  });
  return match;
}

function addWalletFunds(amount) {
  state.walletBalance += amount;
  state.dashboard.walletBalance += amount;
  addTransaction({
    title: 'Added via mock payment',
    amount,
    type: 'credit',
    category: 'wallet',
  });
  return state.walletBalance;
}

function chargeWalletIfNeeded(total, paymentMethod) {
  if (paymentMethod !== 'wallet') {
    return { ok: true };
  }

  if (state.walletBalance < total) {
    return { ok: false, error: 'Insufficient wallet balance' };
  }

  state.walletBalance -= total;
  state.dashboard.walletBalance = state.walletBalance;
  return { ok: true };
}

function createTrackingSteps(kind, hint) {
  if (kind === 'food') {
    return [
      { id: 'placed', label: 'Order placed', detail: 'Restaurant accepted your order', state: 'done' },
      { id: 'prep', label: 'Preparing', detail: 'Fresh batch on the line', state: 'active' },
      { id: 'rider', label: 'Rider assigned', detail: `Expected in ${hint}`, state: 'pending' },
    ];
  }

  return [
    { id: 'confirmed', label: 'Order confirmed', detail: 'Seller accepted your order', state: 'done' },
    { id: 'packed', label: 'Packed', detail: 'Warehouse picked your order', state: 'active' },
    { id: 'delivery', label: 'Out for delivery', detail: `Expected by ${hint}`, state: 'pending' },
  ];
}

function getTravelPreset(routeKey) {
  return state.travelInventory.find((item) => item.routeKey === routeKey) || state.travelInventory[0];
}

function searchTravelInventory(search) {
  const routeKey = `${search.originCode}-${search.destinationCode}`;
  const preset = getTravelPreset(routeKey);

  return {
    searchId: makeId('travel-search'),
    routeLabel: `${search.originCode} -> ${search.destinationCode}`,
    summary: `${preset.offers.length} flights for ${search.originCity} to ${search.destinationCity}`,
    aiTip: preset.aiTip,
    priceInsight: preset.priceInsight,
    addOns: preset.addOns,
    offers: preset.offers,
  };
}

function createTravelBooking(payload) {
  const routeKey = `${payload.search.originCode}-${payload.search.destinationCode}`;
  const preset = getTravelPreset(routeKey);
  const offer = preset.offers.find((item) => item.id === payload.offerId);

  if (!offer) {
    return null;
  }

  const selectedAddOns = preset.addOns.filter((item) => payload.addOnIds.includes(item.id));
  const addOnTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const total = offer.price + addOnTotal;

  if (payload.paymentMethod === 'wallet' && state.walletBalance < total) {
    return {
      error: 'Insufficient wallet balance',
    };
  }

  if (payload.paymentMethod === 'wallet') {
    state.walletBalance -= total;
    state.dashboard.walletBalance = state.walletBalance;
  }

  state.dashboard.monthlySpend += total;
  state.dashboard.tripCount += 1;
  state.dashboard.recentActivity.unshift(
    `Booked ${payload.search.originCode} to ${payload.search.destinationCode} with ${offer.airline}.`,
  );
  state.dashboard.recentActivity = state.dashboard.recentActivity.slice(0, 3);

  const booking = {
    id: makeId('booking'),
    experienceId: offer.id,
    title: `${offer.airline} ${offer.flightNumber}`,
    category: 'Travel',
    location: `${payload.search.originCity} to ${payload.search.destinationCity}`,
    date: payload.search.departureDate,
    guests: payload.travelers.length,
    total,
    status: 'upcoming',
  };

  state.bookings.unshift(booking);

  addTransaction({
    title:
      payload.paymentMethod === 'wallet'
        ? 'Flight booking via wallet'
        : 'Flight booking via mock gateway',
    amount: total,
    type: 'debit',
    category: 'booking',
  });

  addNotification({
    title: 'Flight booking confirmed',
    body: `${payload.search.originCity} to ${payload.search.destinationCity} is now locked in.`,
    kind: 'booking',
  });

  return {
    bookingId: booking.id,
    pnr: `GZ${Math.floor(100000 + Math.random() * 900000)}`,
    title: booking.title,
    route: booking.location,
    departureDate: payload.search.departureDate,
    amountPaid: total,
    paymentMethod: payload.paymentMethod,
    travelers: payload.travelers.length,
    status: 'confirmed',
    walletBalance: state.walletBalance,
    summaryChips: [offer.stops, offer.cabinBag, `${payload.travelers.length} travellers`],
    supportMessage: 'Your e-ticket, live status, and support are now available in Gozy bookings.',
  };
}

function createHotelBooking(payload) {
  const hotel =
    state.travel.find((item) => item.id === payload.hotelId && item.type === 'hotel') ||
    state.travel.find((item) => item.type === 'hotel');

  if (!hotel) {
    return null;
  }

  const couponSavings =
    payload.couponCode === 'MMTSMARTDEAL'
      ? 297
      : payload.couponCode === 'WELCOMETRIP'
        ? 431
        : 0;
  const roomPrice = Math.max(1, Math.round(hotel.price || 3500));
  const taxes = Math.round(roomPrice * 0.18);
  const tripSecure = payload.tripSecure ? 29 * payload.guests : 0;
  const total = roomPrice + taxes + tripSecure - couponSavings;
  const payment = chargeWalletIfNeeded(total, payload.paymentMethod);

  if (!payment.ok) {
    return { error: payment.error };
  }

  const primaryGuest = payload.travelerInfo[0];
  const booking = {
    id: makeId('booking'),
    experienceId: hotel.id,
    title: hotel.title,
    category: 'Travel',
    location: hotel.location,
    date: payload.checkIn,
    guests: payload.guests,
    total,
    status: 'confirmed',
  };

  state.bookings.unshift(booking);
  state.dashboard.monthlySpend += total;
  state.dashboard.tripCount += 1;
  state.dashboard.recentActivity.unshift(`Booked ${hotel.title} for ${primaryGuest.firstName}.`);
  state.dashboard.recentActivity = state.dashboard.recentActivity.slice(0, 3);

  addTransaction({
    title:
      payload.paymentMethod === 'wallet'
        ? 'Hotel booking via wallet'
        : 'Hotel booking via mock gateway',
    amount: total,
    type: 'debit',
    category: 'booking',
  });

  addNotification({
    title: 'Hotel booking confirmed',
    body: `${hotel.title} is ready for check-in on ${payload.checkIn}.`,
    kind: 'booking',
  });

  return {
    bookingId: booking.id,
    pnr: `HZ${Math.floor(100000 + Math.random() * 900000)}`,
    hotelName: hotel.title,
    roomName: payload.roomId === 'room-studio' ? 'Studio Room' : 'Standard Room',
    checkIn: payload.checkIn,
    checkOut: payload.checkOut,
    guests: payload.guests,
    rooms: payload.rooms,
    amountPaid: total,
    savings: couponSavings,
    paymentMethod: payload.paymentMethod,
    status: 'confirmed',
    walletBalance: state.walletBalance,
    summaryChips: [
      `${payload.rooms} Room`,
      `${payload.guests} Guests`,
      payload.tripSecure ? 'Trip Secured' : 'No Insurance',
    ],
    supportMessage: 'Your stay voucher, check-in instructions, and support are now available inside Gozy bookings.',
  };
}

function createBookingFromExperience(experienceId) {
  const experience = getExperienceById(experienceId);
  if (!experience) {
    return null;
  }

  const booking = {
    id: makeId('booking'),
    experienceId: experience.id,
    title: experience.title,
    category: experience.category,
    location: experience.location,
    date: 'Friday, 8:00 PM',
    guests: 2,
    total: Math.max(399, Math.round(experience.rating * 400)),
    status: 'upcoming',
  };
  state.bookings.unshift(booking);
  addNotification({
    title: 'Booking confirmed',
    body: `${experience.title} has been added to your plans.`,
    kind: 'booking',
  });
  return booking;
}

function createCheckoutOrder(items) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const walletUsed = state.walletBalance >= total;

  if (walletUsed) {
    state.walletBalance -= total;
    state.dashboard.walletBalance = state.walletBalance;
  }

  state.dashboard.monthlySpend += total;
  state.dashboard.recentActivity.unshift(
    `Checked out ${items.length} items across food and shopping.`,
  );
  state.dashboard.recentActivity = state.dashboard.recentActivity.slice(0, 3);

  items.forEach((item) => {
    state.bookings.unshift({
      id: makeId('booking'),
      experienceId: item.sourceId,
      title: item.title,
      category: item.kind === 'food' ? 'Food' : 'Shopping',
      location: item.subtitle,
      date: item.kind === 'food' ? 'Today, 35 mins' : 'This week',
      guests: item.quantity,
      total: item.price * item.quantity,
      status: 'upcoming',
    });
  });

  addTransaction({
    title: walletUsed ? 'Super app checkout via wallet' : 'Super app checkout via mock gateway',
    amount: total,
    type: 'debit',
    category: 'booking',
  });

  addNotification({
    title: 'Checkout confirmed',
    body: `${items.length} items are now live in your Gozy activity.`,
    kind: 'booking',
  });

  return {
    success: true,
    orderId: makeId('order'),
    itemCount: items.length,
    total,
    walletUsed,
  };
}

function createFoodOrder(payload) {
  const restaurant = state.restaurants.find((item) => item.id === payload.restaurantId);
  if (!restaurant) {
    return null;
  }

  const total = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const payment = chargeWalletIfNeeded(total, payload.paymentMethod);
  if (!payment.ok) {
    return { error: payment.error };
  }

  const confirmation = {
    orderId: makeId('food-order'),
    restaurantName: restaurant.name,
    eta: restaurant.eta,
    amountPaid: total,
    paymentMethod: payload.paymentMethod,
    addressLabel: payload.address.label,
    status: 'preparing',
    trackingSteps: createTrackingSteps('food', restaurant.eta),
    supportMessage: 'Your food order is live. Track prep, rider assignment, and ETA inside Gozy.',
  };

  state.liveOrders.unshift({
    id: confirmation.orderId,
    kind: 'food',
    title: restaurant.name,
    ...confirmation,
  });
  state.bookings.unshift({
    id: makeId('booking'),
    experienceId: restaurant.id,
    title: restaurant.name,
    category: 'Food',
    location: payload.address.label,
    date: `ETA ${restaurant.eta}`,
    guests: payload.items.reduce((sum, item) => sum + item.quantity, 0),
    total,
    status: 'preparing',
  });
  state.dashboard.monthlySpend += total;
  state.dashboard.recentActivity.unshift(`Ordered from ${restaurant.name}.`);
  state.dashboard.recentActivity = state.dashboard.recentActivity.slice(0, 3);
  addTransaction({
    title:
      payload.paymentMethod === 'wallet'
        ? 'Food order via wallet'
        : 'Food order via mock gateway',
    amount: total,
    type: 'debit',
    category: 'booking',
  });
  addNotification({
    title: 'Food order confirmed',
    body: `${restaurant.name} is preparing your order.`,
    kind: 'booking',
  });

  return confirmation;
}

function createShoppingOrder(payload) {
  const total = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const payment = chargeWalletIfNeeded(total, payload.paymentMethod);
  if (!payment.ok) {
    return { error: payment.error };
  }

  const deliveryDate = 'Tue, 31 Mar';
  const confirmation = {
    orderId: makeId('shop-order'),
    itemCount: payload.items.length,
    amountPaid: total,
    paymentMethod: payload.paymentMethod,
    addressLabel: payload.address.label,
    deliveryDate,
    status: 'packed',
    trackingSteps: createTrackingSteps('shopping', deliveryDate),
    supportMessage: 'Your order is packed and progressing through the delivery timeline.',
  };

  state.liveOrders.unshift({
    id: confirmation.orderId,
    kind: 'shopping',
    title: `${payload.items.length} item order`,
    ...confirmation,
  });
  state.bookings.unshift({
    id: makeId('booking'),
    experienceId: payload.items[0]?.sourceId || confirmation.orderId,
    title: `${payload.items.length} shopping items`,
    category: 'Shopping',
    location: payload.address.label,
    date: `Delivery by ${deliveryDate}`,
    guests: payload.items.reduce((sum, item) => sum + item.quantity, 0),
    total,
    status: 'packed',
  });
  state.dashboard.monthlySpend += total;
  state.dashboard.recentActivity.unshift(`Placed a shopping order for ${payload.items.length} items.`);
  state.dashboard.recentActivity = state.dashboard.recentActivity.slice(0, 3);
  addTransaction({
    title:
      payload.paymentMethod === 'wallet'
        ? 'Shopping order via wallet'
        : 'Shopping order via mock gateway',
    amount: total,
    type: 'debit',
    category: 'booking',
  });
  addNotification({
    title: 'Shopping order confirmed',
    body: `${payload.items.length} items are moving to delivery.`,
    kind: 'booking',
  });

  return confirmation;
}

function createEntertainmentBooking(payload) {
  const event = state.events.find((item) => item.id === payload.eventId);
  if (!event) {
    return null;
  }

  const total = event.price * payload.seats.length;
  const payment = chargeWalletIfNeeded(total, payload.paymentMethod);
  if (!payment.ok) {
    return { error: payment.error };
  }

  const confirmation = {
    bookingId: makeId('event-booking'),
    eventTitle: event.title,
    venue: event.venue,
    date: event.date,
    seats: payload.seats,
    amountPaid: total,
    paymentMethod: payload.paymentMethod,
    status: 'confirmed',
    supportMessage: 'Your seats are locked. QR entry and event reminders are now in Gozy.',
  };

  state.bookings.unshift({
    id: makeId('booking'),
    experienceId: event.id,
    title: event.title,
    category: 'Entertainment',
    location: event.venue,
    date: event.date,
    guests: payload.seats.length,
    total,
    status: 'confirmed',
  });
  state.dashboard.monthlySpend += total;
  state.dashboard.recentActivity.unshift(`Booked ${payload.seats.length} seats for ${event.title}.`);
  state.dashboard.recentActivity = state.dashboard.recentActivity.slice(0, 3);
  addTransaction({
    title:
      payload.paymentMethod === 'wallet'
        ? 'Entertainment booking via wallet'
        : 'Entertainment booking via mock gateway',
    amount: total,
    type: 'debit',
    category: 'booking',
  });
  addNotification({
    title: 'Tickets confirmed',
    body: `${event.title} seats ${payload.seats.join(', ')} are locked.`,
    kind: 'booking',
  });

  return confirmation;
}

function getLiveOrder(orderId) {
  return state.liveOrders.find((item) => item.id === orderId) || null;
}

module.exports = {
  state,
  makeId,
  getBootstrap,
  getExperienceById,
  updateSessionProfile,
  addNotification,
  addTransaction,
  addMessage,
  addAssistantMessage,
  recordAssistantExchange,
  markNotificationRead,
  applySwipe,
  likeMatch,
  addWalletFunds,
  searchTravelInventory,
  createBookingFromExperience,
  createTravelBooking,
  createHotelBooking,
  createCheckoutOrder,
  createFoodOrder,
  createShoppingOrder,
  createEntertainmentBooking,
  getLiveOrder,
};
