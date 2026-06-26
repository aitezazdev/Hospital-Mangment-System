import dns from "dns";

// Set global DNS servers to Google & Cloudflare to bypass local stub resolver timeouts
dns.setServers(["8.8.8.8", "1.1.1.1"]);
console.log("Global DNS resolution servers set to: 8.8.8.8, 1.1.1.1");
