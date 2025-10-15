'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Network error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldLabelClass =
        'mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground/70';
    const fieldInputClass =
        'w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
                <label htmlFor="name" className={fieldLabelClass}>
                    Name *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={fieldInputClass}
                    placeholder="Your full name"
                    autoComplete="name"
                />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
                <label htmlFor="email" className={fieldLabelClass}>
                    Email *
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={fieldInputClass}
                    placeholder="your.email@example.com"
                    autoComplete="email"
                />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
                <label htmlFor="message" className={fieldLabelClass}>
                    Message *
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className={`${fieldInputClass} resize-none`}
                    placeholder="Tell me about your photography needs, project details, or any questions you have..."
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="cta-button w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                    </span>
                ) : (
                    'Send Message'
                )}
            </button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
                <div
                    className="flex items-start gap-3 rounded-2xl border px-4 py-3"
                    style={{
                        borderColor: 'color-mix(in srgb, var(--success) 45%, transparent)',
                        backgroundColor:
                            'color-mix(in srgb, var(--success) 14%, transparent)',
                        color: 'var(--success)',
                    }}
                >
                    <CheckCircle className="h-5 w-5" />
                    <div className="space-y-1 text-sm">
                        <p className="font-semibold">Message sent successfully</p>
                        <p className="text-muted-foreground">
                            Thanks for reaching out. I’ll reply as soon as I can.
                        </p>
                    </div>
                </div>
            )}

            {submitStatus === 'error' && (
                <div
                    className="flex items-start gap-3 rounded-2xl border px-4 py-3"
                    style={{
                        borderColor: 'color-mix(in srgb, var(--error) 45%, transparent)',
                        backgroundColor:
                            'color-mix(in srgb, var(--error) 14%, transparent)',
                        color: 'var(--error)',
                    }}
                >
                    <XCircle className="h-5 w-5" />
                    <div className="space-y-1 text-sm">
                        <p className="font-semibold">Something went wrong</p>
                        <p className="text-muted-foreground">
                            Please try again or use the contact details on this page.
                        </p>
                    </div>
                </div>
            )}

            <p className="text-xs text-muted-foreground/60">
                * Required fields. Your information stays private and is only used to
                respond to your enquiry.
            </p>
        </form>
    );
}
