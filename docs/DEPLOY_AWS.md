# Deploy HeatReach to AWS Amplify Hosting

## Current status

**PENDING AUTHORIZED NON-ROOT AWS ACCOUNT. AWS DEPLOYMENT NOT YET COMPLETE.**

Read-only AWS identity and Amplify checks succeeded in the existing default profile in `ap-south-1`. The identity is root. The supplied build specification says “Do not use AWS root credentials for deployment,” so no cloud resources or deployment jobs were created. No account ID or credentials are included in this repository. A safe deployment script rejects root before any mutation.

Actual deployment URL: **PENDING**. Deployment timestamp/proof: **PENDING**. Local screenshots are in `docs/screenshots/`; they are not AWS proof.

## Build and package

```sh
npm ci
npm test
npm run build
```

On Windows PowerShell:

```powershell
npm run package
```

This creates `release/heatreach-amplify.zip` and verifies `index.html` is at ZIP root. The archive contains only production assets and the fixture, not project sources, credentials or `node_modules`. Build before every package operation. On macOS/Linux: `cd dist` and `zip -r ../heatreach-amplify.zip .`.

## Console deployment

1. Sign in with an authorized IAM Identity Center session or IAM role/user, not root. Have the account owner approve any account/billing setup; review Amplify pricing and spending controls. No guaranteed zero-cost claim is made.
2. Open AWS Amplify, choose **Create new app → Deploy without Git → Next**.
3. Name the app `HeatReach`, branch `production`, and choose **Drag and drop**.
4. Upload the ZIP from above. Choose **Save and deploy**.
5. Wait for success. Record the app ID, region, job ID, HTTPS URL and actual timestamp here.
6. Open the URL in a private browser. Verify fixture fetch, A+C and 2,150; budget 1 gives C and 1,480; uncheck C; reset; inspect mobile layout and sources. Refresh the page and download the scenario.
7. Capture the real Amplify console and live URL for the video. Only after this verification change deployment status to complete.

AWS's [manual deployment instructions](https://docs.aws.amazon.com/amplify/latest/userguide/manual-deploys.html), checked during implementation, specify uploading the **contents** of the build output. A parent `dist` directory in the ZIP causes an invalid root. This application is static, so manual hosting is suitable; it needs no server runtime or database.

## Guarded CLI deployment on Windows

Ask your account administrator to grant the intended identity permission for Amplify app/branch creation, deployment creation/start, and read access to apps, branches and jobs. Then configure an existing approved sign-in:

```powershell
aws configure sso --profile heatreach-deploy
aws sso login --profile heatreach-deploy
aws sts get-caller-identity --profile heatreach-deploy
npm run build
npm run package
powershell -NoProfile -File scripts/deploy-aws.ps1 -Profile heatreach-deploy
```

SSO configuration requires a team-provided start URL, SSO region, account and role. Do not invent them or paste keys into chat. For an already configured IAM profile, use its name directly. The deployment script checks identity first, creates a static Amplify app/branch, uploads the ZIP to the returned signed endpoint, starts a deployment, polls status and checks HTTP 200. It never prints the signed upload URL. The script is supplied but **its cloud write path has not been executed**, because the available profile is root.

For updates, reuse the returned app ID to avoid duplicate resources:

```powershell
powershell -NoProfile -File scripts/deploy-aws.ps1 -Profile heatreach-deploy -AppId YOUR_EXISTING_APP_ID
```

After any timeout inspect the existing app/job in Amplify before retrying. Complete the private-browser workflow even after HTTP 200. The script reports hosting status, not field verification or submission success.

## Git-connected alternative

Connect `https://github.com/AamirrH/HeatReach`, branch `main`, in Amplify using the team's authorized GitHub connection. The committed `amplify.yml` installs Node 22, runs `npm ci`, tests and the production build, and publishes `dist`. No secrets/environment variables are required.

Only a single page and in-page anchors exist, so no history-route rewrite is needed. If paths are added later, follow [AWS rewrite documentation](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html). The project has no need for Amplify backend resources.

## Troubleshooting

- Blank/error page: check that `/fixtures/illustrative_district.json` returns JSON and `/assets/` files return 200; upload all output contents.
- Build fails: use Node 22.12+ and `npm ci`; do not remove the lockfile.
- Access denied: check role authorization, session expiry and intended AWS region. Do not fall back to root.
- Old content: compare build/job IDs and perform a fresh private-browser reload.
- Missing live API: expected; the P0 planner uses only the local fixture.
