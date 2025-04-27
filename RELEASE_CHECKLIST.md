# Release Checklist

## Pre-Deployment Checks

- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Update CHANGELOG.md with all changes
- [ ] Update version number in package.json
- [ ] Verify all environment variables are set
- [ ] Verify API endpoints are functioning correctly
- [ ] Run Lighthouse audit for performance
- [ ] Run accessibility checks

## Post-Deployment Checks

- [ ] Verify application loads correctly in production
- [ ] Check error monitoring for any new errors
- [ ] Verify authentication works in production
- [ ] Check key user flows work end-to-end
- [ ] Verify analytics are working correctly
- [ ] Monitor server response times
- [ ] Check for any 404 errors in logs
- [ ] Verify third-party integrations function properly

## Rollback Plan

If critical issues are detected after deployment:

1. Revert to previous version in deployment dashboard
2. Create hotfix if necessary
3. Run through pre-deployment checks again
4. Re-deploy when fixed

## Environment Variables

Ensure the following environment variables are set:

```bash
# Authentication
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Database
MONGODB_URI=

# API Keys
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Analytics
GOOGLE_ANALYTICS_ID=

# Other
NODE_ENV=production
```

## Documentation Updates

- [ ] Update API documentation
- [ ] Update user documentation
- [ ] Update deployment documentation
- [ ] Update security documentation 