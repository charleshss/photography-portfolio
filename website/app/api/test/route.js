export async function GET() {
    console.log('Test GET route called');
    return Response.json({
        message: 'Test route working!',
        timestamp: new Date().toISOString(),
        env_check: {
            hasResendKey: !!process.env.RESEND_API_KEY,
            nodeEnv: process.env.NODE_ENV
        }
    });
}

export async function POST() {
    console.log('Test POST route called');
    return Response.json({
        message: 'Test POST working!',
        timestamp: new Date().toISOString()
    });
}