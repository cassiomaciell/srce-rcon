/// <reference types="node" />
import EventEmitter from "events";
import { IResponse } from "./utils/packets";
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
export declare class RCON extends EventEmitter {
    private client;
    constructor(host: string, port: number, password: string);
    private login;
    sendCommand(command: string): void;
}
