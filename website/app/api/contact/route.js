import { Resend } from 'resend';
import { client } from '@/lib/sanity';

const resend = new Resend(process.env.RESEND_API_KEY);

async function getContactEmail() {
    try {
        const contactData = await client.fetch(
            `*[_type == "contactPageNew" && _id == "contactPageNew"][0]{
        email
      }`
        );
        return contactData?.email || 'contact@samuelss.photography';
    } catch (error) {
        console.log('Sanity CMS not available, using fallback email');
        return 'contact@samuelss.photography';
    }
}

export async function POST(request) {
    try {
        const { name, email, message } = await request.json();

        // Validate required fields
        if (!name || !email || !message) {
            return Response.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Get the destination email from Sanity CMS
        const destinationEmail = await getContactEmail();

        // Send email using Resend
        const data = await resend.emails.send({
            from: 'Samuel Photography <contact@samuelss.photography>', // Using your official email
            to: [destinationEmail],
            subject: `New Contact Form Message from ${name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">Message:</h3>
            <div style="background-color: #ffffff; padding: 15px; border: 1px solid #d1d5db; border-radius: 6px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>This message was sent through the contact form on your photography portfolio website.</p>
            <p>Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
            replyTo: email, // This allows you to reply directly to the sender
        });

        return Response.json({
            success: true,
            message: 'Email sent successfully',
            emailId: data.id,
        });
    } catch (error) {
        console.error('Error sending email:', error);

        // Return specific error messages based on the error type
        if (error.message?.includes('API key')) {
            return Response.json(
                { error: 'Email service configuration error' },
                { status: 500 }
            );
        }

        return Response.json(
            { error: 'Failed to send email. Please try again later.' },
            { status: 500 }
        );
    }
}
