# Cloudinary Image Upload Setup

## Overview
This document explains the Cloudinary integration for event image and banner uploads in the VGC Events platform.

## What Was Implemented

### 1. Database Schema Updates
- Added `imageUrl` field (nullable TEXT) to Event model
- Added `bannerUrl` field (nullable TEXT) to Event model
- Created and applied migration: `20251205235402_add_event_images`

### 2. Backend Infrastructure

#### Cloudinary Configuration (`src/lib/cloudinary.ts`)
- Configured Cloudinary v2 SDK
- Uses environment variables for credentials

#### Upload API Route (`src/app/api/upload/route.ts`)
- POST endpoint that accepts FormData with file
- Converts file to base64 for Cloudinary upload
- Accepts optional `folder` parameter for organization
- Returns `secure_url` and `public_id` on success

#### Event Creation API Updates (`src/app/api/events/create/route.ts`)
- Now accepts `imageUrl` and `bannerUrl` fields
- Saves image URLs to database when creating events

### 3. Frontend Updates

#### Create Event Form (`src/app/dashboard/create-event/page.tsx`)
- Added file input fields for event image and banner
- Image preview functionality
- Uploads images to Cloudinary before creating event
- Shows loading toast during upload
- Stores returned Cloudinary URLs in event record

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Get these from https://cloudinary.com/console
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### How to Get Cloudinary Credentials:
1. Sign up at https://cloudinary.com (free tier available)
2. Go to your dashboard: https://cloudinary.com/console
3. Find your credentials in the "Account Details" section:
   - Cloud Name
   - API Key
   - API Secret
4. Copy these values to your `.env.local` file
5. Restart your development server

## Usage Flow

1. **Organizer creates event:**
   - Fills out event form
   - Optionally selects event image
   - Optionally selects event banner
   - Submits form

2. **Image upload process:**
   - If image selected, uploads to `/api/upload` with folder: `events/images`
   - If banner selected, uploads to `/api/upload` with folder: `events/banners`
   - Cloudinary returns secure HTTPS URLs

3. **Event creation:**
   - Event is created with image URLs stored in database
   - Images can be displayed on event pages

## File Organization in Cloudinary

Images are organized into folders:
- `events/images/` - Event main images
- `events/banners/` - Event banner images

## Next Steps (TODO)

1. **Add environment variables** - You need to add your Cloudinary credentials
2. **Display images** - Update event detail pages to show images
3. **Update event cards** - Show images in discover and attendee dashboards
4. **Add image optimization** - Consider using Next.js Image component for optimization
5. **Add validation** - File size limits, image dimensions, file type restrictions
6. **Error handling** - Better user feedback for upload failures

## Testing

To test the image upload:
1. Make sure environment variables are set
2. Restart dev server
3. Go to Create Event page
4. Select images for event image and banner
5. Preview should appear
6. Submit form
7. Check Cloudinary dashboard to verify uploads

## Troubleshooting

**Error: "Cloudinary configuration not found"**
- Make sure environment variables are set in `.env.local`
- Restart development server after adding variables

**Error: "Failed to upload image"**
- Check Cloudinary credentials are correct
- Verify your Cloudinary account is active
- Check file size (free tier has limits)

**Images not displaying**
- Verify URLs are being saved to database
- Check browser console for errors
- Ensure Cloudinary URLs are accessible
