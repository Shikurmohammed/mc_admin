// utils/tokenUtils.ts
export const checkTokenExpiry = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const issuedAt = new Date(payload.iat * 1000);
        const expiresAt = new Date(payload.exp * 1000);
        const now = new Date();
        
        console.log('=== TOKEN DEBUG ===');
        console.log('Issued at:', issuedAt.toLocaleString());
        console.log('Expires at:', expiresAt.toLocaleString());
        console.log('Current time:', now.toLocaleString());
        console.log('Time until expiry (ms):', expiresAt.getTime() - now.getTime());
        console.log('Is expired?', expiresAt.getTime() < now.getTime());
        console.log('Token age (seconds):', (now.getTime() - issuedAt.getTime()) / 1000);
        console.log('Token lifetime (seconds):', payload.exp - payload.iat);
        console.log('=== END DEBUG ===');
        
        return {
            isExpired: expiresAt.getTime() < now.getTime(),
            expiresInMs: expiresAt.getTime() - now.getTime(),
            lifetimeSeconds: payload.exp - payload.iat
        };
    } catch (error) {
        console.error('Error checking token:', error);
        return null;
    }
};

