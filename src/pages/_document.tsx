import Document, { Html, Head, Main, NextScript } from 'next/document';

/*
 * O _document é o único component do Next que precisa ser escrito em formato de
 * classe, pois o Next aínda não da suporte para que ele seja escrito em formato 
 * de função.
 * O _document serve para fazer o carregamento únido de componentes em nossas
 * aplicações Next, pois no next ao acessar qualquer rota todo o _app será 
 * recarregado completamente novamente, incluindo seus estados.
 * 
 * O _document então é equivalente ao arquivo public/index.html das aplicações
 * criadas com o create react-app.
 * 
 * Sempre que o _document é alterado é preciso reiniciar a execução da aplicação.
 * 
 * O componente NextScript precisa ficar no final do body por ele é lugar onde
 * o Next irá colocar todos os script necessários para a aplicação funcionar.
 */
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet" />

          <link rel="shortcut icon" href="/favicon.png" type="image/png"/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}