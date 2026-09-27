import { r as mimicResponse } from "./cacheable-request+[...].mjs";
import { PassThrough, Transform } from "node:stream";
import zlib from "node:zlib";
//#region node_modules/decompress-response/index.js
var supportsZstd = typeof zlib.createZstdDecompress === "function";
function decompressResponse(response) {
	const contentEncoding = (response.headers["content-encoding"] || "").toLowerCase();
	const supportedEncodings = [
		"gzip",
		"deflate",
		"br"
	];
	if (supportsZstd) supportedEncodings.push("zstd");
	if (!supportedEncodings.includes(contentEncoding)) return response;
	let isEmpty = true;
	const headers = { ...response.headers };
	const finalStream = new PassThrough({ autoDestroy: false });
	finalStream.once("error", () => {
		response.destroy();
	});
	function handleContentEncoding(data) {
		let decompressStream;
		if (contentEncoding === "zstd") decompressStream = zlib.createZstdDecompress();
		else if (contentEncoding === "br") decompressStream = zlib.createBrotliDecompress();
		else if (contentEncoding === "deflate" && data.length > 0 && (data[0] & 8) === 0) decompressStream = zlib.createInflateRaw();
		else decompressStream = zlib.createUnzip();
		decompressStream.once("error", (error) => {
			if (isEmpty && !response.readable) {
				finalStream.end();
				return;
			}
			finalStream.destroy(error);
		});
		checker.pipe(decompressStream).pipe(finalStream);
	}
	const checker = new Transform({
		transform(data, _encoding, callback) {
			if (isEmpty === false) {
				callback(null, data);
				return;
			}
			isEmpty = false;
			handleContentEncoding(data);
			callback(null, data);
		},
		flush(callback) {
			if (isEmpty) finalStream.end();
			callback();
		}
	});
	delete headers["content-encoding"];
	delete headers["content-length"];
	finalStream.headers = headers;
	mimicResponse(response, finalStream);
	response.pipe(checker);
	return finalStream;
}
//#endregion
export { decompressResponse as t };
