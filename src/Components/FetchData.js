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

export async function updatefetchPut(url = "", accessToken = "") {
  const options = {
    method: "PUT",
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

export async function fetchPut(url = "", values = {}, accessToken = "") {
  const options = {
    method: "PUT",
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

export async function fetchDelete(url = "", accessToken = "") {
  const options = {
    method: "DELETE",
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
