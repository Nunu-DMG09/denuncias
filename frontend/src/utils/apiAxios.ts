import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost/denuncias/backend/public/form/", // placeholder de la url del backend
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 5000,
});
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
export default api;
