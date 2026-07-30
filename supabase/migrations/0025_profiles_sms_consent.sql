-- SMS consent for guardian notification texts, required for Twilio A2P
-- 10DLC campaign approval. Defaults to false so any phone number written
-- outside the signup checkbox (e.g. updateGuardianPhoneAction, principal-
-- entered) never triggers SMS until the guardian consents.
alter table profiles add column sms_consent boolean not null default false;
alter table profiles add column sms_consent_at timestamptz;
