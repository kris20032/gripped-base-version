# Plan: Add Film Grain Effect to Product Images

## Problem
The current SVG-based grain overlay is not producing visible grain like the reference image (analog film photography grain texture).

## Solution
Replace the SVG noise approach with a **real grain texture image** for reliable, visible results.

## Implementation Steps

### Step 1: Create grain texture image
- Create a 300x300px PNG grain texture file at `assets/grain.png`
- Use a high-contrast black/white noise pattern (monochromatic)
- Can generate using ImageMagick or download a film grain texture

### Step 2: Update CSS `.product-image::after`
Replace lines 426-441 in `assets/style.css` with:

```css
.product-image::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('grain.png');
  background-size: 300px 300px;
  background-repeat: repeat;
  pointer-events: none;
  z-index: 2;
  mix-blend-mode: overlay;
  opacity: 0.3;
}
```

### Step 3: Fine-tune opacity
- Adjust opacity value (0.2-0.5) based on visual comparison with reference
- Consider `mix-blend-mode: soft-light` as alternative if overlay is too harsh

## Alternative (no external image)
If PNG approach fails, use CSS filter directly on the image:
```css
.product-image img {
  filter: contrast(1.05) url("data:image/svg+xml,...");
}
```

## Files to Modify
1. `assets/style.css` - lines 426-441
2. `assets/grain.png` - new file (grain texture)
