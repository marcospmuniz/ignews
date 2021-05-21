import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from "../../services/stripe";

async function buffer(readable: Readable) {
	const chunks = [];

	for await (const chunk of readable) {
		chunks.push(
			typeof chunk === "string" ? Buffer.from(chunk) : chunk
		);
	}

	return Buffer.concat(chunks);
}

// Por padrão o next sempre faz o JSON.parse() das requests recebidas,
// como aqui a requisição retorna um strem, precisamos exportar essa
// config para desabilitar o JSON.parse nas request.
export const config = {
  api: {
    bodyParser: false
  }
}

// evento(s) que queremos ouvir do Stripe
const relevantEvents = new Set([
	'checkout.session.completed'
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const secret = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    const type = event.type; // pega o tipo do evento retornado no webhook

    if (relevantEvents.has(type)) {
      // o evento recebido é do tipo desejado
      console.log('Evento recebido', event);
    }

    res.json({received: true});
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed!');
  }
}