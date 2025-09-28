import { Resend } from 'resend';
import { client } from '@/lib/sanity';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const rawResendKey = process.env.RESEND_API_KEY;
const resendKey =
    rawResendKey && !rawResendKey.includes('<YOUR_RESEND_API_KEY>')
        ? rawResendKey
        : null;

function resolveAllowedOrigin() {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
    if (explicit) return explicit;
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
    if (vercelUrl) {
        return vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`;
    }
    return '*';
}

const ALLOWED_ORIGIN = resolveAllowedOrigin();

function buildCorsHeaders(extra = {}) {
    const headers = {
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers':
            'Content-Type, Authorization, X-Requested-With, Accept',
        Allow: 'POST, OPTIONS',
        ...extra,
    };
    if (ALLOWED_ORIGIN !== '*') {
        headers['Access-Control-Allow-Credentials'] = 'true';
    }
    return headers;
}

function normalizeHeaders(headers) {
    if (!headers) return {};
    if (headers instanceof Headers) {
        return Object.fromEntries(headers.entries());
    }
    return headers;
}

function jsonResponse(body, init = {}) {
    const extraHeaders = normalizeHeaders(init.headers);
    return Response.json(body, {
        ...init,
        headers: {
            ...buildCorsHeaders(extraHeaders),
            ...extraHeaders,
        },
    });
}

export async function OPTIONS(request) {
    const requestHeaders = request.headers.get('Access-Control-Request-Headers');
    const headers = buildCorsHeaders(
        requestHeaders
            ? {
                  'Access-Control-Allow-Headers': requestHeaders,
              }
            : {}
    );
    headers['Access-Control-Max-Age'] = '86400';
    return new Response(null, {
        status: 204,
        headers,
    });
}

export async function GET() {
    return jsonResponse({ error: 'Method not allowed' }, { status: 405 });
}

export async function HEAD() {
    return new Response(null, {
        status: 405,
        headers: buildCorsHeaders(),
    });
}

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
    if (!resendKey) {
        console.warn('RESEND_API_KEY is not configured. Skipping email send.');
        return jsonResponse(
            { error: 'Email service not configured. Please try again later.' },
            { status: 503 }
        );
    }

    const resend = new Resend(resendKey);

    let parsedBody;
    try {
        parsedBody = await request.json();
    } catch (error) {
        console.error('Invalid JSON payload received:', error);
        return jsonResponse(
            { error: 'Invalid request payload' },
            { status: 400 }
        );
    }

    try {
        const { name, email, message } = parsedBody;

        // Validate required fields
        if (!name || !email || !message) {
            return jsonResponse({ error: 'All fields are required' }, { status: 400 });
        }

        // Get the destination email from Sanity CMS
        const destinationEmail = await getContactEmail();

        const sanitizedMessage = String(message)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\n/g, '<br>');

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
              ${sanitizedMessage}
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

        return jsonResponse({
            success: true,
            message: 'Email sent successfully',
            emailId: data.id,
        });
    } catch (error) {
        console.error('Error sending email:', error);

        // Return specific error messages based on the error type
        if (error.message?.includes('API key')) {
            return jsonResponse(
                { error: 'Email service configuration error' },
                { status: 500 }
            );
        }

        return jsonResponse(
            { error: 'Failed to send email. Please try again later.' },
            { status: 500 }
        );
    }
}
