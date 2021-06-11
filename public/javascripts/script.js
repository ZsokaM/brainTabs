require("../../node_modules/dotenv").config();

const head = document.getElementsByTagName("head")[0];
const tinyScript = document.createElement("script");

tinyScript.src = `https://cdn.tiny.cloud/1/${process.env.TINY_KEY}/tinymce/5/tinymce.min.js`;

tinyScript.referrelpolicy = "origin";

head.appendChild(tinyScript);
