---
name: Sendy API Integration
description: Documentation and instructions for integrating with Sendy API
---

# Sendy API Documentation

## Base Configuration

All API calls make use of your Sendy installation URL and require your `api_key` (available in Settings).

## SUBSCRIBERS

### Subscribe

**URL**: `[Installation URL]/subscribe`
**Method**: POST

**Parameters**:

- `api_key`: Your API key.
- `name`: User's name (optional).
- `email`: User's email.
- `list`: The encrypted & hashed list ID.
- `country`: User's 2 letter country code (optional).
- `ipaddress`: User's IP address (optional).
- `referrer`: The URL where the user signed up from (optional).
- `gdpr`: Set to "true" for GDPR compliance (optional).
- `silent`: Set to "true" to bypass double opt-in (optional).
- `hp`: Honeypot field (optional).
- `boolean`: Set to "true" for plain text response (optional).

**Responses**:

- `true`: Success.
- `Some fields are missing.`
- `API key not passed`
- `Invalid API key`
- `Invalid email address.`
- `Already subscribed.`
- `Bounced email address.`
- `Email is suppressed.`
- `Invalid list ID.`

### Unsubscribe

**URL**: `[Installation URL]/unsubscribe`
**Method**: POST

**Parameters**:

- `email`: User's email.
- `list`: The encrypted & hashed list ID.
- `boolean`: Set to "true" for plain text response.

**Responses**:

- `true`: Success.
- `Some fields are missing.`
- `Invalid email address.`
- `Email does not exist.`

### Delete Subscriber

**URL**: `[Installation URL]/api/subscribers/delete.php`
**Method**: POST

**Parameters**:

- `api_key`: Your API key.
- `list_id`: The encrypted list ID.
- `email`: The email address to delete.

**Responses**:

- `true`: Success.
- `No data passed`
- `API key not passed`
- `Invalid API key`
- `List ID not passed`
- `List does not exist`
- `Email address not passed`
- `Subscriber does not exist`

### Subscription Status

**URL**: `[Installation URL]/api/subscribers/subscription-status.php`
**Method**: POST

**Parameters**:

- `api_key`: Your API key.
- `email`: User's email.
- `list_id`: The encrypted list ID.

**Responses**:

- `Subscribed`
- `Unsubscribed`
- `Unconfirmed`
- `Bounced`
- `Soft bounced`
- `Complained`
- `No data passed`
- `API key not passed`
- `Invalid API key`
- `Email not passed`
- `List ID not passed`
- `Email does not exist in list`

### Active Subscriber Count

**URL**: `[Installation URL]/api/subscribers/active-subscriber-count.php`
**Method**: POST

**Parameters**:

- `api_key`: Your API key.
- `list_id`: The encrypted list ID.

**Responses**:

- (Integer): Active subscriber count.
- `No data passed`
- `API key not passed`
- `Invalid API key`
- `List ID not passed`
- `List does not exist`

## LISTS

### Get Lists

**URL**: `[Installation URL]/api/lists/get-lists.php`
**Method**: POST

**Parameters**:

- `api_key`: Your API key.
- `brand_id`: The brand ID.
- `include_hidden`: "yes" or "no" (default "no").

**Responses**:

- (JSON): List of lists (ids and names).
- `No data passed`
- `API key not passed`
- `Invalid API key`
- `Brand ID not passed`
- `Brand does not exist`
- `No lists found`

## BRANDS

### Get Brands

**URL**: `[Installation URL]/api/brands/get-brands.php`
**Method**: POST

**Parameters**:

- `api_key`: Your API key.

**Responses**:

- (JSON): List of brands (ids and names).
- `No data passed`
- `API key not passed`
- `Invalid API key`
- `No brands found`

## CAMPAIGNS

### Create and Send Campaign

**URL**: `[Installation URL]/api/campaigns/create.php`
**Method**: POST

**Parameters**:

- `api_key`: Your API key.
- `from_name`: 'From name'.
- `from_email`: 'From email'.
- `reply_to`: 'Reply to' email.
- `title`: Campaign title.
- `subject`: Campaign subject.
- `plain_text`: Plain text version (optional).
- `html_text`: HTML version.
- `list_ids`: Comma-separated list IDs (required if `send_campaign=1` and no segments).
- `segment_ids`: Comma-separated segment IDs (required if `send_campaign=1` and no lists).
- `exclude_list_ids`: Lists to exclude (optional).
- `exclude_segments_ids`: Segments to exclude (optional).
- `brand_id`: Brand ID (required for drafts).
- `query_string`: e.g. Google Analytics tags (optional).
- `track_opens`: 0 (disable), 1 (enable), 2 (anonymous).
- `track_clicks`: 0 (disable), 1 (enable), 2 (anonymous).
- `send_campaign`: 1 (send), 0 (draft - default).
- `schedule_date_time`: Date/time to schedule (optional).
- `schedule_timezone`: Timezone for scheduling (optional).

**Responses**:

- `Campaign created`
- `Campaign created and now sending`
- `Campaign scheduled`
- `No data passed`
- `API key not passed`
- `Invalid API key`
- `From name not passed`
- `From email not passed`
- `Reply to email not passed`
- `Subject not passed`
- `HTML not passed`
- `List or segment ID(s) not passed`
- `One or more list IDs are invalid`
- `One or more segment IDs are invalid`
- `List or segment IDs does not belong to a single brand`
- `Brand ID not passed`
