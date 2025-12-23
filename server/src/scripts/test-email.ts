// server/src/scripts/test-email.ts
import { sendVerificationEmail } from '../services/emailService';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function testEmail() {
  try {
    console.log('Sending test email...');
    await sendVerificationEmail('your-test-email@example.com', 'test-token-123');
    console.log('Test email sent successfully!');
  } catch (error) {
    console.error('Test email failed:', error);
  }
}

testEmail();