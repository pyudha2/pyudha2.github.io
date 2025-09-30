<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'min:2',
                'regex:/^[a-zA-Z\s]+$/'
            ],
            'email' => [
                'required',
                'email:rfc,dns',
                'max:255'
            ],
            'project_type' => [
                'nullable',
                'string',
                'max:100',
                'in:web-application,mobile-app,e-commerce,saas-platform,api-development,consultation,other'
            ],
            'message' => [
                'required',
                'string',
                'min:10',
                'max:2000'
            ]
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please tell us your name.',
            'name.min' => 'Your name should be at least 2 characters.',
            'name.regex' => 'Please enter a valid name (letters and spaces only).',
            'email.required' => 'We need your email to get back to you.',
            'email.email' => 'Please enter a valid email address.',
            'project_type.in' => 'Please select a valid project type.',
            'message.required' => 'Please tell us about your project.',
            'message.min' => 'Please provide more details about your project (at least 10 characters).',
            'message.max' => 'Your message is too long. Please keep it under 2000 characters.'
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'full name',
            'email' => 'email address',
            'project_type' => 'project type',
            'message' => 'project description'
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim($this->name ?? ''),
            'email' => strtolower(trim($this->email ?? '')),
            'project_type' => $this->project_type ?: null,
            'message' => trim($this->message ?? ''),
        ]);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Check for spam patterns
            if ($this->containsSpam($this->message)) {
                $validator->errors()->add('message', 'Your message appears to contain spam content.');
            }

            // Check for too many URLs
            if ($this->containsTooManyUrls($this->message)) {
                $validator->errors()->add('message', 'Please limit the number of URLs in your message.');
            }
        });
    }

    /**
     * Check if message contains spam patterns.
     */
    private function containsSpam(string $message): bool
    {
        $spamPatterns = [
            '/\b(viagra|cialis|loan|casino|poker|gambling)\b/i',
            '/\b(click here|buy now|limited time|act now)\b/i',
            '/\$\d+.*\b(guaranteed|instant|easy money)\b/i',
            '/\b(work from home|make money fast|get rich quick)\b/i'
        ];

        foreach ($spamPatterns as $pattern) {
            if (preg_match($pattern, $message)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if message contains too many URLs.
     */
    private function containsTooManyUrls(string $message): bool
    {
        $urlCount = preg_match_all('/https?:\/\/[^\s]+/', $message);
        return $urlCount > 2;
    }
}
