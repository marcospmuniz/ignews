import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string,
    amount: number
  }
}

/*
 * O componente Head pode ser adicionado em qualquer lugar do componente para
 * renderizar o conteúdo que estiver dentro dele no head da aplicação ao acessar
 * este componente. É utilizado para fazer SEO.
 * 
 * ATENÇÃO, as pages no Next obrigam export default.
 */
export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>IgNews - Home | Aplicação Next.js</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👋 Hey, Welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async function() {

  const price = await stripe.prices.retrieve('price_1IoPFoDT8YOCvm7FEa2zIbR7');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(price.unit_amount / 100), // o preço vem em centavos
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24 // 24h - tempo para expiração do html estático
  }
}