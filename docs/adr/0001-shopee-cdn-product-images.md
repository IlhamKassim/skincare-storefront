# Use Shopee's own CDN URLs for product photos, not self-hosted images

**Status:** accepted

Product cards need real per-product photos instead of the generic category SVG icons. We considered three sources: (1) download images from brand press kits and self-host them in `public/products/`, (2) pull Involve Asia's official Shopee MY datafeed (a CSV covering the entire marketplace) and extract image URLs by SKU, (3) read each product's own Shopee listing page directly and take the `og:image` URL, then use that URL as-is (hotlinked, not downloaded).

We chose (3). The datafeed (2) exists and explicitly includes an `image_url` field meant for affiliate use, which confirms Shopee's own CDN (`down-my.img.susercontent.com`) is the sanctioned source — but downloading and parsing the full-catalog CSV for 15 SKUs was disproportionate compared to reading the 15 listing pages we already had open from generating affiliate links. Since (3) reads from the same CDN the official datafeed points at, it carries the same licensing basis without the multi-GB download.

`RoutineResults.tsx` renders these via a plain `<img>` (not `next/image`, consistent with the file's existing choice) with an `onError` handler that falls back to the original `/products/{category}.svg` icon, so a broken or delisted Shopee image degrades gracefully instead of showing a broken-image icon.

**Consequence:** image availability depends on Shopee's listings staying live and their CDN URLs staying stable — no guarantee either holds long-term. If a listing is delisted or Shopee reorganizes the CDN, the affected product silently reverts to its category icon (via the `onError` fallback) rather than breaking the page.
