import Link from "next/link";

export default function NavBar() {
    return (
        <ul className="space-x-2">
            <Link href="/">WEBGL-GAMES</Link>
            <Link href="/signup">Signup</Link>
            <Link href="/login">Login</Link>
        </ul>
    )
}