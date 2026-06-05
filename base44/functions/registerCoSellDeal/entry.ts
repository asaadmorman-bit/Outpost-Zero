import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      company_name, 
      contact_name, 
      contact_email,
      deal_size,
      description,
      microsoft_seller_email 
    } = await req.json();

    if (!company_name || !contact_email || !deal_size) {
      return Response.json({ 
        error: 'Missing required fields: company_name, contact_email, deal_size' 
      }, { status: 400 });
    }

    // Create co-sell deal record
    const deal = await base44.entities.CoSellDeal.create({
      deal_id: `COSELL-${Date.now()}`,
      company_name,
      contact_name: contact_name || 'N/A',
      contact_email,
      deal_size: parseFloat(deal_size),
      description: description || '',
      microsoft_seller_email: microsoft_seller_email || '',
      status: 'registered',
      stage: 'discovery',
      registered_by: user.email,
      registered_date: new Date().toISOString(),
      pipeline_value: parseFloat(deal_size),
      probability: 25 // Initial discovery stage
    });

    // Send notification email to partner team
    try {
      await base44.integrations.Core.SendEmail({
        to: 'partners@outpostzero.com',
        subject: `New Co-Sell Deal Registered: ${company_name}`,
        body: `
New co-sell opportunity registered:

Company: ${company_name}
Contact: ${contact_name} (${contact_email})
Deal Size: $${deal_size}
Microsoft Seller: ${microsoft_seller_email || 'Not specified'}
Registered By: ${user.email}

Description:
${description || 'No description provided'}

View in Partner Center: https://partner.microsoft.com/dashboard/referrals/v2/leads

Next Steps:
1. Acknowledge deal within 24 hours
2. Schedule discovery call
3. Prepare technical demo
        `
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the whole request if email fails
    }

    return Response.json({
      success: true,
      deal_id: deal.deal_id,
      message: 'Co-sell deal registered successfully',
      next_steps: [
        'Acknowledge deal in Partner Center',
        'Schedule discovery call with customer',
        'Prepare technical demo materials',
        'Share customer insights with Microsoft seller'
      ]
    });

  } catch (error) {
    console.error('Co-sell registration error:', error);
    return Response.json({ 
      error: error.message,
      details: 'Failed to register co-sell deal'
    }, { status: 500 });
  }
});