import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {

  const session = await getSession();
  console.log("session: ", session)
  if (!session) {
    redirect('/login');
  }
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div>
          <h1>WEB-GL GAMES</h1> 
          <p>This is the front page. For now.</p>
        </div>
      </main>
    </div>
  );
}
