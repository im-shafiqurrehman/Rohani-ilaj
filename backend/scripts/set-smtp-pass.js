#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const ENV = path.join(__dirname, "..", ".env");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Mask typing so the password never appears in the terminal or scrollback.
rl.input.on("keypress", () => {
  readline.moveCursor(rl.output, -rl.line.length, 0);
  readline.clearLine(rl.output, 1);
  rl.output.write("App Password: " + "*".repeat(rl.line.length));
});

rl.question("App Password: ", (answer) => {
  rl.close();
  console.log();

  const clean = String(answer).replace(/\s/g, "").replace(/^["']|["']$/g, "");

  if (clean.length !== 16) {
    console.error(
      `\nRejected: got ${clean.length} characters, expected exactly 16.` +
        `\nSelect the whole password — all four groups of four — or generate a` +
        `\nfresh one at myaccount.google.com/apppasswords\n`
    );
    process.exit(1);
  }
  if (!/^[a-z]{16}$/.test(clean)) {
    console.error("\nRejected: App Passwords are 16 lowercase letters (a-z).\n");
    process.exit(1);
  }

  let env = fs.readFileSync(ENV, "utf8");
  env = /^SMTP_PASS=.*$/m.test(env)
    ? env.replace(/^SMTP_PASS=.*$/m, `SMTP_PASS=${clean}`)
    : env.trimEnd() + `\nSMTP_PASS=${clean}\n`;
  fs.writeFileSync(ENV, env);

  console.log("Saved 16 characters to backend/.env (no spaces).");
  console.log("Now run:  npm run test:email\n");
});
