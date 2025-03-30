# Subdomain Integration

## Overview

The Block app is now integrated with the main application via a subdomain approach rather than a path-based approach. The app is accessible at:

- `bl.cb.databayt.org` (subdomain)

This document outlines the integration approach and what has been removed to avoid conflicts.

## Subdomain Approach Benefits

1. **Clean URL Structure**:
   - Each app gets its own subdomain (`bl.cb.databayt.org`) instead of a path prefix 
   - Eliminates potential conflicts with path-based routing

2. **Simplified Asset Handling**:
   - No need for asset prefixing or special path handling
   - CSS, JavaScript, and other assets load normally from their standard paths

3. **Independent Deployment**:
   - Each app can be deployed and updated independently
   - No need to coordinate deployments between the monorepo and the Block app

## Changes Made

1. **Removed Path-Based Configuration**:
   - Removed `assetPrefix` from `next.config.ts`
   - Removed `NEXT_PUBLIC_BASE_PATH` environment variable
   - Removed monorepo integration documentation

2. **No Special Handling Required**:
   - Standard Next.js routing works without modification
   - No need for special path prefixing in links or assets

## How It Works

1. **DNS Configuration**:
   - `bl.cb.databayt.org` subdomain is set up to point to the Block app
   - This is managed at the DNS level (typically through Vercel or your DNS provider)

2. **User Access**:
   - Users access the Block app directly through `bl.cb.databayt.org`
   - The main app can link to the Block app using this subdomain

## Current State

All path-based integration code has been removed from the Block app. The app now operates as a standard Next.js application without any special path handling. 