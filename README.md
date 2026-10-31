This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Practice

Open `/diagnostic/practice` to choose topics, 10/15/20 questions or Unlimited, and untimed, whole-round, or per-question timing. Practice reuses the diagnostic question layout.

`app/diagnostic/practice/data/question-bank.json` holds demo approval statuses referencing the diagnostic JSON question bank. Only entries marked `approved` appear in practice. These are sample statuses, not a production review workflow. Short sets end when matching content runs out, without repeating questions.

Whole-round expiry ends practice; per-question expiry locks the unanswered question and advances in order. Timers continue in the background. Response times include elapsed time while a question is open, including background time, and stop on submission or timeout. Completed and manually ended sessions save timing settings and per-question responses in browser storage. Reloading an active practice returns to setup. The dashboard currently displays its separate sample JSON data.

The AI Mentor button opens on demand. It currently displays a labeled general study tip; no AI service is connected.

Use Node.js 22 or newer for the development tools.

## Exam Mode

`/exam` always shows a Start exam confirmation before creating a fixed 15-question, 30-minute mock exam, using the approved sample bank and the practice interface. The timer starts only after confirmation. There is no setup, mentor, or pause control. Answers must be submitted in order and results appear only after completion, early submission, or timeout. Active exams warn before following a link, using Back, refreshing, or closing the tab. Refresh/close warnings use browser-controlled wording. Confirming departure discards the active exam; unfinished exams do not resume. Completed exams are saved separately from practice sessions. Choose New exam on the results screen to open the confirmation again. This is a short mock exam, not a full-length official GMAT simulation.

## Resources

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
