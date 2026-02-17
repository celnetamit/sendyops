
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const messageType = req.headers.get('x-amz-sns-message-type');
    const body = await req.json();

    if (messageType === 'SubscriptionConfirmation') {
      const subscribeUrl = body.SubscribeURL;
      if (subscribeUrl) {
        console.log(`Confirming SNS subscription: ${subscribeUrl}`);
        await fetch(subscribeUrl); // Confirm the subscription
        return NextResponse.json({ message: 'Subscription confirmed' });
      }
    } else if (messageType === 'Notification') {
      const message = JSON.parse(body.Message);
      const notificationType = message.notificationType;

      if (notificationType === 'Bounce') {
        const bounce = message.bounce;
        for (const recipient of bounce.bouncedRecipients) {
          const email = recipient.emailAddress;
          console.log(`Processing bounce for: ${email}`);
          
          // Update Subscriber
          await prisma.subscriber.updateMany({
            where: { email: email },
            data: { status: 'bounced' }
          });

          // Optional: Update Campaign stats if mail.headers contains campaign info
          // This is harder without custom headers mapping back to Campaign ID
        }
      } else if (notificationType === 'Complaint') {
        const complaint = message.complaint;
        for (const recipient of complaint.complainedRecipients) {
          const email = recipient.emailAddress;
          console.log(`Processing complaint for: ${email}`);

          // Update Subscriber
          await prisma.subscriber.updateMany({
            where: { email: email },
            data: { status: 'complained' } // We might need to handle if 'complained' isn't a valid enum/string in app logic elsewhere, but schema is String
          });
        }
      }
      
      return NextResponse.json({ message: 'Notification processed' });
    }

    return NextResponse.json({ message: 'Received' });
  } catch (error: unknown) {
    console.error('Error processing SNS message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
