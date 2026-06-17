# Gozy

Gozy now contains two production app surfaces in one repo:

- `Frontend/`
  React Native + Expo Router mobile app.
- `Server/`
  Express + Socket.io backend with seeded super-app data, AI assistant routes, checkout, wallet, and realtime chat.

## Mobile scripts

From `/Users/sandeepnaik/Desktop/gozyAPP/gozy/Frontend`:

```bash
cp .env.example .env
npm install
npm run start
npm run android
npm run ios
npm run web
npm run lint
npm run typecheck
```

## Backend scripts

From `/Users/sandeepnaik/Desktop/gozyAPP/gozy/Server`:

```bash
cp .env.example .env
npm install
npm run dev
npm run check
```

## Core API routes

- `GET /api/bootstrap`
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `PATCH /api/auth/profile`
- `POST /api/feed/:experienceId/swipe`
- `POST /api/chat/:conversationId/messages`
- `POST /api/wallet/add-money`
- `POST /api/orders/checkout`
- `POST /api/ai/assistant`
- `GET /api/travel`
- `GET /api/food/restaurants`
- `GET /api/shopping/products`
- `GET /api/entertainment/events`

## Notes

- The Expo mobile code now lives entirely in `Frontend/`.
- The old Vite web shell has been removed from `Frontend/`.
- Redis and Firebase remain optional on the backend.
- MongoDB is optional in local mode because the server can run on seeded in-memory data.
