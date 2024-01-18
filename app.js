var msg = "";
const cards = [
  {
    site: "https://www.steamcardexchange.net/index.php?inventorygame-appid-461950",
    name: "Jew",
  },
  {
    site: "https://www.steamcardexchange.net/index.php?inventorygame-appid-461950",
    name: "Louie",
  },
  {
    site: "https://www.steamcardexchange.net/index.php?inventorygame-appid-461950",
    name: "Gang",
  },
];

const fs = require("fs");
const { exec } = require("child_process");
const cron = require("node-cron");
const puppeteer = require("puppeteer");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
require("dotenv").config();

console.log(
  "\x1b[34m%s\x1b[0m",
  `
 ::::::::   :::::::::: ::::    :::     :::
:+:    :+:  ::+:       :+:+:   :+:   :+: :+:
+:+         +:+        :+:+:+  +:+  +:+   +:+
+#++:++#++  +#++:++#   +#+ +:+ +#+ +#++:++#++:
       +#+  +#+        +#+  #+#+#+     +#+
#+#    #+#  #+#        #+#   #+#+# #+#     #+#
 ########   ########## ###   ##### ###     ### `
);
server.listen(4000, () => console.log("Servidor rodando na porta 4000"));

async function loginAndPost(page, card) {
  await page.goto(`https://discord.com/login`);
  await page.waitForSelector('input[name="email"]');
  await page.focus('input[name="email"]');
  await page.keyboard.type(`${process.env.EMAIL}`);
  await page.focus('input[name="password"]');
  await page.keyboard.type(`${process.env.SENHA}`);
  await page.waitForSelector('button[type="submit"]');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 3000));
  await page.keyboard.down("Control");
  await page.keyboard.press("KeyK");
  await page.keyboard.up("Control");
  await page.focus('input[aria-label="Troca rápida"]');
  await page.keyboard.type(`${process.env.USER}`);
  await new Promise((r) => setTimeout(r, 3000));
  await page.keyboard.press("Enter");
  await page.waitForSelector('div[role="textbox"]');
  await page.click('div[role="textbox"]');
  await page.keyboard.type(
    `:warning: Carta ${card.name} disponivel para troca :flower_playing_cards:`
  );
  await page.keyboard.press("Enter");
}

async function run() {
  while (true) {
    try {
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      console.log(`Cartas Sendo analizadas:`);
      for (let i = 0; i < cards.length; i++) {
        await page.goto(`${cards[i].site}`);
        // Encontre o elemento da contagem na página
        let nameElements = await page.$$(".text-sm.break-words");
        for (let element of nameElements) {
          let name = await page.evaluate((el) => el.textContent, element);
          if (name === `${cards[i].name}`) {
            // Obtenha o elemento pai
            let parentElement = (await element.$x(".."))[0];

            let red = await parentElement.$(".text-key-red");
            let grey = await parentElement.$(".text-key-grayscale");
            let green = await parentElement.$(".text-key-green");
            let yellow = await parentElement.$(".text-key-yellow");
            let colorElement = red || grey || green || yellow;
            if (colorElement) {
              var value = await page.evaluate(
                (el) => el.textContent,
                colorElement
              );
              var color = await page.evaluate(
                (el) => getComputedStyle(el).color,
                colorElement
              );
              var number = parseInt(value.split(" ")[1]);
              switch (color) {
                case "rgb(181, 36, 38)":
                  console.log(
                    "\x1b[31m",
                    `${cards[i].name} possuí ${number} carta(s)`
                  );
                  break;
                case "rgb(255, 255, 255)":
                  console.log(
                    "\x1b[2m\x1b[37m%s\x1b[0m",
                    `${cards[i].name} possuí ${number} carta(s)`
                  );
                  break;
                case "rgb(248, 210, 16)":
                  console.log(
                    "\x1b[33m%s\x1b[0m",
                    `${cards[i].name} possuí ${number} carta(s)`
                  );
                  break;
                default:
                  console.log(
                    "\x1b[32m",
                    `${cards[i].name} possuí ${number} carta(s)`
                  );
                  break;
              }
              console.log("\x1b[37m", `--------------------------------`);
              msg += `<p style="font-family:verdana; color:${color}; background-color: black; padding: 1em;">${cards[i].name} possuí ${number} carta(s)</p>`;
              app.get("/", (req, res) => {
                res.send(msg);
              });
            }
          }
        }

        if (number > 1) {
          exec("alert.vbs", (error, stdout, stderr) => {
            if (error) {
              console.error(`Erro ao executar o arquivo VBS: ${error}`);
              return;
            }
          });
          loginAndPost(page, cards[i]);
          cards.splice(i, 1);

          const vbsCode = `Set WshShell = WScript.CreateObject("WScript.Shell")\nWshShell.Run "${cards[i].site}"`;
          fs.writeFile("abrir_site.vbs", vbsCode, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log("Arquivo VBScript criado com sucesso!");
          });
          exec("cscript abrir_site.vbs", (err, stdout, stderr) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log("Arquivo VBScript executado com sucesso!");
          });
          await new Promise((r) => setTimeout(r, 3000));
          fs.unlink("abrir_site.vbs", (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log("Arquivo VBScript apagado com sucesso!");
          });
        }
      }
      if (process.uptime() < 60) {
        console.log(
          `Tempo de execução: ${process.uptime().toFixed()} segundos`
        );
      } else if (process.uptime() >= 60 && process.uptime() < 3600) {
        let minutos = Math.floor(process.uptime() / 60);
        let segundos = process.uptime() % 60;
        console.log(
          `Tempo de execução: ${minutos.toFixed()} minutos e ${segundos.toFixed()} segundos`
        );
      } else {
        let horas = Math.floor(process.uptime() / 3600);
        let minutos = Math.floor((process.uptime() % 3600) / 60);
        console.log(
          `Tempo de execução: ${horas.toFixed()} horas e ${minutos.toFixed()} minutos`
        );
      }
      await browser.close();
      cron.schedule("1 */2 * * *", function () {
        try {
          fs.utimesSync("app.js", new Date(), new Date());
          console.log("Script reiniciado para evitar erros");
        } catch (e) {
          console.error(e);
        }
      });
      await new Promise((r) => setTimeout(r, 120000));
      msg = "";
    } catch (error) {
      console.error(error);
      await new Promise((r) => setTimeout(r, 120000));
      fs.utimesSync("app.js", new Date(), new Date());
      console.log("Script reiniciado após erros");
      break;
    }
  }
}

run();
