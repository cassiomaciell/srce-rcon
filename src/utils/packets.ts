export interface IResponse {
    size: number;
    id: number;
    type: number;
    body: string;
}

function request(id: number, type: number, body: string) {
	let size = Buffer.byteLength(body) + 14;
	let buffer = Buffer.alloc(size);

	buffer.writeInt32LE(size - 4, 0);
	buffer.writeInt32LE(id, 4);
	buffer.writeInt32LE(type, 8);
	buffer.write(body, 12, size - 2, "ascii");
	buffer.writeInt16LE(0, size - 2);

	return buffer;
}

function response(buffer: Buffer): IResponse {
	return {
		size: buffer.readInt32LE(0),
		id: buffer.readInt32LE(4),
		type: buffer.readInt32LE(8),
		body: buffer.toString("ascii", 12, buffer.length - 2),
	};
}

export default {
    request,
    response
}