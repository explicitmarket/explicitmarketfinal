# Signal Templates Database Setup Guide

## Overview
Signal templates are now managed in Supabase and synced across the app. Admins create signals, users can subscribe to them.

## Database Setup

### Step 1: Create the Table
Run this SQL in your Supabase SQL Editor:

```sql
DROP TABLE IF EXISTS signal_templates CASCADE;

CREATE TABLE signal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name TEXT NOT NULL,
  description TEXT NOT NULL,
  symbol TEXT NOT NULL,
  confidence DECIMAL(5, 2) NOT NULL,
  followers INTEGER NOT NULL DEFAULT 0,
  cost DECIMAL(10, 2) NOT NULL,
  win_rate DECIMAL(5, 2) NOT NULL,
  trades INTEGER NOT NULL DEFAULT 0,
  avg_return DECIMAL(5, 2) NOT NULL,
  created_by TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE signal_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view active signal templates"
  ON signal_templates FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage signal templates"
  ON signal_templates FOR ALL
  USING (
    auth.uid()::text = 'admin-1' OR
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE INDEX idx_signal_templates_active ON signal_templates(is_active);
CREATE INDEX idx_signal_templates_symbol ON signal_templates(symbol);
CREATE INDEX idx_signal_templates_confidence ON signal_templates(confidence);
```

## How It Works

### Admin Creates Signal
1. **Admin Panel** → **Signal Management**
2. Fill in form:
   - **Provider Name**: e.g., "FX Master Pro"
   - **Description**: Signal service details
   - **Trading Pair/Symbol**: e.g., "EURUSD"
   - **Confidence Level (0-100)**: e.g., 85
   - **Followers**: e.g., 1250
   - **Subscription Cost ($)**: e.g., 59.99
   - **Win Rate (%)**: e.g., 78
   - **Total Signals Provided**: e.g., 342
   - **Average Return (%)**: e.g., 24.5
3. Click **Create Signal**
4. Signal is saved to `signal_templates` table
5. Toggle **Active/Inactive** to show/hide from users

### User Finds Signal
1. **Signals Marketplace**
2. See all **active** signals from database
3. Click to subscribe
4. Signal added to their portfolio

## Database Schema

```
signal_templates {
  id: UUID                         (Primary Key)
  provider_name: TEXT              (e.g., "FX Master Pro")
  description: TEXT                (Service details)
  symbol: TEXT                     (e.g., "EURUSD")
  confidence: DECIMAL              (0-100, e.g., 85.00)
  followers: INTEGER               (e.g., 1250)
  cost: DECIMAL                    (e.g., 59.99)
  win_rate: DECIMAL                (e.g., 78.00)
  trades: INTEGER                  (e.g., 342)
  avg_return: DECIMAL              (e.g., 24.50)
  created_by: TEXT                 (Admin user ID)
  is_active: BOOLEAN               (true = visible to users)
  created_at: TIMESTAMP WITH TZ    (Auto)
  updated_at: TIMESTAMP WITH TZ    (Auto)
}
```

## Store Functions

### Add Signal
```typescript
await addSignalTemplate(
  providerName: string,
  description: string,
  symbol: string,
  confidence: number,
  followers: number,
  cost: number,
  winRate: number,
  trades: number,
  avgReturn: number
)
```

### Edit Signal
```typescript
await editSignalTemplate(signalId: string, updates: Partial<SignalTemplate>)
```

### Delete Signal
```typescript
await deleteSignalTemplate(signalId: string)
```

## Data Flow

```
Admin creates/edits signal in UI
    ↓
Function calls Supabase API
    ↓
Data saved to signal_templates table
    ↓
Store state updates
    ↓
Admin page refreshes
    ↓
Regular users see active signals
```

## What Users See

✅ Only **active** signals (`is_active = true`)
✅ All fields: provider name, symbol, confidence, cost, win rate, etc.
✅ Can filter by symbol, confidence, cost, performance
✅ Can subscribe and activate signals

What users DON'T see:
❌ Inactive signals
❌ Deleted signals
❌ Signal management tools (admin only)

## Testing Checklist

- [ ] Create `signal_templates` table with SQL above
- [ ] Admin logs in
- [ ] Admin goes to **Signal Management**
- [ ] Admin adds a new signal with all fields
- [ ] Check Supabase → `signal_templates` table has the signal
- [ ] Signal shows in admin panel
- [ ] Admin edits signal
- [ ] Changes saved to database
- [ ] Admin deactivates signal
- [ ] User no longer sees signal in marketplace
- [ ] Admin deletes signal
- [ ] Signal is gone from Supabase
- [ ] Regular user logs in
- [ ] User sees active signals in marketplace
- [ ] User can subscribe to signal

## Comparison with Bots

Both follow the same pattern:

| Feature | Bots | Signals |
|---------|------|---------|
| Table | `bot_templates` | `signal_templates` |
| Price | ✅ Yes | ✅ Yes (cost) |
| Performance | ✅ Yes | ✅ Yes (avg_return) |
| Win Rate | ✅ Yes | ✅ Yes |
| Trades | ✅ Yes | ✅ Yes |
| Risk Level | ✅ Yes (Low/Med/High) | ❌ No |
| Confidence | ❌ No | ✅ Yes (0-100) |
| Followers | ❌ No | ✅ Yes |
| Symbol | ❌ No | ✅ Yes |
| Admin Manage | ✅ Full control | ✅ Full control |
| User View | ✅ Active only | ✅ Active only |

## Notes

- All signal operations are **async** and sync with Supabase in real-time
- Signals are created by admin with `created_by = admin_user_id`
- Active signals automatically appear in user marketplace
- Deactivate instead of delete to hide signals without losing data
- All timestamps are UTC
- Confidence level range: 0-100 (represents signal accuracy/reliability)
