# Gozy Mobile

Expo Router mobile app for Gozy.

## Folder structure

- `app/`
  File-based routes for auth, tabs, wallet, bookings, cart, assistant, travel, food, shopping, entertainment, notifications, and profile flows.
- `src/`
  Shared app state, API layer, theme tokens, reusable components, mock seed data, and native stores.
- `assets/`
  App icons, splash assets, and adaptive icon images.

## Scripts

```bash
npm install
npm run start
npm run android
npm run ios
npm run web
npm run lint
npm run typecheck
```

## Environment

```bash
cp .env.example .env
```

Set `EXPO_PUBLIC_API_URL` to your backend host if you are not using the default local server.

Run this app from `/Users/sandeepnaik/Desktop/gozyAPP/gozy/Frontend`.
