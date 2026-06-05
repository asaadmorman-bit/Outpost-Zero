import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

/**
 * Hub-Ready Activity Summary
 * Returns contextual metrics depending on the calling app identity (app_context header).
 * 
 * app_context: "ASOSINT"        → count of active investigations
 * app_context: "CyberDojoSensai" → count of total active users
 * default (Outpost Zero / PHD Hub) → both metrics combined
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appContext = req.headers.get('x-app-context') || 'default';

    if (appContext === 'ASOSINT') {
      // Count active investigations
      const investigations = await base44.asServiceRole.entities.Investigation.filter({ status: 'active' });
      return Response.json({
        app: 'ASOSINT',
        metric: 'active_investigations',
        count: investigations.length,
        timestamp: new Date().toISOString(),
      });
    }

    if (appContext === 'CyberDojoSensai') {
      // Count all active users (role-agnostic)
      const users = await base44.asServiceRole.entities.User.list();
      const activeUsers = users.filter(u => u.access_level === 'paid_user' || u.role === 'admin');
      return Response.json({
        app: 'CyberDojoSensai',
        metric: 'total_active_users',
        count: activeUsers.length,
        timestamp: new Date().toISOString(),
      });
    }

    // Default: PHD Hub — return full summary
    const [investigations, users] = await Promise.all([
      base44.asServiceRole.entities.Investigation.filter({ status: 'active' }),
      base44.asServiceRole.entities.User.list(),
    ]);
    const activeUsers = users.filter(u => u.access_level === 'paid_user' || u.role === 'admin');

    return Response.json({
      app: 'OutpostZero_PHDHub',
      metrics: {
        active_investigations: investigations.length,
        total_active_users: activeUsers.length,
      },
      identity_context: {
        user_id: user.id,
        user_email: user.email,
        role: user.role,
        access_level: user.access_level || 'unknown',
        ecosystem: 'CyberDojo',
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});