import { upload } from "@vercel/blob/client";

export async function uploadFile(file: File): Promise<{ url: string }> {
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
  });
  return { url: blob.url };
}
