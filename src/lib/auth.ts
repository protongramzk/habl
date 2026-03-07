import { supabase } from "./supabase"

export async function loginWithOTP(email: string){

  const { error } = await supabase.auth.signInWithOtp({
    email
  })

  if(error) throw error
}

export async function loginWithPassword(
  email: string,
  password: string
){

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if(error) throw error

  return data
}

export async function getSession(){

  const { data } = await supabase.auth.getSession()

  return data.session
}

export async function logout(){
  await supabase.auth.signOut()
}
// Tambahkan ke $lib/supabase/auth.ts
export async function register(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username, // Ini akan masuk ke metadata auth
      }
    }
  });

  if (error) throw error;
  return data;
}

export async function loginWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'http://localhost:5173/auth/callback', // Halaman penampung setelah balik dari GitHub
    },
  });

  if (error) throw error;
  return data;
}
