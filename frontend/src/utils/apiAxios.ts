import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
	baseURL: `${BASE_URL}/form/`,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 60000,
});
export const apiTracking = axios.create({
	baseURL: `${BASE_URL}/api/`,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 5000,
	withCredentials: true,
})
apiTracking.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.code === "ECONNABORTED") {
			console.error("Timeout error");
		} else if (error.response) {
			console.error(
				`Error response: ${error.response.status} : ${error.response.data}`
			);
		} else {
			console.error(`Error message: ${error.message}`);
		}
		return Promise.reject(error);
	}
)
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.code === "ECONNABORTED") {
			console.error("Timeout error");
		} else if (error.response) {
			console.error(
				`Error response: ${error.response.status} : ${error.response.data}`
			);
		} else {
			console.error(`Error message: ${error.message}`);
		}
		return Promise.reject(error);
	}
);
export const authApi = axios.create({
	baseURL: `${BASE_URL}/admin`,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 5000,
	withCredentials: true,
});
authApi.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.code === "ECONNABORTED") {
			console.error("Timeout error");
		} else if (error.response) {
			if (error.response.status === 401) {
				if (!window.location.pathname.includes('/admin/login')) {
					window.location.href = "/admin/login";
				}
			}
			console.error(
				`Error response: ${error.response.status} : ${error.response.data}`
			);
		} else {
			console.error(`Error message: ${error.message}`);
		}
		return Promise.reject(error);
	}
);
export default api;
