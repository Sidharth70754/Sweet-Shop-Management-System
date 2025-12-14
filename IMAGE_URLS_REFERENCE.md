# 📸 Image URLs Reference for Sweets

## Overview
This document lists all the image URLs used for sweets in the application. All images are sourced from Unsplash (free, high-quality stock photos).

## Image URLs by Sweet Type

### Mithai (Indian Sweets)

1. **Kaju Katli** (Cashew Fudge)
   - URL: `https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop&q=80`
   - Shows diamond-shaped cashew fudge pieces

2. **Gulab Jamun** (Milk Dumplings in Syrup)
   - URL: `https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=600&h=600&fit=crop&q=80`
   - Shows golden brown dumplings in syrup

3. **Rasgulla** (Spongy Cottage Cheese Balls)
   - URL: `https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600&h=600&fit=crop&q=80`
   - White spongy balls in syrup

4. **Barfi** (Milk Fudge)
   - URL: `https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=600&h=600&fit=crop&q=80`
   - Square milk fudge pieces

5. **Ladoo** (Sweet Balls)
   - URL: `https://images.unsplash.com/photo-1606756790138-26100a9fd0a1?w=600&h=600&fit=crop&q=80`
   - Golden sweet balls

6. **Jalebi** (Coiled Sweet)
   - URL: `https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=600&fit=crop&q=80`
   - Orange coiled sweet

7. **Rasmalai** (Cream in Milk)
   - URL: `https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600&h=600&fit=crop&q=80`
   - Similar to Rasgulla, in creamy milk

8. **Peda** (Sweet Milk Balls)
   - URL: `https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=600&h=600&fit=crop&q=80`
   - Small round milk sweets

9. **Soan Papdi** (Flaky Sweet)
   - URL: `https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=600&h=600&fit=crop&q=80`
   - Flaky layered sweet

10. **Besan Ladoo** (Gram Flour Balls)
    - URL: `https://images.unsplash.com/photo-1606756790138-26100a9fd0a1?w=600&h=600&fit=crop&q=80`
    - Golden gram flour balls

### Desserts

11. **Kheer** (Rice Pudding)
    - URL: `https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600&h=600&fit=crop&q=80`
    - Creamy rice pudding

12. **Gajar Halwa** (Carrot Pudding)
    - URL: `https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop&q=80`
    - Orange carrot halwa

13. **Rabri** (Sweet Condensed Milk)
    - URL: `https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600&h=600&fit=crop&q=80`
    - Thick sweetened milk

14. **Shrikhand** (Sweet Yogurt)
    - URL: `https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600&h=600&fit=crop&q=80`
    - Sweet strained yogurt

### Special Varieties

15. **Chocolate Barfi**
    - URL: `https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=600&h=600&fit=crop&q=80`
    - Chocolate-flavored barfi

16. **Coconut Barfi**
    - URL: `https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=600&h=600&fit=crop&q=80`
    - White coconut barfi

17. **Motichoor Ladoo**
    - URL: `https://images.unsplash.com/photo-1606756790138-26100a9fd0a1?w=600&h=600&fit=crop&q=80`
    - Fine-grained ladoo

18. **Kalakand**
    - URL: `https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=600&h=600&fit=crop&q=80`
    - Milk-based sweet

19. **Mysore Pak**
    - URL: `https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=600&h=600&fit=crop&q=80`
    - Gram flour and ghee sweet

20. **Badam Halwa** (Almond Pudding)
    - URL: `https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop&q=80`
    - Rich almond pudding

## Image Source Information

### Unsplash API
- **Website**: https://unsplash.com
- **License**: Free for commercial use (Unsplash License)
- **Quality**: High-resolution (600x600px optimized)
- **Format**: JPG with quality=80

### URL Parameters Explained
- `w=600`: Width (600px)
- `h=600`: Height (600px)
- `fit=crop`: Crop to fit dimensions
- `q=80`: Quality (80% compression)

## Alternative Image Sources

If you want to use different images, here are alternative sources:

1. **Pexels**: https://www.pexels.com/search/indian-sweets/
2. **Pixabay**: https://pixabay.com/images/search/indian-sweets/
3. **Food Image API**: Various food-specific APIs available

## Fallback Behavior

If an image fails to load:
- The application will show a placeholder image
- Uses DiceBear API to generate unique placeholder based on sweet name
- Maintains visual consistency even if external images fail

## Updating Images

To update images for existing sweets:

```sql
UPDATE public.sweets 
SET image_url = 'NEW_IMAGE_URL_HERE'
WHERE name = 'SWEET_NAME';
```

Or use the Admin panel in the application to edit sweets and update image URLs.

---

**Note**: All images are subject to availability from Unsplash. If specific images become unavailable, update the URLs or use the placeholder system built into the application.

