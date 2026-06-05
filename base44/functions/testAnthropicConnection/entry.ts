import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Try multiple ways to access the API key
        const apiKey1 = Deno.env.get("ANTHROPIC_API_KEY");
        const apiKey2 = Deno.env.get("anthrokeynew"); // Maybe it's stored under a different name?
        const apiKey3 = Deno.env.get("ANTHROPIC_KEY");
        
        // Get all environment variables (keys only, not values for security)
        const allEnvKeys = Object.keys(Deno.env.toObject());
        
        // Filter for anything that might be our key
        const relevantKeys = allEnvKeys.filter(key => 
            key.toLowerCase().includes('anthrop') || 
            key.toLowerCase().includes('claude') ||
            key.toLowerCase().includes('key')
        );

        const diagnostics = {
            ANTHROPIC_API_KEY_exists: !!apiKey1,
            ANTHROPIC_API_KEY_length: apiKey1 ? apiKey1.length : 0,
            ANTHROPIC_API_KEY_prefix: apiKey1 ? apiKey1.substring(0, 10) + '...' : 'NOT FOUND',
            
            anthrokeynew_exists: !!apiKey2,
            anthrokeynew_length: apiKey2 ? apiKey2.length : 0,
            anthrokeynew_prefix: apiKey2 ? apiKey2.substring(0, 10) + '...' : 'NOT FOUND',
            
            ANTHROPIC_KEY_exists: !!apiKey3,
            
            total_env_vars: allEnvKeys.length,
            relevant_env_vars: relevantKeys,
            all_env_vars: allEnvKeys,
            
            timestamp: new Date().toISOString(),
            deno_version: Deno.version.deno,
            
            // Check if we can access base44 app ID
            base44_app_id: Deno.env.get("BASE44_APP_ID") || 'NOT FOUND'
        };

        // Return the first key we find
        const workingKey = apiKey1 || apiKey2 || apiKey3;

        return Response.json({
            success: true,
            diagnostics,
            api_key_found: !!workingKey,
            working_key_name: workingKey ? (apiKey1 ? 'ANTHROPIC_API_KEY' : apiKey2 ? 'anthrokeynew' : 'ANTHROPIC_KEY') : null,
            message: workingKey ? 'API key found and accessible!' : 'API key NOT found in environment'
        });

    } catch (error) {
        return Response.json({ 
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
});