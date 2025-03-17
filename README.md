# Clubsaurus

Open source, self-hostable student org management.

## Unstable Warning

This software is not currently stable, and use is at your own risk.
Database migratios are currently performed unsafely.

## Philosophy

This is based on the old version of [Clubsaurus](https://github.com/CoasterFan5/Clubsaurus-old), which I built in high school. However, due to how that version was built, I felt trapped, and it didn't feel ready for the enterprise-level use that education institutions require.

Edtech often does not consider education's best interests but instead focuses on sales and marketing. I hope Clubsaurus can be different.

## Getting started with dev

1. Clone the repo
2. Copy the `.env.example` to a new `.env` file
3. Run `pnpm install`
4. Run `docker-compose up` to start the database
5. Run `pnpm run dev`
