export async function fetchPost(url = "", values = {}, accessToken = "") {
  const options = {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = await fetch(url, options);
  if (response.status >= 200 && response.status <= 299) {
    return await response.json();
  } else {
    let error = await response.json();
    let err = new Error();
    err.status = error.status;
    err.message = error.error;
    throw err;
  }
}

export async function fetchGet(url = "", accessToken = "") {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    mode: "no-cors",
  };
  const response = await fetch(url, options);
  if (response.status >= 200 && response.status <= 299) {
    return await response.json();
  } else {
    let error = await response.json();
    let err = new Error();
    err.status = error.status;
    err.message = error.error;
    throw err;
  }
}
