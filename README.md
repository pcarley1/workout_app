# TurnSpeed

Private single-user golf fitness app for guided workouts, baseline tests, and progress tracking.

## Local setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL`, `APP_PASSWORD`, and `SESSION_SECRET`.
3. Run `npm install`.
4. Run `npm run db:migrate -- --name init`.
5. Run `npm run db:seed`.
6. Run `npm run dev`.

## Railway

Create a Railway project from the GitHub repo, add Postgres, and expose `DATABASE_URL` to the app service. Add `APP_PASSWORD` and `SESSION_SECRET` as service variables. Railway runs migrations and seeds with the pre-deploy command in `railway.json`.
