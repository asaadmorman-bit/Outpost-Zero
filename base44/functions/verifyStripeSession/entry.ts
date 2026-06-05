import { createClient } from 'npm:@base44/sdk@0.1.0';
import Stripe from 'npm:stripe@15.8.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const base44 = createClient({
  appId: Deno.env.get('BASE44_APP_ID'),
});

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return new Response('Unauthorized', { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    base44.auth.setToken(token);
    const user = await base44.auth.me();
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Session ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return new Response(JSON.stringify({ error: 'Invalid session ID' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Return relevant session data
    return new Response(JSON.stringify({
      customer: session.customer,
      subscription: session.subscription,
      plan: session.metadata.plan_key,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});