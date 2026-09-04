import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24">
      <h1 className="font-display text-3xl text-paper">Log in</h1>
      <p className="mt-2 text-center font-body text-sm text-muted">
        Save favorites and track your reservations.
      </p>

      <div className="mt-8 w-full space-y-3">
        <button
          disabled
          className="w-full rounded-sm border border-white/15 px-6 py-3 font-body text-sm text-silver opacity-60"
        >
          Continue with Google
        </button>
        <button
          disabled
          className="w-full rounded-sm border border-white/15 px-6 py-3 font-body text-sm text-silver opacity-60"
        >
          Continue with Facebook
        </button>
      </div>

      <p className="mt-6 font-body text-xs text-muted">
        Accounts aren&apos;t connected yet — this screen is ready for
        Clerk/NextAuth wiring in the next phase.
      </p>
    </div>
  );
}
