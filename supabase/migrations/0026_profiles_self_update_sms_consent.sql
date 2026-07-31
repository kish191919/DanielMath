-- Lets a signed-in user update only their own sms_consent/sms_consent_at,
-- via the session-bound (anon-key) client from updateSmsConsentAction.
-- Column-level grant, not just row-level, so this can't be leveraged to
-- self-escalate role or rewrite other profiles fields via a raw client call.
revoke update on profiles from authenticated;
grant update (sms_consent, sms_consent_at) on profiles to authenticated;

create policy "profiles_update_own_sms_consent" on profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
