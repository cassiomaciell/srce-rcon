```JavaScript
const SRCERcon = require("srce-rcon");

const rcon = new SRCERcon.RCON("127.0.0.1", 27915, "12345678");

rcon.on("serverdata_response_value", (data) => {
    console.log("RCON RESPONSE\n", data.body);
});
rcon.on("serverdata_auth_response", (success) => {
    console.log("RCON LOGIN", success);
    if (success) rcon.sendCommand("help");
});
```
