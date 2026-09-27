import { o as __toESM, t as __commonJSMin } from "../_runtime.mjs";
import { t as h } from "./sec-ant__readable-stream.mjs";
import { n as defaultSerialize, t as defaultDeserialize } from "./keyv__serialize.mjs";
import stream, { PassThrough, Readable } from "node:stream";
import crypto from "node:crypto";
import EventEmitter$1 from "node:events";
import urlLib, { URL as URL$1 } from "node:url";
//#region node_modules/is-stream/index.js
function isStream(stream, { checkOpen = true } = {}) {
	return stream !== null && typeof stream === "object" && (stream.writable || stream.readable || !checkOpen || stream.writable === void 0 && stream.readable === void 0) && typeof stream.pipe === "function";
}
function isReadableStream(stream, { checkOpen = true } = {}) {
	return isStream(stream, { checkOpen }) && (stream.readable || !checkOpen) && typeof stream.read === "function" && typeof stream.readable === "boolean" && typeof stream.readableObjectMode === "boolean" && typeof stream.destroy === "function" && typeof stream.destroyed === "boolean";
}
//#endregion
//#region node_modules/get-stream/source/stream.js
var getAsyncIterable = (stream) => {
	if (isReadableStream(stream, { checkOpen: false }) && nodeImports.on !== void 0) return getStreamIterable(stream);
	if (typeof stream?.[Symbol.asyncIterator] === "function") return stream;
	if (toString.call(stream) === "[object ReadableStream]") return h.call(stream);
	throw new TypeError("The first argument must be a Readable, a ReadableStream, or an async iterable.");
};
var { toString } = Object.prototype;
var getStreamIterable = async function* (stream) {
	const controller = new AbortController();
	const state = {};
	handleStreamEnd(stream, controller, state);
	try {
		for await (const [chunk] of nodeImports.on(stream, "data", { signal: controller.signal })) yield chunk;
	} catch (error) {
		if (state.error !== void 0) throw state.error;
		else if (!controller.signal.aborted) throw error;
	} finally {
		stream.destroy();
	}
};
var handleStreamEnd = async (stream, controller, state) => {
	try {
		await nodeImports.finished(stream, {
			cleanup: true,
			readable: true,
			writable: false,
			error: false
		});
	} catch (error) {
		state.error = error;
	} finally {
		controller.abort();
	}
};
var nodeImports = {};
//#endregion
//#region node_modules/get-stream/source/contents.js
var getStreamContents = async (stream, { init, convertChunk, getSize, truncateChunk, addChunk, getFinalChunk, finalize }, { maxBuffer = Number.POSITIVE_INFINITY } = {}) => {
	const asyncIterable = getAsyncIterable(stream);
	const state = init();
	state.length = 0;
	try {
		for await (const chunk of asyncIterable) appendChunk({
			convertedChunk: convertChunk[getChunkType(chunk)](chunk, state),
			state,
			getSize,
			truncateChunk,
			addChunk,
			maxBuffer
		});
		appendFinalChunk({
			state,
			convertChunk,
			getSize,
			truncateChunk,
			addChunk,
			getFinalChunk,
			maxBuffer
		});
		return finalize(state);
	} catch (error) {
		const normalizedError = typeof error === "object" && error !== null ? error : new Error(error);
		normalizedError.bufferedData = finalize(state);
		throw normalizedError;
	}
};
var appendFinalChunk = ({ state, getSize, truncateChunk, addChunk, getFinalChunk, maxBuffer }) => {
	const convertedChunk = getFinalChunk(state);
	if (convertedChunk !== void 0) appendChunk({
		convertedChunk,
		state,
		getSize,
		truncateChunk,
		addChunk,
		maxBuffer
	});
};
var appendChunk = ({ convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer }) => {
	const chunkSize = getSize(convertedChunk);
	const newLength = state.length + chunkSize;
	if (newLength <= maxBuffer) {
		addNewChunk(convertedChunk, state, addChunk, newLength);
		return;
	}
	const truncatedChunk = truncateChunk(convertedChunk, maxBuffer - state.length);
	if (truncatedChunk !== void 0) addNewChunk(truncatedChunk, state, addChunk, maxBuffer);
	throw new MaxBufferError();
};
var addNewChunk = (convertedChunk, state, addChunk, newLength) => {
	state.contents = addChunk(convertedChunk, state, newLength);
	state.length = newLength;
};
var getChunkType = (chunk) => {
	const typeOfChunk = typeof chunk;
	if (typeOfChunk === "string") return "string";
	if (typeOfChunk !== "object" || chunk === null) return "others";
	if (globalThis.Buffer?.isBuffer(chunk)) return "buffer";
	const prototypeName = objectToString.call(chunk);
	if (prototypeName === "[object ArrayBuffer]") return "arrayBuffer";
	if (prototypeName === "[object DataView]") return "dataView";
	if (Number.isInteger(chunk.byteLength) && Number.isInteger(chunk.byteOffset) && objectToString.call(chunk.buffer) === "[object ArrayBuffer]") return "typedArray";
	return "others";
};
var { toString: objectToString } = Object.prototype;
var MaxBufferError = class extends Error {
	name = "MaxBufferError";
	constructor() {
		super("maxBuffer exceeded");
	}
};
//#endregion
//#region node_modules/get-stream/source/utils.js
var noop = () => void 0;
var throwObjectStream = (chunk) => {
	throw new Error(`Streams in object mode are not supported: ${String(chunk)}`);
};
var getLengthProperty = (convertedChunk) => convertedChunk.length;
//#endregion
//#region node_modules/get-stream/source/array-buffer.js
async function getStreamAsArrayBuffer(stream, options) {
	return getStreamContents(stream, arrayBufferMethods, options);
}
var initArrayBuffer = () => ({ contents: /* @__PURE__ */ new ArrayBuffer(0) });
var useTextEncoder = (chunk) => textEncoder.encode(chunk);
var textEncoder = new TextEncoder();
var useUint8Array = (chunk) => new Uint8Array(chunk);
var useUint8ArrayWithOffset = (chunk) => new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);
var truncateArrayBufferChunk = (convertedChunk, chunkSize) => convertedChunk.slice(0, chunkSize);
var addArrayBufferChunk = (convertedChunk, { contents, length: previousLength }, length) => {
	const newContents = hasArrayBufferResize() ? resizeArrayBuffer(contents, length) : resizeArrayBufferSlow(contents, length);
	new Uint8Array(newContents).set(convertedChunk, previousLength);
	return newContents;
};
var resizeArrayBufferSlow = (contents, length) => {
	if (length <= contents.byteLength) return contents;
	const arrayBuffer = new ArrayBuffer(getNewContentsLength(length));
	new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
	return arrayBuffer;
};
var resizeArrayBuffer = (contents, length) => {
	if (length <= contents.maxByteLength) {
		contents.resize(length);
		return contents;
	}
	const arrayBuffer = new ArrayBuffer(length, { maxByteLength: getNewContentsLength(length) });
	new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
	return arrayBuffer;
};
var getNewContentsLength = (length) => SCALE_FACTOR ** Math.ceil(Math.log(length) / Math.log(SCALE_FACTOR));
var SCALE_FACTOR = 2;
var finalizeArrayBuffer = ({ contents, length }) => hasArrayBufferResize() ? contents : contents.slice(0, length);
var hasArrayBufferResize = () => "resize" in ArrayBuffer.prototype;
var arrayBufferMethods = {
	init: initArrayBuffer,
	convertChunk: {
		string: useTextEncoder,
		buffer: useUint8Array,
		arrayBuffer: useUint8Array,
		dataView: useUint8ArrayWithOffset,
		typedArray: useUint8ArrayWithOffset,
		others: throwObjectStream
	},
	getSize: getLengthProperty,
	truncateChunk: truncateArrayBufferChunk,
	addChunk: addArrayBufferChunk,
	getFinalChunk: noop,
	finalize: finalizeArrayBuffer
};
//#endregion
//#region node_modules/get-stream/source/buffer.js
async function getStreamAsBuffer(stream, options) {
	if (!("Buffer" in globalThis)) throw new Error("getStreamAsBuffer() is only supported in Node.js");
	try {
		return arrayBufferToNodeBuffer(await getStreamAsArrayBuffer(stream, options));
	} catch (error) {
		if (error.bufferedData !== void 0) error.bufferedData = arrayBufferToNodeBuffer(error.bufferedData);
		throw error;
	}
}
var arrayBufferToNodeBuffer = (arrayBuffer) => globalThis.Buffer.from(arrayBuffer);
//#endregion
//#region node_modules/cacheable-request/node_modules/keyv/dist/index.js
var import_http_cache_semantics = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* @typedef {Object} HttpRequest
	* @property {Record<string, string>} headers - Request headers
	* @property {string} [method] - HTTP method
	* @property {string} [url] - Request URL
	*/
	/**
	* @typedef {Object} HttpResponse
	* @property {Record<string, string>} headers - Response headers
	* @property {number} [status] - HTTP status code
	*/
	/**
	* Set of default cacheable status codes per RFC 7231 section 6.1.
	* @type {Set<number>}
	*/
	var statusCodeCacheableByDefault = /* @__PURE__ */ new Set([
		200,
		203,
		204,
		206,
		300,
		301,
		308,
		404,
		405,
		410,
		414,
		501
	]);
	/**
	* Set of HTTP status codes that the cache implementation understands.
	* Note: This implementation does not understand partial responses (206).
	* @type {Set<number>}
	*/
	var understoodStatuses = /* @__PURE__ */ new Set([
		200,
		203,
		204,
		300,
		301,
		302,
		303,
		307,
		308,
		404,
		405,
		410,
		414,
		501
	]);
	/**
	* Set of HTTP error status codes.
	* @type {Set<number>}
	*/
	var errorStatusCodes = /* @__PURE__ */ new Set([
		500,
		502,
		503,
		504
	]);
	/**
	* Object representing hop-by-hop headers that should be removed.
	* @type {Record<string, boolean>}
	*/
	var hopByHopHeaders = {
		date: true,
		connection: true,
		"keep-alive": true,
		"proxy-authenticate": true,
		"proxy-authorization": true,
		te: true,
		trailer: true,
		"transfer-encoding": true,
		upgrade: true
	};
	/**
	* Headers that are excluded from revalidation update.
	* @type {Record<string, boolean>}
	*/
	var excludedFromRevalidationUpdate = {
		"content-length": true,
		"content-encoding": true,
		"transfer-encoding": true,
		"content-range": true
	};
	/**
	* Converts a string to a number or returns zero if the conversion fails.
	* @param {string} s - The string to convert.
	* @returns {number} The parsed number or 0.
	*/
	function toNumberOrZero(s) {
		const n = parseInt(s, 10);
		return isFinite(n) ? n : 0;
	}
	/**
	* Determines if the given response is an error response.
	* Implements RFC 5861 behavior.
	* @param {HttpResponse|undefined} response - The HTTP response object.
	* @returns {boolean} true if the response is an error or undefined, false otherwise.
	*/
	function isErrorResponse(response) {
		if (!response) return true;
		return errorStatusCodes.has(response.status);
	}
	/**
	* Parses a Cache-Control header string into an object.
	* @param {string} [header] - The Cache-Control header value.
	* @returns {Record<string, string|boolean>} An object representing Cache-Control directives.
	*/
	function parseCacheControl(header) {
		/** @type {Record<string, string|boolean>} */
		const cc = {};
		if (!header) return cc;
		const parts = header.trim().split(/,/);
		for (const part of parts) {
			const [k, v] = part.split(/=/, 2);
			cc[k.trim()] = v === void 0 ? true : v.trim().replace(/^"|"$/g, "");
		}
		return cc;
	}
	/**
	* Formats a Cache-Control directives object into a header string.
	* @param {Record<string, string|boolean>} cc - The Cache-Control directives.
	* @returns {string|undefined} A formatted Cache-Control header string or undefined if empty.
	*/
	function formatCacheControl(cc) {
		let parts = [];
		for (const k in cc) {
			const v = cc[k];
			parts.push(v === true ? k : k + "=" + v);
		}
		if (!parts.length) return;
		return parts.join(", ");
	}
	module.exports = class CachePolicy {
		/**
		* Creates a new CachePolicy instance.
		* @param {HttpRequest} req - Incoming client request.
		* @param {HttpResponse} res - Received server response.
		* @param {Object} [options={}] - Configuration options.
		* @param {boolean} [options.shared=true] - Is the cache shared (a public proxy)? `false` for personal browser caches.
		* @param {number} [options.cacheHeuristic=0.1] - Fallback heuristic (age fraction) for cache duration.
		* @param {number} [options.immutableMinTimeToLive=86400000] - Minimum TTL for immutable responses in milliseconds.
		* @param {boolean} [options.ignoreCargoCult=false] - Detect nonsense cache headers, and override them.
		* @param {any} [options._fromObject] - Internal parameter for deserialization. Do not use.
		*/
		constructor(req, res, { shared, cacheHeuristic, immutableMinTimeToLive, ignoreCargoCult, _fromObject } = {}) {
			if (_fromObject) {
				this._fromObject(_fromObject);
				return;
			}
			if (!res || !res.headers) throw Error("Response headers missing");
			this._assertRequestHasHeaders(req);
			/** @type {number} Timestamp when the response was received */
			this._responseTime = this.now();
			/** @type {boolean} Indicates if the cache is shared */
			this._isShared = shared !== false;
			/** @type {boolean} Indicates if legacy cargo cult directives should be ignored */
			this._ignoreCargoCult = !!ignoreCargoCult;
			/** @type {number} Heuristic cache fraction */
			this._cacheHeuristic = void 0 !== cacheHeuristic ? cacheHeuristic : .1;
			/** @type {number} Minimum TTL for immutable responses in ms */
			this._immutableMinTtl = void 0 !== immutableMinTimeToLive ? immutableMinTimeToLive : 864e5;
			/** @type {number} HTTP status code */
			this._status = "status" in res ? res.status : 200;
			/** @type {Record<string, string>} Response headers */
			this._resHeaders = res.headers;
			/** @type {Record<string, string|boolean>} Parsed Cache-Control directives from response */
			this._rescc = parseCacheControl(res.headers["cache-control"]);
			/** @type {string} HTTP method (e.g., GET, POST) */
			this._method = "method" in req ? req.method : "GET";
			/** @type {string} Request URL */
			this._url = req.url;
			/** @type {string} Host header from the request */
			this._host = req.headers.host;
			/** @type {boolean} Whether the request does not include an Authorization header */
			this._noAuthorization = !req.headers.authorization;
			/** @type {Record<string, string>|null} Request headers used for Vary matching */
			this._reqHeaders = res.headers.vary ? req.headers : null;
			/** @type {Record<string, string|boolean>} Parsed Cache-Control directives from request */
			this._reqcc = parseCacheControl(req.headers["cache-control"]);
			if (this._ignoreCargoCult && "pre-check" in this._rescc && "post-check" in this._rescc) {
				delete this._rescc["pre-check"];
				delete this._rescc["post-check"];
				delete this._rescc["no-cache"];
				delete this._rescc["no-store"];
				delete this._rescc["must-revalidate"];
				this._resHeaders = Object.assign({}, this._resHeaders, { "cache-control": formatCacheControl(this._rescc) });
				delete this._resHeaders.expires;
				delete this._resHeaders.pragma;
			}
			if (res.headers["cache-control"] == null && /no-cache/.test(res.headers.pragma)) this._rescc["no-cache"] = true;
		}
		/**
		* You can monkey-patch it for testing.
		* @returns {number} Current time in milliseconds.
		*/
		now() {
			return Date.now();
		}
		/**
		* Determines if the response is storable in a cache.
		* @returns {boolean} `false` if can never be cached.
		*/
		storable() {
			return !!(!this._reqcc["no-store"] && ("GET" === this._method || "HEAD" === this._method || "POST" === this._method && this._hasExplicitExpiration()) && understoodStatuses.has(this._status) && !this._rescc["no-store"] && (!this._isShared || !this._rescc.private) && (!this._isShared || this._noAuthorization || this._allowsStoringAuthenticated()) && (this._resHeaders.expires || this._rescc["max-age"] || this._isShared && this._rescc["s-maxage"] || this._rescc.public || statusCodeCacheableByDefault.has(this._status)));
		}
		/**
		* @returns {boolean} true if expiration is explicitly defined.
		*/
		_hasExplicitExpiration() {
			return !!(this._isShared && this._rescc["s-maxage"] || this._rescc["max-age"] || this._resHeaders.expires);
		}
		/**
		* @param {HttpRequest} req - a request
		* @throws {Error} if the headers are missing.
		*/
		_assertRequestHasHeaders(req) {
			if (!req || !req.headers) throw Error("Request headers missing");
		}
		/**
		* Checks if the request matches the cache and can be satisfied from the cache immediately,
		* without having to make a request to the server.
		*
		* This doesn't support `stale-while-revalidate`. See `evaluateRequest()` for a more complete solution.
		*
		* @param {HttpRequest} req - The new incoming HTTP request.
		* @returns {boolean} `true`` if the cached response used to construct this cache policy satisfies the request without revalidation.
		*/
		satisfiesWithoutRevalidation(req) {
			return !this.evaluateRequest(req).revalidation;
		}
		/**
		* @param {{headers: Record<string, string>, synchronous: boolean}|undefined} revalidation - Revalidation information, if any.
		* @returns {{response: {headers: Record<string, string>}, revalidation: {headers: Record<string, string>, synchronous: boolean}|undefined}} An object with a cached response headers and revalidation info.
		*/
		_evaluateRequestHitResult(revalidation) {
			return {
				response: { headers: this.responseHeaders() },
				revalidation
			};
		}
		/**
		* @param {HttpRequest} request - new incoming
		* @param {boolean} synchronous - whether revalidation must be synchronous (not s-w-r).
		* @returns {{headers: Record<string, string>, synchronous: boolean}} An object with revalidation headers and a synchronous flag.
		*/
		_evaluateRequestRevalidation(request, synchronous) {
			return {
				synchronous,
				headers: this.revalidationHeaders(request)
			};
		}
		/**
		* @param {HttpRequest} request - new incoming
		* @returns {{response: undefined, revalidation: {headers: Record<string, string>, synchronous: boolean}}} An object indicating no cached response and revalidation details.
		*/
		_evaluateRequestMissResult(request) {
			return {
				response: void 0,
				revalidation: this._evaluateRequestRevalidation(request, true)
			};
		}
		/**
		* Checks if the given request matches this cache entry, and how the cache can be used to satisfy it. Returns an object with:
		*
		* ```
		* {
		*     // If defined, you must send a request to the server.
		*     revalidation: {
		*         headers: {}, // HTTP headers to use when sending the revalidation response
		*         // If true, you MUST wait for a response from the server before using the cache
		*         // If false, this is stale-while-revalidate. The cache is stale, but you can use it while you update it asynchronously.
		*         synchronous: bool,
		*     },
		*     // If defined, you can use this cached response.
		*     response: {
		*         headers: {}, // Updated cached HTTP headers you must use when responding to the client
		*     },
		* }
		* ```
		* @param {HttpRequest} req - new incoming HTTP request
		* @returns {{response: {headers: Record<string, string>}|undefined, revalidation: {headers: Record<string, string>, synchronous: boolean}|undefined}} An object containing keys:
		*   - revalidation: { headers: Record<string, string>, synchronous: boolean } Set if you should send this to the origin server
		*   - response: { headers: Record<string, string> } Set if you can respond to the client with these cached headers
		*/
		evaluateRequest(req) {
			this._assertRequestHasHeaders(req);
			if (this._rescc["must-revalidate"]) return this._evaluateRequestMissResult(req);
			if (!this._requestMatches(req, false)) return this._evaluateRequestMissResult(req);
			const requestCC = parseCacheControl(req.headers["cache-control"]);
			if (requestCC["no-cache"] || /no-cache/.test(req.headers.pragma)) return this._evaluateRequestMissResult(req);
			if (requestCC["max-age"] && this.age() > toNumberOrZero(requestCC["max-age"])) return this._evaluateRequestMissResult(req);
			if (requestCC["min-fresh"] && this.maxAge() - this.age() < toNumberOrZero(requestCC["min-fresh"])) return this._evaluateRequestMissResult(req);
			if (this.stale()) {
				if ("max-stale" in requestCC && (true === requestCC["max-stale"] || requestCC["max-stale"] > this.age() - this.maxAge())) return this._evaluateRequestHitResult(void 0);
				if (this.useStaleWhileRevalidate()) return this._evaluateRequestHitResult(this._evaluateRequestRevalidation(req, false));
				return this._evaluateRequestMissResult(req);
			}
			return this._evaluateRequestHitResult(void 0);
		}
		/**
		* @param {HttpRequest} req - check if this is for the same cache entry
		* @param {boolean} allowHeadMethod - allow a HEAD method to match.
		* @returns {boolean} `true` if the request matches.
		*/
		_requestMatches(req, allowHeadMethod) {
			return !!((!this._url || this._url === req.url) && this._host === req.headers.host && (!req.method || this._method === req.method || allowHeadMethod && "HEAD" === req.method) && this._varyMatches(req));
		}
		/**
		* Determines whether storing authenticated responses is allowed.
		* @returns {boolean} `true` if allowed.
		*/
		_allowsStoringAuthenticated() {
			return !!(this._rescc["must-revalidate"] || this._rescc.public || this._rescc["s-maxage"]);
		}
		/**
		* Checks whether the Vary header in the response matches the new request.
		* @param {HttpRequest} req - incoming HTTP request
		* @returns {boolean} `true` if the vary headers match.
		*/
		_varyMatches(req) {
			if (!this._resHeaders.vary) return true;
			if (this._resHeaders.vary === "*") return false;
			const fields = this._resHeaders.vary.trim().toLowerCase().split(/\s*,\s*/);
			for (const name of fields) if (req.headers[name] !== this._reqHeaders[name]) return false;
			return true;
		}
		/**
		* Creates a copy of the given headers without any hop-by-hop headers.
		* @param {Record<string, string>} inHeaders - old headers from the cached response
		* @returns {Record<string, string>} A new headers object without hop-by-hop headers.
		*/
		_copyWithoutHopByHopHeaders(inHeaders) {
			/** @type {Record<string, string>} */
			const headers = {};
			for (const name in inHeaders) {
				if (hopByHopHeaders[name]) continue;
				headers[name] = inHeaders[name];
			}
			if (inHeaders.connection) {
				const tokens = inHeaders.connection.trim().split(/\s*,\s*/);
				for (const name of tokens) delete headers[name];
			}
			if (headers.warning) {
				const warnings = headers.warning.split(/,/).filter((warning) => {
					return !/^\s*1[0-9][0-9]/.test(warning);
				});
				if (!warnings.length) delete headers.warning;
				else headers.warning = warnings.join(",").trim();
			}
			return headers;
		}
		/**
		* Returns the response headers adjusted for serving the cached response.
		* Removes hop-by-hop headers and updates the Age and Date headers.
		* @returns {Record<string, string>} The adjusted response headers.
		*/
		responseHeaders() {
			const headers = this._copyWithoutHopByHopHeaders(this._resHeaders);
			const age = this.age();
			if (age > 86400 && !this._hasExplicitExpiration() && this.maxAge() > 86400) headers.warning = (headers.warning ? `${headers.warning}, ` : "") + "113 - \"rfc7234 5.5.4\"";
			headers.age = `${Math.round(age)}`;
			headers.date = new Date(this.now()).toUTCString();
			return headers;
		}
		/**
		* Returns the Date header value from the response or the current time if invalid.
		* @returns {number} Timestamp (in milliseconds) representing the Date header or response time.
		*/
		date() {
			const serverDate = Date.parse(this._resHeaders.date);
			if (isFinite(serverDate)) return serverDate;
			return this._responseTime;
		}
		/**
		* Value of the Age header, in seconds, updated for the current time.
		* May be fractional.
		* @returns {number} The age in seconds.
		*/
		age() {
			return this._ageValue() + (this.now() - this._responseTime) / 1e3;
		}
		/**
		* @returns {number} The Age header value as a number.
		*/
		_ageValue() {
			return toNumberOrZero(this._resHeaders.age);
		}
		/**
		* Possibly outdated value of applicable max-age (or heuristic equivalent) in seconds.
		* This counts since response's `Date`.
		*
		* For an up-to-date value, see `timeToLive()`.
		*
		* Returns the maximum age (freshness lifetime) of the response in seconds.
		* @returns {number} The max-age value in seconds.
		*/
		maxAge() {
			if (!this.storable() || this._rescc["no-cache"]) return 0;
			if (this._isShared && this._resHeaders["set-cookie"] && !this._rescc.public && !this._rescc.immutable) return 0;
			if (this._resHeaders.vary === "*") return 0;
			if (this._isShared) {
				if (this._rescc["proxy-revalidate"]) return 0;
				if (this._rescc["s-maxage"]) return toNumberOrZero(this._rescc["s-maxage"]);
			}
			if (this._rescc["max-age"]) return toNumberOrZero(this._rescc["max-age"]);
			const defaultMinTtl = this._rescc.immutable ? this._immutableMinTtl : 0;
			const serverDate = this.date();
			if (this._resHeaders.expires) {
				const expires = Date.parse(this._resHeaders.expires);
				if (Number.isNaN(expires) || expires < serverDate) return 0;
				return Math.max(defaultMinTtl, (expires - serverDate) / 1e3);
			}
			if (this._resHeaders["last-modified"]) {
				const lastModified = Date.parse(this._resHeaders["last-modified"]);
				if (isFinite(lastModified) && serverDate > lastModified) return Math.max(defaultMinTtl, (serverDate - lastModified) / 1e3 * this._cacheHeuristic);
			}
			return defaultMinTtl;
		}
		/**
		* Remaining time this cache entry may be useful for, in *milliseconds*.
		* You can use this as an expiration time for your cache storage.
		*
		* Prefer this method over `maxAge()`, because it includes other factors like `age` and `stale-while-revalidate`.
		* @returns {number} Time-to-live in milliseconds.
		*/
		timeToLive() {
			const age = this.maxAge() - this.age();
			const staleIfErrorAge = age + toNumberOrZero(this._rescc["stale-if-error"]);
			const staleWhileRevalidateAge = age + toNumberOrZero(this._rescc["stale-while-revalidate"]);
			return Math.round(Math.max(0, age, staleIfErrorAge, staleWhileRevalidateAge) * 1e3);
		}
		/**
		* If true, this cache entry is past its expiration date.
		* Note that stale cache may be useful sometimes, see `evaluateRequest()`.
		* @returns {boolean} `false` doesn't mean it's fresh nor usable
		*/
		stale() {
			return this.maxAge() <= this.age();
		}
		/**
		* @returns {boolean} `true` if `stale-if-error` condition allows use of a stale response.
		*/
		_useStaleIfError() {
			return this.maxAge() + toNumberOrZero(this._rescc["stale-if-error"]) > this.age();
		}
		/** See `evaluateRequest()` for a more complete solution
		* @returns {boolean} `true` if `stale-while-revalidate` is currently allowed.
		*/
		useStaleWhileRevalidate() {
			const swr = toNumberOrZero(this._rescc["stale-while-revalidate"]);
			return swr > 0 && this.maxAge() + swr > this.age();
		}
		/**
		* Creates a `CachePolicy` instance from a serialized object.
		* @param {Object} obj - The serialized object.
		* @returns {CachePolicy} A new CachePolicy instance.
		*/
		static fromObject(obj) {
			return new this(void 0, void 0, { _fromObject: obj });
		}
		/**
		* @param {any} obj - The serialized object.
		* @throws {Error} If already initialized or if the object is invalid.
		*/
		_fromObject(obj) {
			if (this._responseTime) throw Error("Reinitialized");
			if (!obj || obj.v !== 1) throw Error("Invalid serialization");
			this._responseTime = obj.t;
			this._isShared = obj.sh;
			this._cacheHeuristic = obj.ch;
			this._immutableMinTtl = obj.imm !== void 0 ? obj.imm : 864e5;
			this._ignoreCargoCult = !!obj.icc;
			this._status = obj.st;
			this._resHeaders = obj.resh;
			this._rescc = obj.rescc;
			this._method = obj.m;
			this._url = obj.u;
			this._host = obj.h;
			this._noAuthorization = obj.a;
			this._reqHeaders = obj.reqh;
			this._reqcc = obj.reqcc;
		}
		/**
		* Serializes the `CachePolicy` instance into a JSON-serializable object.
		* @returns {Object} The serialized object.
		*/
		toObject() {
			return {
				v: 1,
				t: this._responseTime,
				sh: this._isShared,
				ch: this._cacheHeuristic,
				imm: this._immutableMinTtl,
				icc: this._ignoreCargoCult,
				st: this._status,
				resh: this._resHeaders,
				rescc: this._rescc,
				m: this._method,
				u: this._url,
				h: this._host,
				a: this._noAuthorization,
				reqh: this._reqHeaders,
				reqcc: this._reqcc
			};
		}
		/**
		* Headers for sending to the origin server to revalidate stale response.
		* Allows server to return 304 to allow reuse of the previous response.
		*
		* Hop by hop headers are always stripped.
		* Revalidation headers may be added or removed, depending on request.
		* @param {HttpRequest} incomingReq - The incoming HTTP request.
		* @returns {Record<string, string>} The headers for the revalidation request.
		*/
		revalidationHeaders(incomingReq) {
			this._assertRequestHasHeaders(incomingReq);
			const headers = this._copyWithoutHopByHopHeaders(incomingReq.headers);
			delete headers["if-range"];
			if (!this._requestMatches(incomingReq, true) || !this.storable()) {
				delete headers["if-none-match"];
				delete headers["if-modified-since"];
				return headers;
			}
			if (this._resHeaders.etag) headers["if-none-match"] = headers["if-none-match"] ? `${headers["if-none-match"]}, ${this._resHeaders.etag}` : this._resHeaders.etag;
			if (headers["accept-ranges"] || headers["if-match"] || headers["if-unmodified-since"] || this._method && this._method != "GET") {
				delete headers["if-modified-since"];
				if (headers["if-none-match"]) {
					const etags = headers["if-none-match"].split(/,/).filter((etag) => {
						return !/^\s*W\//.test(etag);
					});
					if (!etags.length) delete headers["if-none-match"];
					else headers["if-none-match"] = etags.join(",").trim();
				}
			} else if (this._resHeaders["last-modified"] && !headers["if-modified-since"]) headers["if-modified-since"] = this._resHeaders["last-modified"];
			return headers;
		}
		/**
		* Creates new CachePolicy with information combined from the previews response,
		* and the new revalidation response.
		*
		* Returns {policy, modified} where modified is a boolean indicating
		* whether the response body has been modified, and old cached body can't be used.
		*
		* @param {HttpRequest} request - The latest HTTP request asking for the cached entry.
		* @param {HttpResponse} response - The latest revalidation HTTP response from the origin server.
		* @returns {{policy: CachePolicy, modified: boolean, matches: boolean}} The updated policy and modification status.
		* @throws {Error} If the response headers are missing.
		*/
		revalidatedPolicy(request, response) {
			this._assertRequestHasHeaders(request);
			if (this._useStaleIfError() && isErrorResponse(response)) return {
				policy: this,
				modified: false,
				matches: true
			};
			if (!response || !response.headers) throw Error("Response headers missing");
			let matches = false;
			if (response.status !== void 0 && response.status != 304) matches = false;
			else if (response.headers.etag && !/^\s*W\//.test(response.headers.etag)) matches = this._resHeaders.etag && this._resHeaders.etag.replace(/^\s*W\//, "") === response.headers.etag;
			else if (this._resHeaders.etag && response.headers.etag) matches = this._resHeaders.etag.replace(/^\s*W\//, "") === response.headers.etag.replace(/^\s*W\//, "");
			else if (this._resHeaders["last-modified"]) matches = this._resHeaders["last-modified"] === response.headers["last-modified"];
			else if (!this._resHeaders.etag && !this._resHeaders["last-modified"] && !response.headers.etag && !response.headers["last-modified"]) matches = true;
			const optionsCopy = {
				shared: this._isShared,
				cacheHeuristic: this._cacheHeuristic,
				immutableMinTimeToLive: this._immutableMinTtl,
				ignoreCargoCult: this._ignoreCargoCult
			};
			if (!matches) return {
				policy: new this.constructor(request, response, optionsCopy),
				modified: response.status != 304,
				matches: false
			};
			const headers = {};
			for (const k in this._resHeaders) headers[k] = k in response.headers && !excludedFromRevalidationUpdate[k] ? response.headers[k] : this._resHeaders[k];
			const newResponse = Object.assign({}, response, {
				status: this._status,
				method: this._method,
				headers
			});
			return {
				policy: new this.constructor(request, newResponse, optionsCopy),
				modified: false,
				matches: true
			};
		}
	};
})))(), 1);
var EventManager = class {
	_eventListeners;
	_maxListeners;
	constructor() {
		this._eventListeners = /* @__PURE__ */ new Map();
		this._maxListeners = 100;
	}
	maxListeners() {
		return this._maxListeners;
	}
	addListener(event, listener) {
		this.on(event, listener);
	}
	on(event, listener) {
		if (!this._eventListeners.has(event)) this._eventListeners.set(event, []);
		const listeners = this._eventListeners.get(event);
		if (listeners) {
			if (listeners.length >= this._maxListeners) console.warn(`MaxListenersExceededWarning: Possible event memory leak detected. ${listeners.length + 1} ${event} listeners added. Use setMaxListeners() to increase limit.`);
			listeners.push(listener);
		}
		return this;
	}
	removeListener(event, listener) {
		this.off(event, listener);
	}
	off(event, listener) {
		const listeners = this._eventListeners.get(event) ?? [];
		const index = listeners.indexOf(listener);
		if (index !== -1) listeners.splice(index, 1);
		if (listeners.length === 0) this._eventListeners.delete(event);
	}
	once(event, listener) {
		const onceListener = (...arguments_) => {
			listener(...arguments_);
			this.off(event, onceListener);
		};
		this.on(event, onceListener);
	}
	emit(event, ...arguments_) {
		const listeners = this._eventListeners.get(event);
		if (listeners && listeners.length > 0) for (const listener of listeners) listener(...arguments_);
	}
	listeners(event) {
		return this._eventListeners.get(event) ?? [];
	}
	removeAllListeners(event) {
		if (event) this._eventListeners.delete(event);
		else this._eventListeners.clear();
	}
	setMaxListeners(n) {
		this._maxListeners = n;
	}
};
var event_manager_default = EventManager;
var HooksManager = class extends event_manager_default {
	_hookHandlers;
	constructor() {
		super();
		this._hookHandlers = /* @__PURE__ */ new Map();
	}
	addHandler(event, handler) {
		const eventHandlers = this._hookHandlers.get(event);
		if (eventHandlers) eventHandlers.push(handler);
		else this._hookHandlers.set(event, [handler]);
	}
	removeHandler(event, handler) {
		const eventHandlers = this._hookHandlers.get(event);
		if (eventHandlers) {
			const index = eventHandlers.indexOf(handler);
			if (index !== -1) eventHandlers.splice(index, 1);
		}
	}
	trigger(event, data) {
		const eventHandlers = this._hookHandlers.get(event);
		if (eventHandlers) for (const handler of eventHandlers) try {
			handler(data);
		} catch (error) {
			this.emit("error", /* @__PURE__ */ new Error(`Error in hook handler for event "${event}": ${error.message}`));
		}
	}
	get handlers() {
		return new Map(this._hookHandlers);
	}
};
var hooks_manager_default = HooksManager;
var StatsManager = class extends event_manager_default {
	enabled = true;
	hits = 0;
	misses = 0;
	sets = 0;
	deletes = 0;
	errors = 0;
	constructor(enabled) {
		super();
		if (enabled !== void 0) this.enabled = enabled;
		this.reset();
	}
	hit() {
		if (this.enabled) this.hits++;
	}
	miss() {
		if (this.enabled) this.misses++;
	}
	set() {
		if (this.enabled) this.sets++;
	}
	delete() {
		if (this.enabled) this.deletes++;
	}
	hitsOrMisses(array) {
		for (const item of array) if (item === void 0) this.miss();
		else this.hit();
	}
	reset() {
		this.hits = 0;
		this.misses = 0;
		this.sets = 0;
		this.deletes = 0;
		this.errors = 0;
	}
};
var stats_manager_default = StatsManager;
var iterableAdapters = [
	"sqlite",
	"postgres",
	"mysql",
	"mongo",
	"redis",
	"valkey",
	"etcd"
];
var Keyv = class extends event_manager_default {
	opts;
	iterator;
	hooks = new hooks_manager_default();
	stats = new stats_manager_default(false);
	/**
	* Time to live in milliseconds
	*/
	_ttl;
	/**
	* Namespace
	*/
	_namespace;
	/**
	* Store
	*/
	_store = /* @__PURE__ */ new Map();
	_serialize = defaultSerialize;
	_deserialize = defaultDeserialize;
	_compression;
	_useKeyPrefix = true;
	_throwOnErrors = false;
	/**
	* Keyv Constructor
	* @param {KeyvStoreAdapter | KeyvOptions} store
	* @param {Omit<KeyvOptions, 'store'>} [options] if you provide the store you can then provide the Keyv Options
	*/
	constructor(store, options) {
		super();
		options ??= {};
		store ??= {};
		this.opts = {
			namespace: "keyv",
			serialize: defaultSerialize,
			deserialize: defaultDeserialize,
			emitErrors: true,
			store: /* @__PURE__ */ new Map(),
			...options
		};
		if (store && store.get) this.opts.store = store;
		else this.opts = {
			...this.opts,
			...store
		};
		this._store = this.opts.store ?? /* @__PURE__ */ new Map();
		this._compression = this.opts.compression;
		this._serialize = this.opts.serialize;
		this._deserialize = this.opts.deserialize;
		if (this.opts.namespace) this._namespace = this.opts.namespace;
		if (this._store) {
			if (!this._isValidStorageAdapter(this._store)) throw new Error("Invalid storage adapter");
			if (typeof this._store.on === "function") this._store.on("error", (error) => this.emit("error", error));
			this._store.namespace = this._namespace;
			if (typeof this._store[Symbol.iterator] === "function" && this._store instanceof Map) this.iterator = this.generateIterator(this._store);
			else if ("iterator" in this._store && this._store.opts && this._checkIterableAdapter()) this.iterator = this.generateIterator(this._store.iterator.bind(this._store));
		}
		if (this.opts.stats) this.stats.enabled = this.opts.stats;
		if (this.opts.ttl) this._ttl = this.opts.ttl;
		if (this.opts.useKeyPrefix !== void 0) this._useKeyPrefix = this.opts.useKeyPrefix;
		if (this.opts.throwOnErrors !== void 0) this._throwOnErrors = this.opts.throwOnErrors;
	}
	/**
	* Get the current store
	*/
	get store() {
		return this._store;
	}
	/**
	* Set the current store. This will also set the namespace, event error handler, and generate the iterator. If the store is not valid it will throw an error.
	* @param {KeyvStoreAdapter | Map<any, any> | any} store the store to set
	*/
	set store(store) {
		if (this._isValidStorageAdapter(store)) {
			this._store = store;
			this.opts.store = store;
			if (typeof store.on === "function") store.on("error", (error) => this.emit("error", error));
			if (this._namespace) this._store.namespace = this._namespace;
			if (typeof store[Symbol.iterator] === "function" && store instanceof Map) this.iterator = this.generateIterator(store);
			else if ("iterator" in store && store.opts && this._checkIterableAdapter()) this.iterator = this.generateIterator(store.iterator?.bind(store));
		} else throw new Error("Invalid storage adapter");
	}
	/**
	* Get the current compression function
	* @returns {CompressionAdapter} The current compression function
	*/
	get compression() {
		return this._compression;
	}
	/**
	* Set the current compression function
	* @param {CompressionAdapter} compress The compression function to set
	*/
	set compression(compress) {
		this._compression = compress;
	}
	/**
	* Get the current namespace.
	* @returns {string | undefined} The current namespace.
	*/
	get namespace() {
		return this._namespace;
	}
	/**
	* Set the current namespace.
	* @param {string | undefined} namespace The namespace to set.
	*/
	set namespace(namespace) {
		this._namespace = namespace;
		this.opts.namespace = namespace;
		this._store.namespace = namespace;
		if (this.opts.store) this.opts.store.namespace = namespace;
	}
	/**
	* Get the current TTL.
	* @returns {number} The current TTL in milliseconds.
	*/
	get ttl() {
		return this._ttl;
	}
	/**
	* Set the current TTL.
	* @param {number} ttl The TTL to set in milliseconds.
	*/
	set ttl(ttl) {
		this.opts.ttl = ttl;
		this._ttl = ttl;
	}
	/**
	* Get the current serialize function.
	* @returns {Serialize} The current serialize function.
	*/
	get serialize() {
		return this._serialize;
	}
	/**
	* Set the current serialize function.
	* @param {Serialize} serialize The serialize function to set.
	*/
	set serialize(serialize) {
		this.opts.serialize = serialize;
		this._serialize = serialize;
	}
	/**
	* Get the current deserialize function.
	* @returns {Deserialize} The current deserialize function.
	*/
	get deserialize() {
		return this._deserialize;
	}
	/**
	* Set the current deserialize function.
	* @param {Deserialize} deserialize The deserialize function to set.
	*/
	set deserialize(deserialize) {
		this.opts.deserialize = deserialize;
		this._deserialize = deserialize;
	}
	/**
	* Get the current useKeyPrefix value. This will enable or disable key prefixing.
	* @returns {boolean} The current useKeyPrefix value.
	* @default true
	*/
	get useKeyPrefix() {
		return this._useKeyPrefix;
	}
	/**
	* Set the current useKeyPrefix value. This will enable or disable key prefixing.
	* @param {boolean} value The useKeyPrefix value to set.
	*/
	set useKeyPrefix(value) {
		this._useKeyPrefix = value;
		this.opts.useKeyPrefix = value;
	}
	/**
	* Get the current throwErrors value. This will enable or disable throwing errors on methods in addition to emitting them.
	* @return {boolean} The current throwOnErrors value.
	*/
	get throwOnErrors() {
		return this._throwOnErrors;
	}
	/**
	* Set the current throwOnErrors value. This will enable or disable throwing errors on methods in addition to emitting them.
	* @param {boolean} value The throwOnErrors value to set.
	*/
	set throwOnErrors(value) {
		this._throwOnErrors = value;
		this.opts.throwOnErrors = value;
	}
	generateIterator(iterator) {
		const function_ = async function* () {
			for await (const [key, raw] of typeof iterator === "function" ? iterator(this._store.namespace) : iterator) {
				const data = await this.deserializeData(raw);
				if (this._useKeyPrefix && this._store.namespace && !key.includes(this._store.namespace)) continue;
				if (typeof data.expires === "number" && Date.now() > data.expires) {
					await this.delete(key);
					continue;
				}
				yield [this._getKeyUnprefix(key), data.value];
			}
		};
		return function_.bind(this);
	}
	_checkIterableAdapter() {
		return iterableAdapters.includes(this._store.opts.dialect) || iterableAdapters.some((element) => this._store.opts.url.includes(element));
	}
	_getKeyPrefix(key) {
		if (!this._useKeyPrefix) return key;
		if (!this._namespace) return key;
		if (key.startsWith(`${this._namespace}:`)) return key;
		return `${this._namespace}:${key}`;
	}
	_getKeyPrefixArray(keys) {
		if (!this._useKeyPrefix) return keys;
		if (!this._namespace) return keys;
		return keys.map((key) => `${this._namespace}:${key}`);
	}
	_getKeyUnprefix(key) {
		if (!this._useKeyPrefix) return key;
		return key.split(":").splice(1).join(":");
	}
	_isValidStorageAdapter(store) {
		return store instanceof Map || typeof store.get === "function" && typeof store.set === "function" && typeof store.delete === "function" && typeof store.clear === "function";
	}
	async get(key, options) {
		const { store } = this.opts;
		const isArray = Array.isArray(key);
		const keyPrefixed = isArray ? this._getKeyPrefixArray(key) : this._getKeyPrefix(key);
		const isDataExpired = (data) => typeof data.expires === "number" && Date.now() > data.expires;
		if (isArray) {
			if (options?.raw === true) return this.getMany(key, { raw: true });
			return this.getMany(key, { raw: false });
		}
		this.hooks.trigger("preGet", { key: keyPrefixed });
		let rawData;
		try {
			rawData = await store.get(keyPrefixed);
		} catch (error) {
			if (this.throwOnErrors) throw error;
		}
		const deserializedData = typeof rawData === "string" || this.opts.compression ? await this.deserializeData(rawData) : rawData;
		if (deserializedData === void 0 || deserializedData === null) {
			this.hooks.trigger("postGet", {
				key: keyPrefixed,
				value: void 0
			});
			this.stats.miss();
			return;
		}
		if (isDataExpired(deserializedData)) {
			await this.delete(key);
			this.hooks.trigger("postGet", {
				key: keyPrefixed,
				value: void 0
			});
			this.stats.miss();
			return;
		}
		this.hooks.trigger("postGet", {
			key: keyPrefixed,
			value: deserializedData
		});
		this.stats.hit();
		return options?.raw ? deserializedData : deserializedData.value;
	}
	async getMany(keys, options) {
		const { store } = this.opts;
		const keyPrefixed = this._getKeyPrefixArray(keys);
		const isDataExpired = (data) => typeof data.expires === "number" && Date.now() > data.expires;
		this.hooks.trigger("preGetMany", { keys: keyPrefixed });
		if (store.getMany === void 0) {
			const promises = keyPrefixed.map(async (key) => {
				const rawData2 = await store.get(key);
				const deserializedRow = typeof rawData2 === "string" || this.opts.compression ? await this.deserializeData(rawData2) : rawData2;
				if (deserializedRow === void 0 || deserializedRow === null) return;
				if (isDataExpired(deserializedRow)) {
					await this.delete(key);
					return;
				}
				return options?.raw ? deserializedRow : deserializedRow.value;
			});
			const result2 = (await Promise.allSettled(promises)).map((row) => row.value);
			this.hooks.trigger("postGetMany", result2);
			if (result2.length > 0) this.stats.hit();
			return result2;
		}
		const rawData = await store.getMany(keyPrefixed);
		const result = [];
		const expiredKeys = [];
		for (const index in rawData) {
			let row = rawData[index];
			if (typeof row === "string") row = await this.deserializeData(row);
			if (row === void 0 || row === null) {
				result.push(void 0);
				continue;
			}
			if (isDataExpired(row)) {
				expiredKeys.push(keys[index]);
				result.push(void 0);
				continue;
			}
			const value = options?.raw ? row : row.value;
			result.push(value);
		}
		if (expiredKeys.length > 0) await this.deleteMany(expiredKeys);
		this.hooks.trigger("postGetMany", result);
		if (result.length > 0) this.stats.hit();
		return result;
	}
	/**
	* Get the raw value of a key. This is the replacement for setting raw to true in the get() method.
	* @param {string} key the key to get
	* @returns {Promise<StoredDataRaw<Value> | undefined>} will return a StoredDataRaw<Value> or undefined if the key does not exist or is expired.
	*/
	async getRaw(key) {
		const { store } = this.opts;
		const keyPrefixed = this._getKeyPrefix(key);
		this.hooks.trigger("preGetRaw", { key: keyPrefixed });
		const rawData = await store.get(keyPrefixed);
		if (rawData === void 0 || rawData === null) {
			this.hooks.trigger("postGetRaw", {
				key: keyPrefixed,
				value: void 0
			});
			this.stats.miss();
			return;
		}
		const deserializedData = typeof rawData === "string" || this.opts.compression ? await this.deserializeData(rawData) : rawData;
		if (deserializedData !== void 0 && deserializedData.expires !== void 0 && deserializedData.expires !== null && deserializedData.expires < Date.now()) {
			this.hooks.trigger("postGetRaw", {
				key: keyPrefixed,
				value: void 0
			});
			this.stats.miss();
			await this.delete(key);
			return;
		}
		this.stats.hit();
		this.hooks.trigger("postGetRaw", {
			key: keyPrefixed,
			value: deserializedData
		});
		return deserializedData;
	}
	/**
	* Get the raw values of many keys. This is the replacement for setting raw to true in the getMany() method.
	* @param {string[]} keys the keys to get
	* @returns {Promise<Array<StoredDataRaw<Value>>>} will return an array of StoredDataRaw<Value> or undefined if the key does not exist or is expired.
	*/
	async getManyRaw(keys) {
		const { store } = this.opts;
		const keyPrefixed = this._getKeyPrefixArray(keys);
		if (keys.length === 0) {
			const result2 = Array.from({ length: keys.length }).fill(void 0);
			this.stats.misses += keys.length;
			this.hooks.trigger("postGetManyRaw", {
				keys: keyPrefixed,
				values: result2
			});
			return result2;
		}
		let result = [];
		if (store.getMany === void 0) {
			const promises = keyPrefixed.map(async (key) => {
				const rawData = await store.get(key);
				if (rawData !== void 0 && rawData !== null) return this.deserializeData(rawData);
			});
			result = (await Promise.allSettled(promises)).map((row) => row.value);
		} else {
			const rawData = await store.getMany(keyPrefixed);
			for (const row of rawData) if (row !== void 0 && row !== null) result.push(await this.deserializeData(row));
			else result.push(void 0);
		}
		const expiredKeys = [];
		const isDataExpired = (data) => typeof data.expires === "number" && Date.now() > data.expires;
		for (const [index, row] of result.entries()) if (row !== void 0 && isDataExpired(row)) {
			expiredKeys.push(keyPrefixed[index]);
			result[index] = void 0;
		}
		if (expiredKeys.length > 0) await this.deleteMany(expiredKeys);
		this.stats.hitsOrMisses(result);
		this.hooks.trigger("postGetManyRaw", {
			keys: keyPrefixed,
			values: result
		});
		return result;
	}
	/**
	* Set an item to the store
	* @param {string | Array<KeyvEntry>} key the key to use. If you pass in an array of KeyvEntry it will set many items
	* @param {Value} value the value of the key
	* @param {number} [ttl] time to live in milliseconds
	* @returns {boolean} if it sets then it will return a true. On failure will return false.
	*/
	async set(key, value, ttl) {
		const data = {
			key,
			value,
			ttl
		};
		this.hooks.trigger("preSet", data);
		const keyPrefixed = this._getKeyPrefix(data.key);
		data.ttl ??= this._ttl;
		if (data.ttl === 0) data.ttl = void 0;
		const { store } = this.opts;
		const expires = typeof data.ttl === "number" ? Date.now() + data.ttl : void 0;
		if (typeof data.value === "symbol") {
			this.emit("error", "symbol cannot be serialized");
			throw new Error("symbol cannot be serialized");
		}
		const formattedValue = {
			value: data.value,
			expires
		};
		const serializedValue = await this.serializeData(formattedValue);
		let result = true;
		try {
			const value2 = await store.set(keyPrefixed, serializedValue, data.ttl);
			if (typeof value2 === "boolean") result = value2;
		} catch (error) {
			result = false;
			this.emit("error", error);
			if (this._throwOnErrors) throw error;
		}
		this.hooks.trigger("postSet", {
			key: keyPrefixed,
			value: serializedValue,
			ttl
		});
		this.stats.set();
		return result;
	}
	/**
	* Set many items to the store
	* @param {Array<KeyvEntry>} entries the entries to set
	* @returns {boolean[]} will return an array of booleans if it sets then it will return a true. On failure will return false.
	*/
	async setMany(entries) {
		let results = [];
		try {
			if (this._store.setMany === void 0) {
				const promises = [];
				for (const entry of entries) promises.push(this.set(entry.key, entry.value, entry.ttl));
				results = await Promise.all(promises);
			} else {
				const serializedEntries = await Promise.all(entries.map(async ({ key, value, ttl }) => {
					ttl ??= this._ttl;
					if (ttl === 0) ttl = void 0;
					const expires = typeof ttl === "number" ? Date.now() + ttl : void 0;
					if (typeof value === "symbol") {
						this.emit("error", "symbol cannot be serialized");
						throw new Error("symbol cannot be serialized");
					}
					const formattedValue = {
						value,
						expires
					};
					const serializedValue = await this.serializeData(formattedValue);
					return {
						key: this._getKeyPrefix(key),
						value: serializedValue,
						ttl
					};
				}));
				results = await this._store.setMany(serializedEntries);
			}
		} catch (error) {
			this.emit("error", error);
			if (this._throwOnErrors) throw error;
			results = entries.map(() => false);
		}
		return results;
	}
	/**
	* Delete an Entry
	* @param {string | string[]} key the key to be deleted. if an array it will delete many items
	* @returns {boolean} will return true if item or items are deleted. false if there is an error
	*/
	async delete(key) {
		const { store } = this.opts;
		if (Array.isArray(key)) return this.deleteMany(key);
		const keyPrefixed = this._getKeyPrefix(key);
		this.hooks.trigger("preDelete", { key: keyPrefixed });
		let result = true;
		try {
			const value = await store.delete(keyPrefixed);
			if (typeof value === "boolean") result = value;
		} catch (error) {
			result = false;
			this.emit("error", error);
			if (this._throwOnErrors) throw error;
		}
		this.hooks.trigger("postDelete", {
			key: keyPrefixed,
			value: result
		});
		this.stats.delete();
		return result;
	}
	/**
	* Delete many items from the store
	* @param {string[]} keys the keys to be deleted
	* @returns {boolean} will return true if item or items are deleted. false if there is an error
	*/
	async deleteMany(keys) {
		try {
			const { store } = this.opts;
			const keyPrefixed = this._getKeyPrefixArray(keys);
			this.hooks.trigger("preDelete", { key: keyPrefixed });
			if (store.deleteMany !== void 0) return await store.deleteMany(keyPrefixed);
			const promises = keyPrefixed.map(async (key) => store.delete(key));
			const returnResult = (await Promise.all(promises)).every(Boolean);
			this.hooks.trigger("postDelete", {
				key: keyPrefixed,
				value: returnResult
			});
			return returnResult;
		} catch (error) {
			this.emit("error", error);
			if (this._throwOnErrors) throw error;
			return false;
		}
	}
	/**
	* Clear the store
	* @returns {void}
	*/
	async clear() {
		this.emit("clear");
		const { store } = this.opts;
		try {
			await store.clear();
		} catch (error) {
			this.emit("error", error);
			if (this._throwOnErrors) throw error;
		}
	}
	async has(key) {
		if (Array.isArray(key)) return this.hasMany(key);
		const keyPrefixed = this._getKeyPrefix(key);
		const { store } = this.opts;
		if (store.has !== void 0 && !(store instanceof Map)) return store.has(keyPrefixed);
		let rawData;
		try {
			rawData = await store.get(keyPrefixed);
		} catch (error) {
			this.emit("error", error);
			if (this._throwOnErrors) throw error;
			return false;
		}
		if (rawData) {
			const data = await this.deserializeData(rawData);
			if (data) {
				if (data.expires === void 0 || data.expires === null) return true;
				return data.expires > Date.now();
			}
		}
		return false;
	}
	/**
	* Check if many keys exist
	* @param {string[]} keys the keys to check
	* @returns {boolean[]} will return an array of booleans if the keys exist
	*/
	async hasMany(keys) {
		const keyPrefixed = this._getKeyPrefixArray(keys);
		const { store } = this.opts;
		if (store.hasMany !== void 0) return store.hasMany(keyPrefixed);
		const results = [];
		for (const key of keys) results.push(await this.has(key));
		return results;
	}
	/**
	* Will disconnect the store. This is only available if the store has a disconnect method
	* @returns {Promise<void>}
	*/
	async disconnect() {
		const { store } = this.opts;
		this.emit("disconnect");
		if (typeof store.disconnect === "function") return store.disconnect();
	}
	emit(event, ...arguments_) {
		if (event === "error" && !this.opts.emitErrors) return;
		super.emit(event, ...arguments_);
	}
	async serializeData(data) {
		if (!this._serialize) return data;
		if (this._compression?.compress) return this._serialize({
			value: await this._compression.compress(data.value),
			expires: data.expires
		});
		return this._serialize(data);
	}
	async deserializeData(data) {
		if (!this._deserialize) return data;
		if (this._compression?.decompress && typeof data === "string") {
			const result = await this._deserialize(data);
			return {
				value: await this._compression.decompress(result?.value),
				expires: result?.expires
			};
		}
		if (typeof data === "string") return this._deserialize(data);
	}
};
/* v8 ignore next -- @preserve */
//#endregion
//#region node_modules/mimic-response/index.js
var knownProperties = [
	"aborted",
	"complete",
	"headers",
	"httpVersion",
	"httpVersionMinor",
	"httpVersionMajor",
	"method",
	"rawHeaders",
	"rawTrailers",
	"setTimeout",
	"socket",
	"statusCode",
	"statusMessage",
	"trailers",
	"url"
];
function mimicResponse(fromStream, toStream) {
	if (toStream._readableState.autoDestroy) throw new Error("The second stream must have the `autoDestroy` option set to `false`");
	const fromProperties = /* @__PURE__ */ new Set([...Object.keys(fromStream), ...knownProperties]);
	const properties = {};
	for (const property of fromProperties) {
		if (property in toStream) continue;
		properties[property] = {
			get() {
				const value = fromStream[property];
				return typeof value === "function" ? value.bind(fromStream) : value;
			},
			set(value) {
				fromStream[property] = value;
			},
			enumerable: true,
			configurable: false
		};
	}
	Object.defineProperties(toStream, properties);
	fromStream.once("aborted", () => {
		toStream.destroy();
		toStream.emit("aborted");
	});
	fromStream.once("close", () => {
		if (fromStream.complete) {
			if (toStream.readable) toStream.once("end", () => {
				toStream.emit("close");
			});
			else toStream.emit("close");
		} else toStream.emit("close");
	});
	return toStream;
}
//#endregion
//#region node_modules/normalize-url/index.js
var DATA_URL_DEFAULT_MIME_TYPE = "text/plain";
var DATA_URL_DEFAULT_CHARSET = "us-ascii";
var testParameter = (name, filters) => filters.some((filter) => filter instanceof RegExp ? filter.test(name) : filter === name);
var supportedProtocols = /* @__PURE__ */ new Set([
	"https:",
	"http:",
	"file:"
]);
var hasCustomProtocol = (urlString) => {
	try {
		const { protocol } = new URL(urlString);
		return protocol.endsWith(":") && !protocol.includes(".") && !supportedProtocols.has(protocol);
	} catch {
		return false;
	}
};
var normalizeDataURL = (urlString, { stripHash }) => {
	const match = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(urlString);
	if (!match) throw new Error(`Invalid URL: ${urlString}`);
	const { type, data, hash } = match.groups;
	const mediaType = type.split(";");
	const isBase64 = mediaType.at(-1) === "base64";
	if (isBase64) mediaType.pop();
	const mimeType = mediaType.shift()?.toLowerCase() ?? "";
	const normalizedMediaType = [...mediaType.map((attribute) => {
		let [key, value = ""] = attribute.split("=").map((string) => string.trim());
		if (key === "charset") {
			value = value.toLowerCase();
			if (value === DATA_URL_DEFAULT_CHARSET) return "";
		}
		return `${key}${value ? `=${value}` : ""}`;
	}).filter(Boolean)];
	if (isBase64) normalizedMediaType.push("base64");
	if (normalizedMediaType.length > 0 || mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE) normalizedMediaType.unshift(mimeType);
	const hashPart = stripHash || !hash ? "" : `#${hash}`;
	return `data:${normalizedMediaType.join(";")},${isBase64 ? data.trim() : data}${hashPart}`;
};
function normalizeUrl(urlString, options) {
	options = {
		defaultProtocol: "http",
		normalizeProtocol: true,
		forceHttp: false,
		forceHttps: false,
		stripAuthentication: true,
		stripHash: false,
		stripTextFragment: true,
		stripWWW: true,
		removeQueryParameters: [/^utm_\w+/i],
		removeTrailingSlash: true,
		removeSingleSlash: true,
		removeDirectoryIndex: false,
		removeExplicitPort: false,
		sortQueryParameters: true,
		removePath: false,
		transformPath: false,
		...options
	};
	if (typeof options.defaultProtocol === "string" && !options.defaultProtocol.endsWith(":")) options.defaultProtocol = `${options.defaultProtocol}:`;
	urlString = urlString.trim();
	if (/^data:/i.test(urlString)) return normalizeDataURL(urlString, options);
	if (hasCustomProtocol(urlString)) return urlString;
	const hasRelativeProtocol = urlString.startsWith("//");
	if (!(!hasRelativeProtocol && /^\.*\//.test(urlString))) urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
	const urlObject = new URL(urlString);
	if (options.forceHttp && options.forceHttps) throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
	if (options.forceHttp && urlObject.protocol === "https:") urlObject.protocol = "http:";
	if (options.forceHttps && urlObject.protocol === "http:") urlObject.protocol = "https:";
	if (options.stripAuthentication) {
		urlObject.username = "";
		urlObject.password = "";
	}
	if (options.stripHash) urlObject.hash = "";
	else if (options.stripTextFragment) urlObject.hash = urlObject.hash.replace(/#?:~:text.*?$/i, "");
	if (urlObject.pathname) {
		const protocolRegex = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g;
		let lastIndex = 0;
		let result = "";
		for (;;) {
			const match = protocolRegex.exec(urlObject.pathname);
			if (!match) break;
			const protocol = match[0];
			const protocolAtIndex = match.index;
			const intermediate = urlObject.pathname.slice(lastIndex, protocolAtIndex);
			result += intermediate.replace(/\/{2,}/g, "/");
			result += protocol;
			lastIndex = protocolAtIndex + protocol.length;
		}
		const remnant = urlObject.pathname.slice(lastIndex, urlObject.pathname.length);
		result += remnant.replace(/\/{2,}/g, "/");
		urlObject.pathname = result;
	}
	if (urlObject.pathname) try {
		urlObject.pathname = decodeURI(urlObject.pathname).replace(/\\/g, "%5C");
	} catch {}
	if (options.removeDirectoryIndex === true) options.removeDirectoryIndex = [/^index\.[a-z]+$/];
	if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
		const pathComponents = urlObject.pathname.split("/").filter(Boolean);
		const lastComponent = pathComponents.at(-1);
		if (lastComponent && testParameter(lastComponent, options.removeDirectoryIndex)) {
			pathComponents.pop();
			urlObject.pathname = pathComponents.length > 0 ? `/${pathComponents.join("/")}/` : "/";
		}
	}
	if (options.removePath) urlObject.pathname = "/";
	if (options.transformPath && typeof options.transformPath === "function") {
		const pathComponents = urlObject.pathname.split("/").filter(Boolean);
		const newComponents = options.transformPath(pathComponents);
		urlObject.pathname = newComponents?.length > 0 ? `/${newComponents.join("/")}` : "/";
	}
	if (urlObject.hostname) {
		urlObject.hostname = urlObject.hostname.replace(/\.$/, "");
		if (options.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(urlObject.hostname)) urlObject.hostname = urlObject.hostname.replace(/^www\./, "");
	}
	if (Array.isArray(options.removeQueryParameters)) {
		for (const key of [...urlObject.searchParams.keys()]) if (testParameter(key, options.removeQueryParameters)) urlObject.searchParams.delete(key);
	}
	if (!Array.isArray(options.keepQueryParameters) && options.removeQueryParameters === true) urlObject.search = "";
	if (Array.isArray(options.keepQueryParameters) && options.keepQueryParameters.length > 0) {
		for (const key of [...urlObject.searchParams.keys()]) if (!testParameter(key, options.keepQueryParameters)) urlObject.searchParams.delete(key);
	}
	if (options.sortQueryParameters) {
		const originalSearch = urlObject.search;
		urlObject.searchParams.sort();
		try {
			urlObject.search = decodeURIComponent(urlObject.search);
		} catch {}
		const partsWithoutEquals = originalSearch.slice(1).split("&").filter((p) => p && !p.includes("="));
		for (const part of partsWithoutEquals) {
			const decoded = decodeURIComponent(part);
			urlObject.search = urlObject.search.replace(`?${decoded}=`, `?${decoded}`).replace(`&${decoded}=`, `&${decoded}`);
		}
	}
	if (options.removeTrailingSlash) urlObject.pathname = urlObject.pathname.replace(/\/$/, "");
	if (options.removeExplicitPort && urlObject.port) urlObject.port = "";
	const oldUrlString = urlString;
	urlString = urlObject.toString();
	if (!options.removeSingleSlash && urlObject.pathname === "/" && !oldUrlString.endsWith("/") && urlObject.hash === "") urlString = urlString.replace(/\/$/, "");
	if ((options.removeTrailingSlash || urlObject.pathname === "/") && urlObject.hash === "" && options.removeSingleSlash) urlString = urlString.replace(/\/$/, "");
	if (hasRelativeProtocol && !options.normalizeProtocol) urlString = urlString.replace(/^http:\/\//, "//");
	if (options.stripProtocol) urlString = urlString.replace(/^(?:https?:)?\/\//, "");
	return urlString;
}
//#endregion
//#region node_modules/responselike/node_modules/lowercase-keys/index.js
function lowercaseKeys(object) {
	return Object.fromEntries(Object.entries(object).map(([key, value]) => [key.toLowerCase(), value]));
}
//#endregion
//#region node_modules/responselike/index.js
var Response = class extends Readable {
	statusCode;
	headers;
	body;
	url;
	complete;
	constructor({ statusCode, headers, body, url }) {
		if (typeof statusCode !== "number") throw new TypeError("Argument `statusCode` should be a number");
		if (typeof headers !== "object") throw new TypeError("Argument `headers` should be an object");
		if (!(body instanceof Uint8Array)) throw new TypeError("Argument `body` should be a buffer");
		if (typeof url !== "string") throw new TypeError("Argument `url` should be a string");
		let bodyPushed = false;
		super({ read() {
			if (!bodyPushed) {
				bodyPushed = true;
				this.push(body);
				return;
			}
			this.push(null);
		} });
		this.statusCode = statusCode;
		this.headers = lowercaseKeys(headers);
		this.body = body;
		this.url = url;
		this.complete = true;
	}
};
//#endregion
//#region node_modules/cacheable-request/dist/types.js
var RequestError = class extends Error {
	constructor(error) {
		super(error.message);
		Object.defineProperties(this, Object.getOwnPropertyDescriptors(error));
	}
};
var CacheError = class extends Error {
	constructor(error) {
		super(error.message);
		Object.defineProperties(this, Object.getOwnPropertyDescriptors(error));
	}
};
//#endregion
//#region node_modules/cacheable-request/dist/index.js
var CacheableRequest = class {
	constructor(cacheRequest, cacheAdapter) {
		this.cache = new Keyv({ namespace: "cacheable-request" });
		this.hooks = /* @__PURE__ */ new Map();
		this.request = () => (options, callback) => {
			let url;
			if (typeof options === "string") {
				url = normalizeUrlObject(parseWithWhatwg(options));
				options = {};
			} else if (options instanceof urlLib.URL) {
				url = normalizeUrlObject(parseWithWhatwg(options.toString()));
				options = {};
			} else {
				const [pathname, ...searchParts] = (options.path ?? "").split("?");
				const search = searchParts.length > 0 ? `?${searchParts.join("?")}` : "";
				url = normalizeUrlObject({
					...options,
					pathname,
					search
				});
			}
			options = {
				headers: {},
				method: "GET",
				cache: true,
				strictTtl: false,
				automaticFailover: false,
				...options,
				...urlObjectToRequestOptions(url)
			};
			options.headers = Object.fromEntries(entries(options.headers).map(([key, value]) => [key.toLowerCase(), value]));
			const ee = new EventEmitter$1();
			const normalizedUrlString = normalizeUrl(urlLib.format(url), {
				stripWWW: false,
				removeTrailingSlash: false,
				stripAuthentication: false
			});
			let key = `${options.method}:${normalizedUrlString}`;
			if (options.body && options.method !== void 0 && [
				"POST",
				"PATCH",
				"PUT"
			].includes(options.method)) {
				if (options.body instanceof stream.Readable) options.cache = false;
				else key += `:${crypto.createHash("md5").update(options.body).digest("hex")}`;
			}
			let revalidate = false;
			let madeRequest = false;
			const makeRequest = (options_) => {
				madeRequest = true;
				let requestErrored = false;
				/* c8 ignore next 4 */
				let requestErrorCallback = () => {};
				const requestErrorPromise = new Promise((resolve) => {
					requestErrorCallback = () => {
						if (!requestErrored) {
							requestErrored = true;
							resolve();
						}
					};
				});
				const handler = async (response) => {
					if (revalidate) {
						response.status = response.statusCode;
						const originalPolicy = import_http_cache_semantics.default.fromObject(revalidate.cachePolicy);
						const revalidatedPolicy = originalPolicy.revalidatedPolicy(options_, response);
						if (!revalidatedPolicy.modified) {
							response.resume();
							await new Promise((resolve) => {
								response.once("end", resolve);
							});
							const headers = convertHeaders(revalidatedPolicy.policy.responseHeaders());
							const originalHeaders = convertHeaders(originalPolicy.responseHeaders());
							for (const headerName of [
								"content-encoding",
								"content-type",
								"content-length",
								"content-language",
								"content-location",
								"etag"
							]) if (originalHeaders[headerName] !== void 0 && headers[headerName] === void 0) headers[headerName] = originalHeaders[headerName];
							response = new Response({
								statusCode: revalidate.statusCode,
								headers,
								body: revalidate.body,
								url: revalidate.url
							});
							response.cachePolicy = revalidatedPolicy.policy;
							response.fromCache = true;
						}
					}
					if (!response.fromCache) {
						response.cachePolicy = new import_http_cache_semantics.default(options_, response, options_);
						response.fromCache = false;
					}
					let clonedResponse;
					if (options_.cache && response.cachePolicy.storable()) {
						clonedResponse = cloneResponse(response);
						(async () => {
							try {
								const bodyPromise = getStreamAsBuffer(response);
								await Promise.race([
									requestErrorPromise,
									new Promise((resolve) => response.once("end", resolve)),
									new Promise((resolve) => response.once("close", resolve))
								]);
								const body = await bodyPromise;
								let value = {
									url: response.url,
									statusCode: response.fromCache ? revalidate.statusCode : response.statusCode,
									body,
									cachePolicy: response.cachePolicy.toObject()
								};
								let ttl = options_.strictTtl ? response.cachePolicy.timeToLive() : void 0;
								if (options_.maxTtl) ttl = ttl ? Math.min(ttl, options_.maxTtl) : options_.maxTtl;
								if (this.hooks.size > 0) for (const key_ of this.hooks.keys()) value = await this.runHook(key_, value, response);
								await this.cache.set(key, value, ttl);
							} catch (error) {
								/* c8 ignore next -- @preserve */
								ee.emit("error", new CacheError(error));
							}
						})();
					} else if (options_.cache && revalidate) (async () => {
						try {
							await this.cache.delete(key);
						} catch (error) {
							/* c8 ignore next -- @preserve */
							ee.emit("error", new CacheError(error));
						}
					})();
					ee.emit("response", clonedResponse ?? response);
					if (typeof callback === "function") callback(clonedResponse ?? response);
				};
				try {
					const request_ = this.cacheRequest(options_, handler);
					request_.once("error", requestErrorCallback);
					request_.once("abort", requestErrorCallback);
					request_.once("destroy", requestErrorCallback);
					ee.emit("request", request_);
				} catch (error) {
					ee.emit("error", new RequestError(error));
				}
			};
			(async () => {
				const get = async (options_) => {
					await Promise.resolve();
					const cacheEntry = options_.cache ? await this.cache.get(key) : void 0;
					if (cacheEntry === void 0 && !options_.forceRefresh) {
						makeRequest(options_);
						return;
					}
					const policy = import_http_cache_semantics.default.fromObject(cacheEntry.cachePolicy);
					if (policy.satisfiesWithoutRevalidation(options_) && !options_.forceRefresh) {
						const headers = convertHeaders(policy.responseHeaders());
						const bodyBuffer = cacheEntry.body;
						const body = Buffer.from(bodyBuffer);
						const response = new Response({
							statusCode: cacheEntry.statusCode,
							headers,
							body,
							url: cacheEntry.url
						});
						response.cachePolicy = policy;
						response.fromCache = true;
						ee.emit("response", response);
						if (typeof callback === "function") callback(response);
					} else if (policy.satisfiesWithoutRevalidation(options_) && Date.now() >= policy.timeToLive() && options_.forceRefresh) {
						await this.cache.delete(key);
						options_.headers = policy.revalidationHeaders(options_);
						makeRequest(options_);
					} else {
						revalidate = cacheEntry;
						options_.headers = policy.revalidationHeaders(options_);
						makeRequest(options_);
					}
				};
				const errorHandler = (error) => ee.emit("error", new CacheError(error));
				if (this.cache instanceof Keyv) {
					const cachek = this.cache;
					cachek.once("error", errorHandler);
					ee.on("error", () => {
						cachek.removeListener("error", errorHandler);
					});
					ee.on("response", () => {
						cachek.removeListener("error", errorHandler);
					});
				}
				try {
					await get(options);
				} catch (error) {
					/* v8 ignore next -- @preserve */
					if (options.automaticFailover && !madeRequest) makeRequest(options);
					ee.emit("error", new CacheError(error));
				}
			})();
			return ee;
		};
		this.addHook = (name, function_) => {
			if (!this.hooks.has(name)) this.hooks.set(name, function_);
		};
		this.removeHook = (name) => this.hooks.delete(name);
		this.getHook = (name) => this.hooks.get(name);
		this.runHook = async (name, ...arguments_) => this.hooks.get(name)?.(...arguments_);
		if (cacheAdapter) {
			if (cacheAdapter instanceof Keyv) this.cache = cacheAdapter;
			else this.cache = new Keyv({
				store: cacheAdapter,
				namespace: "cacheable-request"
			});
		}
		this.request = this.request.bind(this);
		this.cacheRequest = cacheRequest;
	}
};
var entries = Object.entries;
var cloneResponse = (response) => {
	const clone = new PassThrough({ autoDestroy: false });
	mimicResponse(response, clone);
	return response.pipe(clone);
};
var urlObjectToRequestOptions = (url) => {
	const options = { ...url };
	options.path = `${url.pathname || "/"}${url.search || ""}`;
	delete options.pathname;
	delete options.search;
	return options;
};
var normalizeUrlObject = (url) => ({
	protocol: url.protocol,
	auth: url.auth,
	hostname: url.hostname || url.host || "localhost",
	port: url.port,
	pathname: url.pathname,
	search: url.search
});
var convertHeaders = (headers) => {
	const result = [];
	for (const name of Object.keys(headers)) result[name.toLowerCase()] = headers[name];
	return result;
};
var parseWithWhatwg = (raw) => {
	const u = new URL$1(raw);
	return {
		protocol: u.protocol,
		slashes: true,
		/* c8 ignore next 3 */
		auth: u.username || u.password ? `${u.username}:${u.password}` : void 0,
		host: u.host,
		port: u.port,
		hostname: u.hostname,
		hash: u.hash,
		search: u.search,
		query: Object.fromEntries(u.searchParams),
		pathname: u.pathname,
		path: u.pathname + u.search,
		href: u.href
	};
};
//#endregion
export { CacheError as n, mimicResponse as r, CacheableRequest as t };
