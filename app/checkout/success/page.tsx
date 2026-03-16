import { getStoreSettings } from '@/app/actions/store-settings'
import { CheckoutSuccessClient } from './checkout-success-client'

export default async function CheckoutSuccessPage() {
  const storeSettings = await getStoreSettings()
  return <CheckoutSuccessClient storeSettings={storeSettings} />
}
