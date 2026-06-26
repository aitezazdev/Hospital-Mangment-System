import dns from "dns";


dns.setServers(["8.8.8.8", "1.1.1.1"]);
console.log("Global DNS resolution servers set to: 8.8.8.8, 1.1.1.1");
