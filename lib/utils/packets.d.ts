/// <reference types="node" />
export interface IResponse {
    size: number;
    id: number;
    type: number;
    body: string;
}
declare function request(id: number, type: number, body: string): Buffer;
declare function response(buffer: Buffer): IResponse;
declare const _default: {
    request: typeof request;
    response: typeof response;
};
export default _default;
