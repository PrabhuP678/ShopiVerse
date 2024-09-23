async function fetchWithToken(url, options = {}) {
    let token = localStorage.getItem('accessToken');
    let refreshToken = localStorage.getItem('refreshToken');

    try {
        let response = await fetch(url, {
            ...options,
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.status === 401) {
            // Token might be expired, try refreshing it
            const refreshResponse = await fetch('/refresh-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (refreshResponse.ok) {
                const { accessToken: newAccessToken } = await refreshResponse.json();
                localStorage.setItem('accessToken', newAccessToken);

                // Retry the original request
                response = await fetch(url, {
                    ...options,
                    headers: { 'Authorization': `Bearer ${newAccessToken}` },
                });
            } else {
                // Handle refresh token error (e.g., prompt user to log in again)
                alert('Session expired. Please log in again.');
                window.location.href = '/login';
            }
        }

        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export default fetchWithToken;
