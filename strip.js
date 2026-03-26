const { execSync } = require("child_process");
try {
  execSync("npx prisma validate --schema test.prisma", { stdio: "pipe" });
  console.log("SUCCESS");
} catch (e) {
  let err = e.stderr.toString() + e.stdout.toString();
  // Strip ansi
  err = err.replace(/\u001b\[\d+m/g, "").replace(/\u001b\[\d+;\d+m/g, "");
  console.log("ERROR OUTPUT:");
  console.log(err);
}
