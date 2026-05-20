"use client";

import { useRef, useState } from "react";
import { BasicCard } from "../components/BasicCard";
import { uploadGame } from "@/lib/upload-action";

export default function UploadForm() {

    const fileInput = useRef<HTMLInputElement>(null);
    const nameInput = useRef<HTMLInputElement>(null);
    const descriptionInput = useRef<HTMLTextAreaElement>(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const file = fileInput.current?.files?.[0];
        const name = nameInput.current?.value;
        const description = descriptionInput.current?.value;

        if (!name || !description) {
            setError("Please fill in both name and description.");
            return;
        }

        if (!file) {
            setError("Please select a ZIP file.");
            return;
        }

        if (!file.name.endsWith(".zip")) {
            setError("Please provide a ZIP file.")
            return;
        }

        try {
            const formData = new FormData();
            formData.append("gamename", name);
            formData.append("description", description);
            formData.append("file", file);

            const result = await uploadGame(formData);
            setSuccess("Game uploaded!");
            //setSuccess(`Game "${result.name}" uploaded successfully!`);
        } catch (err: any) {
            setError(err.message || "Upload failed");
        }
    };

     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 font-sans">
        <BasicCard>
            <h1 className="text-3xl font-bold text-center mb-6">Upload a new game</h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block mb-1">Name:</label>
                <input
                type="gamename"
                name="gamename"
                ref={nameInput}
                required
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
            </div>
            <div>
                <label className="block mb-1">Description:</label>
                <textarea
                name="description"
                ref={descriptionInput}
                required
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
            </div>
            <div>
                <label className="block mb-1">Game files (zip archive): </label>
                <input
                type="file"
                accept=".zip"
                ref={fileInput}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <button
                type="submit"
                className="w-full py-2 mt-2 bg-gray-600 hover:bg-gray-500 rounded-md text-gray-100 font-bold transition"
            >
                Upload Game
            </button>
            </form>
        </BasicCard>
        </div>
  );
}