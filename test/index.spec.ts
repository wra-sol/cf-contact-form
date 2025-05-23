import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import worker from '../src/index';
import { API_ENDPOINTS } from '../src/config/constants';
import { ApiResponse } from '../src/utils/response';

// Mock environment variables
const mockEnv = {
	GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@example.com',
	GOOGLE_PRIVATE_KEY: 'test-key',
	GOOGLE_SHEET_ID: 'test-sheet-id',
};

describe('Contact Form Worker', () => {
	beforeEach(() => {
		// Reset any mocks or state before each test
		vi.clearAllMocks();
	});

	describe('Form Serving', () => {
		it('serves the contact form HTML for root path', async () => {
			const request = new Request('http://example.com/');
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, mockEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(200);
			expect(response.headers.get('Content-Type')).toBe('text/html');
			const html = await response.text();
			expect(html).toContain('Contact Us');
			expect(html).toContain('name="name"');
			expect(html).toContain('name="email"');
			expect(html).toContain('name="message"');
		});
	});

	describe('Form Submission', () => {
		it('handles CORS preflight request', async () => {
			const request = new Request('http://example.com' + API_ENDPOINTS.SUBMIT, {
				method: 'OPTIONS',
			});
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, mockEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(200);
			expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
			expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
			expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
		});

		it('rejects non-POST methods', async () => {
			const request = new Request('http://example.com' + API_ENDPOINTS.SUBMIT, {
				method: 'GET',
			});
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, mockEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(405);
		});

		it('validates required fields', async () => {
			const request = new Request('http://example.com' + API_ENDPOINTS.SUBMIT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({}),
			});
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, mockEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(400);
			const data = await response.json() as ApiResponse;
			expect(data.success).toBe(false);
			expect(data.error).toBe('Name is required');
		});

		it('validates email format', async () => {
			const request = new Request('http://example.com' + API_ENDPOINTS.SUBMIT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: 'Test User',
					email: 'invalid-email',
					message: 'Test message',
				}),
			});
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, mockEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(400);
			const data = await response.json() as ApiResponse;
			expect(data.success).toBe(false);
			expect(data.error).toBe('Invalid email format');
		});

		it('validates field length limits', async () => {
			const request = new Request('http://example.com' + API_ENDPOINTS.SUBMIT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: 'a'.repeat(101), // Exceeds 100 character limit
					email: 'test@example.com',
					message: 'Test message',
				}),
			});
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, mockEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(400);
			const data = await response.json() as ApiResponse;
			expect(data.success).toBe(false);
			expect(data.error).toBe('Name must be less than 100 characters');
		});

		it('handles successful form submission', async () => {
			const request = new Request('http://example.com' + API_ENDPOINTS.SUBMIT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: 'Test User',
					email: 'test@example.com',
					message: 'Test message',
				}),
			});
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, mockEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(200);
			const data = await response.json() as ApiResponse;
			expect(data.success).toBe(true);
		});
	});
});
