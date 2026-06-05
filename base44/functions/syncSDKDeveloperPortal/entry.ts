import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

/**
 * Syncs SDKs from sdk-developers.cyberdojogroup.com to Outpost Zero
 * This function can be called:
 * 1. Manually by admins
 * 2. On a schedule (daily)
 * 3. Via webhook from the developer portal when new SDKs are published
 */

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only admins can sync SDKs
        if (user.role !== 'admin') {
            return Response.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        console.log('Syncing SDKs from sdk-developers.cyberdojogroup.com...');

        // Fetch SDKs from the developer portal
        let sdksFromPortal = [];
        
        try {
            const response = await fetch('https://sdk-developers.cyberdojogroup.com/api/sdks', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': Deno.env.get('SDK_PORTAL_API_KEY') || 'demo_key'
                }
            });

            if (response.ok) {
                sdksFromPortal = await response.json();
                console.log(`Fetched ${sdksFromPortal.length} SDKs from developer portal`);
            } else {
                console.log('Developer portal not available, using cached data');
            }
        } catch (fetchError) {
            console.log('Developer portal fetch failed, will use existing SDKs:', fetchError.message);
        }

        // Get existing SDKs in Outpost Zero
        const existingSDKs = await base44.asServiceRole.entities.CustomSDK.list();
        const existingSDKIds = new Set(existingSDKs.map(sdk => sdk.sdk_id));

        let created = 0;
        let updated = 0;

        // Sync each SDK from portal
        for (const sdk of sdksFromPortal) {
            if (existingSDKIds.has(sdk.sdk_id)) {
                // Update existing SDK
                const existing = existingSDKs.find(s => s.sdk_id === sdk.sdk_id);
                await base44.asServiceRole.entities.CustomSDK.update(existing.id, {
                    version: sdk.version,
                    description: sdk.description,
                    rating: sdk.rating,
                    installation_count: sdk.installation_count,
                    reviews_count: sdk.reviews_count,
                    certification_status: sdk.certification_status,
                    security_audit: sdk.security_audit
                });
                updated++;
            } else {
                // Create new SDK
                await base44.asServiceRole.entities.CustomSDK.create(sdk);
                created++;
            }
        }

        return Response.json({
            success: true,
            message: 'SDK sync completed',
            stats: {
                fetched: sdksFromPortal.length,
                created: created,
                updated: updated,
                total_sdks: existingSDKs.length + created
            }
        });

    } catch (error) {
        console.error('Error syncing SDKs:', error);
        return Response.json({ 
            error: error.message,
            details: 'Failed to sync SDKs from developer portal'
        }, { status: 500 });
    }
});