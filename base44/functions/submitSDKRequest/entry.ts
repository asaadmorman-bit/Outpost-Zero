import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

/**
 * Submits an SDK development request to sdk-developers.cyberdojogroup.com
 * and creates a local record for tracking
 */

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const requestData = await req.json();

        // Create local record first
        const localRequest = await base44.entities.SDKDevelopmentRequest.create({
            request_id: `req_${Date.now()}`,
            requested_by: user.email,
            organization: user.organization || 'Unknown',
            ...requestData,
            status: 'submitted'
        });

        // Send to developer portal
        try {
            const portalResponse = await fetch('https://sdk-developers.cyberdojogroup.com/api/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': Deno.env.get('SDK_PORTAL_API_KEY') || 'demo_key',
                    'X-User-Email': user.email
                },
                body: JSON.stringify({
                    request_id: localRequest.request_id,
                    requester_email: user.email,
                    requester_organization: user.organization,
                    infrastructure_problem: requestData.infrastructure_problem,
                    desired_functionality: requestData.desired_functionality,
                    current_systems: requestData.current_systems,
                    data_sources: requestData.data_sources,
                    compliance_requirements: requestData.compliance_requirements,
                    budget_range: requestData.budget_range,
                    timeline: requestData.timeline,
                    priority: requestData.priority,
                    submitted_at: new Date().toISOString()
                })
            });

            if (portalResponse.ok) {
                const portalData = await portalResponse.json();
                console.log('Request submitted to developer portal:', portalData);
                
                // Update local record with portal reference
                await base44.entities.SDKDevelopmentRequest.update(localRequest.id, {
                    portal_reference_id: portalData.portal_request_id,
                    status: 'under_review'
                });
            } else {
                console.warn('Developer portal submission failed, request saved locally only');
            }
        } catch (portalError) {
            console.warn('Could not reach developer portal:', portalError.message);
            // Request is still saved locally and can be synced later
        }

        return Response.json({
            success: true,
            request: localRequest,
            message: 'SDK development request submitted successfully. Our team will contact you within 24 hours.'
        });

    } catch (error) {
        console.error('Error submitting SDK request:', error);
        return Response.json({ 
            error: error.message,
            details: 'Failed to submit SDK development request'
        }, { status: 500 });
    }
});