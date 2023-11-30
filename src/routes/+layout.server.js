export async function load({ cookies }) {
  let token = cookies.get("token")
  
  return {
    loggedin: !!token
  }
}