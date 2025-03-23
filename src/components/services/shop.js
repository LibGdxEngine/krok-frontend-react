import axiosInstance from "../axiosInstance";

export const addToCart = async (token, product_id, quantity = 1) => { // Assuming you also need quantity
    try {
        const response = await axiosInstance.post("/v1/cart/add_item/",
            {
                product_id: product_id,
            },
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        return response.data;
    } catch (error) {
        console.error("Error adding item to cart:", error);
        throw error;
    }
};