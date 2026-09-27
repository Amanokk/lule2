//#region node_modules/byte-counter/utilities.js
var textEncoder = new TextEncoder();
function byteLength(data) {
	if (typeof data === "string") return textEncoder.encode(data).byteLength;
	if (ArrayBuffer.isView(data) || data instanceof ArrayBuffer || data instanceof SharedArrayBuffer) return data.byteLength;
	return 0;
}
//#endregion
export { byteLength as t };
