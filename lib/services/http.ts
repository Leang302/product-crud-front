import axios from "axios";

const API_BASE_PATH = process.env.NEXT_PUBLIC_API_URL || "";

const http = axios.create({
    baseURL: API_BASE_PATH,
});


http.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const response = error?.response;

        if (!response) {
            return Promise.reject(error);
        } else {
            const data = response?.data;
            const errorMessage =
                (data && data?.message) || response.statusText || data?.status?.message;

            return Promise.reject({
                message: errorMessage,
                data: data.data,
                status: response.status,
            });
        }
    }
);

export default http;