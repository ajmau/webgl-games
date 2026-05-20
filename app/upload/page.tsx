"use server";
import UploadForm from "./UploadForm";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function UploadPage() {
    if (!await getSession()) {
        redirect("/login");
    }

    return (
        <UploadForm/>
    )
}