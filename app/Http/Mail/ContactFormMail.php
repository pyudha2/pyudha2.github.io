<?php

namespace App\Mail;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Log;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class ContactFormMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Contact $contact;
    public $type;

    /**
     * Create a new message instance.
     */
    public function __construct(Contact $contact, string $type = 'admin')
    {
        $this->contact = $contact;
        $this->type = $type;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address'),
                config('mail.from.name')
            ),
            replyTo: [
                new Address($this->contact->email, $this->contact->name)
            ],
            subject: $this->getSubject(),
            tags: ['contact-form', 'portfolio'],
            metadata: [
                'contact_id' => $this->contact->id,
                'project_type' => $this->contact->project_type ?? 'not_specified',
                'submitted_at' => $this->contact->created_at->toISOString()
            ]
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            html: 'emails.contact',
            text: 'emails.contact-text',
            with: [
                'contact' => $this->contact,
                'projectTypeLabel' => $this->getProjectTypeLabel(),
                'submissionTime' => $this->contact->created_at->format('F j, Y \a\t g:i A T'),
                'contactUrl' => $this->getContactUrl(),
                'hasProjectType' => !empty($this->contact->project_type)
            ]
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }

    /**
     * Get email subject based on project type.
     */
    private function getSubject(): string
    {
        $projectType = $this->contact->project_type;
        $name = $this->contact->name;

        if ($projectType) {
            $typeLabel = $this->getProjectTypeLabel();
            return "New {$typeLabel} Inquiry from {$name} - Portfolio Contact";
        }

        return "New Project Inquiry from {$name} - Portfolio Contact";
    }

    /**
     * Get human-readable project type label.
     */
    private function getProjectTypeLabel(): string
    {
        $projectTypes = [
            'web-application' => 'Web Application',
            'mobile-app' => 'Mobile App',
            'e-commerce' => 'E-commerce',
            'saas-platform' => 'SaaS Platform',
            'api-development' => 'API Development',
            'consultation' => 'Consultation',
            'other' => 'Other'
        ];

        return $projectTypes[$this->contact->project_type] ?? 'General Inquiry';
    }

    /**
     * Get contact management URL (if admin panel exists).
     */
    private function getContactUrl(): ?string
    {
        // This would point to your admin panel contact view
        // Adjust the route name according to your application
        try {
            return route('admin.contacts.show', $this->contact->id);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Configure the queue connection.
     */
    public function viaQueues(): array
    {
        return [
            'mail' => 'default',
        ];
    }

    /**
     * Set retry attempts.
     */
    public function tries(): int
    {
        return 3;
    }

    /**
     * Calculate retry delay.
     */
    public function retryUntil(): \DateTime
    {
        return now()->addMinutes(10);
    }

    /**
     * Handle job failure.
     */
    public function failed(\Exception $exception): void
    {
        // Log the failure
        Log::error('Contact form email failed to send', [
            'contact_id' => $this->contact->id,
            'email' => $this->contact->email,
            'exception' => $exception->getMessage()
        ]);

        // You could also store failure information in the database
        // or trigger an alert to administrators
    }
}
