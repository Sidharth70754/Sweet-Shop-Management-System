# Supabase Setup Instructions

## Your Supabase URL
```
https://bewaxbuupahsspnxfyyb.supabase.co
```

## Next Steps - Get Your API Key

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Login to your account

2. **Select Your Project**
   - Click on the project with URL: `bewaxbuupahsspnxfyyb`

3. **Get Your API Keys**
   - In the left sidebar, click on **Settings** (gear icon)
   - Click on **API** in the settings menu
   - Scroll down to **Project API keys** section
   - Copy the **`anon` `public`** key (this is the one you need)

4. **Update Your .env File**
   - Open the `.env` file in the root of your project
   - Replace `your_anon_key_here` with your actual anon key
   - Save the file

5. **Restart Your Development Server**
   - Stop your current dev server (Ctrl+C)
   - Run `npm run dev` again
   - The connection should now work!

## Example .env File Content

```env
VITE_SUPABASE_URL=https://bewaxbuupahsspnxfyyb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_actual_key_here
```

## Verify Connection

After updating your .env file and restarting:
1. Open your browser's Developer Console (F12)
2. Look for the message: "✅ Supabase client initialized"
3. If you see "⚠️ Supabase client initialized with missing or placeholder credentials", check your .env file again

## Troubleshooting

- **Make sure the .env file is in the root directory** (same level as package.json)
- **Restart your dev server** after making changes to .env
- **Check for typos** in your API key
- **Make sure you copied the `anon public` key**, not the `service_role` key (that one is secret!)

