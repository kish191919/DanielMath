-- Lets a signed-in parent also update their own phone, alongside
-- sms_consent/sms_consent_at from 0026, via the session-bound client from
-- updatePhoneAction. Column-level grant, not just row-level, so this can't
-- be leveraged to self-escalate role or rewrite other profiles fields via a
-- raw client call.
revoke update on profiles from authenticated;
grant update (sms_consent, sms_consent_at, phone) on profiles to authenticated;

-- profiles_update_own_sms_consent (0026) already scopes this update path
-- to auth.uid() = id at the row level; RLS row policies don't distinguish
-- by column, so no new policy is needed for the added phone column.
