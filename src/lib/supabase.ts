import { createClient } from "@supabase/supabase-js"

const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const NEXT_PUBLIC_SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ""

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_KEY)

export const uploadFile = async (file: File) => {
	try {
		const filename = `${Date.now()}.png`;
		const { error } = await supabase
			.storage
			.from('imageupload')
			.upload(`public/airplanes/${filename}`, file, {
				cacheControl: '3600',
				upsert: false
			})

		if (error) {
			throw error;
		}
		return filename;
	} catch (error) {
		console.error("Error uploading file:", error);
		throw new Error("Failed to upload file");
	}
}

export const getFileUrl = (filename: string) => {
	return supabase
		.storage
		.from('imageupload')
		.getPublicUrl(`public/airplanes/${filename}`).data.publicUrl;
}

export const deleteFile = async (filename: string) => {
	try {
		const { error } = await supabase
			.storage
			.from('imageupload')
			.remove([`public/airplanes/${filename}`]);

		if (error) {
			throw error;
		}
	} catch (error) {
		console.error("Error deleting file:", error);
		throw new Error("Failed to delete file");
	}
}
