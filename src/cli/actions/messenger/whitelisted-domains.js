/* eslint-disable consistent-return */
import invariant from 'invariant';
import { MessengerClient } from 'messaging-api-messenger';

import getConfig from '../../shared/getConfig';
import { print, error, bold } from '../../shared/log';

export async function getWhitelistedDomains(
  configPath = 'bottender.config.js'
) {
  try {
    const config = getConfig(configPath, 'messenger');

    invariant(config.accessToken, 'accessToken is not found in config file');

    const client = MessengerClient.connect(config.accessToken);

    const { data } = await client.getDomainWhitelist();
    if (data.length) {
      for (let i = 0; i < data[0].whitelisted_domains.length; i++) {
        print(
          `The whitelisted domains is: ${bold(data[0].whitelisted_domains[i])}`
        );
      }
    } else {
      error('Failed to find whitelisted domains setting');
    }
  } catch (err) {
    error('Failed to get whitelisted domains');
    if (err.response) {
      error(`status: ${bold(err.response.status)}`);
      if (err.response.data) {
        error(`data: ${bold(JSON.stringify(err.response.data, null, 2))}`);
      }
    } else {
      error(err.message);
    }
    return process.exit(1);
  }
}

export async function setWhitelistedDomains(
  _domains,
  configPath = 'bottender.config.js'
) {
  try {
    const config = getConfig(configPath, 'messenger');
    const domains = _domains || config.domainWhitelist;

    invariant(config.accessToken, 'accessToken is not found in config file');
    invariant(
      domains,
      'domains is required but not found. using -d <array of domain_name> separate by comma(,) to setup or list `domainWhitelist` key it in config file.'
    );
    invariant(Array.isArray(domains), 'domains should be an array');
    invariant(domains.length < 10, 'The domains should less than 10');

    const client = MessengerClient.connect(config.accessToken);
    await client.setDomainWhitelist(domains);

    print(`Successfully set whitelisted domains to ${bold(domains)}`);
  } catch (err) {
    error('Failed to set whitelisted domains');
    if (err.response) {
      error(`status: ${bold(err.response.status)}`);
      if (err.response.data) {
        error(`data: ${bold(JSON.stringify(err.response.data, null, 2))}`);
      }
    } else {
      error(err.message);
    }
    return process.exit(1);
  }
}

export async function deleteWhitelistedDomains(
  configPath = 'bottender.config.js'
) {
  try {
    const config = getConfig(configPath, 'messenger');

    invariant(config.accessToken, 'accessToken is not found in config file');

    const client = MessengerClient.connect(config.accessToken);

    await client.deleteDomainWhitelist();

    print('Successfully delete whitelisted domains');
  } catch (err) {
    error('Failed to delete whitelisted domains');
    if (err.response) {
      error(`status: ${bold(err.response.status)}`);
      if (err.response.data) {
        error(`data: ${bold(JSON.stringify(err.response.data, null, 2))}`);
      }
    } else {
      error(err.message);
    }
    return process.exit(1);
  }
}