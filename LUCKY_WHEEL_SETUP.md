# Lucky Wheel Feature Setup Guide

## Overview
The Lucky Wheel feature allows users to spin a wheel daily and earn AIDLA coins. Admins can configure the wheel pieces, probabilities, entry fees, and daily limits.

## Database Setup (IMPORTANT - DO THIS FIRST)

1. Go to your Supabase Project Dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the entire content of `SQL_SETUP.sql` into the editor
5. Click **Run** to execute all the setup queries

This will create:
- ✅ `users_transactions` - Track all user transactions
- ✅ `admin_pool` - Manage admin's coin pool
- ✅ `admin_pool_transactions` - Admin transaction history
- ✅ `lucky_wheel_config` - Wheel configuration (admin controlled)
- ✅ `lucky_wheel_slices` - Wheel pieces/slices (8 pieces by default)
- ✅ `lucky_wheel_spins` - User spin history and results
- ✅ Tables with proper indexes, constraints, and security policies

## Components

### 1. User Side: `/user/lucky-wheel` (LuckyWheel.jsx)
**Features:**
- Visual wheel display
- Spin button (daily limit enforced)
- Daily spin counter
- Pending coins display
- Claim coins button
- Last spin result display
- Entry fee info (if any)

**User Flow:**
```
1. User visits Lucky Wheel page
2. Fetches wheel config and user spin data
3. Can spin if daily limit not reached
4. Wins coins/gift/extra chance/try again
5. Coins go to "coins_earned_from_LW" (pending)
6. User clicks "Claim" to transfer to total coins
7. Transaction created with unique number
```

### 2. Admin Side (TO BE CREATED): `/admin/lucky-wheel`
**Features:**
- Configure wheel slices (4, 6, 8, etc. pieces)
- Set probability for each slice
- Set guaranteed winning slice (if needed)
- Set rewards (coins, gifts, extra chance, try again)
- Set entry fee (free or paid)
- Set max spins per day per user
- View all user spins and claims
- View admin pool balance
- View transaction history

## Admin Configuration

### Sample Wheel Slices (Pre-loaded):
```
1. 🎉 500 Coins (15% probability)
2. 💎 1000 Coins (10% probability)
3. 🎁 Gift Card (8% probability)
4. ⭐ Try Again! (20% probability)
5. 🚀 2000 Coins (5% probability)
6. 🛍️ Shop Voucher (12% probability)
7. 🔥 +1 Chance (18% probability)
8. 💰 100 Coins (12% probability)
```

Total: 100% (probabilities must sum to 100)

### Default Config:
- Max spins per day: **1**
- Entry fee: **Free (true)**
- Entry is entry-free by default

## RPC Functions Available

### 1. `spin_lucky_wheel(user_id_param uuid)`
Called when user clicks SPIN button. Returns:
- `reward` - Label of winning piece
- `result_message` - Message displayed to user
- `reward_type` - Type (coins/gift/try_again/extra_chance)
- `reward_value` - Value/ID of reward
- `spin_id` - Spin record ID

**Process:**
1. Check daily spin limit
2. Select winning slice (based on probability or guaranteed)
3. Create spin record
4. If coins: add to `coins_earned_from_LW` and deduct from admin pool
5. Return result

### 2. `claim_lucky_wheel_coins(user_id_param uuid)`
Called when user clicks CLAIM button. Returns:
- `message` - Confirmation message
- `coins_claimed` - Amount claimed

**Process:**
1. Get user's `coins_earned_from_LW`
2. Create transaction with unique `txn_no`
3. Transfer coins to `total_aidla_coins`
4. Reset `coins_earned_from_LW` to 0
5. Create admin pool transaction record

## Transaction History

### User Transaction Record:
```
{
  txn_no: "TXN-20260222143022-a1b2c3d4",
  user_id: "user-uuid",
  user_email: "user@example.com",
  txn_type: "lucky_wheel",
  direction: "in",
  amount: 500.00000,
  balance_before: 1000.00000,
  balance_after: 1500.00000,
  note: "Claimed coins from Lucky Wheel",
  created_at: "2026-02-22T14:30:22Z"
}
```

### Admin Pool Transaction Record:
```
{
  txn_no: "ADMIN-20260222143022-xyz",
  txn_type: "lucky_wheel_payout",
  direction: "out",
  amount: 500.00000,
  admin_email: "admin@aidla.com",
  target_user_id: "user-uuid",
  target_user_email: "user@example.com",
  target_user_name: "User Name",
  pool_balance_before: 99999500.00000,
  pool_balance_after: 99999000.00000,
  note: "Lucky Wheel spin payout to user"
}
```

## Data Flow Diagram

```
User Spins Wheel
       ↓
spin_lucky_wheel() RPC
       ↓
Check daily limit ✓
Select winning slice ✓
Create lucky_wheel_spins record ✓
       ↓
If coins won:
  ├─ users_profiles.coins_earned_from_LW += coins
  └─ admin_pool.total_aidla_coins -= coins
       ↓
Return result to user

---

User Claims Coins
       ↓
claim_lucky_wheel_coins() RPC
       ↓
Get coins_earned_from_LW
Generate unique txn_no
       ↓
Create users_transactions record ✓
Create admin_pool_transactions record ✓
       ↓
users_profiles.total_aidla_coins += claimed coins ✓
users_profiles.coins_earned_from_LW = 0 ✓
admin_pool.total_aidla_coins -= claimed coins ✓
       ↓
Return confirmation to user
```

## Security Features

✅ Row Level Security (RLS):
- Users can only view their own transactions and spins
- All sensitive operations protected

✅ Constraints:
- Blockchain-style transaction numbers (unique, immutable)
- Amount checks (>0)
- Daily spin limits enforced
- Users cannot directly edit coin balances

✅ Triggers:
- Automatic `updated_at` timestamp
- Block direct coin edits
- Referral count auto-increment

## Testing Checklist

- [ ] Database setup completed
- [ ] Can access LuckyWheel page
- [ ] Can spin wheel (within daily limit)
- [ ] Coins appear in "Pending Coins"
- [ ] Multiple spins blocked after daily limit
- [ ] Can claim coins
- [ ] Transaction appears in wallet history
- [ ] Admin pool balance decreased
- [ ] User coins increased

## Next Steps

1. ✅ Run SQL_SETUP.sql in Supabase
2. ⏳ Create Admin Lucky Wheel page:
   - Configure slices
   - Set probabilities
   - Set entry fee
   - View transaction history
   - Manage admin pool
3. ⏳ Add Lucky Wheel tab to UserLayout navigation
4. ⏳ Enhanced animations and graphics

## Troubleshooting

**Issue: "No spins left for today"**
- Check lucky_wheel_config.max_spins_per_day
- Verify user's spin count for today

**Issue: Coins not deducted from pool**
- Verify admin_pool exists with initial balance
- Check if reward_type is 'coins'

**Issue: RLS Policy errors**
- Ensure user is authenticated
- Check row_security settings enabled on tables

**Issue: Function not found**
- Verify all functions were created in SQL_SETUP.sql
- Check schema.function permissions

---

**Created:** February 22, 2026  
**Version:** 1.0
