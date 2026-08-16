# Radhe Pharmacy — Play Store Submission Guide

## Overview
App is a Capacitor WebView app (`com.radhe.pharmacy`, "Radhe Pharmacy") that loads the built frontend from `frontend/dist` and talks to the backend at `https://radhe-two.vercel.app`.

---

## Phase A — Android Studio Setup (once)
1. Download Android Studio: https://developer.android.com/studio
2. Open project: `frontend/android` with Android Studio
3. Wait for Gradle sync to finish (JDK 21 is already configured in `gradle.properties`)

---

## Phase B — App Icon & Splash (do before listing)
1. **Icon**: Use a 512x512 PNG (orange #FC8019 background + "Rx" logo). Upload to https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html and replace all files in `android/app/src/main/res/mipmap-*`
2. **Splash**: Default Capacitor splash (white + orange) is already set via `styles.xml`/`colors.xml`. Optionally replace `android/app/src/main/res/drawable/splash.png`

---

## Phase C — Privacy Policy (REQUIRED for Play Store)
1. Create a page on the website: `/privacy-policy` (a simple page is enough)
2. Deploy to Vercel, note the URL (e.g. `https://radhepharmacy.app/privacy-policy`)
3. You must list:
   - What data is collected (name, phone, address, order history, payment status)
   - Why it's collected (delivery, order confirmation)
   - Who it's shared with (delivery partner, payment gateway Razorpay)
   - Data deletion: user can contact `radhepharmacy099@gmail.com`

> **Pharmacy warning**: Google treats medicine apps as "Health apps". In Play Console you MUST declare "Health & fitness" app category and fill the **Health apps declaration** truthfully (no user health data is collected/stored on device — state that).

---

## Phase D — Play Console Account
1. Go to https://play.google.com/console → Sign in with your Google account
2. Pay **$25 (one time)** registration fee
3. Verify your identity (may take up to 7 days)
4. Create a developer name, email, website

---

## Phase E — Create the App
1. Play Console → **Create app**
2. App name: `Radhe Pharmacy`
3. Default language: English (India)
4. App or game: **App**
5. Choose "Free" or "Paid" — **Free** (monetize later via in-app features)
6. App access: **All features available without special access** (no login needed to browse)

---

## Phase F — Data Safety Form (answer honestly)
| Question | Answer |
|---|---|
| Does app collect data? | Yes |
| Personal data | Name, Email, Phone, Address, Order history |
| Health data | No (medicines are products, no health records stored) |
| Payment data | No (handled by Razorpay on their server) |
| Data shared with third parties | Delivery partner, Razorpay |
| Data encryption | Yes (HTTPS / JWT) |
| Data deletion | On request via email |

---

## Phase G — Content Rating & Target Audience
1. **Content rating**: Answer the questionnaire (no violence, no sexual content → rating will be "Everyone" or "3+")
2. **Target audience**: All ages
3. **Ads**: "No ads" (app has none)

---

## Phase H — Store Listing
- **Short description** (80 chars): `Radhe Pharmacy – Genuine medicines delivered to your door in 30-40 min. Order, pay & track easily.`
- **Full description**: Write 4-6 short paragraphs: what app does, features (Rx upload, lab tests coming soon, COD + online payment, fast delivery in Panipat), why trust us
- **App icon**: 512x512 (same as Phase B)
- **Feature graphic**: 1024x500 (create simple banner with Canva — "Medicines at your doorstep")
- **Phone screenshots** (min 2, best 4-6): Take on a phone (Android) — Home, Product page, Cart, Checkout, Order tracking
- **Category**: Medical → Health & Fitness
- **Contact email**: `radhepharmacy099@gmail.com`

---

## Phase I — Release Signing (IMPORTANT, do ONCE, save forever)
```bash
cd ~/Work\ Space/Radhe/frontend/android
# Generate keystore (protect this file + password!)
keytool -genkey -v -keystore ~/radhe-release.keystore -alias radhe \
  -keyalg RSA -keysize 2048 -validity 10000 -storepass YOUR_PASSWORD
```
Then add to `android/app/build.gradle` (inside `android { }`):
```gradle
signingConfigs {
    release {
        storeFile file(System.getenv("KEYSTORE_FILE") ?: "$rootDir/../release.keystore")
        storePassword System.getenv("KEYSTORE_PASS")
        keyAlias System.getenv("KEY_ALIAS")
        keyPassword System.getenv("KEY_PASS")
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
    }
}
```
Build release APK/AAB:
```bash
KEYSTORE_FILE=~/radhe-release.keystore KEYSTORE_PASS=... KEY_ALIAS=radhe KEY_PASS=... ./gradlew bundleRelease
# Output: app/build/outputs/bundle/release/app-release.aab
```

> **LOSE THE KEYSTORE = YOU CAN NEVER UPDATE THE APP.** Backup keystore + passwords to Google Drive + a USB stick.

---

## Phase J — Closed Testing (REQUIRED now for new apps)
1. Play Console → Testing → **Closed testing** → Create track
2. Add up to 12 testers (their Google accounts, or a group link)
3. Upload the `.aab`, fill release notes, submit
4. **All 12 testers must accept the invite and install + keep the app for 14 days**
5. After 14 days → go to Production → **Promote to production**

---

## Phase K — Timeline Expectation
| Step | Time |
|---|---|
| Account + identity | 1-7 days |
| Closed testing | 14 days minimum |
| Production review | 1-7 days |
| **Total** | **~3-4 weeks** |

---

## Common Rejections & Fixes
- **"Health apps declaration required"** → Fill the declaration form truthfully
- **"Data safety mismatch"** → Make privacy policy match the data safety form exactly
- **"No privacy policy"** → Upload the URL before sending for review
- **"Crash on launch"** → Test on a real device first: `npm run cap:apk` → install `app-debug.apk`

---

## Everyday Workflow (after first release)
```bash
cd frontend
npm run cap:apk          # rebuild web + sync + build APK
# or for release:
npm run build && npx cap sync android
cd android && ./gradlew bundleRelease   # with signing env vars
# Upload app-release.aab to Play Console → Create new release
```
Version bump: edit `android/app/build.gradle` → `versionCode` +1, `versionName` new