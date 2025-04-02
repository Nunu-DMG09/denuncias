const API_BASE_URL = 'http://localhost/denuncias/backend/public/api';

export const getDNIData = async (dni: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/dni/${dni}`);
        if (!response.ok) {
            throw new Error("Error al obtener datos del DNI");
        }
        const data = await response.json();
        if (data?.success && data?.data) {
            const personData = data.data;
            const nombre = `${personData.apellido_paterno} ${personData.apellido_materno[0]}. ${personData.nombres.split(' ')[0]}${personData.nombres.split(' ')[1] ? ` ${personData.nombres.split(' ')[1][0]}.` : ''}`;
            return nombre
        }
        return ''
    } catch (err) {
        console.error("Error al consultar DNI:", err);
        throw new Error("Error al consultar DNI. Intente nuevamente.");
    }
}

export const getRUCData = async (ruc: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ruc/${ruc}`);
        if (!response.ok) {
            throw new Error("Error al obtener datos del RUC");
        }
        const data = await response.json();
        if (data?.success && data?.data) {
            const nombre = data.data.nombre_o_razon_social
            return nombre;
        }
        return ''
    } catch (err) {
        console.error("Error al consultar RUC:", err);
        throw new Error("Error al consultar RUC. Intente nuevamente.");
    }
}