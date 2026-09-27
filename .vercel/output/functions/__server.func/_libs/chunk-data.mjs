//#region node_modules/chunk-data/index.js
var toUint8Array = (data) => data instanceof Uint8Array ? data : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
function* chunk(data, chunkSize) {
	if (!ArrayBuffer.isView(data)) throw new TypeError("Expected data to be ArrayBufferView");
	if (!Number.isSafeInteger(chunkSize) || chunkSize <= 0) throw new TypeError("Expected chunkSize to be a positive integer");
	const uint8Array = toUint8Array(data);
	for (let offset = 0; offset < uint8Array.length; offset += chunkSize) yield uint8Array.subarray(offset, offset + chunkSize);
}
//#endregion
export { chunk as t };
