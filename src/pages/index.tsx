import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import styles from './home.module.scss';

/*
 * O componente Head pode ser adicionado em qualquer lugar do componente para
 * renderizar o conteúdo que estiver dentro dele no head da aplicação ao acessar
 * este componente. É utilizado para fazer SEO.
 * 
 * ATENÇÃO, as pages no Next obrigam export default.
 */
export default function Home() {
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
            <span>for $9.90 month</span>
          </p>

          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </>
  )
}
