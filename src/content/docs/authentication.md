---
title: Authentication
description: API key usage, rate limits, and tiers.
---

## API Keys

All requests require an API key passed via the `X-API-Key` header.

```bash
curl https://api.gnosistool.com/v1/people \
  -H "X-API-Key: gn_your_key_here"
```

Keys are prefixed with `gn_` and generated when you sign up.

## Rate Limits

| Tier | Requests/Day | Semantic Search |
|------|-------------|-----------------|
| Free | 1,000 | No |
| Pro | 10,000 | Yes |

When you exceed your rate limit, the API returns `429 Too Many Requests` with a `Retry-After` header.

## Check Your Usage

```bash
curl https://api.gnosistool.com/v1/usage \
  -H "X-API-Key: gn_your_key_here"
```

```json
{
  "data": {
    "email": "you@example.com",
    "tier": "free",
    "daily_limit": 1000,
    "daily_used": 42
  }
}
```

## Error Codes

| Status | Meaning |
|--------|---------|
| 401 | Invalid or missing API key |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
