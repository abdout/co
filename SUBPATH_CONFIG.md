# Subpath Configuration for Block App

This application has been configured to work with both direct access and subpath access:

1. Direct: `block-ivory.vercel.app`
2. Subpath: `cb.databayt.org/blocks`

## Core Configuration

The following minimal configurations enable proper subpath support:

### 1. Next.js Configuration (next.config.ts)

```typescript
// Get base path from environment variable
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  // ... other config
  
  // Configure for subpath deployment
  basePath,
  assetPrefix: basePath,
};
```

### 2. Vercel Configuration (vercel.json)

```json
{
  "rewrites": [
    {
      "source": "/blocks/:path*",
      "destination": "/:path*"
    },
    {
      "source": "/blocks/_next/:path*",
      "destination": "/_next/:path*"
    }
  ]
}
```

### 3. Environment Variables

Make sure `.env.production` has:

```
NEXT_PUBLIC_BASE_PATH=/blocks
```

## Important Notes

- When deployed with basePath set, Next.js automatically handles:
  - Static asset loading
  - API route prefixing
  - Navigation paths

- No need for path utility functions as Next.js handles this internally
- All standard Next.js features like `<Link>`, `<Image>`, and API routes work normally 