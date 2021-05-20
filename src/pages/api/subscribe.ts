import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { fauna } from '../../services/fauna';
import { query as q } from 'faunadb';
import { stripe } from '../../services/stripe';

type User = {
  ref: {
    id: string;
  },
  data: {
    stripe_customer_id: string;
  }
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    // recupera os dados do usuário autenticado (cadastrado no fauna)
    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    );

    let customerId = user.data.stripe_customer_id;

    // se o usuário ainda não tiver um stripe_customer_id, significa que ele
    // ainda não fez nenhum pagamento na stripe, então cadastra ele no stripe
    // para gerar o seu stripe_customer_id
    if (!customerId) {
      // cria um novo usuário no Stripe
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata
      });

      // seta o stripe_customer_id no fauna para o usuário autenticado
      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id
            }
          }
        )
      );

      customerId = stripeCustomer.id;
    }

    // cria a sessão de checkout para o usuário realizar o pagamento
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1IoPFoDT8YOCvm7FEa2zIbR7', quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
  }
}