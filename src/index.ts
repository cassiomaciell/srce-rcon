import EventEmitter from "events";
import net from "net";
import packets, { IResponse } from "./utils/packets";

export declare interface RCON {
	on(event: "serverdata_auth_response", listener: (success: boolean) => void): this;
	on(event: "serverdata_response_value", listener: (response: IResponse) => void): this;
	on(event: "error", listener: (error: Error) => void): this;
	on(event: "data", listener: (data: Buffer) => void): this;
	on(event: "close", listener: (hadError: boolean) => void): this;
	on(event: "connected", listener: (rcon: this) => void): this;
	on(event: "wrong_password", listener: () => void): this;
	on(event: string, listener: Function): this;
}

export class RCON extends EventEmitter {
	private client: net.Socket;
	constructor(host: string, port: number, password: string) {
		super();
		this.client = net.createConnection(port, host, () => {
			this.client.on("data", (data) => {
				this.emit("data", data);
				const response = packets.response(data);
				switch (response.type) {
					case 2:
						const success = response.id < 0 ? false : true;
						this.emit("serverdata_auth_response", success);
						if (success) {
							this.emit("connected", this);
						} else {
							this.emit("wrong_password");
							this.client.destroy();
						}
						break;
					case 0:
						this.emit("serverdata_response_value", response);
						break;
				}
			});
			this.login(password);
		});
		this.client.once("close",(hadError)=>{
			this.emit("close", hadError)
		})
		this.client.once("error", (err) => {
			this.emit("error", err);
		});
	}
	private login(password: string) {
		this.client.write(packets.request(1, 3, password));
	}
	public sendCommand(command: string) {
		this.client.write(packets.request(1, 2, command));
	}
}
