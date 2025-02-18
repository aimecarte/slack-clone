export default function useLogin() {
    const headers = JSON.parse(localStorage.getItem("headers"));
    
    const hasToken = typeof headers === "object" && headers !== null && !Array.isArray(headers) && Object.keys(headers).length > 0;
    // const hasToken = false;
    return {token: hasToken}
}