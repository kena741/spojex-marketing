# Spojex App Links / Universal Links

Hosted at `https://www.spojex.com/.well-known/…`. The bare `spojex.com`
redirects to `www`, so the apps only claim `www.spojex.com`.

Only `/news/*`, `/gym/*`, `/stadium/*`, `/org-chat/*` and `/shorts` open the app; every
other page stays the marketing site. Keep this list in sync with the Android
manifest intent filter.

## Android (`assetlinks.json`)

List **both** fingerprints: the upload key (`apps/host/android/upload-keystore.jks`,
already added) and Google's app signing key from Play Console → Test and release →
App integrity → App signing. Play Store installs are signed with Google's key.

1. Export the **release** signing certificate SHA-256 (colon-hex):

```bash
keytool -list -v -keystore upload-keystore.jks -alias <alias>
```

2. Replace `REPLACE_WITH_RELEASE_SHA256_COLON_HEX` in `assetlinks.json`.
3. Serve the file as `application/json` with **no** redirects on
   `https://www.spojex.com/.well-known/assetlinks.json`.
4. Verify: `adb shell pm get-app-links com.spojex.superapp`

## iOS (`apple-app-site-association`)

- Team ID `W9Z6727KB5` + bundle `com.spojex.superapp` (from the Xcode project).
- Serve as `application/json` (no `.json` extension) at
  `https://www.spojex.com/.well-known/apple-app-site-association`.
- Associated Domains entitlement: `applinks:www.spojex.com`.

## Share URL format

| Content | App / share URL |
|---------|-----------------|
| Sport news | `https://www.spojex.com/news/{articleId}` |
| Gym FYP clip | `https://www.spojex.com/news/gymv:{videoUuid}` |
| Gym profile | `https://www.spojex.com/gym/{gymId}` |
| Legacy custom scheme | `spojex://news/{articleId}` (still supported) |

Web fallback pages under `/open/news/[id]` and `/open/gym/[id]` show download CTAs when the app is not installed. Deferred deep linking after install is **not** implemented.
