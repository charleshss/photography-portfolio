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

            const rawBody = await response.text();
            let parsedBody = null;

            if (rawBody) {
                try {
                    parsedBody = JSON.parse(rawBody);
                } catch (parseError) {
                    console.error('Unexpected response payload:', rawBody);
                }
            }

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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Name *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    placeholder="Your full name"
                />
            </div>

            {/* Email Field */}
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Email *
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    placeholder="your.email@example.com"
                />
            </div>

            {/* Message Field */}
            <div>
                <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Message *
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 resize-vertical"
                    placeholder="Tell me about your photography needs, project details, or any questions you have..."
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        Sending...
                    </span>
                ) : (
                    'Send Message'
                )}
            </button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-green-800">
                                Message sent successfully!
                            </h3>
                            <p className="text-sm text-green-700 mt-1">
                                Thanks for reaching out. I'll get back to you
                                soon.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex">
                        <XCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-red-800">
                                Something went wrong
                            </h3>
                            <p className="text-sm text-red-700 mt-1">
                                Please try again or use the alternative contact
                                methods below.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <p className="text-xs text-gray-500">
                * Required fields. Your information will be kept private and
                only used to respond to your inquiry.
            </p>
        </form>
    );
}
