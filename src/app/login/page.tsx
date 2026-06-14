import { redirect } from "next/navigation";
import { isPasswordValid, setAuthCookie } from "../../lib/auth";

async function login(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const valid = await isPasswordValid(password, process.env.APP_PASSWORD);

  if (!valid) redirect("/login?error=1");

  await setAuthCookie();
  redirect("/");
}

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-page">
      <form action={login} className="panel">
        <h1>Golf Workout</h1>
        <p>Enter the app password to continue.</p>
        <input name="password" type="password" placeholder="Password" required />
        {params.error ? <p className="error">That password did not work.</p> : null}
        <button type="submit">Enter</button>
      </form>
    </main>
  );
}
