## Setting API Key for Development

You have three safe options for providing your OpenRouter API key during development:

1. Use the app UI (recommended):
	- Start the app and paste the API key in the **API Key** field. This stores the key in memory only and is safer than committing secrets.

2. Use a local Vite environment variable (recommended for rapid testing):
	- Create a file named `.env.local` at the project root (add to `.gitignore` so it isn't committed):
		```
		VITE_OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxxxxxxxxxx
		```
	- When you run `npm run dev`, Vite will replace `import.meta.env.VITE_OPENROUTER_API_KEY` with the value and the app will auto-load it for convenience.

3. Node script env variable for CLI tests:
	- For scripts like `scripts/test_openrouter_key.js`, use `OPENROUTER_API_KEY` environment variable:
		```powershell
		$env:OPENROUTER_API_KEY = 'sk-or-xxxx'; npm run test-api-key
		```

Security note: Never commit your API key into a repository, and always rotate keys if they were accidentally shared (like the one in the chat). Revoke compromised keys in the OpenRouter dashboard.

## API Key Testing

The browser-based "Test Key" UI has been removed. Please use the CLI scripts in `scripts/test_openrouter_key.js` or `scripts/test_openrouter_key.ps1` to validate your API key and the selected model.

CLI usage examples:

Node (Windows PowerShell):
```powershell
$env:OPENROUTER_API_KEY='sk-or-xxxxxxxxxxxx'; npm run test-api-key
```

Or pass the key directly to the script:
```powershell
node scripts/test_openrouter_key.js sk-or-xxxxxxxxxxxx
```
# Rate Limit Information

## Current Issue
You're getting 429 errors immediately on the FIRST request. This means:

1. **You've already exhausted your rate limit** from previous attempts
2. The free tier has a **global shared limit** or **very low per-user limit**
3. You need to **wait 5-10 minutes** between attempts

## Check Your Rate Limits

### OpenRouter Dashboard
Visit: https://openrouter.ai/settings/limits

This shows:
- ✅ Current rate limit status
- ✅ Requests remaining
- ✅ When limits reset
- ✅ Cost per request

### OpenRouter Free Model Info
Visit: https://openrouter.ai/

**Known limits for free tier (may vary by model):**
- Small request quotas; the free tier often has global shared limits and low per-minute allowances
- Limits change over time; check the OpenRouter dashboard for the specific model you're using

## Solutions

### Option 1: Wait Between Attempts ⏰
**Wait 10-15 minutes** between each test run to let your rate limit reset.

### Option 2: Switch to Paid Model 💰 (Recommended)
Much cheaper and faster than you think:

**Recommended paid models:**
- `openai/gpt-4o-mini` - $0.15/$0.60 per million tokens (recommended default)
- `anthropic/claude-3.5-sonnet` - $3/$15 per million tokens

**Cost for your app (approx)** (3 API calls per workflow):
- GPT-4o-mini: ~$0.005 per workflow
- Other models vary; check model pricing and usage at OpenRouter

### Option 3: Reduce API Calls
Current app makes 3 calls:
1. Workflow generation
2. Tech stack generation
3. Workflow explanation

You could disable the explanation to reduce to 2 calls.

## How to Switch Models

Edit `src/utils/deepseekApi.ts` line 87 (or set `VITE_OPENROUTER_MODEL`):

```typescript
// Change from:
model: 'openai/gpt-4o-mini',

// To paid version:
model: 'openai/gpt-4o-mini',

// Or to GPT-4o-mini (cheaper):
model: 'openai/gpt-4o-mini',
```

## Adding Credits to OpenRouter

1. Visit: https://openrouter.ai/credits
2. Add credits (minimum $5 recommended)
3. Switch to paid model in code
4. You'll get thousands of requests for $5

## Current App Behavior

With current rate limiting (10 seconds between requests):
- Takes ~30 seconds per workflow generation
- Makes 3 API calls total
- Node descriptions only generated on-click (not pre-generated)

## Switching Models in the App

Model selection and browser testing have been removed from the app; use CLI scripts and environment variables to configure and test models (see 'API Key Testing' above). If you get a 429 and want to try a paid model quickly, use the CLI script and pass a different model in the script parameters.

If that returns 200, set the key, and continue testing using the paid model in the app.
