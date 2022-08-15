import Cookies from "universal-cookie";
const cookies = new Cookies();
export default function deleteAllCookies() {
  const cookiesArray = cookies.getAll();
  if (cookiesArray != null) {
    for (let key in cookiesArray) {
      cookies.remove(key);
    }
  }
}
