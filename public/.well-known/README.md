# Spojex App Links / Universal Links

Hosted at `https://spojex.app/.well-known/…`.

## Android (`assetlinks.json`)

1. Export the **release** signing certificate SHA-256 (colon-hex):

```bash
keytool -list -v -keystore upload-keystore.jks -alias <alias>
```

2. Replace `REPLACE_WITH_RELEASE_SHA256_COLON_HEX` in `assetlinks.json`.
3. Serve the file as `application/json` with **no** redirects on
   `https://spojex.app/.well-known/assetlinks.json`.
4. Verify: `adb shell pm get-app-links com.spojex.superapp`

## iOS (`apple-app-site-association`)

- Team ID `W9Z6727KB5` + bundle `com.spojex.superapp` (from the Xcode project).
- Serve as `application/json` (no `.json` extension) at
  `https://spojex.app/.well-known/apple-app-site-association`.
- Associated Domains entitlement: `applinks:spojex.app`.

## Share URL format

| Content | App / share URL |
|---------|-----------------|
| Sport news | `https://spojex.app/news/{articleId}` |
| Gym FYP clip | `https://spojex.app/news/gymv:{videoUuid}` |
| Gym profile | `https://spojex.app/gym/{gymId}` |
| Legacy custom scheme | `spojex://news/{articleId}` (still supported) |

Web fallback pages under `/open/news/[id]` and `/open/gym/[id]` show download CTAs when the app is not installed. Deferred deep linking after install is **not** implemented.
