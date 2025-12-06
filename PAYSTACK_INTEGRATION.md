# Paystack Payment Integration with Splitting

## Overview
This integration allows attendees to purchase event tickets with automatic payment splitting between the platform and event organizers.

## Features Implemented

### 1. Payment Processing
- **Free Events**: Instant ticket registration without payment
- **Paid Events**: Paystack checkout with payment splitting
- Platform fee: 5% of ticket price
- Organizer receives: 95% of ticket price

### 2. Payment Splitting
- Uses Paystack Subaccounts for automatic splitting
- Transaction charge is borne by the subaccount (organizer)
- Platform collects 5% fee on every paid ticket

### 3. Ticket Management
- Unique ticket codes generated for each purchase
- Ticket status tracking (pending/confirmed)
- Automatic inventory management (tickets sold count)

## Setup Instructions

### 1. Get Paystack API Keys
1. Sign up at https://paystack.com
2. Go to Settings > API Keys & Webhooks
3. Copy your **Public Key** and **Secret Key**
4. Add to `.env.local`:
```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

### 2. Create Subaccounts for Organizers

Each event organizer needs a Paystack subaccount to receive their split:

**Using Paystack API:**
```bash
curl https://api.paystack.co/subaccount \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "business_name": "Organizer Name",
    "settlement_bank": "044",
    "account_number": "0123456789",
    "percentage_charge": 5
  }' \\
  -X POST
```

**Response will include:**
- `subaccount_code`: e.g., `ACCT_xxxxxxxxxx`
- Store this code in the organizer's profile

### 3. Update Database Schema

Add Paystack subaccount field to users table:

```sql
ALTER TABLE users ADD COLUMN paystack_subaccount_code VARCHAR(50);
```

Or update Prisma schema:
```prisma
model User {
  // ... existing fields
  paystackSubaccountCode String? @map("paystack_subaccount_code") @db.VarChar(50)
}
```

Then run:
```bash
npx prisma migrate dev --name add_paystack_subaccount
npx prisma generate
```

### 4. Configure Webhook

Set up webhook to receive payment notifications:

1. Go to Paystack Dashboard > Settings > API Keys & Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/paystack`
3. The webhook will update ticket status upon successful payment

## Usage Flow

### For Attendees:
1. Browse events on `/discover`
2. Click on event to view details
3. Click "Purchase Ticket" or "Register for Free"
4. **Free Events**: Ticket created immediately
5. **Paid Events**:
   - Paystack checkout modal opens
   - Enter card details
   - Payment processed with 5% platform fee
   - Ticket created upon successful payment

### For Organizers:
1. Create event with ticket price
2. Platform automatically splits payment:
   - Organizer receives 95% to their subaccount
   - Platform keeps 5% as commission
3. View ticket sales in dashboard

## Payment Splitting Example

**Ticket Price: ₦10,000**
- Organizer receives: ₦9,500 (95%)
- Platform fee: ₦500 (5%)
- Paystack fee: ~₦150 (1.5% + ₦100)
- *Paystack fee is deducted from organizer's portion*

## API Endpoints

### Purchase Ticket
```
POST /api/tickets/purchase
Body: {
  userId: number,
  eventId: number,
  paymentReference: string,
  amount: number,
  paymentStatus: "success" | "pending"
}
```

### Paystack Webhook
```
POST /api/webhooks/paystack
Headers: {
  x-paystack-signature: string
}
```

## Files Created/Modified

### New Files:
- `src/lib/paystack.ts` - Paystack utilities
- `src/app/api/tickets/purchase/route.ts` - Ticket purchase API
- `src/app/api/webhooks/paystack/route.ts` - Webhook handler

### Modified Files:
- `src/app/events/[id]/page.tsx` - Added payment integration
- `.env.local` - Added Paystack keys

## Testing

### Test Cards (Paystack Test Mode):
- **Success**: 4084084084084081
- **Insufficient Funds**: 5060666666666666666
- **Declined**: 408408408408

**CVV**: Any 3 digits
**Expiry**: Any future date
**PIN**: 0000

## Security Notes

1. **Never expose secret key** in client-side code
2. **Verify webhook signatures** to prevent fraud
3. **Use HTTPS** in production
4. **Validate all inputs** before processing

## Next Steps

1. Add Paystack keys to environment variables
2. Create subaccounts for existing organizers
3. Test payment flow in test mode
4. Set up webhook URL
5. Switch to live keys for production

## Support

- Paystack Docs: https://paystack.com/docs
- Subaccounts: https://paystack.com/docs/payments/subaccounts
- Split Payments: https://paystack.com/docs/payments/split-payments
