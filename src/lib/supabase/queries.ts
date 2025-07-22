import { Tables } from '@/datatypes.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';


type Product = Tables<"products">;
type Prices = Tables<"prices">;
type Subscription = Tables<"subscriptions">;



interface PriceWithProducts extends Prices {
  products: Product | null;
}

interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProducts | null;
}

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
});

export const getSubscription = cache(async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

    if(error){
        console.log(error)
    }

  return subscription as SubscriptionWithProduct;
});

export const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });
    
     if(error){
        console.log(error)
    }

  return products;
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();
  return userDetails;
});