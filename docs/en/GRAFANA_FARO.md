# Grafana Faro Setup

This document guides you through the process of configuring Grafana Faro for frontend observability in the React application.

## What is Grafana Faro?

Grafana Faro is a frontend observability SDK that automatically captures:

- **JavaScript errors** and unhandled exceptions
- **Web Vitals** (Core Web Vitals, LCP, FID, CLS)
- **Navigation and performance** metrics
- **Custom logs** and user events
- **Distributed traces** for request tracking

## Step-by-Step Configuration

### 1. Create Grafana Cloud Account (Free)

1. Go to [Grafana Cloud](https://grafana.com/auth/sign-up/create-user)
2. Create a free account (includes 10k metric series, 50GB logs, 50GB traces)
3. Once logged in, you'll be redirected to your Grafana Cloud instance

### 2. Configure Frontend Observability

1. In the Grafana Cloud panel, search for **"Frontend Observability"** or **"Faro"**
2. Click **"Configure"** or **"Add Frontend App"**
3. Complete the configuration:
   - **App Name**: `mywebsite2` (or your preferred name)
   - **Environment**: `production` for production, `development` for development
4. Copy the generated credentials

### 3. Configure Environment Variables

Create a `.env.local` file (or edit your existing `.env`) with:

```bash
# Grafana Faro Configuration
VITE_GRAFANA_FARO_URL=https://faro-collector-prod-[REGION].grafana.net/collect/[YOUR_INSTANCE_ID]
VITE_GRAFANA_FARO_API_KEY=your_api_key_here
```

**Important**: Replace `[REGION]` and `[YOUR_INSTANCE_ID]` with the actual values provided by Grafana Cloud.

### 4. Environment Variables for Different Environments

#### Local Development

```bash
# Only enable if you want telemetry in development
VITE_GRAFANA_FARO_URL=your_faro_url
```

#### Production (Vercel)

In your Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add:
   - `VITE_GRAFANA_FARO_URL`: your Faro URL
   - `VITE_GRAFANA_FARO_API_KEY`: your API key (optional)

## Implemented Features

### Complete React Integration

- ✅ **React SDK**: Using `@grafana/faro-react` for React-specific integration
- ✅ **ReactIntegration**: Automatic capture of React component errors
- ✅ **Navigation Tracking**: Custom hook to track route changes
- ✅ **Web Instrumentation**: Automatic capture of Web Vitals and performance metrics
- ✅ **Distributed Tracing**: For HTTP request tracking

### Automatic Initialization

The SDK is automatically initialized in `src/main.tsx` and:

- ✅ Only activates in production by default
- ✅ Automatically captures React errors
- ✅ Records Web Vitals
- ✅ Includes distributed tracing
- ✅ Tracks user sessions
- ✅ Complete integration with React Router for navigation

### Navigation Tracking

In `src/components/Layout.tsx` the `useFaroPageTracking()` hook is implemented that:

- ✅ Automatically tracks all route changes
- ✅ Captures page language information
- ✅ Records referrer and user agent
- ✅ Includes search parameters and hash

### Custom Logging

Use the `useFaroLogger` hook in your components:

```tsx
import { useFaroLogger } from '../lib/faro'

const MyComponent = () => {
  const { logEvent, logError, logMeasurement } = useFaroLogger()

  const handleUserAction = () => {
    logEvent('button_clicked', { 
      buttonType: 'submit',
      page: 'contact' 
    })
  }

  const handleError = (error: Error) => {
    logError(error, { 
      context: 'form_validation',
      userId: user.id 
    })
  }

  return <button onClick={handleUserAction}>Click me</button>
}
```

### Implementation Example

Already implemented in `src/pages/Contact/hooks/useContactForm.ts`:

- ✅ Form submission tracking
- ✅ reCAPTCHA error logging
- ✅ Success/failure metrics
- ✅ Custom context for debugging

## Dashboards and Alerts

### Predefined Dashboards

Grafana Cloud includes predefined dashboards for:

- **Frontend Overview**: General performance metrics
- **Web Vitals**: Core Web Vitals and UX metrics
- **Error Tracking**: JavaScript errors and stack traces
- **User Sessions**: Session and navigation analysis

### Creating Alerts

1. In Grafana Cloud, go to **Alerting** → **Alert Rules**
2. Useful alert examples:
   - Error rate > 5% in 5 minutes
   - Core Web Vitals below thresholds
   - Load time > 3 seconds

## Best Practices

### 1. Sampling in Production

To control costs, the current configuration uses sampling:

```typescript
sampling: {
  traces: 0.1, // 10% of traces
  logs: 1.0,   // 100% of logs
}
```

### 2. Sensitive Data

- ❌ **DON'T** log personal information (emails, passwords)
- ❌ **DON'T** include credit card data
- ✅ **DO** use general context (error type, page, action)

### 3. Performance

- The SDK is lightweight (~20KB gzipped)
- Asynchronous initialization doesn't block UI
- Sampling controls data volume

## Troubleshooting

### Faro doesn't initialize

1. Verify that environment variables are configured
2. Check browser console for errors
3. Confirm you're in production mode or have `VITE_GRAFANA_FARO_URL` in development

### No data visible in Grafana

1. Wait 1-2 minutes for data propagation
2. Verify that the Faro endpoint is correct
3. Check free tier limitations

### CORS Errors

If you see CORS errors, verify that:

- The Faro endpoint is correct
- No proxies or firewalls are blocking the connection

## Free Tier Limits

Grafana Cloud free includes:

- **10,000 metric series** per month
- **50 GB logs** per month
- **50 GB traces** per month
- **Retention**: 30 days for metrics, 15 days for logs/traces

For small to medium websites, this is more than sufficient.

## Useful Links

- [Official Grafana Faro Documentation](https://grafana.com/docs/grafana-cloud/frontend-observability/)
- [Grafana Cloud Dashboard](https://grafana.com/auth/sign-in)
- [Implementation Examples](https://github.com/grafana/faro-web-sdk/tree/main/examples)
