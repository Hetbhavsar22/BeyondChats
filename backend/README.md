# BeyondChats Email Dashboard - Backend

This is the Laravel API backend for the BeyondChats Email Dashboard assignment. 

## Capabilities
- Secure Google OAuth 2.0 Integration & Token Management
- Gmail API Integration: Fast synchronized fetching of Inbox and Sent emails.
- Intelligent Email Parsing: Safely extracts headers, decodes base64 bodies, and preserves native HTML.
- Direct Email Replies via Gmail API.
- Database Caching: Stores synced emails in an Eloquent tracked SQLite/MySQL database to minimize API calls.

## Setup
All primary documentation, environment variables, and setup instructions are located in the [Root README](../README.md).

To run this backend locally:
1. Run `composer install`
2. Configure `.env` with Google Auth credentials.
3. Run `php artisan migrate`
4. Start the server with `php artisan serve`

The API will be available at `http://127.0.0.1:8000`.
