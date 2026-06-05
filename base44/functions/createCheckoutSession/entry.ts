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

    const { priceId, planName, successUrl, cancelUrl } = await req.json();

    if (!priceId || !successUrl || !cancelUrl) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: priceId, successUrl, cancelUrl' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create or retrieve Stripe customer
    let customer;
    try {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1
      });

      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: user.email,
          name: user.full_name,
          metadata: {
            user_id: user.id,
            outpost_zero_user: 'true'
          }
        });
      }
    } catch (error) {
      console.error('Error creating/retrieving customer:', error);
      return new Response(JSON.stringify({ error: 'Customer creation failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        plan_name: planName,
        user_id: user.id,
        user_email: user.email,
        outpost_zero_subscription: 'true'
      },
      subscription_data: {
        metadata: {
          plan_name: planName,
          user_id: user.id,
          outpost_zero_origin: 'true'
        },
        trial_period_days: 7, // 7-day free trial
      },
      allow_promotion_codes: true,
    });

    return new Response(JSON.stringify({
      sessionId: session.id,
      sessionUrl: session.url,
      customerId: customer.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to create checkout session' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});