import { apiClient } from "../client";

export const registerUser = (email, password, nickname) => {
    const data = apiClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
            nickname
        }),
    });

    return data;
}