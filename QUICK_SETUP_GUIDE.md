# 🚀 Quick Setup Guide - Phase 1 Features

## Get Started in 5 Minutes

### 1️⃣ Environment Setup

Create or update `.env.local`:

```env
TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production, change the URL:
```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

---

### 2️⃣ Create PWA Icons

You need app icons for the PWA to work properly. Here's the fastest way:

#### Option A: Use a Logo Generator Tool
1. Visit [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload your logo/design
3. Download the generated icons
4. Extract to `public/icons/`

#### Option B: Create Manually
Create a 512x512px PNG with your logo, then resize:

```bash
# If you have ImageMagick installed
cd public/icons
convert source-512.png -resize 72x72 icon-72x72.png
convert source-512.png -resize 96x96 icon-96x96.png
convert source-512.png -resize 128x128 icon-128x128.png
convert source-512.png -resize 144x144 icon-144x144.png
convert source-512.png -resize 152x152 icon-152x152.png
convert source-512.png -resize 192x192 icon-192x192.png
convert source-512.png -resize 384x384 icon-384x384.png
convert source-512.png -resize 512x512 icon-512x512.png
```

#### Required Icon Files
```
public/
  icons/
    ✅ icon-72x72.png
    ✅ icon-96x96.png
    ✅ icon-128x128.png
    ✅ icon-144x144.png
    ✅ icon-152x152.png
    ✅ icon-192x192.png
    ✅ icon-384x384.png
    ✅ icon-512x512.png
```

---

### 3️⃣ Test PWA Features

#### Build for Production
PWA features only work in production mode:

```bash
npm run build
npm start
```

#### Test Install Prompt
1. Open in Chrome or Edge
2. Look for the install banner at the bottom right
3. Click "Install" to add to home screen
4. App opens in standalone window!

#### Test Offline Mode
1. Visit the site while online
2. Open DevTools (F12) > Network tab
3. Check "Offline" checkbox
4. Navigate around - cached pages work!
5. Try a new page - you'll see the offline page

---

### 4️⃣ Test SEO Features

#### Check Metadata
```bash
# Start the dev server
npm run dev

# Visit these URLs and view source
http://localhost:3000 - Homepage
http://localhost:3000/movies - Movies page
http://localhost:3000/shows - Shows page
```

Look for in `<head>`:
- ✅ Title tags
- ✅ Meta descriptions
- ✅ Open Graph tags
- ✅ Twitter Card tags

#### Check Sitemap
Visit: `http://localhost:3000/sitemap.xml`

Should show XML with all pages listed.

#### Check Robots.txt
Visit: `http://localhost:3000/robots.txt`

Should show crawling rules.

---

### 5️⃣ Test Mobile Features

#### Use DevTools
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select a mobile device
4. Test these features:
   - ✅ Touch targets (44x44px minimum)
   - ✅ Input focus (no zoom)
   - ✅ Smooth scrolling
   - ✅ Touch feedback on buttons

#### Real Device Testing
Best way to test:
1. Build for production: `npm run build && npm start`
2. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Visit `http://YOUR_IP:3000` on your phone
4. Test install prompt and offline mode

---

## 🎨 Creating Your Open Graph Image

Create a 1200x630px image for social sharing:

1. Design a banner with your logo and tagline
2. Save as `public/og-image.png`
3. Share your site on social media - image appears!

Tools:
- [Canva](https://www.canva.com/) - Free templates
- [Figma](https://www.figma.com/) - Professional design
- Photoshop/GIMP - Full control

---

## 🧪 Quick Test Checklist

### PWA Features ✅
- [ ] Install prompt appears
- [ ] Can install to home screen
- [ ] Works offline (cached pages)
- [ ] Service worker registered
- [ ] Manifest.json accessible

### SEO Features ✅
- [ ] Meta tags in all pages
- [ ] Sitemap.xml works
- [ ] Robots.txt accessible
- [ ] Open Graph tags present
- [ ] Twitter cards configured

### Mobile Features ✅
- [ ] No zoom on input focus
- [ ] Touch targets large enough
- [ ] Smooth scrolling works
- [ ] Touch feedback on actions
- [ ] Responsive on all sizes

### Error Handling ✅
- [ ] Error boundary catches errors
- [ ] Loading states show properly
- [ ] Retry buttons work
- [ ] Offline page appears when needed
- [ ] Error messages are clear

---

## 🔧 Common Issues

### "Install prompt not showing"
**Solution:**
- Use production build: `npm run build && npm start`
- Must be HTTPS (or localhost)
- Clear: `localStorage.removeItem('pwa-prompt-dismissed')`

### "Service worker not working"
**Solution:**
- Clear cache: DevTools > Application > Clear storage
- Unregister: DevTools > Application > Service Workers > Unregister
- Hard reload: Ctrl+Shift+R

### "Icons not showing"
**Solution:**
- Make sure all 8 icon sizes exist
- Check file names match manifest.json exactly
- Clear cache and rebuild

### "Offline mode not working"
**Solution:**
- Service workers only work in production
- Visit pages first to cache them
- Check cache in DevTools > Application > Cache Storage

---

## 📱 Deploy to Production

### Update URLs
Before deploying, update:

1. `.env.local` → `.env.production`:
```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

2. `public/robots.txt`:
```txt
Sitemap: https://yourdomain.com/sitemap.xml
```

### Deploy Platforms

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm run build
# Upload .next folder
```

#### Manual Server
```bash
npm run build
npm start
# Runs on port 3000
```

---

## 🎉 You're All Set!

Your site now has:
- ✅ **PWA capabilities** - Install to home screen
- ✅ **Offline support** - Works without internet
- ✅ **SEO optimized** - Better search rankings
- ✅ **Mobile-friendly** - Perfect on all devices
- ✅ **Error handling** - Graceful failures

### Next: Phase 2 Features
When ready, implement:
- Advanced search with filters
- User personalization
- Enhanced video player
- Analytics tracking
- Performance monitoring

---

## 💡 Pro Tips

1. **Test on Real Devices:** Emulators don't fully replicate PWA behavior
2. **Create Quality Icons:** First impression matters!
3. **Monitor SEO:** Use Google Search Console
4. **Check Core Web Vitals:** Use Lighthouse
5. **Update Service Worker:** Version your cache names

---

## 📚 Resources

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**Need Help?** Check `PHASE_1_IMPLEMENTATION.md` for detailed documentation!