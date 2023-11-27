import { redirect } from "@sveltejs/kit"
export async function load({ cookies }) {
  let token = cookies.get("token")
  
  if(!token) throw redirect(302, '/');
}