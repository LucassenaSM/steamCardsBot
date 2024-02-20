var msg = "";
var pTime = null;
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
  {
    site: "https://www.steamcardexchange.net/index.php?inventorygame-appid-368230",
    name: "Farmer",
  },
  {
    site: "https://www.steamcardexchange.net/index.php?inventorygame-appid-368230",
    name: "Greed",
  },
  {
    site: "https://www.steamcardexchange.net/index.php?inventorygame-appid-368230",
    name: "Worker",
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
console.table(cards);

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

async function processTime() {
  if (process.uptime() < 60) {
    return `Tempo de execução: ${process.uptime().toFixed()} segundos`;
  } else if (process.uptime() >= 60 && process.uptime() < 3600) {
    let minutos = Math.floor(process.uptime() / 60);
    let segundos = process.uptime() % 60;
    return `Tempo de execução: ${minutos.toFixed()} minuto(s) e ${segundos.toFixed()} segundo(s)`;
  } else {
    let horas = Math.floor(process.uptime() / 3600);
    let minutos = Math.floor((process.uptime() % 3600) / 60);
    return `Tempo de execução: ${horas.toFixed()} hora(s) e ${minutos.toFixed()} minuto(s)`;
  }
}

async function run() {
  var active = true;
  while (active) {
    try {
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      if (active == true) {
        console.log(`Cartas Sendo analisadas:`);
        for (let i = 0; i < cards.length; i++) {
          await page.goto(`${cards[i].site}`);
          // Encontre o elemento da contagem na página
          let nameElements = await page.$$(".text-sm.break-words");
          for (let element of nameElements) {
            let name = await page.evaluate((el) => el.textContent, element);
            if (name === `${cards[i].name}`) {
              let paddedName = cards[i].name.padEnd(10, " ");
              // Obtenha o elemento pai
              let parentElement = (await element.$x(".."))[0];

              let red = await parentElement.$(".text-key-red");
              let grey = await parentElement.$(".text-key-grayscale");
              let green = await parentElement.$(".text-key-green");
              let yellow = await parentElement.$(".text-key-yellow");
              console.log("\x1b[37m", `----------------------------------`);
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
                      `|${paddedName}\t|\t${number} carta(s)|`
                    );
                    break;
                  case "rgb(255, 255, 255)":
                    console.log(
                      "\x1b[2m\x1b[37m%s\x1b[0m",
                      ` |${paddedName}\t|\t${number} carta(s)|`
                    );
                    break;
                  case "rgb(248, 210, 16)":
                    console.log(
                      "\x1b[33m%s\x1b[0m",
                      `|${paddedName}\t|\t${number} carta(s)|`
                    );
                    break;
                  default:
                    console.log(
                      "\x1b[32m",
                      `|${paddedName}\t|\t${number} carta(s)|`
                    );
                    break;
                }
                msg += `<pre style="font-family:verdana; color:${color}; padding: 1em; border: 1px solid #ffffff; border-radius: 10px; height: 1em; margin:0px;">${paddedName}\t<span style="font-weight: 900;">|\t</span>${number} carta(s)</pre>`;
                app.get("/", async (req, res) => {
                  let time = await processTime();
                  pTime = `<p style="font-family:verdana; color: #FFFFFF; padding: 1em;">${time}</p>`;
                  if (active) {
                    res.send(
                      `<body style="background-color: #1f2124; font-family: sans-serif; padding:0px; margin:0px; width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;"><div style="display:flex; flex-direction: row; justify-content:space-between; width:100vw;align-items: baseline;"><h1 style="color: #FFFFFF; margin-left:1em;">Steam Cards Bot</h1><span style="color: #FFFFFF;">Ativação:<button onclick="window.location.href='/ativar'" style="background-color: #4CAF50; margin: 10px; border: none; border-radius:10px; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;">Ativar</button><button onclick="window.location.href='/desativar'" style="background-color: #f44336; border: none; border-radius:10px; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;">Desativar</button></span><h2><a href="https://github.com/LucassenaSM" style="color:#FFFFFF; text-decoration:none; margin-right:1em;";>By: Lucas Sena</a></h2></div><div style="width: 100vw; height: 100vh; display: flex; flex-direction: row; gap: 10px 1em; justify-content: center; align-items: center; flex-wrap: wrap; align-content: center;">${msg}</div>${pTime}</body>`
                    );
                  } else {
                    res.send(
                      `<body style="background-color: #1f2124; color: #FFFFFF; font-family: sans-serif; padding:0px; margin:0px; width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;"><div style="display:flex; flex-direction: row; justify-content:space-between; width:100vw;align-items: baseline;"><h1 style="color: #FFFFFF; margin-left:1em;">Steam Cards Bot</h1><span style="color: #FFFFFF;">Ativação:<button onclick="window.location.href='/ativar'" style="background-color: #4CAF50; margin: 10px; border: none; border-radius:10px; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;">Ativar</button><button onclick="window.location.href='/desativar'" style="background-color: #f44336; border: none; border-radius:10px; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;">Desativar</button></span><h2><a href="https://github.com/LucassenaSM" style="color:#FFFFFF; text-decoration:none; margin-right:1em;";>By: Lucas Sena</a></h2></div><div style="width: 100vw; height: 100vh; display: flex; flex-direction: row; gap: 10px 1em; justify-content: center; align-items: center; flex-wrap: wrap; align-content: center;"><h1>Script Desativado</h1></div>${pTime}</body>`
                    );
                  }
                });
              }
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
          await new Promise((r) => setTimeout(r, 50000));
          break;
        }
      }
      console.log("\x1b[37m", `----------------------------------`);
      console.log(await processTime());
      await browser.close();
      app.get("/ativar", (req, res) => {
        if (active) {
          res.send(
            `<script>alert("Já está ativado");window.location.href = '/';</script>Ativado com sucesso`
          );
        } else {
          active = true;
          console.log(active);
          run();
          res.send(
            `<body style="background-color: #1f2124; color: #FFFFFF; font-family: sans-serif; padding:0px; margin:0px; width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;"><div style="display:flex; flex-direction: row; justify-content:space-between; width:100vw;align-items: baseline;"><h1 style="color: #FFFFFF; margin-left:1em;">Steam Cards Bot</h1><span style="color: #FFFFFF;">Ativação:<button onclick="window.location.href='/ativar'" style="background-color: #4CAF50; margin: 10px; border: none;border-radius:10px;  color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;">Ativar</button><button onclick="window.location.href='/desativar'" style="background-color: #f44336; border: none; border-radius:10px; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;">Desativar</button></span><h2><a href="https://github.com/LucassenaSM" style="color:#FFFFFF; text-decoration:none; margin-right:1em;";>By: Lucas Sena</a></h2></div><div style="width: 100vw; height: 100vh; display: flex; flex-direction: row; gap: 10px 1em; justify-content: center; align-items: center; flex-wrap: wrap; align-content: center;"><h1>Ativando o Script...</h1></div>${pTime}</body><script>setTimeout(function () {window.location.href = '/';}, 10000);</script>`
          );
        }
      });

      app.get("/desativar", (req, res) => {
        active = false;
        console.log(active);
        res.send(
          `<script>window.location.href = '/';</script>Desativado com sucesso`
        );
        msg = "";
      });
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
      await new Promise((r) => setTimeout(r, 60000));
      fs.utimesSync("app.js", new Date(), new Date());
      console.log("Script reiniciado após erros");
      break;
    }
  }
}

run();
