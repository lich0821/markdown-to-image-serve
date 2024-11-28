import { NextApiRequest, NextApiResponse } from "next";
// import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
const chromium = require("@sparticuz/chromium-min");
const puppeteer = require("puppeteer-core");

export const maxDuration = 30; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只支持 POST 请求" });
  }

  try {
    const { markdown } = req.body;

    // 启动浏览器
    // const browser = await puppeteer.launch({ headless: true });
    // const browser = await puppeteer.launch({
    //   headless: true,
    //   executablePath: process.env.CHROME_PATH || '/opt/bin/chromium',
    //   args: ['--no-sandbox', '--disable-setuid-sandbox']
    // });
    const browser = await puppeteer.launch({
      // args: [...chromium.args, '--hide-scrollbars', '--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox'],
      // 只有 production 环境才需要 args
      args:
        process.env.NODE_ENV === "production"
          ? [
              ...chromium.args,
              "--hide-scrollbars",
              "--disable-web-security",
              "--no-sandbox",
              "--disable-setuid-sandbox",
            ]
          : [],
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.NODE_ENV === "production"
          ? await chromium.executablePath(
              `https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar`
            )
          : process.env.CHROME_PATH,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // 设置视口大小
    await page.setViewport({ width: 1200, height: 1600 });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = `/poster?content=${encodeURIComponent(markdown)}`;
    const fullUrl = `${baseUrl}${url}`;

    await page.goto(fullUrl);

    // 等待海报元素渲染完成
    await page.waitForSelector(".poster-content");

    // 等待所有图片加载完成
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.onload = img.onerror = resolve;
              })
          )
      );
    });
    // 获取元素
    const element = await page.$(".poster-content");

    if (!element) {
      throw new Error("Poster element not found");
    }

    // 获取元素的边界框
    const box = await element.boundingBox();
    if (!box) {
      throw new Error("Could not get element bounds");
    }

    // 直接获取 base64 格式的截图
    const base64Image = await page.screenshot({
      clip: {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
      },
      encoding: "base64",
    });

    await browser.close();

    res.status(200).json({  base64: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate poster" });
  }
}
