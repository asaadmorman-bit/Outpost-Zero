import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';
import Stripe from 'npm:stripe@15.8.0';

const stripe = new Stripe(Deno.env.get('Stripe'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized - Admin only' }, { status: 401 });
    }

    // Fetch all active subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      status: 'active',
      limit: 100
    });

    // Sync to database
    const syncedCount = 0;
    for (const sub of subscriptions.data) {
      try {
        // Check if already exists
        const existing = await base44.entities.StripeSubscription.filter({
          stripe_subscription_id: sub.id
        });

        const subData = {
          stripe_subscription_id: sub.id,
          stripe_customer_id: sub.customer,
          plan_key: sub.metadata?.plan_key || 'revsentinel',
          plan_name: sub.metadata?.plan_name || 'RevSentinel',
          status: sub.status,
          current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          amount: sub.items.data[0]?.price?.unit_amount || 0,
          currency: sub.currency || 'usd',
          cancel_at_period_end: sub.cancel_at_period_end,
          metadata: sub.metadata
        };

        if (existing && existing.length > 0) {
          // Update existing
          await base44.asServiceRole.entities.StripeSubscription.update(existing[0].id, subData);
        } else {
          // Create new
          await base44.asServiceRole.entities.StripeSubscription.create(subData);
          syncedCount++;
        }
      } catch (error) {
        console.error(`Error syncing subscription ${sub.id}:`, error);
      }
    }

    return Response.json({
      success: true,
      total_subscriptions: subscriptions.data.length,
      synced_new: syncedCount,
      message: `Successfully synced ${subscriptions.data.length} subscriptions`
    });

  } catch (error) {
    console.error('Sync error:', error);
    return Response.json({ 
      error: error.message,
      details: 'Failed to sync Stripe subscriptions'
    }, { status: 500 });
  }
});