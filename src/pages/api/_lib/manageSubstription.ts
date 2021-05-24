import { Create, query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
  subscriptId: string,
  customerId: string,
  createAction = false
) {
  // recupera o ref do usuário (customer) do banco 
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  );

  // pega todos os dados da inscrição (subscription)
  const subscription = await stripe.subscriptions.retrieve(subscriptId);

  // os dados relacionados a inscrição a serem salvos no banco
  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  }

  if (createAction) {
    // salva a subscription do usuário no banco
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscriptionData }
      )
    );
  } else {
    // atualiza os dados da assinatura
    await fauna.query(
      q.Replace( // substitui todo o conteúdo do registro com a ref informada
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index('subscription_by_id'),
              subscriptId,
            )
          )
        ),
        { data: subscriptionData } // o conteúdo a ser adicionado no registro
      )
    );
  }
}