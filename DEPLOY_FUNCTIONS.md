# Deploy Supabase Edge Functions

## Manual Deployment via Dashboard

Since CLI is not working, deploy via Supabase Dashboard:

### 1. Go to Edge Functions
1. Open https://supabase.com/dashboard/project/ujcdbhxkdwzwkeajfljx/functions
2. Click "Create a new function"

### 2. Deploy generate-study function
- Name: `generate-study`
- Copy code from: `supabase/functions/generate-study/index.ts`
- Click "Deploy function"

### 3. Deploy chat-tutor function
- Name: `chat-tutor`
- Copy code from: `supabase/functions/chat-tutor/index.ts`
- Click "Deploy function"

### 4. Deploy generate-schedule function
- Name: `generate-schedule`
- Copy code from: `supabase/functions/generate-schedule/index.ts`
- Click "Deploy function"

### 5. Set Environment Variables
In each function settings, add:
- `LOVABLE_API_KEY` = (leave empty or use any value)

## Then update code to use Edge Functions
