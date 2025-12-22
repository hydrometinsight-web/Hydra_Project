# Security Measures

This document outlines the security measures implemented in the HydroMetInsight platform.

## 1. Authentication & Authorization

### JWT Authentication
- JWT tokens with 7-day expiration
- Secure token storage in localStorage (consider httpOnly cookies for production)
- Role-based access control (admin role required)
- Token verification on all admin API routes

### Password Security
- Passwords hashed using bcryptjs
- Password validation (minimum 8 characters, letters and numbers)
- Rate limiting on login attempts (5 attempts per 15 minutes)

## 2. Input Validation & Sanitization

### Validation Functions (`lib/validation.ts`)
- **String Sanitization**: Removes null bytes, trims, and limits length
- **Email Validation**: Regex validation and sanitization
- **Slug Sanitization**: Only alphanumeric, hyphens, and underscores
- **HTML Sanitization**: Removes script tags and dangerous attributes
- **URL Validation**: Validates URL format and protocol

### Applied To:
- Login forms
- Comment submissions
- Newsletter subscriptions
- Admin content creation (categories, news, etc.)

## 3. Rate Limiting

### Implementation (`lib/rateLimit.ts`)
- In-memory rate limiting (consider Redis for production)
- IP-based identification
- Configurable windows and limits

### Current Limits:
- **Login**: 5 attempts per 15 minutes
- **Comments**: 3 submissions per minute
- **Newsletter**: 5 subscriptions per minute

## 4. Security Headers

### HTTP Security Headers (next.config.js)
- **Strict-Transport-Security**: Forces HTTPS
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-XSS-Protection**: XSS protection
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features
- **Content-Security-Policy**: Controls resource loading

## 5. API Security

### Admin API Routes
- JWT token verification on all routes
- Input sanitization and validation
- Error handling without exposing sensitive information
- Role-based access control

### Public API Routes
- Rate limiting
- Input validation
- SQL injection protection (via Prisma ORM)

## 6. Database Security

### Prisma ORM
- Parameterized queries (prevents SQL injection)
- Type-safe database access
- Connection pooling

## 7. XSS Protection

### Measures:
- HTML sanitization on user input
- Content Security Policy headers
- React's built-in XSS protection
- Dangerous HTML only rendered with `dangerouslySetInnerHTML` after sanitization

## 8. CSRF Protection

### Measures:
- SameSite cookie attributes (when using cookies)
- Origin validation
- State tokens (can be added for forms)

## 9. File Access Protection

### Middleware (`middleware.ts`)
- Blocks access to sensitive files (.env, .git, node_modules)
- Returns 404 for blocked paths

## 10. Environment Variables

### Security:
- Sensitive data stored in environment variables
- `.env` file excluded from version control
- Warning if default JWT secret is used

## 11. Content Security

### Comment Moderation
- All comments require admin approval
- HTML sanitization before storage
- Spam protection via rate limiting

## Production Recommendations

1. **Use Redis** for rate limiting instead of in-memory storage
2. **Implement httpOnly cookies** for JWT tokens
3. **Add CSRF tokens** to forms
4. **Enable HTTPS** and enforce it
5. **Regular security audits** and dependency updates
6. **Database backups** and encryption
7. **Monitoring and logging** for suspicious activities
8. **WAF (Web Application Firewall)** for additional protection
9. **Regular penetration testing**
10. **Keep dependencies updated** to patch vulnerabilities

## Reporting Security Issues

If you discover a security vulnerability, please report it to: security@hydrometinsight.com

Do not publicly disclose vulnerabilities until they have been addressed.

