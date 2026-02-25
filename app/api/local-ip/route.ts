import { NextResponse } from 'next/server';
import os from 'os';

/**
 * GET /api/local-ip
 * Returns the local-network IP address of this machine so the QR code
 * can point to an address reachable by phones on the same WiFi.
 */
export async function GET() {
    try {
        const nets = os.networkInterfaces();
        let localIP = '';

        for (const name of Object.keys(nets)) {
            const ifaces = nets[name];
            if (!ifaces) continue;
            for (const iface of ifaces) {
                // Pick the first non-internal IPv4 address
                if (iface.family === 'IPv4' && !iface.internal) {
                    localIP = iface.address;
                    break;
                }
            }
            if (localIP) break;
        }

        // Fallback: return localhost if no LAN IP found
        if (!localIP) {
            localIP = '127.0.0.1';
        }

        return NextResponse.json({ ip: localIP });
    } catch {
        return NextResponse.json({ ip: '127.0.0.1' });
    }
}
