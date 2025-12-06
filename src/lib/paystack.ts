// Paystack configuration and utilities

export interface PaystackConfig {
  publicKey: string;
  email: string;
  amount: number; // in kobo (multiply by 100)
  ref: string;
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string | number;
    }>;
  };
  split_code?: string;
  onSuccess: (reference: any) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export const initializePaystack = (config: PaystackConfig) => {
  if (typeof window === 'undefined') return;

  const handler = window.PaystackPop.setup({
    key: config.publicKey,
    email: config.email,
    amount: config.amount,
    ref: config.ref,
    metadata: config.metadata,
    split_code: config.split_code,
    onClose: config.onClose,
    callback: config.onSuccess,
  });

  handler.openIframe();
};

export const generatePaymentReference = () => {
  return `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
