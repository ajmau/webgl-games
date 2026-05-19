import Link from "next/link";
import { logout } from "@/lib/session";
import { getSession } from "@/lib/session";

export default async function NavBar() {

    const session = await getSession();

    if (!session) {
        return (
            <ul className="space-x-2">
                <Link href="/">WEBGL-GAMES</Link>
                <Link href="/signup">Signup</Link>
                <Link href="/login">Login</Link>
            </ul>
        ) 
    } else {
         return (
            <ul className="space-x-2">
                <Link href="/">WEBGL-GAMES</Link>
                <button onClick={logout}>Logout</button>
            </ul>
        ) 
       
    }
}