import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost/denuncias/backend/public/form/", // placeholder de la url del backend
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 5000,
});
export const apiTracking = axios.create({
	baseURL: "http://localhost/denuncias/backend/public/api/",
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 5000,
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
	baseURL: "http://localhost/denuncias/backend/public/admin",
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 5000,
});
authApi.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('auth_token')
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`
		}
		return config
	}, 
	(error) => {
		return Promise.reject(error)
	}
)
authApi.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.code === "ECONNABORTED") {
			console.error("Timeout error");
		} else if (error.response) {
			if (error.response.status === 401) {
				localStorage.removeItem('auth_token');
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
