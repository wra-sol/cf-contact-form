# Cloudflare Contact Form

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange.svg)](https://workers.cloudflare.com/)

A Cloudflare Workers application that provides a contact form service with Google Sheets integration. The application allows users to submit contact information which is then stored in a Google Sheet.

## Features

- Contact form with name, email, and message fields
- Google Sheets integration for data storage
- CORS support for cross-origin requests
- Secure authentication using Google Service Account
- Built with TypeScript and Cloudflare Workers

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)
- A Google Cloud Project with:
  - Google Sheets API enabled
  - A service account with appropriate permissions
  - A Google Sheet for storing submissions

## Environment Variables

1. Copy the example environment variables file:
```bash
cp .dev.vars.example .dev.vars
```

2. Update the `.dev.vars` file with your actual values:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Your Google Service Account email
- `GOOGLE_PRIVATE_KEY`: Your service account's private key
- `GOOGLE_SHEET_ID`: The ID of your Google Sheet

For detailed instructions on how to obtain these values, see the comments in `.dev.vars.example`.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cloudflare-contact-form.git
cd cloudflare-contact-form
```

2. Install dependencies:
```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8787`

## Building

To build the project:

```bash
npm run build
```

## Deployment

To deploy to Cloudflare Workers:

```bash
npm run deploy
```

## Testing

Run the test suite:

```bash
npm test
```

## Project Structure

```
cloudflare-contact-form/
├── src/
│   ├── index.ts        # Main application logic
│   └── templates/      # HTML templates
├── public/            # Static assets
├── test/             # Test files
├── wrangler.toml     # Cloudflare Workers configuration
└── package.json      # Project dependencies and scripts
```

## API Endpoints

### POST /api/submit

Submits contact form data to Google Sheets.

Request body:
```json
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

Response:
```json
{
  "success": true
}
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and follow our code style.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Open an issue in the GitHub repository
- Join our community discussions
- Check out our [documentation](docs/)

## Acknowledgments

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [TypeScript](https://www.typescriptlang.org/) 