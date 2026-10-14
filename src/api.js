const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("json")) {
        throw new Error(
            `The API returned a non-JSON response (HTTP ${response.status}) for ${path}. ` +
            "Restart the backend with the latest routes and verify VITE_API_URL points to it."
        );
    }

    const data = await response.json();

    // Return login failures normally; throw only for server errors
    if (!response.ok && response.status >= 500) {
        throw new Error(data.message || "Server error");
    }

    return data;
}
