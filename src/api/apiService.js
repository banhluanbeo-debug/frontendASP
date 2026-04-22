import API_BASE_URL from "./apiConfig";

const handleResponse = async (res) => {
  if (res.ok) {
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } else {
    let errorText = "";
    try {
      errorText = await res.text();
      // Log lỗi chi tiết ra console để dễ debug
      console.error(`❌ API Error ${res.status}:`, errorText);
    } catch (e) {
      errorText = res.statusText;
    }
    throw new Error(errorText || `Lỗi API! status: ${res.status}`);
  }
};

export const apiGet = (url) =>
  fetch(`${API_BASE_URL}${url}`).then(handleResponse);

export const apiPost = (url, data) => {
  const isFormData = data instanceof FormData;
  return fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    body: isFormData ? data : JSON.stringify(data),
  }).then(handleResponse);
};

export const apiPut = (url, data) => {
  const isFormData = data instanceof FormData;
  return fetch(`${API_BASE_URL}${url}`, {
    method: "PUT",
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    body: isFormData ? data : JSON.stringify(data),
  }).then(handleResponse);
};

export const apiDelete = (url) =>
  fetch(`${API_BASE_URL}${url}`, {
    method: "DELETE",
  }).then(handleResponse);
