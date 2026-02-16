import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-red-600">403</h1>
        <h2 className="text-2xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground">
          You do not have permission to access this page.
        </p>
        <Link
          href="/product"
          className="inline-block mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-black/90"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
