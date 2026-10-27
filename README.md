# Template for Orderly SDK v2 based on Vite

## Getting started

1. Clone the code:

```
git clone https://github.com/OrderlyNetwork/orderly-js-sdk-vite-template.git
cd orderly-js-sdk-vite-template
```

2. Install the dependencies

```
npm install
```

3. Run

```
npm run dev
```

4. Build

```
npm run build
```

5. Create docker image

```
docker build -t orderly-js-sdk-vite-template .
```

## Docs

For more information, please visit the following link:

- [Orderly JS SDK](https://github.com/OrderlyNetwork/js-sdk)
- [SDK documentation](https://orderly.network/docs/sdks)

## Prediction routes

The canonical page routes are `/predict` and `/predict/:symbol` with the current
language prefix. SDK navigation still emits legacy `/prediction` hrefs;
the host navigation adapter maps them to `/predict`. Old direct links redirect
to the canonical page while preserving the encoded symbol, query, and hash.
Entries without a language prefix use the existing locale selection.

Orderly SDK dependencies are pinned to `3.3.1`.
