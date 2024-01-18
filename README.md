# README

## Visão geral
Este script automatiza o monitoramento de cartas de troca específicas no Steamcardexchange.net e envia alertas quando certas condições são atendidas. Ele também fornece uma interface web simples para visualizar o status das cartas.

## Requisitos
Para usar este script, você precisará dos seguintes itens:

- Node.js (versão 14 ou posterior) e npm (ou yarn)
- Puppeteer (uma biblioteca Node.js para controlar o Chromium)
- Express (um framework web Node.js)
- cron (uma biblioteca Node.js para agendar tarefas)
- dotenv (uma biblioteca Node.js para carregar variáveis de ambiente)
- Chromium (Uma Versão de desenvolvedor do Google Chrome)
- Uma conta secundária do Discord sem 2FA(Opcional)

## Instalação
Instale as dependências:

```npm install puppeteer express cron dotenv chromium```

### Crie um arquivo .env:
No mesmo diretório do script, crie um arquivo chamado `.env` e adicione as seguintes variáveis:
```
EMAIL=seu_e-mail_do_Discord
SENHA=sua_senha_do_Discord
USER=usuário_do_Discord_para_enviar_alertas
````
### Executando o script
Abra um terminal no diretório do script.
Execute o script:
```node app.js```
ou crie um atalho do arquivo `SteamCardsBot.bat` para a área de trabalho e mude o caminho dentro do arquivo para onde estão os arquivos e caso esteja escrito `nodemon app.js` coloque `node app.js`.

## Uso
- O script começará a ser executado e monitorando as cartas especificadas.
- Você pode acessar a interface web para visualizar o status das cartas abrindo http://localhost:4000 em um navegador da web.
- O script enviará automaticamente alertas do Discord quando certas condições forem atendidas.

> [!WARNING]
> Mantenha a tela do dispositivo ligada para evitar erros.

## Explicação dos principais pontos:

- O script usa a biblioteca Puppeteer para controlar o Chromium. Isso significa que o Chromium será executado em segundo plano sem exibir uma janela.
- O script usa a biblioteca Express para criar uma interface web simples. Esta interface web permite que você visualize o status das cartas em tempo real.
- O script usa a biblioteca cron para reiniciar automaticamente a cada 2 horas. Isso ajuda a evitar problemas causados por erros ou falhas do sistema.
- O script usa VBScript para abrir links externos. Isso permite que o script envie alertas do Discord com links para as cartas monitoradas.


## Como personalizar o script:

Você pode personalizar o script modificando o array cards. Esse array contém as informações sobre as cartas que você deseja monitorar. Cada item do array tem os seguintes campos:

site: O URL do site da carta.
name: O nome da carta.
Por exemplo, para monitorar as cartas "Jew" e "Louie", você pode modificar o array cards da seguinte forma:

```
const cards = [
  {
    site: "https://www.steamcardexchange.net/index.php?inventorygame-appid-461950",
    name: "Jew",
  },
  {
    site: "https://www.steamcardexchange.net/index.php?inventorygame-appid-461950",
    name: "Louie",
  },
];
```

## Alertas e Ações
Alertas e ações são acionados quando as condições são atendidas.

### Msgbox
Uma caixa de texto é exibida na tela do dispositivo.

### Discord
O script insere os dados (que estão no arquivo `.env` criado anteriormente) da sua conta secundária no site de login do Discord e envia uma mensagem para a sua conta principal.

Se você preferir não receber essa notificação no Discord, ou se não tiver ou não quiser criar uma conta, você pode remover a linha:
```
loginAndPost(page, cards[i]);
```
Além disso, você pode remover completamente a função `loginAndPost`.

### Site
O site onde a carta está localizada é aberto automaticamente.

## Notas adicionais
- Personalização: Você pode modificar o array cards para monitorar diferentes cartas.
- Gerenciamento de erros: O script inclui um gerenciamento básico de erros e tentará reiniciar se ocorrerem erros.
- Agendamento: O script usa cron para reiniciar automaticamente a cada 2 horas para evitar possíveis problemas.
- VBScript: O script usa VBScript para abrir links externos. Se você encontrar problemas, certifique-se de que o VBScript esteja ativado no seu sistema.
- Espero que este README seja útil! Sinta-se à vontade para entrar em contato se tiver mais alguma dúvida.

## Como enviar feedback:

Se você tiver alguma dúvida ou feedback sobre este script, sinta-se à vontade para entrar em contato.
