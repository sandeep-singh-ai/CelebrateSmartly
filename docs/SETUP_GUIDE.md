# Vendor Search System Setup Guide

## Quick Start

Follow these steps to set up the vendor search system with Google Places API integration.

## 1. Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```bash
# Google Places API Configuration (REQUIRED)
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# Application Configuration (Optional)
VITE_APP_URL=https://yourdomain.com

# Supabase Configuration (should already be configured)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Service Configuration (for invitations)
VITE_BREVO_API_KEY=your_brevo_api_key

# AWS S3 Configuration (for image storage)
VITE_AWS_ACCESS_KEY_ID=your_aws_access_key
VITE_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
VITE_AWS_BUCKET_NAME=your_s3_bucket_name
VITE_AWS_REGION=your_aws_region
```

## 2. Google Places API Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for the project

### Step 2: Enable Places API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Places API"
3. Click on "Places API" and click "Enable"

### Step 3: Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

### Step 4: Restrict API Key (Recommended)
1. Click on the created API key
2. Under "Application restrictions", select "HTTP referrers (web sites)"
3. Add your domain(s)
4. Under "API restrictions", select "Restrict key"
5. Select "Places API" from the dropdown
6. Click "Save"

## 3. Database Migration

Run the vendor search system migration to create the necessary tables:

```bash
# Apply the migration
supabase db push
```

This will create:
- `vendor_search_cache` table
- `vendor_search_results` table  
- `vendor_search_history` table
- Required database functions and indexes

## 4. Test Configuration

Visit `/vendor-search-config` to test your Google Places API setup:

1. Navigate to `/vendor-search-config` in your application
2. Verify the API key is detected
3. Test with a sample search (e.g., "New York, NY" + "Catering")
4. Check that results are returned successfully

## 5. Verify Setup

### Check Environment Variables
```bash
# In your terminal
echo $VITE_GOOGLE_PLACES_API_KEY
```

### Check Database Tables
```sql
-- In Supabase SQL editor
SELECT * FROM vendor_search_cache LIMIT 1;
SELECT * FROM vendor_search_results LIMIT 1;
SELECT * FROM vendor_search_history LIMIT 1;
```

### Test Search Functionality
1. Go to `/vendors` or `/vendor-search`
2. Enter a location (e.g., "Los Angeles, CA")
3. Select a category (e.g., "Photography")
4. Click "Search Vendors"
5. Verify results are displayed

## 6. Troubleshooting

### Common Issues

#### "Google Places API not configured"
- Check if `VITE_GOOGLE_PLACES_API_KEY` is set in `.env.local`
- Restart your development server after adding the variable
- Verify the API key is valid and has Places API enabled

#### "Location not found"
- Check location spelling and format
- Try alternative formats (city, state vs. ZIP code)
- Verify the location exists in Google's database

#### "No vendors found"
- Expand search radius
- Try different categories
- Check Google Places API quota limits
- Verify API key restrictions allow your domain

#### Database errors
- Check if migration was applied successfully
- Verify Supabase connection and permissions
- Check RLS policies are correctly configured

### Debug Steps

1. **Check Browser Console**
   - Look for error messages
   - Check network requests to Google Places API

2. **Verify API Key**
   - Test API key directly in browser:
   ```
   https://maps.googleapis.com/maps/api/place/textsearch/json?query=test&key=YOUR_API_KEY
   ```

3. **Check Environment Variables**
   - Verify `.env.local` file exists
   - Check variable names are correct
   - Restart development server

4. **Database Verification**
   - Check Supabase dashboard for table creation
   - Verify RLS policies are active
   - Test database functions manually

## 7. Performance Optimization

### Cache Configuration
- Vendor data is automatically cached for 30 days
- Cache is refreshed when results are insufficient (<10 vendors)
- Search history is tracked for user analytics

### API Usage Optimization
- Implement rate limiting if needed
- Monitor API usage in Google Cloud Console
- Set up billing alerts for cost control

## 8. Security Best Practices

### API Key Security
- Never commit API keys to version control
- Use environment variables for sensitive data
- Restrict API keys to specific domains/IPs
- Monitor API usage for unusual patterns

### Data Privacy
- Vendor data is public information from Google
- User search history is private and user-specific
- Implement appropriate access controls

## 9. Monitoring and Maintenance

### Regular Checks
- Monitor Google Places API usage and costs
- Check cache refresh success rates
- Review search performance metrics
- Monitor database storage growth

### Updates and Maintenance
- Keep Google Places API client libraries updated
- Monitor for API deprecation notices
- Regular database index maintenance
- Cache cleanup for expired entries

## 10. Support Resources

### Documentation
- [Vendor Search System Documentation](./VENDOR_SEARCH_SYSTEM.md)
- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Supabase Documentation](https://supabase.com/docs)

### Configuration Pages
- `/vendor-search-config` - Test and configure API
- `/config-test` - General system configuration

### Troubleshooting
- Check browser console for errors
- Review Supabase logs
- Monitor Google Cloud Console
- Test API endpoints directly

---

## Quick Reference

| Component | Status | Action Required |
|-----------|--------|-----------------|
| Environment Variables | ⚠️ | Add `.env.local` file |
| Google Places API | ⚠️ | Get API key from Google Cloud |
| Database Migration | ⚠️ | Run `supabase db push` |
| Configuration Test | ⚠️ | Visit `/vendor-search-config` |
| Search Functionality | ⚠️ | Test with sample search |

**Legend:**
- ✅ Complete
- ⚠️ Action Required
- ❌ Error/Issue

---

For additional help, check the troubleshooting section or refer to the comprehensive system documentation.
