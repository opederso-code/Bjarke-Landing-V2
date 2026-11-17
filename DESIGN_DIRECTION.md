# Bjärke — design direction

Reference brands: rhode (rhodeskin.com) and Glossier (glossier.com). We are borrowing how these sites
work and feel. We are not copying them: no text, images, logos, product names, fonts files, colour codes
or page layouts taken from either site. Everything on the Bjärke site must be original.

Read PRODUCT.md first. It decides what the product does and what we may claim.

## What the two sites do, and what we take from each

### Shared patterns (adopt all of these)
1. One thin announcement bar at the top with a single offer. Ours: "$1 reserves yours. $70 at launch (MSRP $125)."
2. A short top menu (3 to 5 items) with utility links on the right. No clutter.
3. A hero that sells one thing with one button. No competing offers.
4. Product cards with the same anatomy every time: image, name, one-line descriptor, price, one button.
   Small text badges on the card ("New", "Limited", "Launch price").
5. Named variants. They name shades; we name shells (for example "Signal Red", "Teal").
   Picking a shell must swap the product image.
6. A waitlist / notify button as a first-class call to action, not an apology. Our whole site is this:
   "Reserve yours" and "Get on the list".
7. A dated launch moment in the hero (date and time) to create a reason to act now. Only use a real date.
8. A three-pillar brand values row with a "Learn more" link under each. Ours: how it works, privacy, design.
9. Email capture with a visible privacy note beside the field.
10. Trust kept close to the button: shipping, returns/refund of the deposit, privacy, support contact.
11. A tidy four-column footer: navigate, social, legal/help, support hours.

### From rhode (the restraint)
- Very few sections, each with one job. Lots of empty space. The product is the hero, shot close and clean.
- Minimal words: a name, a few-word descriptor, a price.
- Third-party proof as small badges (they use beauty awards). Ours, only when real: incubator, press, pilot testers.
- A scarcity drop mechanic: limited edition, launch date, waitlist.

### From Glossier (the warmth)
- Real people. Product imagery shows a named person wearing or using the product.
  This directly answers our tester feedback ("looks too AI", "not a proper rendering").
- A short brand statement in a human voice, placed mid-page.
- Category shortcut tiles under the hero. Ours: shortcuts by moment ("The ride home", "The walk back", "The night out").
- Bundles and sets. Ours: pendant plus an extra shell.
- A student discount link in the footer. Relevant: our first audience is campus.

### What we do differently on purpose
- Neither site shows reviews on the homepage. Our buyer is weighing a safety device and needs more proof
  than a lip product: add a short FAQ and, when we have them, real quotes from testers.
- Their products need no explanation. Ours does: keep a three-step "how it works" strip on the homepage.
- A privacy section is required (always-on camera). Neither reference has an equivalent; design it with the
  same calm, minimal treatment as the rest.

## Look and feel (original, in this spirit)
- Warm off-white background instead of pure white; near-black text; one accent colour (signal red from the brand docs).
- Soft, rounded shapes: pill buttons, generously rounded image corners and cards.
- One quiet sans-serif family, mostly lowercase or sentence case, medium weight, small sizes, generous line spacing.
  Keep Geist unless a better free option is proposed. Retire the 283px display size on mobile.
- Photography: close crops, soft daylight or on-camera flash, real skin, real settings (back seat of a car,
  a street at night, getting ready). Product on plain tinted backgrounds for the shell picker.
- Motion: gentle and short. Fades and small slides, image swap on shell select, a slide-in reserve drawer.
  Keep Lenis smooth scroll. Drop effects that slow the page.

## Functions to build
1. Announcement bar (dismissible, one message).
2. Sticky header that shrinks on scroll; on mobile a sticky bottom "Reserve — $1" bar.
3. Hero: one headline, one line of support, one button, one image or short looping video.
4. Shell picker: colour swatches with names; image swaps; chosen shell carries into the reserve form.
5. Product card component (image, name, descriptor, price with struck-through MSRP, badge, button).
6. How it works: three steps, one short sentence each, with a small image or loop per step.
7. Moments row: three tiles (ride home, walk back, night out).
8. Privacy section: what the camera does, what is saved, who can see it. Plain words. No claims beyond PRODUCT.md.
9. Reserve drawer or section: reuse the working Google Apps Script form from index-original.html
   (name, email, phone optional, shell, getting home, batch). Show price, deposit terms and refund line beside it.
10. FAQ accordion answering the objections listed in PRODUCT.md.
11. Email capture with privacy note; footer with four columns and a student link.
12. Keep the Meta Pixel from index-original.html on the new pages.

## Rules
- Mobile first. Design at 390px wide, then scale up. 90% of traffic is mobile from Instagram and Facebook ads.
- Plain HTML, CSS and JS. No framework, no build step. Vercel deploys from main; work on a branch.
- Performance: WebP images, lazy-load below the fold, no layout shift, hero visible fast on 4G.
- Accessibility: real buttons and labels, visible focus, colour contrast, reduced-motion respected.
- Copy: short, calm, direct. Never fear-based. Never promise safety. Mark anything unverified as TODO.
- Do not use AI-generated product images as if they were the real product. Label placeholders clearly.
