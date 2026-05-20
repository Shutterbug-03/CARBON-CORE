import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';


/**
 * Evident Registry Webhook Endpoint
 * 
 * This endpoint receives asynchronous notifications from the Evident Registry.
 * Examples of events:
 * - ISSUANCE_COMPLETED: I-RECs have been successfully minted into the Carbon UPI custodial account.
 * - DEVICE_APPROVED: A newly registered solar plant was approved by the local issuer.
 * - ISSUANCE_REJECTED: The generation data was deemed invalid.
 */

export async function POST(req: Request) {
    try {
        // 1. Verify Webhook Signature (Security is critical here)
        // const signature = req.headers.get('x-evident-signature');
        // if (!verifySignature(signature, req.body)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload = await req.json();
        const eventType = payload.eventType;

        console.log(`[Webhook] Received Evident Event: ${eventType}`);

        // 2. Handle Event Types
        switch (eventType) {
            case 'ISSUANCE_COMPLETED':
                await handleIssuanceCompleted(payload.data);
                break;
            case 'DEVICE_APPROVED':
                await handleDeviceApproved(payload.data);
                break;
            default:
                console.log(`[Webhook] Unhandled event type: ${eventType}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error("[Webhook Error]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * Handle when I-RECs are successfully minted.
 * We must update the platform database to reflect the new assets in the user's wallet.
 */
async function handleIssuanceCompleted(data: any) {
    const { requestId, deviceId, volumeMwh, certificateIds } = data;

    // In a real app, you would look up the Entity ID associated with this deviceId
    console.log(`[Webhook] Issuance Complete! ${volumeMwh} I-RECs minted for Request ${requestId}`);

    // Pseudo-code for DB updates:
    // 1. Create records in `public.certificates` for the new I-RECs
    // 2. Update `public.wallets` to add the volumeMwh to the entity's iRecs balance
    // 3. Mark the internal Issuance Request as 'COMPLETED'
    
    /*
    await supabaseAdmin.from('certificates').insert(
        certificateIds.map(id => ({
            certificate_id: id,
            entity_id: '...', // from device lookup
            project_name: '...', // from device lookup
            project_type: 'I-REC',
            carbon_reduced: volumeMwh, // Technically MWh, but tracked in similar asset tables
            status: 'ISSUED',
            // ... metadata
        }))
    );

    // Update wallet
    await supabaseAdmin.rpc('increment_wallet_irecs', { 
        entity_uuid: '...', 
        amount: volumeMwh 
    });
    */
}

/**
 * Handle when a newly registered facility is approved.
 */
async function handleDeviceApproved(data: any) {
    const { deviceId, status } = data;
    console.log(`[Webhook] Device ${deviceId} has been ${status}.`);

    // Pseudo-code for DB update:
    // await supabaseAdmin.from('assets').update({ metadata: { evident_status: 'ACTIVE' } }).eq('metadata->evident_device_id', deviceId);
}
