// src/utils/storage-helper.js
import { supabase } from "./supabase";

/**
 * Upload file ke profile_pics bucket
 * @param {File} file - File object
 * @param {string} userId - UUID user
 * @param {string} folder - Folder name (e.g., "avatars" atau "posts")
 * @returns {Promise<string>} Public URL dari file
 */
export async function uploadToProfilePics(file, userId, folder = "avatars") {
  if (!file || !userId) {
    throw new Error("File dan userId harus disediakan");
  }

  // Generate unique filename
  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${userId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;

  try {
    // Upload file
    const { error: uploadError } = await supabase.storage
      .from("profile_pics")
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data } = supabase.storage
      .from("profile_pics")
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error("[uploadToProfilePics]", error);
    throw error;
  }
}

/**
 * Upload multiple files
 * @param {File[]} files - Array of File objects
 * @param {string} userId - UUID user
 * @param {string} folder - Folder name
 * @returns {Promise<string[]>} Array of public URLs
 */
export async function uploadMultipleToProfilePics(
  files,
  userId,
  folder = "posts"
) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("Files array harus tidak kosong");
  }

  if (files.length > 4) {
    throw new Error("Maximum 4 files allowed");
  }

  try {
    const uploadPromises = files.map((file) =>
      uploadToProfilePics(file, userId, folder)
    );

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("[uploadMultipleToProfilePics]", error);
    throw error;
  }
}

/**
 * Delete file dari bucket
 * @param {string} fileUrl - Public URL dari file
 * @returns {Promise<void>}
 */
export async function deleteFromProfilePics(fileUrl) {
  try {
    // Extract path dari URL
    // Format: https://xxxxx.supabase.co/storage/v1/object/public/profile_pics/path/to/file
    const pathMatch = fileUrl.match(/profile_pics\/(.+)$/);
    if (!pathMatch) {
      throw new Error("Invalid file URL");
    }

    const filePath = pathMatch[1];

    const { error } = await supabase.storage
      .from("profile_pics")
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error("[deleteFromProfilePics]", error);
    throw error;
  }
}

/**
 * Check if bucket exists dan bisa accessed
 * @returns {Promise<boolean>}
 */
export async function checkProfilePicsBucket() {
  try {
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("Failed to list buckets:", error);
      return false;
    }

    const hasBucket = data.some((bucket) => bucket.name === "profile_pics");
    return hasBucket;
  } catch (error) {
    console.error("[checkProfilePicsBucket]", error);
    return false;
  }
}

/**
 * Create profile_pics bucket (admin only)
 * Run once during setup
 * @returns {Promise<void>}
 */
export async function createProfilePicsBucket() {
  try {
    const { error } = await supabase.storage.createBucket("profile_pics", {
      public: true,
      allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
      fileSizeLimit: 5242880, // 5MB
    });

    if (error && !error.message.includes("already exists")) {
      throw error;
    }

    console.log("profile_pics bucket is ready");
  } catch (error) {
    console.error("[createProfilePicsBucket]", error);
    throw error;
  }
}

// =====================================================
// POSTS BUCKET FUNCTIONS
// =====================================================

/**
 * Upload file ke posts bucket
 * @param {File} file - File object
 * @param {string} userId - UUID user
 * @returns {Promise<string>} Public URL dari file
 */
export async function uploadToPosts(file, userId) {
  if (!file || !userId) {
    throw new Error("File dan userId harus disediakan");
  }

  const ext = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from("posts")
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error("[uploadToPosts]", error);
    throw error;
  }
}

/**
 * Upload multiple files ke posts bucket
 * @param {File[]} files - Array of File objects
 * @param {string} userId - UUID user
 * @returns {Promise<string[]>} Array of public URLs
 */
export async function uploadMultipleToPosts(files, userId) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("Files array harus tidak kosong");
  }

  if (files.length > 4) {
    throw new Error("Maximum 4 files allowed");
  }

  try {
    const uploadPromises = files.map((file) => uploadToPosts(file, userId));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("[uploadMultipleToPosts]", error);
    throw error;
  }
}

/**
 * Delete file dari posts bucket
 * @param {string} fileUrl - Public URL dari file
 * @returns {Promise<void>}
 */
export async function deleteFromPosts(fileUrl) {
  try {
    const pathMatch = fileUrl.match(/posts\/(.+)$/);
    if (!pathMatch) {
      throw new Error("Invalid file URL");
    }

    const filePath = pathMatch[1];

    const { error } = await supabase.storage
      .from("posts")
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error("[deleteFromPosts]", error);
    throw error;
  }
}

/**
 * Create posts bucket (admin only)
 * Run once during setup
 * @returns {Promise<void>}
 */
export async function createPostsBucket() {
  try {
    const { error } = await supabase.storage.createBucket("posts", {
      public: true,
      allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
      fileSizeLimit: 5242880, // 5MB
    });

    if (error && !error.message.includes("already exists")) {
      throw error;
    }

    console.log("posts bucket is ready");
  } catch (error) {
    console.error("[createPostsBucket]", error);
    throw error;
  }
}
