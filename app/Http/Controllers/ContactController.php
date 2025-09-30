<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Mail\ContactFormMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\ContactRequest;
use Illuminate\Support\Facades\RateLimiter;

class ContactController extends Controller
{
    /**
     * Store a new contact form submission
     */
    public function store(ContactRequest $request)
    {
        // Rate limiting to prevent spam
        $key = 'contact-form:' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);

            return response()->json([
                'success' => false,
                'message' => "Too many attempts. Please try again in {$seconds} seconds.",
                'retry_after' => $seconds
            ], 429);
        }

        RateLimiter::hit($key, 300); // 5 minutes decay

        try {
            // Create contact record
            $contact = Contact::create([
                'name' => $request->name,
                'email' => $request->email,
                'project_type' => $request->project_type,
                'message' => $request->message,
                'ip_address' => $request->ip(),
                'status' => Contact::STATUS_NEW,
            ]);

            // Send email notification
            $this->sendContactNotification($contact);

            // Send auto-reply to user
            $this->sendAutoReply($contact);

            return response()->json([
                'success' => true,
                'message' => 'Thank you for your message! I\'ll get back to you soon.',
                'contact_id' => $contact->id
            ]);
        } catch (\Exception $e) {
            Log::error('Contact form submission failed', [
                'error' => $e->getMessage(),
                'request_data' => $request->validated()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Sorry, there was an error sending your message. Please try again later.'
            ], 500);
        }
    }

    /**
     * Get contact statistics (for admin dashboard)
     */
    public function stats(Request $request)
    {
        $stats = [
            'total' => Contact::count(),
            'new' => Contact::new()->count(),
            'read' => Contact::read()->count(),
            'replied' => Contact::replied()->count(),
            'today' => Contact::whereDate('created_at', today())->count(),
            'this_week' => Contact::whereBetween('created_at', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->count(),
            'this_month' => Contact::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Get recent contacts (for admin dashboard)
     */
    public function recent(Request $request)
    {
        $limit = $request->get('limit', 10);

        $contacts = Contact::recent()
            ->take($limit)
            ->get();

        return response()->json($contacts);
    }

    /**
     * Mark contact as read
     */
    public function markAsRead(Contact $contact)
    {
        $contact->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Contact marked as read',
            'contact' => $contact->fresh()
        ]);
    }

    /**
     * Mark contact as replied
     */
    public function markAsReplied(Contact $contact)
    {
        $contact->markAsReplied();

        return response()->json([
            'success' => true,
            'message' => 'Contact marked as replied',
            'contact' => $contact->fresh()
        ]);
    }

    /**
     * Send contact notification email to admin
     */
    protected function sendContactNotification(Contact $contact)
    {
        try {
            Mail::to(config('mail.admin_email', 'alex@example.com'))
                ->send(new ContactFormMail($contact, 'admin'));
        } catch (\Exception $e) {
            Log::error('Failed to send contact notification email', [
                'error' => $e->getMessage(),
                'contact_id' => $contact->id
            ]);
        }
    }

    /**
     * Send auto-reply email to user
     */
    protected function sendAutoReply(Contact $contact)
    {
        try {
            Mail::to($contact->email)
                ->send(new ContactFormMail($contact, 'user'));
        } catch (\Exception $e) {
            Log::error('Failed to send auto-reply email', [
                'error' => $e->getMessage(),
                'contact_id' => $contact->id
            ]);
        }
    }
}
