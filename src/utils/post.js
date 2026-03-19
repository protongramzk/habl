import { supabase } from "./supabase";
import { user } from "./auth";

// 🔥 upload multiple files
export async function uploadPost({ caption, files, group_id = null }) {
  const currentUser = user();

  if (!currentUser) {
    throw new Error("Harus login dulu 😤");
  }

  const uploadedUrls = [];

  for (const file of files) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${currentUser.id}/${Date.now()}-${Math.random()}.${fileExt}`;

    // upload ke bucket "posts"
    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // ambil public URL
    const { data } = supabase.storage
      .from("posts")
      .getPublicUrl(fileName);

    uploadedUrls.push(data.publicUrl);
  }

  // insert ke database
  const { error: insertError } = await supabase.from("posts").insert({
    account_id: currentUser.id,
    caption,
    media: uploadedUrls,
    group_id,
  });

  if (insertError) throw insertError;
}
