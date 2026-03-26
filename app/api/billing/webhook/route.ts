import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { Plan } from '@/types/database'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

// Plan → kredi miktarı eşlemesi
const PLAN_CREDITS: Record<string, number> = {
  builder: 15,
  studio: 150,
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Webhook imzası geçersiz' }, { status: 400 })
  }

  const supabase = createClient()

  switch (event.type) {
    // Ödeme başarılı → planı ve kredileri güncelle
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id
      const plan = session.metadata?.plan

      if (userId && plan) {
        const credits = PLAN_CREDITS[plan] || 0
        await supabase
          .from('users')
          .update({
            plan: plan as Plan,
            credits,
            subscription_id: session.subscription as string,
            subscription_status: 'active',
          })
          .eq('id', userId)
      }
      break
    }

    // Abonelik iptal edildi
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await supabase
        .from('users')
        .update({
          plan: 'starter',
          credits: 2,
          subscription_status: 'cancelled',
        })
        .eq('subscription_id', subscription.id)
      break
    }

    // Aylık yenileme → kredileri sıfırla
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.billing_reason === 'subscription_cycle') {
        const { data: user } = await supabase
          .from('users')
          .select('plan')
          .eq('stripe_customer_id', invoice.customer as string)
          .single()

        if (user) {
          const credits = PLAN_CREDITS[user.plan] || 0
          await supabase
            .from('users')
            .update({ credits })
            .eq('stripe_customer_id', invoice.customer as string)
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
