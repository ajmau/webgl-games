"use server"
import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const key = new TextEncoder().encode(process.env.JWT_SECRET!);
//const key = new TextEncoder().encode("asdasd");

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('100 sec from now')
        .sign(key)
}

async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function logout() {
  (await cookies()).set("session", "", { expires: new Date(0) });
}


export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 100 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}

/*
export async function setSession(username: string) {
        const expires = new Date(Date.now() + 10 * 1000);
        const session = await encrypt( {username, expires} );
        console.log("set session: ", session);
        (await cookies()).set("session", session, {expires, httpOnly: true})
}
        */

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  //console.log("getsession: ", session);
  if (!session) return null;
  return await decrypt(session);
}
