// Email service utilities
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  // Simulated email sending
  console.log(`Verification code ${code} sent to ${email}`);
  return true;
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  // Simulated email sending
  console.log(`Password reset link sent to ${email}`);
  return true;
}


