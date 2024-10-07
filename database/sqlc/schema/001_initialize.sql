CREATE TABLE organization_type (
  organization_type_id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  organization_type_name varchar(50) UNIQUE NOT NULL
);

CREATE TABLE subscription_tier (
  subscription_tier_id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  tier_name varchar(50) NOT NULL,
  tier_description text,
  tier_created_at datetime NOT NULL,
  tier_updated_at datetime NOT NULL
);

CREATE TABLE organization (
  organization_id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  organization_name varchar(100) UNIQUE NOT NULL,
  organization_created_at datetime NOT NULL,
  organization_updated_at datetime NOT NULL,
  organization_realm varchar(100) NOT NULL,
  organization_country varchar(50),
  organization_support_email varchar(256) NOT NULL,
  organization_active boolean DEFAULT true,
  organization_report_q boolean DEFAULT false,
  organization_config text,
  organization_type_id int NOT NULL
);

CREATE TABLE api_key (
  api_key_id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  api_key varchar(100) UNIQUE NOT NULL,
  api_key_status boolean DEFAULT true,
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  organization_id int NOT NULL
);

CREATE TABLE subscription (
  subscription_id int PRIMARY KEY NOT NULL,
  subscription_name varchar(255) UNIQUE NOT NULL,
  subscription_type varchar(255) NOT NULL,
  subscription_created_date datetime NOT NULL,
  subscription_updated_date datetime NOT NULL,
  subscription_start_date date NOT NULL,
  subscription_api_limit int,
  subscription_expiry_date date,
  subscription_description text,
  subscription_status boolean DEFAULT true,
  organization_id int NOT NULL,
  subscription_tier_id int NOT NULL
);

CREATE TABLE api_endpoint (
  api_endpoint_id int PRIMARY KEY NOT NULL,
  endpoint_name varchar(255) UNIQUE NOT NULL,
  endpoint_description text
);

CREATE TABLE tier_base_pricing (
  tier_base_pricing_id int PRIMARY KEY NOT NULL,
  base_cost_per_call float NOT NULL,
  base_rate_limit int,
  api_endpoint_id int NOT NULL,
  subscription_tier_id int NOT NULL
);

CREATE TABLE subscription_endpoint_pricing (
  custom_cost_per_call float,
  custom_rate_limit int,
  subscription_id int NOT NULL,
  tier_base_pricing_id int NOT NULL
);

CREATE TABLE organization_permission (
  resource_code varchar(50) NOT NULL,
  permission_code varchar(50) NOT NULL,
  organization_id int NOT NULL
);

CREATE TABLE billing_history (
  billing_id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  billing_start_date date NOT NULL,
  billing_end_date date NOT NULL,
  total_amount_due float NOT NULL,
  total_calls int NOT NULL,
  payment_status varchar(50) NOT NULL DEFAULT 'Pending',
  payment_date datetime,
  billing_created_at timestamp NOT NULL,
  subscription_id int NOT NULL
);

CREATE TABLE api_usage (
  usage_id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  call_timestamp datetime NOT NULL,
  unix_timestamp int NOT NULL,
  number_of_calls int NOT NULL,
  cost_per_call float NOT NULL,
  total_cost float NOT NULL,
  subscription_id int NOT NULL,
  billing_id int NOT NULL,
  api_endpoint_id int NOT NULL
);

ALTER TABLE organization ADD FOREIGN KEY (organization_type_id) REFERENCES organization_type (organization_type_id);

ALTER TABLE api_key ADD FOREIGN KEY (organization_id) REFERENCES organization (organization_id);

ALTER TABLE organization_permission ADD FOREIGN KEY (organization_id) REFERENCES organization (organization_id);

ALTER TABLE subscription ADD FOREIGN KEY (organization_id) REFERENCES organization (organization_id);

ALTER TABLE subscription ADD FOREIGN KEY (subscription_tier_id) REFERENCES subscription_tier (subscription_tier_id);

ALTER TABLE tier_base_pricing ADD FOREIGN KEY (subscription_tier_id) REFERENCES subscription_tier (subscription_tier_id);

ALTER TABLE tier_base_pricing ADD FOREIGN KEY (api_endpoint_id) REFERENCES api_endpoint (api_endpoint_id);

ALTER TABLE subscription_endpoint_pricing ADD FOREIGN KEY (subscription_id) REFERENCES subscription (subscription_id);

ALTER TABLE api_usage ADD FOREIGN KEY (subscription_id) REFERENCES subscription (subscription_id);

ALTER TABLE billing_history ADD FOREIGN KEY (subscription_id) REFERENCES subscription (subscription_id);

ALTER TABLE api_usage ADD FOREIGN KEY (api_endpoint_id) REFERENCES api_endpoint (api_endpoint_id);

ALTER TABLE api_usage ADD FOREIGN KEY (billing_id) REFERENCES billing_history (billing_id);