SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict fwAW18Nv1b1NQBZUHFPzpyEHbtBVQGcWa7Qkvj5hJD1vuFcQf02UXboRVDweNat

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '18b2340a-fcc3-4bad-bce4-81c250735e47', 'authenticated', 'authenticated', 'admin@dsystems.co.il', '$2a$10$m0LnTijfZTAB.jMKu3SNbep.Mw/1z0rwLEzZqiULmFaY8TeJutWOK', '2026-05-02 22:11:17.223421+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-02 22:12:38.026408+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-02 22:11:17.204617+00', '2026-05-02 22:12:38.048729+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', 'authenticated', 'authenticated', 'demo@synq.co.il', '$2a$10$5.rZgYZOzeEy6PG4O.fojOtborBZAApEvVFmXF5h3Dy6VH8gjusTK', '2026-05-02 23:13:35.236648+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-19 23:41:53.607184+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-02 23:13:35.214871+00', '2026-05-19 23:44:40.812686+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('18b2340a-fcc3-4bad-bce4-81c250735e47', '18b2340a-fcc3-4bad-bce4-81c250735e47', '{"sub": "18b2340a-fcc3-4bad-bce4-81c250735e47", "email": "admin@dsystems.co.il", "email_verified": false, "phone_verified": false}', 'email', '2026-05-02 22:11:17.220529+00', '2026-05-02 22:11:17.220589+00', '2026-05-02 22:11:17.220589+00', '4af8d596-f0bd-4e15-82ff-8cd5308e1c0b'),
	('a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '{"sub": "a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d", "email": "demo@synq.co.il", "email_verified": false, "phone_verified": false}', 'email', '2026-05-02 23:13:35.233757+00', '2026-05-02 23:13:35.233817+00', '2026-05-02 23:13:35.233817+00', '9c71103d-9296-4739-ac6e-8229f701e8d5');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('34515a5f-331a-48e9-84ff-7656e693f479', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-02 23:18:30.940685+00', '2026-05-02 23:18:30.940685+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '62.56.235.231', NULL, NULL, NULL, NULL, NULL),
	('ae4ca87e-9e9b-47b4-8ca9-b7a95230c419', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-02 23:20:04.55588+00', '2026-05-19 17:24:13.222238+00', NULL, 'aal1', NULL, '2026-05-19 17:24:13.222124', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('e7845a9d-2c79-48ba-b704-df2c7e83f698', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 17:24:14.852564+00', '2026-05-19 21:49:36.911665+00', NULL, 'aal1', NULL, '2026-05-19 21:49:36.911546', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('8e9878c0-606f-418d-a7fb-b552ed30cd3a', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 21:49:42.934565+00', '2026-05-19 21:49:42.934565+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('a983f157-3b4e-4720-8310-a3efa75c451c', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-02 23:24:20.942894+00', '2026-05-19 21:58:41.11489+00', NULL, 'aal1', NULL, '2026-05-19 21:58:41.114762', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('6d232c62-bad3-4bbb-874b-a5373613150a', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 22:29:09.741657+00', '2026-05-19 22:29:09.741657+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('b328e6ab-7b84-4c89-8d5f-7edc4303fe6f', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 22:55:26.255102+00', '2026-05-19 22:55:26.255102+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('b4e71a66-e386-4467-aa8b-2b85d0e2cb5e', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 22:55:26.564957+00', '2026-05-19 22:55:26.564957+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('29d51903-3e13-4bb7-9cf7-ff8bd2833c12', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 23:02:54.184231+00', '2026-05-19 23:02:54.184231+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('5124f27d-88e6-41df-ac30-36e30ec17652', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 23:06:51.758787+00', '2026-05-19 23:06:51.758787+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('e0dc7b24-62a1-4c1c-a285-b10fb45dd3a7', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 23:09:32.953916+00', '2026-05-19 23:09:32.953916+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('35c48b4d-6b75-4b5f-bcd2-e0c1d7d2ae05', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 23:12:56.3826+00', '2026-05-19 23:12:56.3826+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('177c28f4-2f2b-4e2a-9d9d-398644405d23', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 23:12:56.557294+00', '2026-05-19 23:12:56.557294+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('6af82f39-0d1a-4244-b70d-33f32bbb2aab', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 23:24:45.158749+00', '2026-05-19 23:24:45.158749+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('464d02a1-e0e0-4fa9-9b81-72ca7169bcfe', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 23:29:18.393549+00', '2026-05-19 23:29:18.393549+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('4e12d7cb-0d41-451d-b455-1363202298b5', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 23:41:05.637558+00', '2026-05-19 23:41:05.637558+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('bfe17c87-b87e-459d-b481-34a596450cfd', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 23:41:53.607324+00', '2026-05-19 23:41:53.607324+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL),
	('fc21ee22-21e2-4b4d-a679-49e88d8020c3', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 17:24:59.241074+00', '2026-05-19 23:44:40.823095+00', NULL, 'aal1', NULL, '2026-05-19 23:44:40.82295', 'Mozilla/5.0 (Linux; Android 16; 2312FPCA6G Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/148.0.7778.120 Mobile Safari/537.36', '62.56.149.31', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('34515a5f-331a-48e9-84ff-7656e693f479', '2026-05-02 23:18:30.962158+00', '2026-05-02 23:18:30.962158+00', 'password', 'fae8209d-04b0-4de4-b03d-bc0173c7d85d'),
	('ae4ca87e-9e9b-47b4-8ca9-b7a95230c419', '2026-05-02 23:20:04.567038+00', '2026-05-02 23:20:04.567038+00', 'password', 'daa0d248-d891-40c9-9619-0ac5b0896eb1'),
	('a983f157-3b4e-4720-8310-a3efa75c451c', '2026-05-02 23:24:20.977693+00', '2026-05-02 23:24:20.977693+00', 'password', '568f7bd4-fed4-4828-99c6-bb881ec74b9f'),
	('e7845a9d-2c79-48ba-b704-df2c7e83f698', '2026-05-19 17:24:14.863612+00', '2026-05-19 17:24:14.863612+00', 'password', '33c727b3-c7a0-4daa-8b3b-abf2b1704d28'),
	('fc21ee22-21e2-4b4d-a679-49e88d8020c3', '2026-05-19 17:24:59.244066+00', '2026-05-19 17:24:59.244066+00', 'password', '623acb23-94ed-43cc-be53-82ace1c747bc'),
	('8e9878c0-606f-418d-a7fb-b552ed30cd3a', '2026-05-19 21:49:42.956696+00', '2026-05-19 21:49:42.956696+00', 'password', 'dc4c24e3-e84c-4a40-a5f6-062b12d99cce'),
	('6d232c62-bad3-4bbb-874b-a5373613150a', '2026-05-19 22:29:09.774428+00', '2026-05-19 22:29:09.774428+00', 'password', '5f6e03fd-2c00-4cb9-bcf2-28834619a43b'),
	('b328e6ab-7b84-4c89-8d5f-7edc4303fe6f', '2026-05-19 22:55:26.269301+00', '2026-05-19 22:55:26.269301+00', 'password', '6b1a0571-fdee-4b5c-905e-bfa31cb4bf81'),
	('b4e71a66-e386-4467-aa8b-2b85d0e2cb5e', '2026-05-19 22:55:26.569903+00', '2026-05-19 22:55:26.569903+00', 'password', 'ac487126-20c2-40bc-8b3e-791cef882005'),
	('29d51903-3e13-4bb7-9cf7-ff8bd2833c12', '2026-05-19 23:02:54.198987+00', '2026-05-19 23:02:54.198987+00', 'password', '0b317206-5c10-4043-8b14-0bd96544c4a2'),
	('5124f27d-88e6-41df-ac30-36e30ec17652', '2026-05-19 23:06:51.778113+00', '2026-05-19 23:06:51.778113+00', 'password', 'a744c59f-3e0b-48cd-aa6e-84cd44d20cbb'),
	('e0dc7b24-62a1-4c1c-a285-b10fb45dd3a7', '2026-05-19 23:09:32.9656+00', '2026-05-19 23:09:32.9656+00', 'password', '161e7764-9be0-42b5-8f28-4a41a7302c3f'),
	('35c48b4d-6b75-4b5f-bcd2-e0c1d7d2ae05', '2026-05-19 23:12:56.394867+00', '2026-05-19 23:12:56.394867+00', 'password', 'd72cd8c7-831b-4c13-9cc4-48db4a999a1b'),
	('177c28f4-2f2b-4e2a-9d9d-398644405d23', '2026-05-19 23:12:56.560105+00', '2026-05-19 23:12:56.560105+00', 'password', '0c5e83fd-36b4-444b-b1c8-15429c3e7691'),
	('6af82f39-0d1a-4244-b70d-33f32bbb2aab', '2026-05-19 23:24:45.174646+00', '2026-05-19 23:24:45.174646+00', 'password', 'ec60eb24-7717-4956-a00b-c0d6fe70a069'),
	('464d02a1-e0e0-4fa9-9b81-72ca7169bcfe', '2026-05-19 23:29:18.40851+00', '2026-05-19 23:29:18.40851+00', 'password', '81a42b5d-f37a-4995-86d8-538bce0af7bb'),
	('4e12d7cb-0d41-451d-b455-1363202298b5', '2026-05-19 23:41:05.649682+00', '2026-05-19 23:41:05.649682+00', 'password', '99ea9a25-27ce-46dd-9f99-1990217a31c9'),
	('bfe17c87-b87e-459d-b481-34a596450cfd', '2026-05-19 23:41:53.612739+00', '2026-05-19 23:41:53.612739+00', 'password', '724d5536-5dbf-4e83-b43c-1c2e452200b9');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 3, '37ntmmtvk6rd', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-02 23:18:30.951984+00', '2026-05-02 23:18:30.951984+00', NULL, '34515a5f-331a-48e9-84ff-7656e693f479'),
	('00000000-0000-0000-0000-000000000000', 5, '5oumfsf6kvhb', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', true, '2026-05-02 23:24:20.966428+00', '2026-05-03 10:29:35.225835+00', NULL, 'a983f157-3b4e-4720-8310-a3efa75c451c'),
	('00000000-0000-0000-0000-000000000000', 6, '6akccmyizwfp', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', true, '2026-05-03 10:29:35.245153+00', '2026-05-03 11:48:46.330593+00', '5oumfsf6kvhb', 'a983f157-3b4e-4720-8310-a3efa75c451c'),
	('00000000-0000-0000-0000-000000000000', 7, 'llimxjrgv5ym', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', true, '2026-05-03 11:48:46.344011+00', '2026-05-04 05:00:01.997857+00', '6akccmyizwfp', 'a983f157-3b4e-4720-8310-a3efa75c451c'),
	('00000000-0000-0000-0000-000000000000', 4, 'g5htyeyeb36g', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', true, '2026-05-02 23:20:04.563867+00', '2026-05-19 17:24:13.194697+00', NULL, 'ae4ca87e-9e9b-47b4-8ca9-b7a95230c419'),
	('00000000-0000-0000-0000-000000000000', 9, 'lnzlj5ztppoh', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 17:24:13.199545+00', '2026-05-19 17:24:13.199545+00', 'g5htyeyeb36g', 'ae4ca87e-9e9b-47b4-8ca9-b7a95230c419'),
	('00000000-0000-0000-0000-000000000000', 10, 'qbhw4l6hknqh', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', true, '2026-05-19 17:24:14.857107+00', '2026-05-19 18:29:58.004226+00', NULL, 'e7845a9d-2c79-48ba-b704-df2c7e83f698'),
	('00000000-0000-0000-0000-000000000000', 11, 'ffpmxbcfs2ct', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', true, '2026-05-19 17:24:59.242323+00', '2026-05-19 21:48:17.731044+00', NULL, 'fc21ee22-21e2-4b4d-a679-49e88d8020c3'),
	('00000000-0000-0000-0000-000000000000', 12, '2k2c66sarqy5', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', true, '2026-05-19 18:29:58.021476+00', '2026-05-19 21:49:36.904038+00', 'qbhw4l6hknqh', 'e7845a9d-2c79-48ba-b704-df2c7e83f698'),
	('00000000-0000-0000-0000-000000000000', 14, 'l3nuo4woj7b6', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 21:49:36.905823+00', '2026-05-19 21:49:36.905823+00', '2k2c66sarqy5', 'e7845a9d-2c79-48ba-b704-df2c7e83f698'),
	('00000000-0000-0000-0000-000000000000', 15, '4uawwafegoqf', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 21:49:42.944679+00', '2026-05-19 21:49:42.944679+00', NULL, '8e9878c0-606f-418d-a7fb-b552ed30cd3a'),
	('00000000-0000-0000-0000-000000000000', 8, 'icvkuh64zhf2', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', true, '2026-05-04 05:00:02.020179+00', '2026-05-19 21:58:41.085081+00', 'llimxjrgv5ym', 'a983f157-3b4e-4720-8310-a3efa75c451c'),
	('00000000-0000-0000-0000-000000000000', 16, 'bpe52kox3q6e', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 21:58:41.09333+00', '2026-05-19 21:58:41.09333+00', 'icvkuh64zhf2', 'a983f157-3b4e-4720-8310-a3efa75c451c'),
	('00000000-0000-0000-0000-000000000000', 17, 'hwn2fmltj426', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 22:29:09.75937+00', '2026-05-19 22:29:09.75937+00', NULL, '6d232c62-bad3-4bbb-874b-a5373613150a'),
	('00000000-0000-0000-0000-000000000000', 13, 'qdnmaq7wh4ys', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', true, '2026-05-19 21:48:17.739819+00', '2026-05-19 22:46:20.862919+00', 'ffpmxbcfs2ct', 'fc21ee22-21e2-4b4d-a679-49e88d8020c3'),
	('00000000-0000-0000-0000-000000000000', 19, 'h64ekoykxg53', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 22:55:26.264602+00', '2026-05-19 22:55:26.264602+00', NULL, 'b328e6ab-7b84-4c89-8d5f-7edc4303fe6f'),
	('00000000-0000-0000-0000-000000000000', 20, '7rjjejf2vc6e', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 22:55:26.567466+00', '2026-05-19 22:55:26.567466+00', NULL, 'b4e71a66-e386-4467-aa8b-2b85d0e2cb5e'),
	('00000000-0000-0000-0000-000000000000', 21, '4mhsjpi5d7eq', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 23:02:54.19244+00', '2026-05-19 23:02:54.19244+00', NULL, '29d51903-3e13-4bb7-9cf7-ff8bd2833c12'),
	('00000000-0000-0000-0000-000000000000', 22, '27dgca772gos', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 23:06:51.77154+00', '2026-05-19 23:06:51.77154+00', NULL, '5124f27d-88e6-41df-ac30-36e30ec17652'),
	('00000000-0000-0000-0000-000000000000', 23, 'e64blfa2eiva', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 23:09:32.961403+00', '2026-05-19 23:09:32.961403+00', NULL, 'e0dc7b24-62a1-4c1c-a285-b10fb45dd3a7'),
	('00000000-0000-0000-0000-000000000000', 24, 'bqnlfuch3yc6', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 23:12:56.387986+00', '2026-05-19 23:12:56.387986+00', NULL, '35c48b4d-6b75-4b5f-bcd2-e0c1d7d2ae05'),
	('00000000-0000-0000-0000-000000000000', 25, 'm7movah7ichc', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 23:12:56.558528+00', '2026-05-19 23:12:56.558528+00', NULL, '177c28f4-2f2b-4e2a-9d9d-398644405d23'),
	('00000000-0000-0000-0000-000000000000', 26, 'ywzllfqthdqq', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 23:24:45.169108+00', '2026-05-19 23:24:45.169108+00', NULL, '6af82f39-0d1a-4244-b70d-33f32bbb2aab'),
	('00000000-0000-0000-0000-000000000000', 27, 'lmw2ydtdmvk4', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 23:29:18.403399+00', '2026-05-19 23:29:18.403399+00', NULL, '464d02a1-e0e0-4fa9-9b81-72ca7169bcfe'),
	('00000000-0000-0000-0000-000000000000', 28, 'ywipuiznsxzz', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 23:41:05.645512+00', '2026-05-19 23:41:05.645512+00', NULL, '4e12d7cb-0d41-451d-b455-1363202298b5'),
	('00000000-0000-0000-0000-000000000000', 29, 'ntkynecupbft', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 23:41:53.610155+00', '2026-05-19 23:41:53.610155+00', NULL, 'bfe17c87-b87e-459d-b481-34a596450cfd'),
	('00000000-0000-0000-0000-000000000000', 18, 'ay5bssdos5fu', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', true, '2026-05-19 22:46:20.871554+00', '2026-05-19 23:44:40.79797+00', 'qdnmaq7wh4ys', 'fc21ee22-21e2-4b4d-a679-49e88d8020c3'),
	('00000000-0000-0000-0000-000000000000', 30, 'kr4yfchutcbn', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', false, '2026-05-19 23:44:40.807913+00', '2026-05-19 23:44:40.807913+00', 'ay5bssdos5fu', 'fc21ee22-21e2-4b4d-a679-49e88d8020c3');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: app_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."app_settings" ("id", "key", "value") VALUES
	('5f13269c-8fd8-4e4f-8b0d-9a535f27d3d2', 'weather_city', 'ירושלים'),
	('ced29590-0f9c-478b-abd5-03ce9927db8c', 'weather_lat', '31.7683'),
	('fb33c77c-db6b-4d76-aa56-3d9b2afa7d97', 'weather_lon', '35.2137');


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('images', 'images', NULL, '2026-05-02 21:34:36.532416+00', '2026-05-02 21:34:36.532416+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('da0bf30c-b4d9-4b37-a604-9f9a2a54f073', 'images', 'upload_1777758655180.png', NULL, '2026-05-02 21:51:00.226841+00', '2026-05-02 21:51:00.226841+00', '2026-05-02 21:51:00.226841+00', '{"eTag": "\"0b9450f78286ad6dca8ecadbc84f5c31\"", "size": 97012, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-02T21:51:01.000Z", "contentLength": 97012, "httpStatusCode": 200}', 'a35c0351-b577-45ee-aa0b-900b4ae46a4e', NULL, '{}'),
	('809a8635-2de5-406c-89c9-19f63f72ba0a', 'images', 'upload_1779215958273.png', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '2026-05-19 18:39:20.553661+00', '2026-05-19 18:39:20.553661+00', '2026-05-19 18:39:20.553661+00', '{"eTag": "\"a319b4038cb1999a50ebe760ef04d240\"", "size": 82026, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-19T18:39:21.000Z", "contentLength": 82026, "httpStatusCode": 200}', '7ff6c630-7272-4d26-8eaf-3ab4f6fd7911', 'a1b079c4-29d3-4ab4-8bf8-127fcfd76c9d', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 30, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict fwAW18Nv1b1NQBZUHFPzpyEHbtBVQGcWa7Qkvj5hJD1vuFcQf02UXboRVDweNat

RESET ALL;
