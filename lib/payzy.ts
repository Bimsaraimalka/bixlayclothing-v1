/**
 * Payzy payment gateway helpers (server-side only).
 * Based on Payzy WooCommerce plugin: signed form and callback verification.
 */

import crypto from 'crypto'

const PAYZY_SIGNED_FIELDS =
  'x_test_mode,x_shopid,x_amount,x_order_id,x_response_url,x_first_name,x_last_name,x_company,x_address,x_country,x_state,x_city,x_zip,x_phone,x_email,x_ship_to_first_name,x_ship_to_last_name,x_ship_to_company,x_ship_to_address,x_ship_to_country,x_ship_to_state,x_ship_to_city,x_ship_to_zip,x_freight,x_platform,x_version,signed_field_names'

const PAYZY_VERIFY_SIGNED_FIELDS =
  'response_code,x_test_mode,x_shopid,x_amount,x_order_id,x_response_url,x_first_name,x_last_name,x_company,x_address,x_country,x_state,x_city,x_zip,x_phone,x_email,x_ship_to_first_name,x_ship_to_last_name,x_ship_to_company,x_ship_to_address,x_ship_to_country,x_ship_to_state,x_ship_to_city,x_ship_to_zip,x_freight,x_platform,x_version,signed_field_names'

export type PayzyFormParams = Record<string, string>

/** HMAC-SHA256 sign for Payzy (matches PHP plugin) */
function sign(params: PayzyFormParams, secretKey: string): string {
  const signedFieldNames = params['signed_field_names'] ?? ''
  const fields = signedFieldNames.split(',')
  const parts = fields.map((f) => `${f}=${params[f] ?? ''}`)
  const dataToSign = parts.join(',')
  const hmac = crypto.createHmac('sha256', secretKey)
  hmac.update(dataToSign)
  return hmac.digest('base64')
}

/** Build signed form params for Payzy checkout-start redirect */
export function buildPayzyCheckoutParams(options: {
  shopId: string
  secretKey: string
  testMode: boolean
  amount: number
  orderId: number
  responseUrl: string
  firstName: string
  lastName: string
  company?: string
  address?: string
  country?: string
  state?: string
  city?: string
  zip?: string
  phone?: string
  email: string
  shipToFirstName?: string
  shipToLastName?: string
  shipToCompany?: string
  shipToAddress?: string
  shipToCountry?: string
  shipToState?: string
  shipToCity?: string
  shipToZip?: string
  freight: number
}): PayzyFormParams {
  const shipFirst = options.shipToFirstName ?? options.firstName
  const shipLast = options.shipToLastName ?? options.lastName
  const shipCompany = options.shipToCompany ?? options.company ?? ''
  const shipAddress = options.shipToAddress ?? options.address ?? ''
  const shipCountry = options.shipToCountry ?? options.country ?? ''
  const shipState = options.shipToState ?? options.state ?? ''
  const shipCity = options.shipToCity ?? options.city ?? ''
  const shipZip = options.shipToZip ?? options.zip ?? ''

  const params: PayzyFormParams = {
    x_shopid: options.shopId,
    x_test_mode: options.testMode ? 'true' : 'false',
    x_amount: String(options.amount),
    x_order_id: String(options.orderId),
    x_response_url: options.responseUrl,
    x_first_name: options.firstName,
    x_last_name: options.lastName,
    x_company: options.company ?? '',
    x_address: options.address ?? '',
    x_country: options.country ?? 'Sri Lanka',
    x_state: options.state ?? '',
    x_city: options.city ?? '',
    x_zip: options.zip ?? '',
    x_phone: options.phone ?? '',
    x_email: options.email,
    x_ship_to_first_name: shipFirst,
    x_ship_to_last_name: shipLast,
    x_ship_to_company: shipCompany,
    x_ship_to_address: shipAddress,
    x_ship_to_country: shipCountry,
    x_ship_to_state: shipState,
    x_ship_to_city: shipCity,
    x_ship_to_zip: shipZip,
    x_freight: String(options.freight),
    x_platform: 'nextjs',
    x_version: '1.7',
    signed_field_names: PAYZY_SIGNED_FIELDS,
  }
  params['signature'] = sign(params, options.secretKey)
  return params
}

/** Verify callback query from Payzy and return order id and response code */
export function verifyPayzyCallback(params: {
  response_code: string
  x_order_id: string
  signature: string
  shopId: string
  secretKey: string
  testMode: boolean
  amount: string
  responseUrl: string
  firstName: string
  lastName: string
  company?: string
  address?: string
  country?: string
  state?: string
  city?: string
  zip?: string
  phone?: string
  email: string
  shipToFirstName?: string
  shipToLastName?: string
  shipToCompany?: string
  shipToAddress?: string
  shipToCountry?: string
  shipToState?: string
  shipToCity?: string
  shipToZip?: string
  freight: string
}): { valid: boolean; orderId: string; responseCode: string } {
  const orderId = params.x_order_id
  const responseCode = params.response_code
  const receivedSignature = params.signature

  const verifyParams: PayzyFormParams = {
    response_code: params.response_code,
    x_test_mode: params.testMode ? 'true' : 'false',
    x_shopid: params.shopId,
    x_amount: params.amount,
    x_order_id: orderId,
    x_response_url: params.responseUrl,
    x_first_name: params.firstName,
    x_last_name: params.lastName,
    x_company: params.company ?? '',
    x_address: params.address ?? '',
    x_country: params.country ?? 'Sri Lanka',
    x_state: params.state ?? '',
    x_city: params.city ?? '',
    x_zip: params.zip ?? '',
    x_phone: params.phone ?? '',
    x_email: params.email,
    x_ship_to_first_name: params.shipToFirstName ?? params.firstName,
    x_ship_to_last_name: params.shipToLastName ?? params.lastName,
    x_ship_to_company: params.shipToCompany ?? params.company ?? '',
    x_ship_to_address: params.shipToAddress ?? params.address ?? '',
    x_ship_to_country: params.shipToCountry ?? params.country ?? 'Sri Lanka',
    x_ship_to_state: params.shipToState ?? params.state ?? '',
    x_ship_to_city: params.shipToCity ?? params.city ?? '',
    x_ship_to_zip: params.shipToZip ?? params.zip ?? '',
    x_freight: params.freight,
    x_platform: 'nextjs',
    x_version: '1.7',
    signed_field_names: PAYZY_VERIFY_SIGNED_FIELDS,
  }
  const expectedSignature = sign(verifyParams, params.secretKey)
  const valid = receivedSignature === expectedSignature
  return { valid, orderId, responseCode }
}

export function getPayzyProcessUrl(testMode: boolean): string {
  return testMode
    ? 'https://api.payzypay.xyz/checkout/checkout-start'
    : 'https://api.payzy.lk/checkout/checkout-start'
}
