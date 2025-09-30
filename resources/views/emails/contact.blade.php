<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0f172a, #1e293b);
            margin: 0;
            padding: 40px 20px;
            color: #f8fafc;
            line-height: 1.6;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(30, 41, 59, 0.9);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
            backdrop-filter: blur(20px);
        }

        .email-header {
            background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
            padding: 30px;
            text-align: center;
            position: relative;
        }

        .email-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="white" opacity="0.3"/></svg>') repeat;
            opacity: 0.3;
        }

        .email-title {
            font-size: 28px;
            font-weight: 800;
            margin: 0;
            color: white;
            position: relative;
            z-index: 1;
        }

        .email-subtitle {
            font-size: 16px;
            margin: 10px 0 0 0;
            color: rgba(255, 255, 255, 0.9);
            position: relative;
            z-index: 1;
        }

        .email-body {
            padding: 40px 30px;
        }

        .contact-info {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .info-row {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .info-row:last-child {
            margin-bottom: 0;
            border-bottom: none;
        }

        .info-label {
            font-weight: 600;
            color: #06b6d4;
            width: 120px;
            flex-shrink: 0;
        }

        .info-value {
            color: #f8fafc;
            flex: 1;
        }

        .message-section {
            background: rgba(99, 102, 241, 0.1);
            border-radius: 15px;
            padding: 25px;
            border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .message-title {
            font-size: 18px;
            font-weight: 600;
            color: #6366f1;
            margin: 0 0 15px 0;
        }

        .message-content {
            color: #cbd5e1;
            background: rgba(15, 23, 42, 0.5);
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #6366f1;
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        .timestamp {
            text-align: center;
            padding: 20px;
            color: #64748b;
            font-size: 14px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer {
            background: rgba(15, 23, 42, 0.8);
            padding: 20px 30px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
        }

        .footer a {
            color: #06b6d4;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        @media (max-width: 600px) {
            body {
                padding: 20px 10px;
            }

            .email-header {
                padding: 20px;
            }

            .email-title {
                font-size: 24px;
            }

            .email-body {
                padding: 30px 20px;
            }

            .info-row {
                flex-direction: column;
                align-items: flex-start;
            }

            .info-label {
                width: auto;
                margin-bottom: 5px;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <h1 class="email-title">New Contact Submission</h1>
            <p class="email-subtitle">Portfolio Website Contact Form</p>
        </div>

        <div class="email-body">
            <div class="contact-info">
                <div class="info-row">
                    <div class="info-label">Name:</div>
                    <div class="info-value">{{ $name }}</div>
                </div>

                <div class="info-row">
                    <div class="info-label">Email:</div>
                    <div class="info-value">
                        <a href="mailto:{{ $email }}" style="color: #06b6d4; text-decoration: none;">
                            {{ $email }}
                        </a>
                    </div>
                </div>

                @if($project_type)
                <div class="info-row">
                    <div class="info-label">Project Type:</div>
                    <div class="info-value">{{ $project_type }}</div>
                </div>
                @endif

                <div class="info-row">
                    <div class="info-label">Submitted:</div>
                    <div class="info-value">{{ $submitted_at ?? now()->format('M d, Y \a\t g:i A') }}</div>
                </div>
            </div>

            <div class="message-section">
                <h3 class="message-title">Project Details</h3>
                <div class="message-content">{{ $message }}</div>
            </div>
        </div>

        <div class="timestamp">
            This message was sent via the portfolio contact form on {{ now()->format('F j, Y \a\t g:i A') }}
        </div>

        <div class="footer">
            <p>
                This email was sent from the portfolio website contact form.<br>
                Reply directly to this email to respond to {{ $name }}.
            </p>
        </div>
    </div>
</body>

</html>