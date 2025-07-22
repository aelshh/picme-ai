import { createClient } from "@supabase/supabase-js";
import { toDateTime } from '@/lib/helpers';
import { stripe } from '@/lib/stripe/config';

import Stripe from 'stripe';
import type { Json, Tables, TablesInsert } from '@/datatypes.types';

type Product = Tables<'products'>;
type Price = Tables<'prices'>;

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || "", 
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata
  };

  const { error: upsertError } = await supabaseAdmin
    .from('products')
    .upsert([productData]);
  if (upsertError) {
    console.error(`Product insert/update failed:`, upsertError);
    throw new Error(`Product insert/update failed: ${upsertError.message}`);
  }
  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3
) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : null,
    active: price.active ?? null,
    currency: price.currency ?? null,
    description: price.nickname ?? null,
    metadata: price.metadata ?? {},
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS, 
    
  };

  const { error: upsertError } = await supabaseAdmin
    .from('prices')
    .upsert([priceData]);

  if (upsertError?.message.includes('foreign key constraint')) {
    if (retryCount < maxRetries) {
      console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await upsertPriceRecord(price, retryCount + 1, maxRetries);
    } else {
      console.error(`Price insert/update failed after ${maxRetries} retries:`, upsertError);
      throw new Error(
        `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`
      );
    }
  } else if (upsertError) {
    console.error(`Price insert/update failed:`, upsertError);
    throw new Error(`Price insert/update failed: ${upsertError.message}`);
  } else {
    console.log(`Price inserted/updated: ${price.id}`);
  }
};

const deleteProductRecord = async (product: Stripe.Product) => {
  const { error: deletionError } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', product.id);
  if (deletionError)
    throw new Error(`Product deletion failed: ${deletionError.message}`);
  console.log(`Product deleted: ${product.id}`);
};

const deletePriceRecord = async (price: Stripe.Price) => {
  const { error: deletionError } = await supabaseAdmin
    .from('prices')
    .delete()
    .eq('id', price.id);
  if (deletionError) throw new Error(`Price deletion failed: ${deletionError.message}`);
  console.log(`Price deleted: ${price.id}`);
};

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
  const { error: upsertError } = await supabaseAdmin
    .from('customers')
    .upsert([{ id: uuid, stripe_customer_id: customerId }]);

  if (upsertError) {
    console.error(`Supabase customer record creation failed:`, upsertError);
    throw new Error(`Supabase customer record creation failed: ${upsertError.message}`);
  }

  return customerId;
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer || !newCustomer.id) {
    console.error('Stripe customer creation failed.');
    throw new Error('Stripe customer creation failed.');
  }

  return newCustomer.id;
};

const createOrRetrieveCustomer = async ({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) => {
  // Check if the customer already exists in Supabase
  const { data: existingSupabaseCustomer, error: queryError } =
    await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', uuid)
      .maybeSingle();

  if (queryError) {
    console.error('Supabase customer lookup failed:', queryError);
    throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
  }

  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  let stripeCustomerId: string | undefined;
  if (existingSupabaseCustomer?.stripe_customer_id) {
    try {
      const existingStripeCustomer = await stripe.customers.retrieve(
        existingSupabaseCustomer.stripe_customer_id
      );
      if (
        typeof existingStripeCustomer === 'object' &&
        'id' in existingStripeCustomer &&
        !('deleted' in existingStripeCustomer && existingStripeCustomer.deleted)
      ) {
        stripeCustomerId = existingStripeCustomer.id;
      } else {
        stripeCustomerId = undefined;
      }
    } catch (err) {
      console.warn('Stripe customer retrieve failed:', err);
      stripeCustomerId = undefined;
    }
  } else {
    // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
    try {
      const stripeCustomers = await stripe.customers.list({ email: email });
      stripeCustomerId =
        stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
    } catch (err) {
      console.warn('Stripe customer list by email failed:', err);
      stripeCustomerId = undefined;
    }
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);
  if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');

  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from('customers')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', uuid);

      if (updateError) {
        console.error('Supabase customer record update failed:', updateError);
        throw new Error(
          `Supabase customer record update failed: ${updateError.message}`
        );
      }
      console.warn(
        `Supabase customer record mismatched Stripe ID. Supabase record updated.`
      );
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
  } else {
    console.warn(
      `Supabase customer record was missing. A new record was created.`
    );

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert
    );
    if (!upsertedStripeCustomer)
      throw new Error('Supabase customer record creation failed.');

    return upsertedStripeCustomer;
  }
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string | null | undefined;
  const { name, phone, address } = payment_method.billing_details || {};
  if (!customer || !name || !phone || !address) {
    console.warn('Missing customer, name, phone, or address in payment method.');
    return;
  }
  try {
    // @ts-expect-error: Stripe types may not allow these fields, but they are valid
    await stripe.customers.update(customer, { name, phone, address });
  } catch (err) {
    console.warn('Stripe customer update failed:', err);
  }
  const paymentMethodDetails = payment_method[payment_method.type] || {};
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({
      billing_address: { ...address },
      payment_method: { ...paymentMethodDetails }
    })
    .eq('id', uuid);
  if (updateError) {
    console.error('Customer update failed:', updateError);
    throw new Error(`Customer update failed: ${updateError.message}`);
  }
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (noCustomerError || !customerData || !customerData.id) {
    console.error('Customer lookup failed:', noCustomerError);
    throw new Error(`Customer lookup failed: ${noCustomerError?.message || 'No customer found'}`);
  }

  const { id: uuid } = customerData;

  let subscription: Stripe.Subscription;
  try {
    subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method']
    }) as Stripe.Subscription;
  } catch (err) {
    console.error('Stripe subscription retrieve failed:', err);
    throw new Error('Stripe subscription retrieve failed.');
  }
  // Upsert the latest status of the subscription object.
  const priceId = subscription.items.data[0]?.price?.id || null;
  // Stripe.Subscription type does not have a top-level quantity, but items may have it
  const quantity = subscription.items.data[0]?.quantity ?? null;

  const subscriptionData = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: priceId,
    quantity: quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: subscription.items.data[0]?.current_period_start
      ? toDateTime(subscription.items.data[0].current_period_start).toISOString()
      : null,
    current_period_end: subscription.items.data[0]?.current_period_end
      ? toDateTime(subscription.items.data[0].current_period_end).toISOString()
      : null,
    created: subscription.created
      ? toDateTime(subscription.created).toISOString()
      : null,
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null
  };

  const { error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);
  if (upsertError) {
    console.error('Subscription insert/update failed:', upsertError);
    throw new Error(`Subscription insert/update failed: ${upsertError.message}`);
  }
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (
    createAction &&
    subscription.default_payment_method &&
    typeof subscription.default_payment_method === 'object' &&
    uuid
  ) {
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
  }
}

const updateUserCredits  = async (userId: string, metadata: Json) => {
  const creditsData: TablesInsert<"credits"> = {
    user_id: userId,
    image_generation_count: (metadata as {image_generation_count: number}).image_generation_count ?? 0, 
    model_training_count: (metadata as { model_training_count: number}).model_training_count ?? 0 , 
    max_image_generation_count: (metadata as {image_generation_count: number}).image_generation_count ?? 0, 
    max_model_training_count: (metadata as {model_training_count: number}).model_training_count ?? 0
  }

  const {error: upsertError} = await supabaseAdmin.from('credits').upsert(creditsData).eq("user_id", userId)

  if(upsertError){
    throw new Error(`Credits update failed: ${upsertError.message}`)

  }

  console.log(`Updated credtis for the user: ${userId}`)

}


export {
  upsertProductRecord,
  updateUserCredits,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange
};