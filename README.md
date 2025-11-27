# Car Loan Navigator

A React application for calculating car loan options with multi-language support.

## Description

This application helps users calculate and compare car loan options from different banks based on their financial situation. It now supports both English and Malay languages with a convenient language toggle feature.

## Features

- Browse available cars
- Calculate loan options from multiple banks
- Compare interest rates and monthly payments
- User authentication and profiles
- Admin dashboard for managing cars and users
- **Multi-language support (English and Malay)**
- **Language toggle button in the navigation bar**
- **Persistent language preference using localStorage**

## Deployment

To deploy this application to Wasmer:

1. Build the application:
   ```bash
   npm run build
   ```

2. Publish to Wasmer:
   ```bash
   wasmer publish
   ```

## Language Support

The application now includes full localization support for:
- English (default)
- Malay (Bahasa Melayu)

Users can toggle between languages using the globe icon in the top navigation bar. The selected language preference is automatically saved and will be remembered on future visits.

## License

MIT