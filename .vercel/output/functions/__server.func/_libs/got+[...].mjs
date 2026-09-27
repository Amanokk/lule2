import { i as __require, o as __toESM, t as __commonJSMin } from "../_runtime.mjs";
import { n as is, r as isBuffer, t as assert$1 } from "./sindresorhus__is.mjs";
import { t as byteLength } from "./byte-counter.mjs";
import { t as chunk } from "./chunk-data.mjs";
import { n as CacheError$1, t as CacheableRequest } from "./cacheable-request+[...].mjs";
import { t as decompressResponse } from "./decompress-response.mjs";
import { t as CacheableLookup } from "./cacheable-lookup.mjs";
import nodeHTTP, { ServerResponse } from "node:http";
import { Duplex } from "node:stream";
import nodeHTTPS from "node:https";
import { randomUUID } from "node:crypto";
import { EventEmitter, addAbortListener, errorMonitor } from "node:events";
import { inspect, isDeepStrictEqual, promisify, types } from "node:util";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import process$1 from "node:process";
import { Buffer as Buffer$1 } from "node:buffer";
import net from "node:net";
import { checkServerIdentity } from "node:tls";
import diagnosticsChannel from "node:diagnostics_channel";
//#region node_modules/got/dist/source/core/utils/strip-url-auth.js
function stripUrlAuth(url) {
	const sanitized = new URL(url);
	sanitized.username = "";
	sanitized.password = "";
	return sanitized.toString();
}
//#endregion
//#region node_modules/got/dist/source/core/errors.js
function isRequest(x) {
	return is.object(x) && "_onResponse" in x;
}
/**
An error to be thrown when a request fails.
Contains a `code` property with error class code, like `ECONNREFUSED`.
*/
var RequestError = class extends Error {
	name = "RequestError";
	code = "ERR_GOT_REQUEST_ERROR";
	input;
	stack;
	response;
	request;
	timings;
	constructor(message, error, self) {
		super(message, { cause: error });
		Error.captureStackTrace(this, this.constructor);
		if (error.code) this.code = error.code;
		this.input = error.input;
		if (isRequest(self)) {
			Object.defineProperty(this, "request", {
				enumerable: false,
				value: self
			});
			Object.defineProperty(this, "response", {
				enumerable: false,
				value: self.response
			});
			this.options = self.options;
		} else this.options = self;
		this.timings = this.request?.timings;
		if (is.string(error.stack) && is.string(this.stack)) {
			const indexOfMessage = this.stack.indexOf(this.message) + this.message.length;
			const thisStackTrace = this.stack.slice(indexOfMessage).split("\n").toReversed();
			const errorStackTrace = error.stack.slice(error.stack.indexOf(error.message) + error.message.length).split("\n").toReversed();
			while (errorStackTrace.length > 0 && errorStackTrace[0] === thisStackTrace[0]) thisStackTrace.shift();
			this.stack = `${this.stack.slice(0, indexOfMessage)}${thisStackTrace.toReversed().join("\n")}${errorStackTrace.toReversed().join("\n")}`;
		}
	}
};
/**
An error to be thrown when the server redirects you more than ten times.
Includes a `response` property.
*/
var MaxRedirectsError = class extends RequestError {
	name = "MaxRedirectsError";
	code = "ERR_TOO_MANY_REDIRECTS";
	constructor(request) {
		super(`Redirected ${request.options.maxRedirects} times. Aborting.`, {}, request);
	}
};
/**
An error to be thrown when the server response code is not 2xx nor 3xx if `options.followRedirect` is `true`, but always except for 304.
Includes a `response` property.
*/
var HTTPError = class extends RequestError {
	name = "HTTPError";
	code = "ERR_NON_2XX_3XX_RESPONSE";
	constructor(response) {
		super(`Request failed with status code ${response.statusCode} (${response.statusMessage}): ${response.request.options.method} ${stripUrlAuth(response.request.options.url)}`, {}, response.request);
	}
};
/**
An error to be thrown when a cache method fails.
For example, if the database goes down or there's a filesystem error.
*/
var CacheError = class extends RequestError {
	name = "CacheError";
	constructor(error, request) {
		super(error.message, error, request);
		this.code = "ERR_CACHE_ACCESS";
	}
};
/**
An error to be thrown when the request body is a stream and an error occurs while reading from that stream.
*/
var UploadError = class extends RequestError {
	name = "UploadError";
	constructor(error, request) {
		super(error.message, error, request);
		this.code = "ERR_UPLOAD";
	}
};
/**
An error to be thrown when the request is aborted due to a timeout.
Includes an `event` and `timings` property.
*/
var TimeoutError$1 = class extends RequestError {
	name = "TimeoutError";
	timings;
	event;
	constructor(error, timings, request) {
		super(error.message, error, request);
		this.event = error.event;
		this.timings = timings;
	}
};
/**
An error to be thrown when reading from response stream fails.
*/
var ReadError = class extends RequestError {
	name = "ReadError";
	code = "ERR_READING_RESPONSE_STREAM";
	constructor(error, request) {
		super(error.message, error, request);
		if (error.code === "ECONNRESET" || error.code === "ERR_HTTP_CONTENT_LENGTH_MISMATCH") this.code = error.code;
	}
};
/**
An error which always triggers a new retry when thrown.
*/
var RetryError = class extends RequestError {
	name = "RetryError";
	code = "ERR_RETRYING";
	constructor(request) {
		super("Retrying", {}, request);
	}
};
/**
An error to be thrown when the request is aborted by AbortController.
*/
var AbortError = class extends RequestError {
	name = "AbortError";
	code = "ERR_ABORTED";
	constructor(request) {
		super("This operation was aborted.", {}, request);
	}
};
//#endregion
//#region node_modules/uint8array-extras/index.js
var objectToString = Object.prototype.toString;
var uint8ArrayStringified = "[object Uint8Array]";
var arrayBufferStringified = "[object ArrayBuffer]";
function isType(value, typeConstructor, typeStringified) {
	if (!value) return false;
	if (value.constructor === typeConstructor) return true;
	return objectToString.call(value) === typeStringified;
}
function isUint8Array(value) {
	return isType(value, Uint8Array, uint8ArrayStringified);
}
function isArrayBuffer(value) {
	return isType(value, ArrayBuffer, arrayBufferStringified);
}
function isUint8ArrayOrArrayBuffer(value) {
	return isUint8Array(value) || isArrayBuffer(value);
}
function toUint8ArrayIfArrayBuffer(value) {
	return isArrayBuffer(value) ? new Uint8Array(value) : value;
}
function assertUint8ArrayOrArrayBuffer(value) {
	if (!isUint8ArrayOrArrayBuffer(value)) throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof value}\``);
}
function concatUint8Arrays(arrays, totalLength) {
	if (arrays.length === 0) return /* @__PURE__ */ new Uint8Array(0);
	totalLength ??= arrays.reduce((accumulator, currentValue) => accumulator + currentValue.byteLength, 0);
	const returnValue = new Uint8Array(totalLength);
	let offset = 0;
	for (let array of arrays) {
		assertUint8ArrayOrArrayBuffer(array);
		array = toUint8ArrayIfArrayBuffer(array);
		returnValue.set(array, offset);
		offset += array.length;
	}
	return returnValue;
}
new globalThis.TextDecoder("utf8");
function assertString(value) {
	if (typeof value !== "string") throw new TypeError(`Expected \`string\`, got \`${typeof value}\``);
}
var cachedEncoder = new globalThis.TextEncoder();
function stringToUint8Array(string) {
	assertString(string);
	return cachedEncoder.encode(string);
}
function base64ToBase64Url(base64) {
	return base64.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}
var MAX_BLOCK_SIZE = 65535;
function uint8ArrayToBase64(array, { urlSafe = false } = {}) {
	assertUint8ArrayOrArrayBuffer(array);
	array = toUint8ArrayIfArrayBuffer(array);
	let base64 = "";
	for (let index = 0; index < array.length; index += MAX_BLOCK_SIZE) {
		const chunk = array.subarray(index, index + MAX_BLOCK_SIZE);
		base64 += globalThis.btoa(String.fromCodePoint.apply(void 0, chunk));
	}
	return urlSafe ? base64ToBase64Url(base64) : base64;
}
function stringToBase64(string, { urlSafe = false } = {}) {
	assertString(string);
	return uint8ArrayToBase64(stringToUint8Array(string), { urlSafe });
}
Array.from({ length: 256 }, (_, index) => index.toString(16).padStart(2, "0"));
//#endregion
//#region node_modules/got/dist/source/core/utils/defer-to-connect.js
function isTlsSocket(socket) {
	return "encrypted" in socket;
}
var deferToConnect = (socket, fn) => {
	const listeners = typeof fn === "function" ? { connect: fn } : fn;
	const onConnect = () => {
		listeners.connect?.();
		if (isTlsSocket(socket) && listeners.secureConnect) {
			if (socket.authorized) listeners.secureConnect();
			else socket.once("secureConnect", listeners.secureConnect);
		}
		if (listeners.close) socket.once("close", listeners.close);
	};
	if (socket.writable && !socket.connecting) onConnect();
	else if (socket.connecting) socket.once("connect", onConnect);
	else if (socket.destroyed && listeners.close) {
		const hadError = "_hadError" in socket ? Boolean(socket._hadError) : false;
		listeners.close(hadError);
	}
};
//#endregion
//#region node_modules/got/dist/source/core/utils/timer.js
var getInitialConnectionTimings = (socket) => Reflect.get(socket, "__initial_connection_timings__");
var setInitialConnectionTimings = (socket, timings) => {
	Reflect.set(socket, "__initial_connection_timings__", timings);
};
var timer = (request) => {
	if (request.timings) return request.timings;
	const timings = {
		start: Date.now(),
		socket: void 0,
		lookup: void 0,
		connect: void 0,
		secureConnect: void 0,
		upload: void 0,
		response: void 0,
		end: void 0,
		error: void 0,
		abort: void 0,
		phases: {
			wait: void 0,
			dns: void 0,
			tcp: void 0,
			tls: void 0,
			request: void 0,
			firstByte: void 0,
			download: void 0,
			total: void 0
		}
	};
	request.timings = timings;
	const handleError = (origin) => {
		origin.once(errorMonitor, () => {
			timings.error = Date.now();
			timings.phases.total = timings.error - timings.start;
		});
	};
	handleError(request);
	const onAbort = () => {
		timings.abort = Date.now();
		timings.phases.total = timings.abort - timings.start;
	};
	request.prependOnceListener("abort", onAbort);
	const onSocket = (socket) => {
		timings.socket = Date.now();
		timings.phases.wait = timings.socket - timings.start;
		if (types.isProxy(socket)) return;
		if (socket.writable && !socket.connecting) {
			timings.lookup = timings.socket;
			timings.connect = timings.socket;
			const initialConnectionTimings = getInitialConnectionTimings(socket);
			if (initialConnectionTimings) {
				timings.phases.dns = initialConnectionTimings.dnsPhase;
				timings.phases.tcp = initialConnectionTimings.tcpPhase;
				timings.phases.tls = initialConnectionTimings.tlsPhase;
				if (timings.phases.tls !== void 0) timings.secureConnect = timings.socket;
			} else {
				timings.phases.dns = 0;
				timings.phases.tcp = 0;
			}
			return;
		}
		const lookupListener = () => {
			timings.lookup = Date.now();
			timings.phases.dns = timings.lookup - timings.socket;
		};
		socket.prependOnceListener("lookup", lookupListener);
		deferToConnect(socket, {
			connect() {
				timings.connect = Date.now();
				if (timings.lookup === void 0) {
					socket.removeListener("lookup", lookupListener);
					timings.lookup = timings.socket;
					timings.phases.dns = 0;
				}
				timings.phases.tcp = timings.connect - timings.lookup;
				if (timings.phases.tcp === 0 && timings.phases.dns && timings.phases.dns > 0) timings.phases.dns = 0;
				if (!getInitialConnectionTimings(socket)) setInitialConnectionTimings(socket, {
					dnsPhase: timings.phases.dns,
					tcpPhase: timings.phases.tcp
				});
			},
			secureConnect() {
				timings.secureConnect = Date.now();
				timings.phases.tls = timings.secureConnect - timings.connect;
				const initialConnectionTimings = getInitialConnectionTimings(socket);
				if (initialConnectionTimings) initialConnectionTimings.tlsPhase = timings.phases.tls;
			}
		});
	};
	if (request.socket) onSocket(request.socket);
	else request.prependOnceListener("socket", onSocket);
	const onUpload = () => {
		timings.upload = Date.now();
		const secureOrConnect = timings.secureConnect ?? timings.connect;
		if (secureOrConnect !== void 0) timings.phases.request = timings.upload - secureOrConnect;
	};
	if (request.writableFinished) onUpload();
	else request.prependOnceListener("finish", onUpload);
	request.prependOnceListener("response", (response) => {
		timings.response = Date.now();
		timings.phases.firstByte = timings.response - timings.upload;
		response.timings = timings;
		handleError(response);
		response.prependOnceListener("end", () => {
			request.off("abort", onAbort);
			response.off("aborted", onAbort);
			if (timings.phases.total !== void 0) return;
			timings.end = Date.now();
			timings.phases.download = timings.end - timings.response;
			timings.phases.total = timings.end - timings.start;
		});
		response.prependOnceListener("aborted", onAbort);
	});
	return timings;
};
//#endregion
//#region node_modules/got/dist/source/core/utils/get-body-size.js
function getBodySize(body, headers) {
	if (headers && "content-length" in headers) return Number(headers["content-length"]);
	if (!body) return 0;
	if (is.string(body)) return stringToUint8Array(body).byteLength;
	if (is.buffer(body)) return body.length;
	if (is.typedArray(body)) return body.byteLength;
}
//#endregion
//#region node_modules/got/dist/source/core/utils/proxy-events.js
function proxyEvents(from, to, events) {
	const eventFunctions = /* @__PURE__ */ new Map();
	for (const event of events) {
		const eventFunction = (...arguments_) => {
			to.emit(event, ...arguments_);
		};
		eventFunctions.set(event, eventFunction);
		from.on(event, eventFunction);
	}
	return () => {
		for (const [event, eventFunction] of eventFunctions) from.off(event, eventFunction);
	};
}
//#endregion
//#region node_modules/got/dist/source/core/utils/unhandle.js
function unhandle() {
	const handlers = [];
	return {
		once(origin, event, function_) {
			origin.once(event, function_);
			handlers.push({
				origin,
				event,
				fn: function_
			});
		},
		unhandleAll() {
			for (const { origin, event, fn } of handlers) origin.removeListener(event, fn);
			handlers.length = 0;
		}
	};
}
//#endregion
//#region node_modules/got/dist/source/core/timed-out.js
var reentry = Symbol("reentry");
var noop$1 = () => {};
var TimeoutError = class extends Error {
	name = "TimeoutError";
	code = "ETIMEDOUT";
	event;
	constructor(threshold, event) {
		super(`Timeout awaiting '${event}' for ${threshold}ms`);
		this.event = event;
	}
};
function timedOut(request, delays, options) {
	if (reentry in request) return noop$1;
	request[reentry] = true;
	const cancelers = [];
	const { once, unhandleAll } = unhandle();
	const handled = /* @__PURE__ */ new Set();
	const addTimeout = (delay, callback, event) => {
		const timeout = setTimeout(callback, delay, delay, event);
		timeout.unref?.();
		const cancel = () => {
			handled.add(event);
			clearTimeout(timeout);
		};
		cancelers.push(cancel);
		return cancel;
	};
	const { host, hostname } = options;
	const timeoutHandler = (delay, event) => {
		setTimeout(() => {
			if (!handled.has(event)) request.destroy(new TimeoutError(delay, event));
		}, 0);
	};
	const cancelTimeouts = () => {
		for (const cancel of cancelers) cancel();
		unhandleAll();
	};
	request.once("error", (error) => {
		cancelTimeouts();
		/* istanbul ignore next */
		if (request.listenerCount("error") === 0) throw error;
	});
	if (delays.request !== void 0) {
		const cancelTimeout = addTimeout(delays.request, timeoutHandler, "request");
		once(request, "response", (response) => {
			once(response, "end", cancelTimeout);
		});
	}
	if (delays.socket !== void 0) {
		const { socket } = delays;
		const socketTimeoutHandler = () => {
			timeoutHandler(socket, "socket");
		};
		request.setTimeout(socket, socketTimeoutHandler);
		cancelers.push(() => {
			request.removeListener("timeout", socketTimeoutHandler);
		});
	}
	const hasLookup = delays.lookup !== void 0;
	const hasConnect = delays.connect !== void 0;
	const hasSecureConnect = delays.secureConnect !== void 0;
	const hasSend = delays.send !== void 0;
	if (hasLookup || hasConnect || hasSecureConnect || hasSend) once(request, "socket", (socket) => {
		const { socketPath } = request;
		/* istanbul ignore next: hard to test */
		if (socket.connecting) {
			const hasPath = Boolean(socketPath ?? net.isIP(hostname ?? host ?? "") !== 0);
			if (hasLookup && !hasPath && socket.address().address === void 0) {
				const cancelTimeout = addTimeout(delays.lookup, timeoutHandler, "lookup");
				once(socket, "lookup", cancelTimeout);
			}
			if (hasConnect) {
				const timeConnect = () => addTimeout(delays.connect, timeoutHandler, "connect");
				if (hasPath) once(socket, "connect", timeConnect());
				else once(socket, "lookup", (error) => {
					if (error === null) once(socket, "connect", timeConnect());
				});
			}
			if (hasSecureConnect && options.protocol === "https:") once(socket, "connect", () => {
				const cancelTimeout = addTimeout(delays.secureConnect, timeoutHandler, "secureConnect");
				once(socket, "secureConnect", cancelTimeout);
			});
		}
		if (hasSend) {
			const timeRequest = () => addTimeout(delays.send, timeoutHandler, "send");
			/* istanbul ignore next: hard to test */
			if (socket.connecting) once(socket, "connect", () => {
				once(request, "upload-complete", timeRequest());
			});
			else once(request, "upload-complete", timeRequest());
		}
	});
	if (delays.response !== void 0) once(request, "upload-complete", () => {
		const cancelTimeout = addTimeout(delays.response, timeoutHandler, "response");
		once(request, "response", cancelTimeout);
	});
	if (delays.read !== void 0) once(request, "response", (response) => {
		const cancelTimeout = addTimeout(delays.read, timeoutHandler, "read");
		once(response, "end", cancelTimeout);
	});
	return cancelTimeouts;
}
//#endregion
//#region node_modules/got/dist/source/core/utils/weakable-map.js
var WeakableMap = class {
	weakMap = /* @__PURE__ */ new WeakMap();
	map = /* @__PURE__ */ new Map();
	set(key, value) {
		if (typeof key === "object") this.weakMap.set(key, value);
		else this.map.set(key, value);
	}
	get(key) {
		if (typeof key === "object") return this.weakMap.get(key);
		return this.map.get(key);
	}
	has(key) {
		if (typeof key === "object") return this.weakMap.has(key);
		return this.map.has(key);
	}
};
//#endregion
//#region node_modules/got/dist/source/core/calculate-retry-delay.js
var calculateRetryDelay = ({ attemptCount, retryOptions, error, retryAfter, computedValue }) => {
	if (error.name === "RetryError") return 1;
	if (attemptCount > retryOptions.limit) return 0;
	const hasMethod = retryOptions.methods.includes(error.options.method);
	const hasErrorCode = retryOptions.errorCodes.includes(error.code);
	const hasStatusCode = error.response && retryOptions.statusCodes.includes(error.response.statusCode);
	if (!hasMethod || !hasErrorCode && !hasStatusCode) return 0;
	if (error.response) {
		if (retryAfter) return retryAfter > computedValue ? 0 : retryAfter;
		if (error.response.statusCode === 413) return 0;
	}
	const noise = Math.random() * retryOptions.noise;
	return Math.min(2 ** (attemptCount - 1) * 1e3, retryOptions.backoffLimit) + noise;
};
//#endregion
//#region node_modules/lowercase-keys/index.js
function lowercaseKeys(object, { onConflict } = {}) {
	if (typeof object !== "object" || object === null) throw new TypeError(`Expected an object, got ${object === null ? "null" : typeof object}`);
	const result = {};
	for (const [key, value] of Object.entries(object)) {
		const lowercasedKey = key.toLowerCase();
		const hasExistingKey = Object.hasOwn(result, lowercasedKey);
		const existingValue = hasExistingKey ? result[lowercasedKey] : void 0;
		const resolvedValue = onConflict && hasExistingKey ? onConflict({
			key: lowercasedKey,
			newValue: value,
			existingValue
		}) : value;
		Object.defineProperty(result, lowercasedKey, {
			value: resolvedValue,
			writable: true,
			enumerable: true,
			configurable: true
		});
	}
	return result;
}
//#endregion
//#region node_modules/quick-lru/index.js
var require_quick_lru = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var QuickLRU = class {
		constructor(options = {}) {
			if (!(options.maxSize && options.maxSize > 0)) throw new TypeError("`maxSize` must be a number greater than 0");
			this.maxSize = options.maxSize;
			this.onEviction = options.onEviction;
			this.cache = /* @__PURE__ */ new Map();
			this.oldCache = /* @__PURE__ */ new Map();
			this._size = 0;
		}
		_set(key, value) {
			this.cache.set(key, value);
			this._size++;
			if (this._size >= this.maxSize) {
				this._size = 0;
				if (typeof this.onEviction === "function") for (const [key, value] of this.oldCache.entries()) this.onEviction(key, value);
				this.oldCache = this.cache;
				this.cache = /* @__PURE__ */ new Map();
			}
		}
		get(key) {
			if (this.cache.has(key)) return this.cache.get(key);
			if (this.oldCache.has(key)) {
				const value = this.oldCache.get(key);
				this.oldCache.delete(key);
				this._set(key, value);
				return value;
			}
		}
		set(key, value) {
			if (this.cache.has(key)) this.cache.set(key, value);
			else this._set(key, value);
			return this;
		}
		has(key) {
			return this.cache.has(key) || this.oldCache.has(key);
		}
		peek(key) {
			if (this.cache.has(key)) return this.cache.get(key);
			if (this.oldCache.has(key)) return this.oldCache.get(key);
		}
		delete(key) {
			const deleted = this.cache.delete(key);
			if (deleted) this._size--;
			return this.oldCache.delete(key) || deleted;
		}
		clear() {
			this.cache.clear();
			this.oldCache.clear();
			this._size = 0;
		}
		*keys() {
			for (const [key] of this) yield key;
		}
		*values() {
			for (const [, value] of this) yield value;
		}
		*[Symbol.iterator]() {
			for (const item of this.cache) yield item;
			for (const item of this.oldCache) {
				const [key] = item;
				if (!this.cache.has(key)) yield item;
			}
		}
		get size() {
			let oldCacheSize = 0;
			for (const key of this.oldCache.keys()) if (!this.cache.has(key)) oldCacheSize++;
			return Math.min(this._size + oldCacheSize, this.maxSize);
		}
	};
	module.exports = QuickLRU;
}));
//#endregion
//#region node_modules/http2-wrapper/source/utils/delay-async-destroy.js
var require_delay_async_destroy = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (stream) => {
		if (stream.listenerCount("error") !== 0) return stream;
		stream.__destroy = stream._destroy;
		stream._destroy = (...args) => {
			const callback = args.pop();
			stream.__destroy(...args, async (error) => {
				await Promise.resolve();
				callback(error);
			});
		};
		const onError = (error) => {
			Promise.resolve().then(() => {
				stream.emit("error", error);
			});
		};
		stream.once("error", onError);
		Promise.resolve().then(() => {
			stream.off("error", onError);
		});
		return stream;
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/agent.js
var require_agent = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { URL: URL$4 } = __require("url");
	var EventEmitter$2 = __require("events");
	var tls$2 = __require("tls");
	var http2$2 = __require("http2");
	var QuickLRU = require_quick_lru();
	var delayAsyncDestroy = require_delay_async_destroy();
	var kCurrentStreamCount = Symbol("currentStreamCount");
	var kRequest = Symbol("request");
	var kOriginSet = Symbol("cachedOriginSet");
	var kGracefullyClosing = Symbol("gracefullyClosing");
	var kLength = Symbol("length");
	var nameKeys = [
		"createConnection",
		"maxDeflateDynamicTableSize",
		"maxSettings",
		"maxSessionMemory",
		"maxHeaderListPairs",
		"maxOutstandingPings",
		"maxReservedRemoteStreams",
		"maxSendHeaderBlockLength",
		"paddingStrategy",
		"peerMaxConcurrentStreams",
		"settings",
		"family",
		"localAddress",
		"rejectUnauthorized",
		"pskCallback",
		"minDHSize",
		"path",
		"socket",
		"ca",
		"cert",
		"sigalgs",
		"ciphers",
		"clientCertEngine",
		"crl",
		"dhparam",
		"ecdhCurve",
		"honorCipherOrder",
		"key",
		"privateKeyEngine",
		"privateKeyIdentifier",
		"maxVersion",
		"minVersion",
		"pfx",
		"secureOptions",
		"secureProtocol",
		"sessionIdContext",
		"ticketKeys"
	];
	var getSortedIndex = (array, value, compare) => {
		let low = 0;
		let high = array.length;
		while (low < high) {
			const mid = low + high >>> 1;
			if (compare(array[mid], value)) low = mid + 1;
			else high = mid;
		}
		return low;
	};
	var compareSessions = (a, b) => a.remoteSettings.maxConcurrentStreams > b.remoteSettings.maxConcurrentStreams;
	var closeCoveredSessions = (where, session) => {
		for (let index = 0; index < where.length; index++) {
			const coveredSession = where[index];
			if (coveredSession[kOriginSet].length > 0 && coveredSession[kOriginSet].length < session[kOriginSet].length && coveredSession[kOriginSet].every((origin) => session[kOriginSet].includes(origin)) && coveredSession[kCurrentStreamCount] + session[kCurrentStreamCount] <= session.remoteSettings.maxConcurrentStreams) gracefullyClose(coveredSession);
		}
	};
	var closeSessionIfCovered = (where, coveredSession) => {
		for (let index = 0; index < where.length; index++) {
			const session = where[index];
			if (coveredSession[kOriginSet].length > 0 && coveredSession[kOriginSet].length < session[kOriginSet].length && coveredSession[kOriginSet].every((origin) => session[kOriginSet].includes(origin)) && coveredSession[kCurrentStreamCount] + session[kCurrentStreamCount] <= session.remoteSettings.maxConcurrentStreams) {
				gracefullyClose(coveredSession);
				return true;
			}
		}
		return false;
	};
	var gracefullyClose = (session) => {
		session[kGracefullyClosing] = true;
		if (session[kCurrentStreamCount] === 0) session.close();
	};
	var Agent = class Agent extends EventEmitter$2 {
		constructor({ timeout = 0, maxSessions = Number.POSITIVE_INFINITY, maxEmptySessions = 10, maxCachedTlsSessions = 100 } = {}) {
			super();
			this.sessions = {};
			this.queue = {};
			this.timeout = timeout;
			this.maxSessions = maxSessions;
			this.maxEmptySessions = maxEmptySessions;
			this._emptySessionCount = 0;
			this._sessionCount = 0;
			this.settings = {
				enablePush: false,
				initialWindowSize: 33554432
			};
			this.tlsSessionCache = new QuickLRU({ maxSize: maxCachedTlsSessions });
		}
		get protocol() {
			return "https:";
		}
		normalizeOptions(options) {
			let normalized = "";
			for (let index = 0; index < nameKeys.length; index++) {
				const key = nameKeys[index];
				normalized += ":";
				if (options && options[key] !== void 0) normalized += options[key];
			}
			return normalized;
		}
		_processQueue() {
			if (this._sessionCount >= this.maxSessions) {
				this.closeEmptySessions(this.maxSessions - this._sessionCount + 1);
				return;
			}
			for (const normalizedOptions in this.queue) for (const normalizedOrigin in this.queue[normalizedOptions]) {
				const item = this.queue[normalizedOptions][normalizedOrigin];
				if (!item.completed) {
					item.completed = true;
					item();
				}
			}
		}
		_isBetterSession(thisStreamCount, thatStreamCount) {
			return thisStreamCount > thatStreamCount;
		}
		_accept(session, listeners, normalizedOrigin, options) {
			let index = 0;
			while (index < listeners.length && session[kCurrentStreamCount] < session.remoteSettings.maxConcurrentStreams) {
				listeners[index].resolve(session);
				index++;
			}
			listeners.splice(0, index);
			if (listeners.length > 0) {
				this.getSession(normalizedOrigin, options, listeners);
				listeners.length = 0;
			}
		}
		getSession(origin, options, listeners) {
			return new Promise((resolve, reject) => {
				if (Array.isArray(listeners) && listeners.length > 0) {
					listeners = [...listeners];
					resolve();
				} else listeners = [{
					resolve,
					reject
				}];
				try {
					if (typeof origin === "string") origin = new URL$4(origin);
					else if (!(origin instanceof URL$4)) throw new TypeError("The `origin` argument needs to be a string or an URL object");
					if (options) {
						const { servername } = options;
						const { hostname } = origin;
						if (servername && hostname !== servername) throw new Error(`Origin ${hostname} differs from servername ${servername}`);
					}
				} catch (error) {
					for (let index = 0; index < listeners.length; index++) listeners[index].reject(error);
					return;
				}
				const normalizedOptions = this.normalizeOptions(options);
				const normalizedOrigin = origin.origin;
				if (normalizedOptions in this.sessions) {
					const sessions = this.sessions[normalizedOptions];
					let maxConcurrentStreams = -1;
					let currentStreamsCount = -1;
					let optimalSession;
					for (let index = 0; index < sessions.length; index++) {
						const session = sessions[index];
						const sessionMaxConcurrentStreams = session.remoteSettings.maxConcurrentStreams;
						if (sessionMaxConcurrentStreams < maxConcurrentStreams) break;
						if (!session[kOriginSet].includes(normalizedOrigin)) continue;
						const sessionCurrentStreamsCount = session[kCurrentStreamCount];
						if (sessionCurrentStreamsCount >= sessionMaxConcurrentStreams || session[kGracefullyClosing] || session.destroyed) continue;
						if (!optimalSession) maxConcurrentStreams = sessionMaxConcurrentStreams;
						if (this._isBetterSession(sessionCurrentStreamsCount, currentStreamsCount)) {
							optimalSession = session;
							currentStreamsCount = sessionCurrentStreamsCount;
						}
					}
					if (optimalSession) {
						this._accept(optimalSession, listeners, normalizedOrigin, options);
						return;
					}
				}
				if (normalizedOptions in this.queue) {
					if (normalizedOrigin in this.queue[normalizedOptions]) {
						this.queue[normalizedOptions][normalizedOrigin].listeners.push(...listeners);
						return;
					}
				} else this.queue[normalizedOptions] = { [kLength]: 0 };
				const removeFromQueue = () => {
					if (normalizedOptions in this.queue && this.queue[normalizedOptions][normalizedOrigin] === entry) {
						delete this.queue[normalizedOptions][normalizedOrigin];
						if (--this.queue[normalizedOptions][kLength] === 0) delete this.queue[normalizedOptions];
					}
				};
				const entry = async () => {
					this._sessionCount++;
					const name = `${normalizedOrigin}:${normalizedOptions}`;
					let receivedSettings = false;
					let socket;
					try {
						const computedOptions = { ...options };
						if (computedOptions.settings === void 0) computedOptions.settings = this.settings;
						if (computedOptions.session === void 0) computedOptions.session = this.tlsSessionCache.get(name);
						socket = await (computedOptions.createConnection || this.createConnection).call(this, origin, computedOptions);
						computedOptions.createConnection = () => socket;
						const session = http2$2.connect(origin, computedOptions);
						session[kCurrentStreamCount] = 0;
						session[kGracefullyClosing] = false;
						const getOriginSet = () => {
							const { socket } = session;
							let originSet;
							if (socket.servername === false) {
								socket.servername = socket.remoteAddress;
								originSet = session.originSet;
								socket.servername = false;
							} else originSet = session.originSet;
							return originSet;
						};
						const isFree = () => session[kCurrentStreamCount] < session.remoteSettings.maxConcurrentStreams;
						session.socket.once("session", (tlsSession) => {
							this.tlsSessionCache.set(name, tlsSession);
						});
						session.once("error", (error) => {
							for (let index = 0; index < listeners.length; index++) listeners[index].reject(error);
							this.tlsSessionCache.delete(name);
						});
						session.setTimeout(this.timeout, () => {
							session.destroy();
						});
						session.once("close", () => {
							this._sessionCount--;
							if (receivedSettings) {
								this._emptySessionCount--;
								const where = this.sessions[normalizedOptions];
								if (where.length === 1) delete this.sessions[normalizedOptions];
								else where.splice(where.indexOf(session), 1);
							} else {
								removeFromQueue();
								const error = /* @__PURE__ */ new Error("Session closed without receiving a SETTINGS frame");
								error.code = "HTTP2WRAPPER_NOSETTINGS";
								for (let index = 0; index < listeners.length; index++) listeners[index].reject(error);
							}
							this._processQueue();
						});
						const processListeners = () => {
							const queue = this.queue[normalizedOptions];
							if (!queue) return;
							const originSet = session[kOriginSet];
							for (let index = 0; index < originSet.length; index++) {
								const origin = originSet[index];
								if (origin in queue) {
									const { listeners, completed } = queue[origin];
									let index = 0;
									while (index < listeners.length && isFree()) {
										listeners[index].resolve(session);
										index++;
									}
									queue[origin].listeners.splice(0, index);
									if (queue[origin].listeners.length === 0 && !completed) {
										delete queue[origin];
										if (--queue[kLength] === 0) {
											delete this.queue[normalizedOptions];
											break;
										}
									}
									if (!isFree()) break;
								}
							}
						};
						session.on("origin", () => {
							session[kOriginSet] = getOriginSet() || [];
							session[kGracefullyClosing] = false;
							closeSessionIfCovered(this.sessions[normalizedOptions], session);
							if (session[kGracefullyClosing] || !isFree()) return;
							processListeners();
							if (!isFree()) return;
							closeCoveredSessions(this.sessions[normalizedOptions], session);
						});
						session.once("remoteSettings", () => {
							if (entry.destroyed) {
								const error = /* @__PURE__ */ new Error("Agent has been destroyed");
								for (let index = 0; index < listeners.length; index++) listeners[index].reject(error);
								session.destroy();
								return;
							}
							if (session.setLocalWindowSize) session.setLocalWindowSize(4194304);
							session[kOriginSet] = getOriginSet() || [];
							if (session.socket.encrypted) {
								const mainOrigin = session[kOriginSet][0];
								if (mainOrigin !== normalizedOrigin) {
									const error = /* @__PURE__ */ new Error(`Requested origin ${normalizedOrigin} does not match server ${mainOrigin}`);
									for (let index = 0; index < listeners.length; index++) listeners[index].reject(error);
									session.destroy();
									return;
								}
							}
							removeFromQueue();
							{
								const where = this.sessions;
								if (normalizedOptions in where) {
									const sessions = where[normalizedOptions];
									sessions.splice(getSortedIndex(sessions, session, compareSessions), 0, session);
								} else where[normalizedOptions] = [session];
							}
							receivedSettings = true;
							this._emptySessionCount++;
							this.emit("session", session);
							this._accept(session, listeners, normalizedOrigin, options);
							if (session[kCurrentStreamCount] === 0 && this._emptySessionCount > this.maxEmptySessions) this.closeEmptySessions(this._emptySessionCount - this.maxEmptySessions);
							session.on("remoteSettings", () => {
								if (!isFree()) return;
								processListeners();
								if (!isFree()) return;
								closeCoveredSessions(this.sessions[normalizedOptions], session);
							});
						});
						session[kRequest] = session.request;
						session.request = (headers, streamOptions) => {
							if (session[kGracefullyClosing]) throw new Error("The session is gracefully closing. No new streams are allowed.");
							const stream = session[kRequest](headers, streamOptions);
							session.ref();
							if (session[kCurrentStreamCount]++ === 0) this._emptySessionCount--;
							stream.once("close", () => {
								if (--session[kCurrentStreamCount] === 0) {
									this._emptySessionCount++;
									session.unref();
									if (this._emptySessionCount > this.maxEmptySessions || session[kGracefullyClosing]) {
										session.close();
										return;
									}
								}
								if (session.destroyed || session.closed) return;
								if (isFree() && !closeSessionIfCovered(this.sessions[normalizedOptions], session)) {
									closeCoveredSessions(this.sessions[normalizedOptions], session);
									processListeners();
									if (session[kCurrentStreamCount] === 0) this._processQueue();
								}
							});
							return stream;
						};
					} catch (error) {
						removeFromQueue();
						this._sessionCount--;
						for (let index = 0; index < listeners.length; index++) listeners[index].reject(error);
					}
				};
				entry.listeners = listeners;
				entry.completed = false;
				entry.destroyed = false;
				this.queue[normalizedOptions][normalizedOrigin] = entry;
				this.queue[normalizedOptions][kLength]++;
				this._processQueue();
			});
		}
		request(origin, options, headers, streamOptions) {
			return new Promise((resolve, reject) => {
				this.getSession(origin, options, [{
					reject,
					resolve: (session) => {
						try {
							const stream = session.request(headers, streamOptions);
							delayAsyncDestroy(stream);
							resolve(stream);
						} catch (error) {
							reject(error);
						}
					}
				}]);
			});
		}
		async createConnection(origin, options) {
			return Agent.connect(origin, options);
		}
		static connect(origin, options) {
			options.ALPNProtocols = ["h2"];
			const port = origin.port || 443;
			const host = origin.hostname;
			if (typeof options.servername === "undefined") options.servername = host;
			const socket = tls$2.connect(port, host, options);
			if (options.socket) socket._peername = {
				family: void 0,
				address: void 0,
				port
			};
			return socket;
		}
		closeEmptySessions(maxCount = Number.POSITIVE_INFINITY) {
			let closedCount = 0;
			const { sessions } = this;
			for (const key in sessions) {
				const thisSessions = sessions[key];
				for (let index = 0; index < thisSessions.length; index++) {
					const session = thisSessions[index];
					if (session[kCurrentStreamCount] === 0) {
						closedCount++;
						session.close();
						if (closedCount >= maxCount) return closedCount;
					}
				}
			}
			return closedCount;
		}
		destroy(reason) {
			const { sessions, queue } = this;
			for (const key in sessions) {
				const thisSessions = sessions[key];
				for (let index = 0; index < thisSessions.length; index++) thisSessions[index].destroy(reason);
			}
			for (const normalizedOptions in queue) {
				const entries = queue[normalizedOptions];
				for (const normalizedOrigin in entries) entries[normalizedOrigin].destroyed = true;
			}
			this.queue = {};
			this.tlsSessionCache.clear();
		}
		get emptySessionCount() {
			return this._emptySessionCount;
		}
		get pendingSessionCount() {
			return this._sessionCount - this._emptySessionCount;
		}
		get sessionCount() {
			return this._sessionCount;
		}
	};
	Agent.kCurrentStreamCount = kCurrentStreamCount;
	Agent.kGracefullyClosing = kGracefullyClosing;
	module.exports = {
		Agent,
		globalAgent: new Agent()
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/incoming-message.js
var require_incoming_message = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { Readable: Readable$1 } = __require("stream");
	var IncomingMessage = class extends Readable$1 {
		constructor(socket, highWaterMark) {
			super({
				emitClose: false,
				autoDestroy: true,
				highWaterMark
			});
			this.statusCode = null;
			this.statusMessage = "";
			this.httpVersion = "2.0";
			this.httpVersionMajor = 2;
			this.httpVersionMinor = 0;
			this.headers = {};
			this.trailers = {};
			this.req = null;
			this.aborted = false;
			this.complete = false;
			this.upgrade = null;
			this.rawHeaders = [];
			this.rawTrailers = [];
			this.socket = socket;
			this._dumped = false;
		}
		get connection() {
			return this.socket;
		}
		set connection(value) {
			this.socket = value;
		}
		_destroy(error, callback) {
			if (!this.readableEnded) this.aborted = true;
			callback();
			this.req._request.destroy(error);
		}
		setTimeout(ms, callback) {
			this.req.setTimeout(ms, callback);
			return this;
		}
		_dump() {
			if (!this._dumped) {
				this._dumped = true;
				this.removeAllListeners("data");
				this.resume();
			}
		}
		_read() {
			if (this.req) this.req._request.resume();
		}
	};
	module.exports = IncomingMessage;
}));
//#endregion
//#region node_modules/http2-wrapper/source/utils/proxy-events.js
var require_proxy_events = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (from, to, events) => {
		for (const event of events) from.on(event, (...args) => to.emit(event, ...args));
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/utils/errors.js
var require_errors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/* istanbul ignore file: https://github.com/nodejs/node/blob/master/lib/internal/errors.js */
	var makeError = (Base, key, getMessage) => {
		module.exports[key] = class NodeError extends Base {
			constructor(...args) {
				super(typeof getMessage === "string" ? getMessage : getMessage(args));
				this.name = `${super.name} [${key}]`;
				this.code = key;
			}
		};
	};
	makeError(TypeError, "ERR_INVALID_ARG_TYPE", (args) => {
		const type = args[0].includes(".") ? "property" : "argument";
		let valid = args[1];
		const isManyTypes = Array.isArray(valid);
		if (isManyTypes) valid = `${valid.slice(0, -1).join(", ")} or ${valid.slice(-1)}`;
		return `The "${args[0]}" ${type} must be ${isManyTypes ? "one of" : "of"} type ${valid}. Received ${typeof args[2]}`;
	});
	makeError(TypeError, "ERR_INVALID_PROTOCOL", (args) => `Protocol "${args[0]}" not supported. Expected "${args[1]}"`);
	makeError(Error, "ERR_HTTP_HEADERS_SENT", (args) => `Cannot ${args[0]} headers after they are sent to the client`);
	makeError(TypeError, "ERR_INVALID_HTTP_TOKEN", (args) => `${args[0]} must be a valid HTTP token [${args[1]}]`);
	makeError(TypeError, "ERR_HTTP_INVALID_HEADER_VALUE", (args) => `Invalid value "${args[0]} for header "${args[1]}"`);
	makeError(TypeError, "ERR_INVALID_CHAR", (args) => `Invalid character in ${args[0]} [${args[1]}]`);
	makeError(Error, "ERR_HTTP2_NO_SOCKET_MANIPULATION", "HTTP/2 sockets should not be directly manipulated (e.g. read and written)");
}));
//#endregion
//#region node_modules/http2-wrapper/source/utils/is-request-pseudo-header.js
var require_is_request_pseudo_header = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (header) => {
		switch (header) {
			case ":method":
			case ":scheme":
			case ":authority":
			case ":path": return true;
			default: return false;
		}
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/utils/validate-header-name.js
var require_validate_header_name = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { ERR_INVALID_HTTP_TOKEN } = require_errors();
	var isRequestPseudoHeader = require_is_request_pseudo_header();
	var isValidHttpToken = /^[\^`\-\w!#$%&*+.|~]+$/;
	module.exports = (name) => {
		if (typeof name !== "string" || !isValidHttpToken.test(name) && !isRequestPseudoHeader(name)) throw new ERR_INVALID_HTTP_TOKEN("Header name", name);
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/utils/validate-header-value.js
var require_validate_header_value = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { ERR_HTTP_INVALID_HEADER_VALUE, ERR_INVALID_CHAR } = require_errors();
	var isInvalidHeaderValue = /[^\t\u0020-\u007E\u0080-\u00FF]/;
	module.exports = (name, value) => {
		if (typeof value === "undefined") throw new ERR_HTTP_INVALID_HEADER_VALUE(value, name);
		if (isInvalidHeaderValue.test(value)) throw new ERR_INVALID_CHAR("header content", name);
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/utils/proxy-socket-handler.js
var require_proxy_socket_handler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { ERR_HTTP2_NO_SOCKET_MANIPULATION } = require_errors();
	/* istanbul ignore file */
	module.exports = {
		has(stream, property) {
			const reference = stream.session === void 0 ? stream : stream.session.socket;
			return property in stream || property in reference;
		},
		get(stream, property) {
			switch (property) {
				case "on":
				case "once":
				case "end":
				case "emit":
				case "destroy": return stream[property].bind(stream);
				case "writable":
				case "destroyed": return stream[property];
				case "readable":
					if (stream.destroyed) return false;
					return stream.readable;
				case "setTimeout": {
					const { session } = stream;
					if (session !== void 0) return session.setTimeout.bind(session);
					return stream.setTimeout.bind(stream);
				}
				case "write":
				case "read":
				case "pause":
				case "resume": throw new ERR_HTTP2_NO_SOCKET_MANIPULATION();
				default: {
					const reference = stream.session === void 0 ? stream : stream.session.socket;
					const value = reference[property];
					return typeof value === "function" ? value.bind(reference) : value;
				}
			}
		},
		getPrototypeOf(stream) {
			if (stream.session !== void 0) return Reflect.getPrototypeOf(stream.session.socket);
			return Reflect.getPrototypeOf(stream);
		},
		set(stream, property, value) {
			switch (property) {
				case "writable":
				case "readable":
				case "destroyed":
				case "on":
				case "once":
				case "end":
				case "emit":
				case "destroy":
					stream[property] = value;
					return true;
				case "setTimeout": {
					const { session } = stream;
					if (session === void 0) stream.setTimeout = value;
					else session.setTimeout = value;
					return true;
				}
				case "write":
				case "read":
				case "pause":
				case "resume": throw new ERR_HTTP2_NO_SOCKET_MANIPULATION();
				default: {
					const reference = stream.session === void 0 ? stream : stream.session.socket;
					reference[property] = value;
					return true;
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/client-request.js
var require_client_request = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { URL: URL$3, urlToHttpOptions: urlToHttpOptions$1 } = __require("url");
	var http2$1 = __require("http2");
	var { Writable } = __require("stream");
	var { Agent, globalAgent } = require_agent();
	var IncomingMessage = require_incoming_message();
	var proxyEvents = require_proxy_events();
	var { ERR_INVALID_ARG_TYPE, ERR_INVALID_PROTOCOL, ERR_HTTP_HEADERS_SENT } = require_errors();
	var validateHeaderName = require_validate_header_name();
	var validateHeaderValue = require_validate_header_value();
	var proxySocketHandler = require_proxy_socket_handler();
	var { HTTP2_HEADER_STATUS, HTTP2_HEADER_METHOD, HTTP2_HEADER_PATH, HTTP2_HEADER_AUTHORITY, HTTP2_METHOD_CONNECT } = http2$1.constants;
	var kHeaders = Symbol("headers");
	var kOrigin = Symbol("origin");
	var kSession = Symbol("session");
	var kOptions = Symbol("options");
	var kFlushedHeaders = Symbol("flushedHeaders");
	var kJobs = Symbol("jobs");
	var kPendingAgentPromise = Symbol("pendingAgentPromise");
	var ClientRequest = class extends Writable {
		constructor(input, options, callback) {
			super({
				autoDestroy: false,
				emitClose: false
			});
			if (typeof input === "string") input = urlToHttpOptions$1(new URL$3(input));
			else if (input instanceof URL$3) input = urlToHttpOptions$1(input);
			else input = { ...input };
			if (typeof options === "function" || options === void 0) {
				callback = options;
				options = input;
			} else options = Object.assign(input, options);
			if (options.h2session) {
				this[kSession] = options.h2session;
				if (this[kSession].destroyed) throw new Error("The session has been closed already");
				this.protocol = this[kSession].socket.encrypted ? "https:" : "http:";
			} else if (options.agent === false) this.agent = new Agent({ maxEmptySessions: 0 });
			else if (typeof options.agent === "undefined" || options.agent === null) this.agent = globalAgent;
			else if (typeof options.agent.request === "function") this.agent = options.agent;
			else throw new ERR_INVALID_ARG_TYPE("options.agent", [
				"http2wrapper.Agent-like Object",
				"undefined",
				"false"
			], options.agent);
			if (this.agent) this.protocol = this.agent.protocol;
			if (options.protocol && options.protocol !== this.protocol) throw new ERR_INVALID_PROTOCOL(options.protocol, this.protocol);
			if (!options.port) options.port = options.defaultPort || this.agent && this.agent.defaultPort || 443;
			options.host = options.hostname || options.host || "localhost";
			delete options.hostname;
			const { timeout } = options;
			options.timeout = void 0;
			this[kHeaders] = Object.create(null);
			this[kJobs] = [];
			this[kPendingAgentPromise] = void 0;
			this.socket = null;
			this.connection = null;
			this.method = options.method || "GET";
			if (!(this.method === "CONNECT" && (options.path === "/" || options.path === void 0))) this.path = options.path;
			this.res = null;
			this.aborted = false;
			this.reusedSocket = false;
			const { headers } = options;
			if (headers) for (const header in headers) this.setHeader(header, headers[header]);
			if (options.auth && !("authorization" in this[kHeaders])) this[kHeaders].authorization = "Basic " + Buffer.from(options.auth).toString("base64");
			options.session = options.tlsSession;
			options.path = options.socketPath;
			this[kOptions] = options;
			this[kOrigin] = new URL$3(`${this.protocol}//${options.servername || options.host}:${options.port}`);
			const reuseSocket = options._reuseSocket;
			if (reuseSocket) {
				options.createConnection = (...args) => {
					if (reuseSocket.destroyed) return this.agent.createConnection(...args);
					return reuseSocket;
				};
				this.agent.getSession(this[kOrigin], this[kOptions]).catch(() => {});
			}
			if (timeout) this.setTimeout(timeout);
			if (callback) this.once("response", callback);
			this[kFlushedHeaders] = false;
		}
		get method() {
			return this[kHeaders][HTTP2_HEADER_METHOD];
		}
		set method(value) {
			if (value) this[kHeaders][HTTP2_HEADER_METHOD] = value.toUpperCase();
		}
		get path() {
			const header = this.method === "CONNECT" ? HTTP2_HEADER_AUTHORITY : HTTP2_HEADER_PATH;
			return this[kHeaders][header];
		}
		set path(value) {
			if (value) {
				const header = this.method === "CONNECT" ? HTTP2_HEADER_AUTHORITY : HTTP2_HEADER_PATH;
				this[kHeaders][header] = value;
			}
		}
		get host() {
			return this[kOrigin].hostname;
		}
		set host(_value) {}
		get _mustNotHaveABody() {
			return this.method === "GET" || this.method === "HEAD" || this.method === "DELETE";
		}
		_write(chunk, encoding, callback) {
			if (this._mustNotHaveABody) {
				callback(/* @__PURE__ */ new Error("The GET, HEAD and DELETE methods must NOT have a body"));
				/* istanbul ignore next: Node.js 12 throws directly */
				return;
			}
			this.flushHeaders();
			const callWrite = () => this._request.write(chunk, encoding, callback);
			if (this._request) callWrite();
			else this[kJobs].push(callWrite);
		}
		_final(callback) {
			this.flushHeaders();
			const callEnd = () => {
				if (this._mustNotHaveABody || this.method === "CONNECT") {
					callback();
					return;
				}
				this._request.end(callback);
			};
			if (this._request) callEnd();
			else this[kJobs].push(callEnd);
		}
		abort() {
			if (this.res && this.res.complete) return;
			if (!this.aborted) process.nextTick(() => this.emit("abort"));
			this.aborted = true;
			this.destroy();
		}
		async _destroy(error, callback) {
			if (this.res) this.res._dump();
			if (this._request) this._request.destroy();
			else process.nextTick(() => {
				this.emit("close");
			});
			try {
				await this[kPendingAgentPromise];
			} catch (internalError) {
				if (this.aborted) error = internalError;
			}
			callback(error);
		}
		async flushHeaders() {
			if (this[kFlushedHeaders] || this.destroyed) return;
			this[kFlushedHeaders] = true;
			const isConnectMethod = this.method === HTTP2_METHOD_CONNECT;
			const onStream = (stream) => {
				this._request = stream;
				if (this.destroyed) {
					stream.destroy();
					return;
				}
				if (!isConnectMethod) proxyEvents(stream, this, ["timeout", "continue"]);
				stream.once("error", (error) => {
					this.destroy(error);
				});
				stream.once("aborted", () => {
					const { res } = this;
					if (res) {
						res.aborted = true;
						res.emit("aborted");
						res.destroy();
					} else this.destroy(/* @__PURE__ */ new Error("The server aborted the HTTP/2 stream"));
				});
				const onResponse = (headers, flags, rawHeaders) => {
					const response = new IncomingMessage(this.socket, stream.readableHighWaterMark);
					this.res = response;
					response.url = `${this[kOrigin].origin}${this.path}`;
					response.req = this;
					response.statusCode = headers[HTTP2_HEADER_STATUS];
					response.headers = headers;
					response.rawHeaders = rawHeaders;
					response.once("end", () => {
						response.complete = true;
						response.socket = null;
						response.connection = null;
					});
					if (isConnectMethod) {
						response.upgrade = true;
						if (this.emit("connect", response, stream, Buffer.alloc(0))) this.emit("close");
						else stream.destroy();
					} else {
						stream.on("data", (chunk) => {
							if (!response._dumped && !response.push(chunk)) stream.pause();
						});
						stream.once("end", () => {
							if (!this.aborted) response.push(null);
						});
						if (!this.emit("response", response)) response._dump();
					}
				};
				stream.once("response", onResponse);
				stream.once("headers", (headers) => this.emit("information", { statusCode: headers[HTTP2_HEADER_STATUS] }));
				stream.once("trailers", (trailers, flags, rawTrailers) => {
					const { res } = this;
					if (res === null) {
						onResponse(trailers, flags, rawTrailers);
						return;
					}
					res.trailers = trailers;
					res.rawTrailers = rawTrailers;
				});
				stream.once("close", () => {
					const { aborted, res } = this;
					if (res) {
						if (aborted) {
							res.aborted = true;
							res.emit("aborted");
							res.destroy();
						}
						const finish = () => {
							res.emit("close");
							this.destroy();
							this.emit("close");
						};
						if (res.readable) res.once("end", finish);
						else finish();
						return;
					}
					if (!this.destroyed) {
						this.destroy(/* @__PURE__ */ new Error("The HTTP/2 stream has been early terminated"));
						this.emit("close");
						return;
					}
					this.destroy();
					this.emit("close");
				});
				this.socket = new Proxy(stream, proxySocketHandler);
				for (const job of this[kJobs]) job();
				this[kJobs].length = 0;
				this.emit("socket", this.socket);
			};
			if (!(HTTP2_HEADER_AUTHORITY in this[kHeaders]) && !isConnectMethod) this[kHeaders][HTTP2_HEADER_AUTHORITY] = this[kOrigin].host;
			if (this[kSession]) try {
				onStream(this[kSession].request(this[kHeaders]));
			} catch (error) {
				this.destroy(error);
			}
			else {
				this.reusedSocket = true;
				try {
					const promise = this.agent.request(this[kOrigin], this[kOptions], this[kHeaders]);
					this[kPendingAgentPromise] = promise;
					onStream(await promise);
					this[kPendingAgentPromise] = false;
				} catch (error) {
					this[kPendingAgentPromise] = false;
					this.destroy(error);
				}
			}
		}
		get connection() {
			return this.socket;
		}
		set connection(value) {
			this.socket = value;
		}
		getHeaderNames() {
			return Object.keys(this[kHeaders]);
		}
		hasHeader(name) {
			if (typeof name !== "string") throw new ERR_INVALID_ARG_TYPE("name", "string", name);
			return Boolean(this[kHeaders][name.toLowerCase()]);
		}
		getHeader(name) {
			if (typeof name !== "string") throw new ERR_INVALID_ARG_TYPE("name", "string", name);
			return this[kHeaders][name.toLowerCase()];
		}
		get headersSent() {
			return this[kFlushedHeaders];
		}
		removeHeader(name) {
			if (typeof name !== "string") throw new ERR_INVALID_ARG_TYPE("name", "string", name);
			if (this.headersSent) throw new ERR_HTTP_HEADERS_SENT("remove");
			delete this[kHeaders][name.toLowerCase()];
		}
		setHeader(name, value) {
			if (this.headersSent) throw new ERR_HTTP_HEADERS_SENT("set");
			validateHeaderName(name);
			validateHeaderValue(name, value);
			const lowercased = name.toLowerCase();
			if (lowercased === "connection") {
				if (value.toLowerCase() === "keep-alive") return;
				throw new Error(`Invalid 'connection' header: ${value}`);
			}
			if (lowercased === "host" && this.method === "CONNECT") this[kHeaders][HTTP2_HEADER_AUTHORITY] = value;
			else this[kHeaders][lowercased] = value;
		}
		setNoDelay() {}
		setSocketKeepAlive() {}
		setTimeout(ms, callback) {
			const applyTimeout = () => this._request.setTimeout(ms, callback);
			if (this._request) applyTimeout();
			else this[kJobs].push(applyTimeout);
			return this;
		}
		get maxHeadersCount() {
			if (!this.destroyed && this._request) return this._request.session.localSettings.maxHeaderListSize;
		}
		set maxHeadersCount(_value) {}
	};
	module.exports = ClientRequest;
}));
//#endregion
//#region node_modules/resolve-alpn/index.js
var require_resolve_alpn = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var tls$1 = __require("tls");
	module.exports = (options = {}, connect = tls$1.connect) => new Promise((resolve, reject) => {
		let timeout = false;
		let socket;
		const callback = async () => {
			await socketPromise;
			socket.off("timeout", onTimeout);
			socket.off("error", reject);
			if (options.resolveSocket) {
				resolve({
					alpnProtocol: socket.alpnProtocol,
					socket,
					timeout
				});
				if (timeout) {
					await Promise.resolve();
					socket.emit("timeout");
				}
			} else {
				socket.destroy();
				resolve({
					alpnProtocol: socket.alpnProtocol,
					timeout
				});
			}
		};
		const onTimeout = async () => {
			timeout = true;
			callback();
		};
		const socketPromise = (async () => {
			try {
				socket = await connect(options, callback);
				socket.on("error", reject);
				socket.once("timeout", onTimeout);
			} catch (error) {
				reject(error);
			}
		})();
	});
}));
//#endregion
//#region node_modules/http2-wrapper/source/utils/calculate-server-name.js
var require_calculate_server_name = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { isIP: isIP$1 } = __require("net");
	var assert = __require("assert");
	var getHost = (host) => {
		if (host[0] === "[") {
			const idx = host.indexOf("]");
			assert(idx !== -1);
			return host.slice(1, idx);
		}
		const idx = host.indexOf(":");
		if (idx === -1) return host;
		return host.slice(0, idx);
	};
	module.exports = (host) => {
		const servername = getHost(host);
		if (isIP$1(servername)) return "";
		return servername;
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/auto.js
var require_auto = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { URL: URL$2, urlToHttpOptions } = __require("url");
	var http$2 = __require("http");
	var https$2 = __require("https");
	var resolveALPN = require_resolve_alpn();
	var QuickLRU = require_quick_lru();
	var { Agent, globalAgent } = require_agent();
	var Http2ClientRequest = require_client_request();
	var calculateServerName = require_calculate_server_name();
	var delayAsyncDestroy = require_delay_async_destroy();
	var cache = new QuickLRU({ maxSize: 100 });
	var queue = /* @__PURE__ */ new Map();
	var installSocket = (agent, socket, options) => {
		socket._httpMessage = { shouldKeepAlive: true };
		const onFree = () => {
			agent.emit("free", socket, options);
		};
		socket.on("free", onFree);
		const onClose = () => {
			agent.removeSocket(socket, options);
		};
		socket.on("close", onClose);
		const onTimeout = () => {
			const { freeSockets } = agent;
			for (const sockets of Object.values(freeSockets)) if (sockets.includes(socket)) {
				socket.destroy();
				return;
			}
		};
		socket.on("timeout", onTimeout);
		const onRemove = () => {
			agent.removeSocket(socket, options);
			socket.off("close", onClose);
			socket.off("free", onFree);
			socket.off("timeout", onTimeout);
			socket.off("agentRemove", onRemove);
		};
		socket.on("agentRemove", onRemove);
		agent.emit("free", socket, options);
	};
	var createResolveProtocol = (cache, queue = /* @__PURE__ */ new Map(), connect = void 0) => {
		return async (options) => {
			const name = `${options.host}:${options.port}:${options.ALPNProtocols.sort()}`;
			if (!cache.has(name)) {
				if (queue.has(name)) return { alpnProtocol: (await queue.get(name)).alpnProtocol };
				const { path } = options;
				options.path = options.socketPath;
				const resultPromise = resolveALPN(options, connect);
				queue.set(name, resultPromise);
				try {
					const result = await resultPromise;
					cache.set(name, result.alpnProtocol);
					queue.delete(name);
					options.path = path;
					return result;
				} catch (error) {
					queue.delete(name);
					options.path = path;
					throw error;
				}
			}
			return { alpnProtocol: cache.get(name) };
		};
	};
	var defaultResolveProtocol = createResolveProtocol(cache, queue);
	module.exports = async (input, options, callback) => {
		if (typeof input === "string") input = urlToHttpOptions(new URL$2(input));
		else if (input instanceof URL$2) input = urlToHttpOptions(input);
		else input = { ...input };
		if (typeof options === "function" || options === void 0) {
			callback = options;
			options = input;
		} else options = Object.assign(input, options);
		options.ALPNProtocols = options.ALPNProtocols || ["h2", "http/1.1"];
		if (!Array.isArray(options.ALPNProtocols) || options.ALPNProtocols.length === 0) throw new Error("The `ALPNProtocols` option must be an Array with at least one entry");
		options.protocol = options.protocol || "https:";
		const isHttps = options.protocol === "https:";
		options.host = options.hostname || options.host || "localhost";
		options.session = options.tlsSession;
		options.servername = options.servername || calculateServerName(options.headers && options.headers.host || options.host);
		options.port = options.port || (isHttps ? 443 : 80);
		options._defaultAgent = isHttps ? https$2.globalAgent : http$2.globalAgent;
		const resolveProtocol = options.resolveProtocol || defaultResolveProtocol;
		let { agent } = options;
		if (agent !== void 0 && agent !== false && agent.constructor.name !== "Object") throw new Error("The `options.agent` can be only an object `http`, `https` or `http2` properties");
		if (isHttps) {
			options.resolveSocket = true;
			let { socket, alpnProtocol, timeout } = await resolveProtocol(options);
			if (timeout) {
				if (socket) socket.destroy();
				const error = /* @__PURE__ */ new Error(`Timed out resolving ALPN: ${options.timeout} ms`);
				error.code = "ETIMEDOUT";
				error.ms = options.timeout;
				throw error;
			}
			if (socket && options.createConnection) {
				socket.destroy();
				socket = void 0;
			}
			delete options.resolveSocket;
			const isHttp2 = alpnProtocol === "h2";
			if (agent) {
				agent = isHttp2 ? agent.http2 : agent.https;
				options.agent = agent;
			}
			if (agent === void 0) agent = isHttp2 ? globalAgent : https$2.globalAgent;
			if (socket) {
				if (agent === false) socket.destroy();
				else {
					const defaultCreateConnection = (isHttp2 ? Agent : https$2.Agent).prototype.createConnection;
					if (agent.createConnection === defaultCreateConnection) {
						if (isHttp2) options._reuseSocket = socket;
						else installSocket(agent, socket, options);
					} else socket.destroy();
				}
			}
			if (isHttp2) return delayAsyncDestroy(new Http2ClientRequest(options, callback));
		} else if (agent) options.agent = agent.http;
		if (options.headers) {
			options.headers = { ...options.headers };
			if (options.headers[":authority"]) {
				if (!options.headers.host) options.headers.host = options.headers[":authority"];
				delete options.headers[":authority"];
			}
			delete options.headers[":method"];
			delete options.headers[":scheme"];
			delete options.headers[":path"];
		}
		return delayAsyncDestroy(http$2.request(options, callback));
	};
	module.exports.protocolCache = cache;
	module.exports.resolveProtocol = defaultResolveProtocol;
	module.exports.createResolveProtocol = createResolveProtocol;
}));
//#endregion
//#region node_modules/http2-wrapper/source/utils/js-stream-socket.js
var require_js_stream_socket = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var stream$1 = __require("stream");
	module.exports = new (__require("tls")).TLSSocket(new stream$1.PassThrough())._handle._parentWrap.constructor;
}));
//#endregion
//#region node_modules/http2-wrapper/source/proxies/unexpected-status-code-error.js
var require_unexpected_status_code_error = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var UnexpectedStatusCodeError = class extends Error {
		constructor(statusCode, statusMessage = "") {
			super(`The proxy server rejected the request with status code ${statusCode} (${statusMessage || "empty status message"})`);
			this.statusCode = statusCode;
			this.statusMessage = statusMessage;
		}
	};
	module.exports = UnexpectedStatusCodeError;
}));
//#endregion
//#region node_modules/http2-wrapper/source/utils/check-type.js
var require_check_type = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var checkType = (name, value, types) => {
		if (!types.some((type) => {
			if (typeof type === "string") return typeof value === type;
			return value instanceof type;
		})) {
			const names = types.map((type) => typeof type === "string" ? type : type.name);
			throw new TypeError(`Expected '${name}' to be a type of ${names.join(" or ")}, got ${typeof value}`);
		}
	};
	module.exports = checkType;
}));
//#endregion
//#region node_modules/http2-wrapper/source/proxies/initialize.js
var require_initialize = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { URL: URL$1 } = __require("url");
	var checkType = require_check_type();
	module.exports = (self, proxyOptions) => {
		checkType("proxyOptions", proxyOptions, ["object"]);
		checkType("proxyOptions.headers", proxyOptions.headers, ["object", "undefined"]);
		checkType("proxyOptions.raw", proxyOptions.raw, ["boolean", "undefined"]);
		checkType("proxyOptions.url", proxyOptions.url, [URL$1, "string"]);
		const url = new URL$1(proxyOptions.url);
		self.proxyOptions = {
			raw: true,
			...proxyOptions,
			headers: { ...proxyOptions.headers },
			url
		};
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/proxies/get-auth-headers.js
var require_get_auth_headers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (self) => {
		const { username, password } = self.proxyOptions.url;
		if (username || password) {
			const data = `${username}:${password}`;
			const authorization = `Basic ${Buffer.from(data).toString("base64")}`;
			return {
				"proxy-authorization": authorization,
				authorization
			};
		}
		return {};
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/proxies/h1-over-h2.js
var require_h1_over_h2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var tls = __require("tls");
	var http$1 = __require("http");
	var https$1 = __require("https");
	var JSStreamSocket = require_js_stream_socket();
	var { globalAgent } = require_agent();
	var UnexpectedStatusCodeError = require_unexpected_status_code_error();
	var initialize = require_initialize();
	var getAuthorizationHeaders = require_get_auth_headers();
	var createConnection = (self, options, callback) => {
		(async () => {
			try {
				const { proxyOptions } = self;
				const { url, headers, raw } = proxyOptions;
				const stream = await globalAgent.request(url, proxyOptions, {
					...getAuthorizationHeaders(self),
					...headers,
					":method": "CONNECT",
					":authority": `${options.host}:${options.port}`
				});
				stream.once("error", callback);
				stream.once("response", (headers) => {
					const statusCode = headers[":status"];
					if (statusCode !== 200) {
						callback(new UnexpectedStatusCodeError(statusCode, ""));
						return;
					}
					const encrypted = self instanceof https$1.Agent;
					if (raw && encrypted) {
						options.socket = stream;
						const secureStream = tls.connect(options);
						secureStream.once("close", () => {
							stream.destroy();
						});
						callback(null, secureStream);
						return;
					}
					const socket = new JSStreamSocket(stream);
					socket.encrypted = false;
					socket._handle.getpeername = (out) => {
						out.family = void 0;
						out.address = void 0;
						out.port = void 0;
					};
					callback(null, socket);
				});
			} catch (error) {
				callback(error);
			}
		})();
	};
	var HttpOverHttp2 = class extends http$1.Agent {
		constructor(options) {
			super(options);
			initialize(this, options.proxyOptions);
		}
		createConnection(options, callback) {
			createConnection(this, options, callback);
		}
	};
	var HttpsOverHttp2 = class extends https$1.Agent {
		constructor(options) {
			super(options);
			initialize(this, options.proxyOptions);
		}
		createConnection(options, callback) {
			createConnection(this, options, callback);
		}
	};
	module.exports = {
		HttpOverHttp2,
		HttpsOverHttp2
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/proxies/h2-over-hx.js
var require_h2_over_hx = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { Agent } = require_agent();
	var JSStreamSocket = require_js_stream_socket();
	var UnexpectedStatusCodeError = require_unexpected_status_code_error();
	var initialize = require_initialize();
	var Http2OverHttpX = class extends Agent {
		constructor(options) {
			super(options);
			initialize(this, options.proxyOptions);
		}
		async createConnection(origin, options) {
			const authority = `${origin.hostname}:${origin.port || 443}`;
			const [stream, statusCode, statusMessage] = await this._getProxyStream(authority);
			if (statusCode !== 200) throw new UnexpectedStatusCodeError(statusCode, statusMessage);
			if (this.proxyOptions.raw) options.socket = stream;
			else {
				const socket = new JSStreamSocket(stream);
				socket.encrypted = false;
				socket._handle.getpeername = (out) => {
					out.family = void 0;
					out.address = void 0;
					out.port = void 0;
				};
				return socket;
			}
			return super.createConnection(origin, options);
		}
	};
	module.exports = Http2OverHttpX;
}));
//#endregion
//#region node_modules/http2-wrapper/source/proxies/h2-over-h2.js
var require_h2_over_h2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { globalAgent } = require_agent();
	var Http2OverHttpX = require_h2_over_hx();
	var getAuthorizationHeaders = require_get_auth_headers();
	var getStatusCode = (stream) => new Promise((resolve, reject) => {
		stream.once("error", reject);
		stream.once("response", (headers) => {
			stream.off("error", reject);
			resolve(headers[":status"]);
		});
	});
	var Http2OverHttp2 = class extends Http2OverHttpX {
		async _getProxyStream(authority) {
			const { proxyOptions } = this;
			const headers = {
				...getAuthorizationHeaders(this),
				...proxyOptions.headers,
				":method": "CONNECT",
				":authority": authority
			};
			const stream = await globalAgent.request(proxyOptions.url, proxyOptions, headers);
			return [
				stream,
				await getStatusCode(stream),
				""
			];
		}
	};
	module.exports = Http2OverHttp2;
}));
//#endregion
//#region node_modules/http2-wrapper/source/proxies/h2-over-h1.js
var require_h2_over_h1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var http = __require("http");
	var https = __require("https");
	var Http2OverHttpX = require_h2_over_hx();
	var getAuthorizationHeaders = require_get_auth_headers();
	var getStream = (request) => new Promise((resolve, reject) => {
		const onConnect = (response, socket, head) => {
			socket.unshift(head);
			request.off("error", reject);
			resolve([
				socket,
				response.statusCode,
				response.statusMessage
			]);
		};
		request.once("error", reject);
		request.once("connect", onConnect);
	});
	var Http2OverHttp = class extends Http2OverHttpX {
		async _getProxyStream(authority) {
			const { proxyOptions } = this;
			const { url, headers } = this.proxyOptions;
			return getStream((url.protocol === "https:" ? https : http).request({
				...proxyOptions,
				hostname: url.hostname,
				port: url.port,
				path: authority,
				headers: {
					...getAuthorizationHeaders(this),
					...headers,
					host: authority
				},
				method: "CONNECT"
			}).end());
		}
	};
	module.exports = {
		Http2OverHttp,
		Http2OverHttps: Http2OverHttp
	};
}));
//#endregion
//#region node_modules/got/dist/source/core/parse-link-header.js
var import_source = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var http2 = __require("http2");
	var { Agent, globalAgent } = require_agent();
	var ClientRequest = require_client_request();
	var IncomingMessage = require_incoming_message();
	var auto = require_auto();
	var { HttpOverHttp2, HttpsOverHttp2 } = require_h1_over_h2();
	var Http2OverHttp2 = require_h2_over_h2();
	var { Http2OverHttp, Http2OverHttps } = require_h2_over_h1();
	var validateHeaderName = require_validate_header_name();
	var validateHeaderValue = require_validate_header_value();
	var request = (url, options, callback) => new ClientRequest(url, options, callback);
	var get = (url, options, callback) => {
		const req = new ClientRequest(url, options, callback);
		req.end();
		return req;
	};
	module.exports = {
		...http2,
		ClientRequest,
		IncomingMessage,
		Agent,
		globalAgent,
		request,
		get,
		auto,
		proxies: {
			HttpOverHttp2,
			HttpsOverHttp2,
			Http2OverHttp2,
			Http2OverHttp,
			Http2OverHttps
		},
		validateHeaderName,
		validateHeaderValue
	};
})))(), 1);
var splitHeaderValue = (value, separator) => {
	const values = [];
	let current = "";
	let inQuotes = false;
	let inReference = false;
	let isEscaped = false;
	for (const character of value) {
		if (inQuotes && isEscaped) {
			current += character;
			isEscaped = false;
			continue;
		}
		if (inQuotes && character === "\\") {
			current += character;
			isEscaped = true;
			continue;
		}
		if (character === "\"") {
			inQuotes = !inQuotes;
			current += character;
			continue;
		}
		if (!inQuotes && character === "<") {
			inReference = true;
			current += character;
			continue;
		}
		if (!inQuotes && character === ">") {
			inReference = false;
			current += character;
			continue;
		}
		if (!inQuotes && !inReference && character === separator) {
			values.push(current);
			current = "";
			continue;
		}
		current += character;
	}
	if (inQuotes || isEscaped) throw new Error(`Failed to parse Link header: ${value}`);
	values.push(current);
	return values;
};
function parseLinkHeader(link) {
	const parsed = [];
	const items = splitHeaderValue(link, ",");
	for (const item of items) {
		const [rawUriReference, ...rawLinkParameters] = splitHeaderValue(item, ";");
		const trimmedUriReference = rawUriReference.trim();
		if (trimmedUriReference[0] !== "<" || trimmedUriReference.at(-1) !== ">") throw new Error(`Invalid format of the Link header reference: ${trimmedUriReference}`);
		const reference = trimmedUriReference.slice(1, -1);
		const parameters = {};
		if (reference.includes("<") || reference.includes(">")) throw new Error(`Invalid format of the Link header reference: ${trimmedUriReference}`);
		if (rawLinkParameters.length === 0) throw new Error(`Unexpected end of Link header parameters: ${rawLinkParameters.join(";")}`);
		for (const rawParameter of rawLinkParameters) {
			const trimmedRawParameter = rawParameter.trim();
			const center = trimmedRawParameter.indexOf("=");
			if (center === -1) throw new Error(`Failed to parse Link header: ${link}`);
			const name = trimmedRawParameter.slice(0, center).trim();
			parameters[name] = trimmedRawParameter.slice(center + 1).trim();
		}
		parsed.push({
			reference,
			parameters
		});
	}
	return parsed;
}
//#endregion
//#region node_modules/got/dist/source/core/utils/is-unix-socket-url.js
function isUnixSocketUrl(url) {
	return url.protocol === "unix:" || url.hostname === "unix";
}
/**
Extract the socket path from a UNIX socket URL.

@example
```
getUnixSocketPath(new URL('http://unix/foo:/path'));
//=> '/foo'

getUnixSocketPath(new URL('unix:/foo:/path'));
//=> '/foo'

getUnixSocketPath(new URL('http://example.com'));
//=> undefined
```
*/
function getUnixSocketPath(url) {
	if (!isUnixSocketUrl(url)) return;
	return new RegExp("^(?<socketPath>[^:]+):", "v").exec(`${url.pathname}${url.search}`)?.groups?.socketPath;
}
//#endregion
//#region node_modules/got/dist/source/core/options.js
var [major, minor] = process$1.versions.node.split(".").map(Number);
/**
Generic helper that wraps any assertion function to add context to error messages.
*/
function wrapAssertionWithContext(optionName, assertionFn) {
	try {
		assertionFn();
	} catch (error) {
		if (error instanceof Error) error.message = `Option '${optionName}': ${error.message}`;
		throw error;
	}
}
/**
Helper function that wraps assert.any() to provide better error messages.
When assertion fails, it includes the option name in the error message.
*/
function assertAny(optionName, validators, value) {
	wrapAssertionWithContext(optionName, () => {
		assert$1.any(validators, value);
	});
}
/**
Helper function that wraps assert.plainObject() to provide better error messages.
When assertion fails, it includes the option name in the error message.
*/
function assertPlainObject(optionName, value) {
	wrapAssertionWithContext(optionName, () => {
		assert$1.plainObject(value);
	});
}
function isSameOrigin(previousUrl, nextUrl) {
	return previousUrl.origin === nextUrl.origin && getUnixSocketPath(previousUrl) === getUnixSocketPath(nextUrl);
}
var crossOriginStripHeaders = [
	"host",
	"cookie",
	"cookie2",
	"authorization",
	"proxy-authorization"
];
var bodyHeaderNames = [
	"content-length",
	"content-encoding",
	"content-language",
	"content-location",
	"content-type",
	"transfer-encoding"
];
function usesUnixSocket(url) {
	return url.protocol === "unix:" || getUnixSocketPath(url) !== void 0;
}
function hasCredentialInUrl(url, credential) {
	if (url instanceof URL) return url[credential] !== "";
	if (!is.string(url)) return false;
	try {
		return new URL(url)[credential] !== "";
	} catch {
		return false;
	}
}
var hasExplicitCredentialInUrlChange = (changedState, url, credential) => changedState.has(credential) || changedState.has("url") && url?.[credential] !== "";
var hasProtocolSlashes = (value) => new RegExp("^[a-z][\\d+\\-.a-z]*:\\/\\/", "iv").test(value);
var hasHttpProtocolWithoutSlashes = (value) => new RegExp("^https?:(?!\\/\\/)", "iv").test(value);
var hasUnixProtocolWithoutSlashes = (value) => new RegExp("^unix:", "iv").test(value);
var isAbsoluteUrl = (url) => is.urlInstance(url) || is.string(url) && (hasProtocolSlashes(url) || url.startsWith("//"));
var isSlashOrBackslash = (character) => character === "/" || character === "\\";
var startsWithSchemeRelativeSeparators = (value) => value.length > 1 && isSlashOrBackslash(value[0]) && isSlashOrBackslash(value[1]);
var stripLeadingC0ControlOrSpace = (value) => {
	let index = 0;
	while (index < value.length && value.codePointAt(index) <= 32) index++;
	return value.slice(index);
};
var removeAsciiTabOrNewline = (value) => {
	let result = "";
	for (const character of value) {
		const codePoint = character.codePointAt(0);
		if (codePoint !== 9 && codePoint !== 10 && codePoint !== 13) result += character;
	}
	return result;
};
var assertRelativeUrlIfNeeded = (options, url) => {
	if (!options.prefixUrl || options.allowAbsoluteUrls) return;
	const normalizedUrl = is.string(url) ? stripLeadingC0ControlOrSpace(removeAsciiTabOrNewline(url)) : url;
	if (isAbsoluteUrl(normalizedUrl) || is.string(normalizedUrl) && (hasHttpProtocolWithoutSlashes(normalizedUrl) || startsWithSchemeRelativeSeparators(normalizedUrl) || options.enableUnixSockets && hasUnixProtocolWithoutSlashes(normalizedUrl))) throw new Error("The `url` option must be relative when `allowAbsoluteUrls` is false and `prefixUrl` is set");
};
var assertUrlHasSameOriginAsPrefixUrlIfNeeded = (options, url) => {
	if (!options.prefixUrl || options.allowAbsoluteUrls) return;
	let prefixUrl;
	try {
		prefixUrl = new URL(options.prefixUrl);
	} catch {
		return;
	}
	if (isSameOrigin(prefixUrl, url)) return;
	throw new Error("The `url` option must stay on the same origin as `prefixUrl` when `allowAbsoluteUrls` is false");
};
var getUrlPrefixBoundary = (options) => ({
	url: options.url instanceof URL ? new URL(options.url) : void 0,
	prefixUrl: options.prefixUrl.toString(),
	allowAbsoluteUrls: options.allowAbsoluteUrls
});
var hasUrlOrPrefixUrlBoundaryChanged = (options, currentUrl, previous) => currentUrl.href !== previous.url?.href || options.prefixUrl.toString() !== previous.prefixUrl || options.allowAbsoluteUrls !== previous.allowAbsoluteUrls;
function applyUrlOverride(options, url, { username, password, baseUrl } = {}) {
	assertRelativeUrlIfNeeded(options, url);
	if (is.string(url) && options.url) url = new URL(url, baseUrl ?? options.url).toString();
	if (options.allowAbsoluteUrls) {
		options.prefixUrl = "";
		options.url = url;
	} else {
		const { allowAbsoluteUrls } = options;
		try {
			options.allowAbsoluteUrls = true;
			options.url = url;
		} finally {
			options.allowAbsoluteUrls = allowAbsoluteUrls;
		}
	}
	if (username !== void 0) options.username = username;
	if (password !== void 0) options.password = password;
	return options.url;
}
function assertValidHeaderName(name) {
	if (name.startsWith(":")) throw new TypeError(`HTTP/2 pseudo-headers are not supported in \`options.headers\`: ${name}`);
}
/**
Safely assign own properties from source to target, skipping `__proto__` to prevent prototype pollution from JSON.parse'd input.
*/
function safeObjectAssign(target, source) {
	for (const [key, value] of Object.entries(source)) {
		if (key === "__proto__") continue;
		Reflect.set(target, key, value);
	}
}
var isToughCookieJar = (cookieJar) => cookieJar.setCookie.length === 4 && cookieJar.getCookieString.length === 0;
function validateSearchParameters(searchParameters) {
	for (const key of Object.keys(searchParameters)) {
		if (key === "__proto__") continue;
		const value = searchParameters[key];
		assertAny(`searchParams.${key}`, [
			is.string,
			is.number,
			is.boolean,
			is.null,
			is.undefined
		], value);
	}
}
var globalCache = /* @__PURE__ */ new Map();
var globalDnsCache;
var getGlobalDnsCache = () => {
	if (globalDnsCache) return globalDnsCache;
	globalDnsCache = new CacheableLookup();
	return globalDnsCache;
};
var wrapQuickLruIfNeeded = (value) => {
	if (value?.[Symbol.toStringTag] === "QuickLRU" && typeof value.evict === "function") return {
		get(key) {
			return value.get(key);
		},
		set(key, cacheValue, ttl) {
			if (ttl === void 0) value.set(key, cacheValue);
			else value.set(key, cacheValue, { maxAge: ttl });
			return true;
		},
		delete(key) {
			return value.delete(key);
		},
		clear() {
			return value.clear();
		},
		has(key) {
			return value.has(key);
		}
	};
	return value;
};
var defaultInternals = {
	request: void 0,
	agent: {
		http: void 0,
		https: void 0,
		http2: void 0
	},
	h2session: void 0,
	decompress: true,
	timeout: {
		connect: void 0,
		lookup: void 0,
		read: void 0,
		request: void 0,
		response: void 0,
		secureConnect: void 0,
		send: void 0,
		socket: void 0
	},
	prefixUrl: "",
	body: void 0,
	form: void 0,
	json: void 0,
	cookieJar: void 0,
	ignoreInvalidCookies: false,
	searchParams: void 0,
	dnsLookup: void 0,
	dnsCache: void 0,
	context: {},
	hooks: {
		init: [],
		beforeRequest: [],
		beforeError: [],
		beforeRedirect: [],
		beforeRetry: [],
		beforeCache: [],
		afterResponse: []
	},
	followRedirect: true,
	maxRedirects: 10,
	cache: void 0,
	throwHttpErrors: true,
	username: "",
	password: "",
	http2: false,
	allowGetBody: false,
	allowAbsoluteUrls: true,
	copyPipedHeaders: false,
	headers: { "user-agent": "got (https://github.com/sindresorhus/got)" },
	methodRewriting: false,
	dnsLookupIpVersion: void 0,
	parseJson: JSON.parse,
	stringifyJson: JSON.stringify,
	retry: {
		limit: 2,
		methods: [
			"GET",
			"PUT",
			"HEAD",
			"DELETE",
			"OPTIONS",
			"TRACE"
		],
		statusCodes: [
			408,
			413,
			429,
			500,
			502,
			503,
			504,
			521,
			522,
			524
		],
		errorCodes: [
			"ETIMEDOUT",
			"ECONNRESET",
			"EADDRINUSE",
			"ECONNREFUSED",
			"EPIPE",
			"ENOTFOUND",
			"ENETUNREACH",
			"EAI_AGAIN"
		],
		maxRetryAfter: void 0,
		calculateDelay: ({ computedValue }) => computedValue,
		backoffLimit: Number.POSITIVE_INFINITY,
		noise: 100,
		enforceRetryRules: true
	},
	localAddress: void 0,
	method: "GET",
	createConnection: void 0,
	cacheOptions: {
		shared: void 0,
		cacheHeuristic: void 0,
		immutableMinTimeToLive: void 0,
		ignoreCargoCult: void 0
	},
	https: {
		alpnProtocols: void 0,
		rejectUnauthorized: void 0,
		checkServerIdentity: void 0,
		serverName: void 0,
		certificateAuthority: void 0,
		key: void 0,
		certificate: void 0,
		passphrase: void 0,
		pfx: void 0,
		ciphers: void 0,
		honorCipherOrder: void 0,
		minVersion: void 0,
		maxVersion: void 0,
		signatureAlgorithms: void 0,
		tlsSessionLifetime: void 0,
		dhparam: void 0,
		ecdhCurve: void 0,
		certificateRevocationLists: void 0,
		secureOptions: void 0
	},
	encoding: void 0,
	resolveBodyOnly: false,
	isStream: false,
	responseType: "text",
	url: void 0,
	pagination: {
		transform(response) {
			if (response.request.options.responseType === "json") return response.body;
			return JSON.parse(response.body);
		},
		paginate({ response }) {
			const rawLinkHeader = response.headers.link;
			if (typeof rawLinkHeader !== "string" || rawLinkHeader.trim() === "") return false;
			const next = parseLinkHeader(rawLinkHeader).find((entry) => entry.parameters.rel === "next" || entry.parameters.rel === "\"next\"");
			if (next) return { url: next.reference };
			return false;
		},
		filter: () => true,
		shouldContinue: () => true,
		countLimit: Number.POSITIVE_INFINITY,
		backoff: 0,
		requestLimit: 1e4,
		stackAllItems: false
	},
	setHost: true,
	maxHeaderSize: void 0,
	signal: void 0,
	enableUnixSockets: false,
	strictContentLength: true
};
var cloneInternals = (internals) => {
	const { hooks, retry } = internals;
	return {
		...internals,
		context: { ...internals.context },
		cacheOptions: { ...internals.cacheOptions },
		https: { ...internals.https },
		agent: { ...internals.agent },
		headers: { ...internals.headers },
		retry: {
			...retry,
			errorCodes: [...retry.errorCodes],
			methods: [...retry.methods],
			statusCodes: [...retry.statusCodes]
		},
		timeout: { ...internals.timeout },
		hooks: {
			init: [...hooks.init],
			beforeRequest: [...hooks.beforeRequest],
			beforeError: [...hooks.beforeError],
			beforeRedirect: [...hooks.beforeRedirect],
			beforeRetry: [...hooks.beforeRetry],
			beforeCache: [...hooks.beforeCache],
			afterResponse: [...hooks.afterResponse]
		},
		searchParams: internals.searchParams ? new URLSearchParams(internals.searchParams) : void 0,
		pagination: { ...internals.pagination }
	};
};
var cloneRaw = (raw) => {
	const result = { ...raw };
	if (Object.hasOwn(raw, "context") && is.object(raw.context)) result.context = { ...raw.context };
	if (Object.hasOwn(raw, "cacheOptions") && is.object(raw.cacheOptions)) result.cacheOptions = { ...raw.cacheOptions };
	if (Object.hasOwn(raw, "https") && is.object(raw.https)) result.https = { ...raw.https };
	if (Object.hasOwn(raw, "agent") && is.object(raw.agent)) result.agent = { ...raw.agent };
	if (Object.hasOwn(raw, "headers") && is.object(raw.headers)) result.headers = { ...raw.headers };
	if (Object.hasOwn(raw, "retry") && is.object(raw.retry)) {
		const { retry } = raw;
		result.retry = { ...retry };
		if (is.array(retry.errorCodes)) result.retry.errorCodes = [...retry.errorCodes];
		if (is.array(retry.methods)) result.retry.methods = [...retry.methods];
		if (is.array(retry.statusCodes)) result.retry.statusCodes = [...retry.statusCodes];
	}
	if (Object.hasOwn(raw, "timeout") && is.object(raw.timeout)) result.timeout = { ...raw.timeout };
	if (Object.hasOwn(raw, "hooks") && is.object(raw.hooks)) {
		const { hooks } = raw;
		result.hooks = { ...hooks };
		if (is.array(hooks.init)) result.hooks.init = [...hooks.init];
		if (is.array(hooks.beforeRequest)) result.hooks.beforeRequest = [...hooks.beforeRequest];
		if (is.array(hooks.beforeError)) result.hooks.beforeError = [...hooks.beforeError];
		if (is.array(hooks.beforeRedirect)) result.hooks.beforeRedirect = [...hooks.beforeRedirect];
		if (is.array(hooks.beforeRetry)) result.hooks.beforeRetry = [...hooks.beforeRetry];
		if (is.array(hooks.beforeCache)) result.hooks.beforeCache = [...hooks.beforeCache];
		if (is.array(hooks.afterResponse)) result.hooks.afterResponse = [...hooks.afterResponse];
	}
	if (Object.hasOwn(raw, "searchParams") && raw.searchParams) {
		if (is.string(raw.searchParams)) result.searchParams = raw.searchParams;
		else if (raw.searchParams instanceof URLSearchParams) result.searchParams = new URLSearchParams(raw.searchParams);
		else if (is.object(raw.searchParams)) result.searchParams = { ...raw.searchParams };
	}
	if (Object.hasOwn(raw, "pagination") && is.object(raw.pagination)) result.pagination = { ...raw.pagination };
	return result;
};
var getHttp2TimeoutOption = (internals) => {
	const delays = [
		internals.timeout.socket,
		internals.timeout.connect,
		internals.timeout.lookup,
		internals.timeout.request,
		internals.timeout.secureConnect
	].filter((delay) => typeof delay === "number");
	return delays.length > 0 ? Math.min(...delays) : void 0;
};
var trackStateMutation = (trackedStateMutations, name) => {
	trackedStateMutations?.add(name);
};
var addExplicitHeader = (explicitHeaders, name) => {
	explicitHeaders.add(name);
};
var markHeaderAsExplicit = (explicitHeaders, trackedStateMutations, name) => {
	addExplicitHeader(explicitHeaders, name);
	trackStateMutation(trackedStateMutations, name);
};
var trackReplacedHeaderMutations = (trackedStateMutations, previousHeaders, nextHeaders) => {
	if (!trackedStateMutations) return;
	for (const header of /* @__PURE__ */ new Set([...Object.keys(previousHeaders), ...Object.keys(nextHeaders)])) if (previousHeaders[header] !== nextHeaders[header]) trackStateMutation(trackedStateMutations, header);
};
var init = (options, withOptions, self) => {
	const initHooks = options.hooks?.init;
	if (initHooks) for (const hook of initHooks) hook(withOptions, self);
};
var nonMergeableKeys = /* @__PURE__ */ new Set([
	"mutableDefaults",
	"handlers",
	"url",
	"preserveHooks",
	"isStream",
	"__proto__"
]);
var Options = class Options {
	#internals;
	#headersProxy;
	#merging = false;
	#init;
	#explicitHeaders;
	#trackedStateMutations;
	constructor(input, options, defaults) {
		assertAny("input", [
			is.string,
			is.urlInstance,
			is.object,
			is.undefined
		], input);
		assertAny("options", [is.object, is.undefined], options);
		assertAny("defaults", [is.object, is.undefined], defaults);
		if (input instanceof Options || options instanceof Options) throw new TypeError("The defaults must be passed as the third argument");
		if (defaults) {
			this.#internals = cloneInternals(defaults.#internals);
			this.#init = [...defaults.#init];
			this.#explicitHeaders = new Set(defaults.#explicitHeaders);
		} else {
			this.#internals = cloneInternals(defaultInternals);
			this.#init = [];
			this.#explicitHeaders = /* @__PURE__ */ new Set();
		}
		this.#headersProxy = this.#createHeadersProxy();
		try {
			if (is.plainObject(input)) try {
				this.merge(input);
				this.merge(options);
			} finally {
				this.url = input.url;
			}
			else try {
				this.merge(options);
			} finally {
				if (options?.url !== void 0) {
					if (input === void 0) this.url = options.url;
					else throw new TypeError("The `url` option is mutually exclusive with the `input` argument");
				} else if (input !== void 0) this.url = input;
			}
		} catch (error) {
			error.options = this;
			throw error;
		}
	}
	merge(options) {
		if (!options) return;
		if (options instanceof Options) {
			const initArray = [...options.#init];
			for (const init of initArray) this.merge(init);
			return;
		}
		options = cloneRaw(options);
		init(this, options, this);
		init(options, options, this);
		this.#merging = true;
		try {
			let push = false;
			for (const key of Object.keys(options)) {
				if (nonMergeableKeys.has(key)) continue;
				if (!(key in this)) throw new Error(`Unexpected option: ${key}`);
				const value = options[key];
				if (value === void 0) continue;
				this[key] = value;
				push = true;
			}
			if (push) this.#init.push(options);
		} finally {
			this.#merging = false;
		}
	}
	/**
	Custom request function.
	The main purpose of this is to [support HTTP2 using a wrapper](https://github.com/szmarczak/http2-wrapper).
	
	@default http.request | https.request
	*/
	get request() {
		return this.#internals.request;
	}
	set request(value) {
		assertAny("request", [is.function, is.undefined], value);
		this.#internals.request = value;
	}
	/**
	An object representing `http`, `https` and `http2` keys for [`http.Agent`](https://nodejs.org/api/http.html#http_class_http_agent), [`https.Agent`](https://nodejs.org/api/https.html#https_class_https_agent) and [`http2wrapper.Agent`](https://github.com/szmarczak/http2-wrapper#new-http2agentoptions) instance.
	This is necessary because a request to one protocol might redirect to another.
	In such a scenario, Got will switch over to the right protocol agent for you.
	
	If a key is not present, it will default to a global agent.
	
	@example
	```
	import got from 'got';
	import HttpAgent from 'agentkeepalive';
	
	const {HttpsAgent} = HttpAgent;
	
	await got('https://sindresorhus.com', {
	agent: {
	http: new HttpAgent(),
	https: new HttpsAgent()
	}
	});
	```
	*/
	get agent() {
		return this.#internals.agent;
	}
	set agent(value) {
		assertPlainObject("agent", value);
		for (const key of Object.keys(value)) {
			if (key === "__proto__") continue;
			if (!(key in this.#internals.agent)) throw new TypeError(`Unexpected agent option: ${key}`);
			assertAny(`agent.${key}`, [
				is.object,
				is.undefined,
				(v) => v === false
			], value[key]);
		}
		if (this.#merging) safeObjectAssign(this.#internals.agent, value);
		else this.#internals.agent = { ...value };
	}
	get h2session() {
		return this.#internals.h2session;
	}
	set h2session(value) {
		this.#internals.h2session = value;
	}
	/**
	Decompress the response automatically.
	
	This will set the `accept-encoding` header to `gzip, deflate, br` unless you set it yourself.
	
	If this is disabled, a compressed response is returned as a `Uint8Array`.
	This may be useful if you want to handle decompression yourself or stream the raw compressed data.
	
	@default true
	*/
	get decompress() {
		return this.#internals.decompress;
	}
	set decompress(value) {
		assert$1.boolean(value);
		this.#internals.decompress = value;
	}
	/**
	Milliseconds to wait for the server to end the response before aborting the request with `got.TimeoutError` error (a.k.a. `request` property).
	By default, there's no timeout.
	
	This also accepts an `object` with the following fields to constrain the duration of each phase of the request lifecycle:
	
	- `lookup` starts when a socket is assigned and ends when the hostname has been resolved.
	Does not apply when using a Unix domain socket.
	- `connect` starts when `lookup` completes (or when the socket is assigned if lookup does not apply to the request) and ends when the socket is connected.
	- `secureConnect` starts when `connect` completes and ends when the handshaking process completes (HTTPS only).
	- `socket` starts when the socket is connected. See [request.setTimeout](https://nodejs.org/api/http.html#http_request_settimeout_timeout_callback).
	- `response` starts when the request has been written to the socket and ends when the response headers are received.
	- `send` starts when the socket is connected and ends with the request has been written to the socket.
	- `request` starts when the request is initiated and ends when the response's end event fires.
	*/
	get timeout() {
		return this.#internals.timeout;
	}
	set timeout(value) {
		assertPlainObject("timeout", value);
		for (const key of Object.keys(value)) {
			if (key === "__proto__") continue;
			if (!(key in this.#internals.timeout)) throw new Error(`Unexpected timeout option: ${key}`);
			assertAny(`timeout.${key}`, [is.number, is.undefined], value[key]);
		}
		if (this.#merging) safeObjectAssign(this.#internals.timeout, value);
		else this.#internals.timeout = { ...value };
	}
	/**
	When specified, `prefixUrl` will be prepended to relative string `url` input.
	The prefix can be any valid URL, either relative or absolute.
	A trailing slash `/` is optional - one will be added automatically.
	
	__Note__: Absolute string URLs and URL instances bypass `prefixUrl` by default. Other instance defaults, including headers, still apply. For untrusted URLs, set `allowAbsoluteUrls` to `false`.
	
	__Note__: Got cannot know which custom headers are sensitive. If you use headers like `x-api-key`, only pass trusted URLs or use `allowAbsoluteUrls: false`.
	
	__Note__: Leading slashes in `input` are disallowed when using this option to enforce consistency and avoid confusion.
	For example, when the prefix URL is `https://example.com/foo` and the input is `/bar`, there's ambiguity whether the resulting URL would become `https://example.com/foo/bar` or `https://example.com/bar`.
	The latter is used by browsers.
	
	__Tip__: Useful when used with `got.extend()` to create niche-specific Got instances.
	
	__Tip__: You can change `prefixUrl` using hooks as long as the URL still includes the `prefixUrl`.
	If the URL doesn't include it anymore, it will throw.
	
	@example
	```
	import got from 'got';
	
	await got('unicorn', {prefixUrl: 'https://cats.com'});
	//=> 'https://cats.com/unicorn'
	
	const instance = got.extend({
	prefixUrl: 'https://google.com'
	});
	
	await instance('unicorn', {
	hooks: {
	beforeRequest: [
	options => {
	options.prefixUrl = 'https://cats.com';
	}
	]
	}
	});
	//=> 'https://cats.com/unicorn'
	```
	*/
	get prefixUrl() {
		return this.#internals.prefixUrl;
	}
	set prefixUrl(value) {
		assertAny("prefixUrl", [is.string, is.urlInstance], value);
		if (value === "") {
			this.#internals.prefixUrl = "";
			return;
		}
		value = value.toString();
		if (!value.endsWith("/")) value += "/";
		if (this.#internals.prefixUrl && this.#internals.url) {
			const { href } = this.#internals.url;
			this.#internals.url.href = value + href.slice(this.#internals.prefixUrl.length);
		}
		this.#internals.prefixUrl = value;
	}
	/**
	__Note #1__: The `body` option cannot be used with the `json` or `form` option.
	
	__Note #2__: If you provide this option, `got.stream()` will be read-only.
	
	__Note #3__: If you provide a payload with the `GET` or `HEAD` method, it will throw a `TypeError` unless the method is `GET` and the `allowGetBody` option is set to `true`.
	
	__Note #4__: This option is not enumerable and will not be merged with the instance defaults.
	
	The `content-length` header will be automatically set if `body` is a `string` / `Uint8Array` / typed array, and `content-length` and `transfer-encoding` are not manually set in `options.headers`.
	
	Since Got 12, the `content-length` is not automatically set when `body` is a `fs.createReadStream`.
	
	You can use `Iterable` and `AsyncIterable` objects as request body, including Web [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream):
	
	@example
	```
	import got from 'got';
	
	// Using an async generator
	async function* generateData() {
	yield 'Hello, ';
	yield 'world!';
	}
	
	await got.post('https://httpbin.org/anything', {
	body: generateData()
	});
	```
	*/
	get body() {
		return this.#internals.body;
	}
	set body(value) {
		assertAny("body", [
			is.string,
			is.buffer,
			is.nodeStream,
			is.generator,
			is.asyncGenerator,
			is.iterable,
			is.asyncIterable,
			is.typedArray,
			is.undefined
		], value);
		if (is.nodeStream(value)) assert$1.truthy(value.readable);
		if (value !== void 0) {
			assert$1.undefined(this.#internals.form);
			assert$1.undefined(this.#internals.json);
		}
		this.#internals.body = value;
		trackStateMutation(this.#trackedStateMutations, "body");
	}
	/**
	The form body is converted to a query string using [`(new URLSearchParams(object)).toString()`](https://nodejs.org/api/url.html#url_constructor_new_urlsearchparams_obj).
	
	If the `Content-Type` header is not present, it will be set to `application/x-www-form-urlencoded`.
	
	__Note #1__: If you provide this option, `got.stream()` will be read-only.
	
	__Note #2__: This option is not enumerable and will not be merged with the instance defaults.
	*/
	get form() {
		return this.#internals.form;
	}
	set form(value) {
		assertAny("form", [is.plainObject, is.undefined], value);
		if (value !== void 0) {
			assert$1.undefined(this.#internals.body);
			assert$1.undefined(this.#internals.json);
		}
		this.#internals.form = value;
		trackStateMutation(this.#trackedStateMutations, "form");
	}
	/**
	JSON request body. If the `content-type` header is not set, it will be set to `application/json`.
	
	__Important__: This option only affects the request body you send to the server. To parse the response as JSON, you must either call `.json()` on the promise or set `responseType: 'json'` in the options.
	
	__Note #1__: If you provide this option, `got.stream()` will be read-only.
	
	__Note #2__: This option is not enumerable and will not be merged with the instance defaults.
	*/
	get json() {
		return this.#internals.json;
	}
	set json(value) {
		if (value !== void 0) {
			assert$1.undefined(this.#internals.body);
			assert$1.undefined(this.#internals.form);
		}
		this.#internals.json = value;
		trackStateMutation(this.#trackedStateMutations, "json");
	}
	/**
	The URL to request, as a string, a [`https.request` options object](https://nodejs.org/api/https.html#https_https_request_options_callback), or a [WHATWG `URL`](https://nodejs.org/api/url.html#url_class_url).
	
	Properties from `options` will override properties in the parsed `url`.
	
	If no protocol is specified, it will throw a `TypeError`.
	
	__Note__: The query string is **not** parsed as search params.
	
	@example
	```
	await got('https://example.com/?query=a b'); //=> https://example.com/?query=a%20b
	await got('https://example.com/', {searchParams: {query: 'a b'}}); //=> https://example.com/?query=a+b
	
	// The query string is overridden by `searchParams`
	await got('https://example.com/?query=a b', {searchParams: {query: 'a b'}}); //=> https://example.com/?query=a+b
	```
	*/
	get url() {
		return this.#internals.url;
	}
	set url(value) {
		assertAny("url", [
			is.string,
			is.urlInstance,
			is.undefined
		], value);
		if (value === void 0) {
			this.#internals.url = void 0;
			trackStateMutation(this.#trackedStateMutations, "url");
			return;
		}
		if (is.string(value) && value.startsWith("/")) throw new Error("`url` must not start with a slash");
		const valueString = value.toString();
		if (is.string(value) && !this.prefixUrl && hasHttpProtocolWithoutSlashes(valueString)) throw new Error("`url` protocol must be followed by `//`");
		const isAbsolute = isAbsoluteUrl(value);
		assertRelativeUrlIfNeeded(this, value);
		const urlString = isAbsolute ? valueString : `${this.prefixUrl}${valueString}`;
		const url = new URL(urlString);
		this.#internals.url = url;
		trackStateMutation(this.#trackedStateMutations, "url");
		if (usesUnixSocket(url) && !this.#internals.enableUnixSockets) throw new Error("Using UNIX domain sockets but option `enableUnixSockets` is not enabled");
		if (url.protocol === "unix:") url.href = `http://unix${url.pathname}${url.search}`;
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			const error = /* @__PURE__ */ new Error(`Unsupported protocol: ${url.protocol}`);
			error.code = "ERR_UNSUPPORTED_PROTOCOL";
			throw error;
		}
		if (this.#internals.username) {
			url.username = this.#internals.username;
			this.#internals.username = "";
		}
		if (this.#internals.password) {
			url.password = this.#internals.password;
			this.#internals.password = "";
		}
		if (this.#internals.searchParams) {
			url.search = this.#internals.searchParams.toString();
			this.#internals.searchParams = void 0;
		}
	}
	/**
	Cookie support. You don't have to care about parsing or how to store them.
	
	__Note__: If you provide this option, `options.headers.cookie` will be overridden.
	*/
	get cookieJar() {
		return this.#internals.cookieJar;
	}
	set cookieJar(value) {
		assertAny("cookieJar", [is.object, is.undefined], value);
		if (value === void 0) {
			this.#internals.cookieJar = void 0;
			return;
		}
		const { setCookie, getCookieString } = value;
		assert$1.function(setCookie);
		assert$1.function(getCookieString);
		/* istanbul ignore next: Horrible `tough-cookie` v3 check */
		if (isToughCookieJar(value)) this.#internals.cookieJar = {
			setCookie: promisify(value.setCookie.bind(value)),
			getCookieString: promisify(value.getCookieString.bind(value))
		};
		else this.#internals.cookieJar = value;
	}
	/**
	You can abort the `request` using [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
	
	@example
	```
	import got from 'got';
	
	const abortController = new AbortController();
	
	const request = got('https://httpbin.org/anything', {
	signal: abortController.signal
	});
	
	setTimeout(() => {
	abortController.abort();
	}, 100);
	```
	*/
	get signal() {
		return this.#internals.signal;
	}
	set signal(value) {
		assertAny("signal", [is.object, is.undefined], value);
		this.#internals.signal = value;
	}
	/**
	Ignore invalid cookies instead of throwing an error.
	Only useful when the `cookieJar` option has been set. Not recommended.
	
	@default false
	*/
	get ignoreInvalidCookies() {
		return this.#internals.ignoreInvalidCookies;
	}
	set ignoreInvalidCookies(value) {
		assert$1.boolean(value);
		this.#internals.ignoreInvalidCookies = value;
	}
	/**
	Query string that will be added to the request URL.
	This will override the query string in `url`.
	
	If you need to pass in an array, you can do it using a `URLSearchParams` instance.
	
	@example
	```
	import got from 'got';
	
	const searchParams = new URLSearchParams([['key', 'a'], ['key', 'b']]);
	
	await got('https://example.com', {searchParams});
	
	console.log(searchParams.toString());
	//=> 'key=a&key=b'
	```
	*/
	get searchParams() {
		if (this.#internals.url) return this.#internals.url.searchParams;
		this.#internals.searchParams ??= new URLSearchParams();
		return this.#internals.searchParams;
	}
	set searchParams(value) {
		assertAny("searchParams", [
			is.string,
			is.object,
			is.undefined
		], value);
		const url = this.#internals.url;
		if (value === void 0) {
			this.#internals.searchParams = void 0;
			if (url) url.search = "";
			return;
		}
		const searchParameters = this.searchParams;
		let updated;
		if (is.string(value)) updated = new URLSearchParams(value);
		else if (value instanceof URLSearchParams) updated = new URLSearchParams(value);
		else {
			validateSearchParameters(value);
			updated = new URLSearchParams();
			for (const key of Object.keys(value)) {
				if (key === "__proto__") continue;
				const entry = value[key];
				if (entry === null) updated.append(key, "");
				else if (entry === void 0) searchParameters.delete(key);
				else updated.append(key, entry);
			}
		}
		if (this.#merging) {
			for (const key of updated.keys()) searchParameters.delete(key);
			for (const [key, value] of updated) searchParameters.append(key, value);
		} else if (url) url.search = updated.toString();
		else this.#internals.searchParams = updated;
	}
	get searchParameters() {
		throw new Error("The `searchParameters` option does not exist. Use `searchParams` instead.");
	}
	set searchParameters(_value) {
		throw new Error("The `searchParameters` option does not exist. Use `searchParams` instead.");
	}
	get dnsLookup() {
		return this.#internals.dnsLookup;
	}
	set dnsLookup(value) {
		assertAny("dnsLookup", [is.function, is.undefined], value);
		this.#internals.dnsLookup = value;
	}
	/**
	An instance of [`CacheableLookup`](https://github.com/szmarczak/cacheable-lookup) used for making DNS lookups.
	Useful when making lots of requests to different *public* hostnames.
	
	`CacheableLookup` uses `dns.resolver4(..)` and `dns.resolver6(...)` under the hood and fall backs to `dns.lookup(...)` when the first two fail, which may lead to additional delay.
	
	__Note__: This should stay disabled when making requests to internal hostnames such as `localhost`, `database.local` etc.
	
	@default false
	*/
	get dnsCache() {
		return this.#internals.dnsCache;
	}
	set dnsCache(value) {
		assertAny("dnsCache", [
			is.object,
			is.boolean,
			is.undefined
		], value);
		if (value === true) this.#internals.dnsCache = getGlobalDnsCache();
		else if (value === false) this.#internals.dnsCache = void 0;
		else this.#internals.dnsCache = value;
	}
	/**
	User data. `context` is shallow merged and enumerable. If it contains non-enumerable properties they will NOT be merged.
	
	@example
	```
	import got from 'got';
	
	const instance = got.extend({
	hooks: {
	beforeRequest: [
	options => {
	if (!options.context || !options.context.token) {
	throw new Error('Token required');
	}
	
	options.headers.token = options.context.token;
	}
	]
	}
	});
	
	const context = {
	token: 'secret'
	};
	
	const response = await instance('https://httpbin.org/headers', {context});
	
	// Let's see the headers
	console.log(response.body);
	```
	*/
	get context() {
		return this.#internals.context;
	}
	set context(value) {
		assert$1.object(value);
		if (this.#merging) safeObjectAssign(this.#internals.context, value);
		else this.#internals.context = { ...value };
	}
	/**
	Hooks allow modifications during the request lifecycle.
	Hook functions may be async and are run serially.
	*/
	get hooks() {
		return this.#internals.hooks;
	}
	set hooks(value) {
		assert$1.object(value);
		for (const knownHookEvent of Object.keys(value)) {
			if (knownHookEvent === "__proto__") continue;
			if (!(knownHookEvent in this.#internals.hooks)) throw new Error(`Unexpected hook event: ${knownHookEvent}`);
			const typedKnownHookEvent = knownHookEvent;
			const hooks = value[typedKnownHookEvent];
			assertAny(`hooks.${knownHookEvent}`, [is.array, is.undefined], hooks);
			if (hooks) for (const hook of hooks) assert$1.function(hook);
			if (this.#merging) {
				if (hooks) this.#internals.hooks[typedKnownHookEvent].push(...hooks);
			} else {
				if (!hooks) throw new Error(`Missing hook event: ${knownHookEvent}`);
				this.#internals.hooks[knownHookEvent] = [...hooks];
			}
		}
	}
	/**
	Whether redirect responses should be followed automatically.
	
	Optionally, pass a function to dynamically decide based on the response object.
	
	Note that if a `303` is sent by the server in response to any request type (`POST`, `DELETE`, etc.), Got will automatically request the resource pointed to in the location header via `GET`.
	This is in accordance with [the spec](https://tools.ietf.org/html/rfc7231#section-6.4.4). You can optionally turn on this behavior also for other redirect codes - see `methodRewriting`.
	On cross-origin redirects, Got strips `host`, `cookie`, `cookie2`, `authorization`, and `proxy-authorization`. When a redirect rewrites the request to `GET`, Got also strips request body headers. Use `hooks.beforeRedirect` for app-specific sensitive headers.
	
	@default true
	*/
	get followRedirect() {
		return this.#internals.followRedirect;
	}
	set followRedirect(value) {
		assertAny("followRedirect", [is.boolean, is.function], value);
		this.#internals.followRedirect = value;
	}
	get followRedirects() {
		throw new TypeError("The `followRedirects` option does not exist. Use `followRedirect` instead.");
	}
	set followRedirects(_value) {
		throw new TypeError("The `followRedirects` option does not exist. Use `followRedirect` instead.");
	}
	/**
	If exceeded, the request will be aborted and a `MaxRedirectsError` will be thrown.
	
	@default 10
	*/
	get maxRedirects() {
		return this.#internals.maxRedirects;
	}
	set maxRedirects(value) {
		assert$1.number(value);
		this.#internals.maxRedirects = value;
	}
	/**
	A cache adapter instance for storing cached response data.
	
	@default false
	*/
	get cache() {
		return this.#internals.cache;
	}
	set cache(value) {
		assertAny("cache", [
			is.object,
			is.string,
			is.boolean,
			is.undefined
		], value);
		if (value === true) this.#internals.cache = globalCache;
		else if (value === false) this.#internals.cache = void 0;
		else this.#internals.cache = wrapQuickLruIfNeeded(value);
	}
	/**
	Determines if a `got.HTTPError` is thrown for unsuccessful responses.
	
	If this is disabled, requests that encounter an error status code will be resolved with the `response` instead of throwing.
	This may be useful if you are checking for resource availability and are expecting error responses.
	
	@default true
	*/
	get throwHttpErrors() {
		return this.#internals.throwHttpErrors;
	}
	set throwHttpErrors(value) {
		assert$1.boolean(value);
		this.#internals.throwHttpErrors = value;
	}
	get username() {
		const url = this.#internals.url;
		const value = url ? url.username : this.#internals.username;
		return decodeURIComponent(value);
	}
	set username(value) {
		assert$1.string(value);
		const url = this.#internals.url;
		const fixedValue = encodeURIComponent(value);
		if (url) url.username = fixedValue;
		else this.#internals.username = fixedValue;
		trackStateMutation(this.#trackedStateMutations, "username");
	}
	get password() {
		const url = this.#internals.url;
		const value = url ? url.password : this.#internals.password;
		return decodeURIComponent(value);
	}
	set password(value) {
		assert$1.string(value);
		const url = this.#internals.url;
		const fixedValue = encodeURIComponent(value);
		if (url) url.password = fixedValue;
		else this.#internals.password = fixedValue;
		trackStateMutation(this.#trackedStateMutations, "password");
	}
	/**
	If set to `true`, Got will additionally accept HTTP2 requests.
	
	It will choose either HTTP/1.1 or HTTP/2 depending on the ALPN protocol.
	
	__Note__: This option requires Node.js 15.10.0 or newer as HTTP/2 support on older Node.js versions is very buggy.
	
	__Note__: Overriding `options.request` will disable HTTP2 support.
	
	@default false
	
	@example
	```
	import got from 'got';
	
	const {headers} = await got('https://nghttp2.org/httpbin/anything', {http2: true});
	
	console.log(headers.via);
	//=> '2 nghttpx'
	```
	*/
	get http2() {
		return this.#internals.http2;
	}
	set http2(value) {
		assert$1.boolean(value);
		this.#internals.http2 = value;
	}
	/**
	Set this to `true` to allow sending body for the `GET` method.
	However, the [HTTP/2 specification](https://tools.ietf.org/html/rfc7540#section-8.1.3) says that `An HTTP GET request includes request header fields and no payload body`, therefore when using the HTTP/2 protocol this option will have no effect.
	This option is only meant to interact with non-compliant servers when you have no other choice.
	
	__Note__: The [RFC 7231](https://tools.ietf.org/html/rfc7231#section-4.3.1) doesn't specify any particular behavior for the GET method having a payload, therefore __it's considered an [anti-pattern](https://en.wikipedia.org/wiki/Anti-pattern)__.
	
	@default false
	*/
	get allowGetBody() {
		return this.#internals.allowGetBody;
	}
	set allowGetBody(value) {
		assert$1.boolean(value);
		this.#internals.allowGetBody = value;
	}
	/**
	Allow absolute URLs to bypass `prefixUrl`.
	
	When set to `false` with `prefixUrl`, passing an absolute `url` will throw. This also rejects scheme-relative URL strings like `//example.com/path` in retry and pagination URL overrides. Use this when untrusted URL input must stay on the same origin as the configured `prefixUrl`. This is not a path sandbox: relative paths like `../other` still follow standard URL resolution on the same origin. Set `prefixUrl` to an empty string for a request that intentionally needs an absolute URL.
	
	__Note__: This guards the `url` you pass. It does not block cross-origin redirects issued by the server, though inherited sensitive headers are still stripped when a redirect changes origin.
	
	__Note__: The check is defeated if the same hook or `pagination.paginate(…)` return also sets `prefixUrl` or `allowAbsoluteUrls`. Do not populate those options from untrusted data.
	
	@default true
	*/
	get allowAbsoluteUrls() {
		return this.#internals.allowAbsoluteUrls;
	}
	set allowAbsoluteUrls(value) {
		assert$1.boolean(value);
		this.#internals.allowAbsoluteUrls = value;
	}
	/**
	Automatically copy headers from piped streams.
	
	When piping a request into a Got stream (e.g., `request.pipe(got.stream(url))`), this controls whether headers from the source stream are automatically merged into the Got request headers.
	
	Note: Explicitly set headers take precedence over piped headers. Piped headers are only copied when a header is not already explicitly set.
	
	Useful for proxy scenarios when explicitly enabled, but you may still want to filter out headers like `Host`, `Connection`, `Authorization`, etc.
	
	@default false
	
	@example
	```
	import got from 'got';
	import {pipeline} from 'node:stream/promises';
	
	// Opt in to automatic header copying for proxy scenarios
	server.get('/proxy', async (request, response) => {
	const gotStream = got.stream('https://example.com', {
	copyPipedHeaders: true,
	// Explicit headers win over piped headers
	headers: {
	host: 'example.com',
	}
	});
	
	await pipeline(request, gotStream, response);
	});
	```
	
	@example
	```
	import got from 'got';
	import {pipeline} from 'node:stream/promises';
	
	// Keep it disabled and manually copy only safe headers
	server.get('/proxy', async (request, response) => {
	const gotStream = got.stream('https://example.com', {
	headers: {
	'user-agent': request.headers['user-agent'],
	'accept': request.headers['accept'],
	// Explicitly NOT copying host, connection, authorization, etc.
	}
	});
	
	await pipeline(request, gotStream, response);
	});
	```
	*/
	get copyPipedHeaders() {
		return this.#internals.copyPipedHeaders;
	}
	set copyPipedHeaders(value) {
		assert$1.boolean(value);
		this.#internals.copyPipedHeaders = value;
	}
	isHeaderExplicitlySet(name) {
		return this.#explicitHeaders.has(name.toLowerCase());
	}
	shouldCopyPipedHeader(name) {
		return !this.isHeaderExplicitlySet(name);
	}
	setPipedHeader(name, value) {
		assertValidHeaderName(name);
		this.#internals.headers[name.toLowerCase()] = value;
	}
	getInternalHeaders() {
		return this.#internals.headers;
	}
	setInternalHeader(name, value) {
		assertValidHeaderName(name);
		this.#internals.headers[name.toLowerCase()] = value;
	}
	deleteInternalHeader(name) {
		delete this.#internals.headers[name.toLowerCase()];
	}
	async trackStateMutations(operation) {
		const changedState = /* @__PURE__ */ new Set();
		this.#trackedStateMutations = changedState;
		try {
			return await operation(changedState);
		} finally {
			this.#trackedStateMutations = void 0;
		}
	}
	clearBody() {
		this.body = void 0;
		this.json = void 0;
		this.form = void 0;
		for (const header of bodyHeaderNames) this.deleteInternalHeader(header);
	}
	clearUnchangedCookieHeader(previousState, changedState) {
		if (previousState?.hadCookieJar && this.cookieJar === void 0 && !this.isHeaderExplicitlySet("cookie") && !changedState?.has("cookie") && this.headers.cookie === previousState.headers.cookie) this.deleteInternalHeader("cookie");
	}
	restoreCookieHeader(previousState, headers) {
		if (!previousState) return;
		if (Object.hasOwn(headers ?? {}, "cookie")) return;
		if (previousState.cookieWasExplicitlySet) {
			this.headers.cookie = previousState.headers.cookie;
			return;
		}
		delete this.headers.cookie;
		if (previousState.headers.cookie !== void 0) this.setInternalHeader("cookie", previousState.headers.cookie);
	}
	syncCookieHeaderAfterMerge(previousState, headers) {
		this.restoreCookieHeader(previousState, headers);
		this.clearUnchangedCookieHeader(previousState);
	}
	stripUnchangedCrossOriginState(previousState, changedState, { clearBody = true } = {}) {
		const headers = this.getInternalHeaders();
		const url = this.#internals.url;
		for (const header of crossOriginStripHeaders) if (!changedState.has(header) && headers[header] === previousState.headers[header]) this.deleteInternalHeader(header);
		if (!hasExplicitCredentialInUrlChange(changedState, url, "username")) this.username = "";
		if (!hasExplicitCredentialInUrlChange(changedState, url, "password")) this.password = "";
		if (clearBody && !changedState.has("body") && !changedState.has("json") && !changedState.has("form") && isBodyUnchanged(this, previousState)) this.clearBody();
	}
	/**
	Strip sensitive headers and credentials when navigating to a different origin.
	Headers and credentials explicitly provided in `userOptions` are preserved.
	*/
	stripSensitiveHeaders(previousUrl, nextUrl, userOptions) {
		if (isSameOrigin(previousUrl, nextUrl)) return;
		const headers = lowercaseKeys(userOptions.headers ?? {});
		for (const header of crossOriginStripHeaders) if (headers[header] === void 0) this.deleteInternalHeader(header);
		const explicitUsername = Object.hasOwn(userOptions, "username") ? userOptions.username : void 0;
		const explicitPassword = Object.hasOwn(userOptions, "password") ? userOptions.password : void 0;
		const hasExplicitUsername = explicitUsername !== void 0 || hasCredentialInUrl(userOptions.url, "username") || isCrossOriginCredentialChanged(previousUrl, nextUrl, "username");
		const hasExplicitPassword = explicitPassword !== void 0 || hasCredentialInUrl(userOptions.url, "password") || isCrossOriginCredentialChanged(previousUrl, nextUrl, "password");
		if (!hasExplicitUsername && this.username) this.username = "";
		if (!hasExplicitPassword && this.password) this.password = "";
	}
	/**
	Request headers.
	
	Existing headers will be overwritten. Headers set to `undefined` will be omitted.
	
	@default {}
	*/
	get headers() {
		return this.#headersProxy;
	}
	set headers(value) {
		assertPlainObject("headers", value);
		const normalizedHeaders = lowercaseKeys(value);
		for (const header of Object.keys(normalizedHeaders)) assertValidHeaderName(header);
		if (this.#merging) safeObjectAssign(this.#internals.headers, normalizedHeaders);
		else {
			const previousHeaders = this.#internals.headers;
			this.#internals.headers = normalizedHeaders;
			this.#headersProxy = this.#createHeadersProxy();
			this.#explicitHeaders.clear();
			trackReplacedHeaderMutations(this.#trackedStateMutations, previousHeaders, normalizedHeaders);
		}
		for (const header of Object.keys(normalizedHeaders)) if (this.#merging) markHeaderAsExplicit(this.#explicitHeaders, this.#trackedStateMutations, header);
		else addExplicitHeader(this.#explicitHeaders, header);
	}
	/**
	Specifies if the HTTP request method should be [rewritten as `GET`](https://tools.ietf.org/html/rfc7231#section-6.4) on redirects.
	
	As the [specification](https://tools.ietf.org/html/rfc7231#section-6.4) prefers to rewrite the HTTP method only on `303` responses, this is Got's default behavior. Cross-origin `301` and `302` redirects also rewrite `POST` requests to `GET` by default to avoid forwarding request bodies to another origin.
	Setting `methodRewriting` to `true` will also rewrite same-origin `301` and `302` responses, as allowed by the spec. This is the behavior followed by `curl` and browsers.
	
	__Note__: Got never performs method rewriting on `307` and `308` responses, as this is [explicitly prohibited by the specification](https://www.rfc-editor.org/rfc/rfc7231#section-6.4.7).
	
	@default false
	*/
	get methodRewriting() {
		return this.#internals.methodRewriting;
	}
	set methodRewriting(value) {
		assert$1.boolean(value);
		this.#internals.methodRewriting = value;
	}
	/**
	Indicates which DNS record family to use.
	
	Values:
	- `undefined`: IPv4 (if present) or IPv6
	- `4`: Only IPv4
	- `6`: Only IPv6
	
	@default undefined
	*/
	get dnsLookupIpVersion() {
		return this.#internals.dnsLookupIpVersion;
	}
	set dnsLookupIpVersion(value) {
		if (value !== void 0 && value !== 4 && value !== 6) throw new TypeError(`Invalid DNS lookup IP version: ${value}`);
		this.#internals.dnsLookupIpVersion = value;
	}
	/**
	A function used to parse JSON responses.
	
	@example
	```
	import got from 'got';
	import Bourne from '@hapi/bourne';
	
	const parsed = await got('https://example.com', {
	parseJson: text => Bourne.parse(text)
	}).json();
	
	console.log(parsed);
	```
	*/
	get parseJson() {
		return this.#internals.parseJson;
	}
	set parseJson(value) {
		assert$1.function(value);
		this.#internals.parseJson = value;
	}
	/**
	A function used to stringify the body of JSON requests.
	
	@example
	```
	import got from 'got';
	
	await got.post('https://example.com', {
	stringifyJson: object => JSON.stringify(object, (key, value) => {
	if (key.startsWith('_')) {
	return;
	}
	
	return value;
	}),
	json: {
	some: 'payload',
	_ignoreMe: 1234
	}
	});
	```
	
	@example
	```
	import got from 'got';
	
	await got.post('https://example.com', {
	stringifyJson: object => JSON.stringify(object, (key, value) => {
	if (typeof value === 'number') {
	return value.toString();
	}
	
	return value;
	}),
	json: {
	some: 'payload',
	number: 1
	}
	});
	```
	*/
	get stringifyJson() {
		return this.#internals.stringifyJson;
	}
	set stringifyJson(value) {
		assert$1.function(value);
		this.#internals.stringifyJson = value;
	}
	/**
	An object representing `limit`, `calculateDelay`, `methods`, `statusCodes`, `maxRetryAfter` and `errorCodes` fields for maximum retry count, retry handler, allowed methods, allowed status codes, maximum [`Retry-After`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) time and allowed error codes.
	
	Delays between retries counts with function `1000 * Math.pow(2, retry) + Math.random() * 100`, where `retry` is attempt number (starts from 1).
	
	The `calculateDelay` property is a `function` that receives an object with `attemptCount`, `retryOptions`, `error` and `computedValue` properties for current retry count, the retry options, error and default computed value.
	The function must return a delay in milliseconds (or a Promise resolving with it) (`0` return value cancels retry).
	
	The `enforceRetryRules` property is a `boolean` that, when set to `true` (default), enforces the `limit`, `methods`, `statusCodes`, and `errorCodes` options before calling `calculateDelay`. Your `calculateDelay` function is only invoked when a retry is allowed based on these criteria. When `false`, `calculateDelay` receives the computed value but can override all retry logic.
	
	__Note:__ When `enforceRetryRules` is `false`, you must check `computedValue` in your `calculateDelay` function to respect retry rules. When `true` (default), the retry rules are enforced automatically.
	
	By default, it retries *only* on the specified methods, status codes, and on these network errors:
	
	- `ETIMEDOUT`: One of the [timeout](#timeout) limits were reached.
	- `ECONNRESET`: Connection was forcibly closed by a peer.
	- `EADDRINUSE`: Could not bind to any free port.
	- `ECONNREFUSED`: Connection was refused by the server.
	- `EPIPE`: The remote side of the stream being written has been closed.
	- `ENOTFOUND`: Couldn't resolve the hostname to an IP address.
	- `ENETUNREACH`: No internet connection.
	- `EAI_AGAIN`: DNS lookup timed out.
	
	__Note__: If `maxRetryAfter` is set to `undefined`, it will use `options.timeout`.
	__Note__: If [`Retry-After`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header is greater than `maxRetryAfter`, it will cancel the request.
	*/
	get retry() {
		return this.#internals.retry;
	}
	set retry(value) {
		assertPlainObject("retry", value);
		assertAny("retry.calculateDelay", [is.function, is.undefined], value.calculateDelay);
		assertAny("retry.maxRetryAfter", [is.number, is.undefined], value.maxRetryAfter);
		assertAny("retry.limit", [is.number, is.undefined], value.limit);
		assertAny("retry.methods", [is.array, is.undefined], value.methods);
		assertAny("retry.statusCodes", [is.array, is.undefined], value.statusCodes);
		assertAny("retry.errorCodes", [is.array, is.undefined], value.errorCodes);
		assertAny("retry.noise", [is.number, is.undefined], value.noise);
		assertAny("retry.enforceRetryRules", [is.boolean, is.undefined], value.enforceRetryRules);
		if (value.noise && Math.abs(value.noise) > 100) throw new Error(`The maximum acceptable retry noise is +/- 100ms, got ${value.noise}`);
		for (const key of Object.keys(value)) {
			if (key === "__proto__") continue;
			if (!(key in this.#internals.retry)) throw new Error(`Unexpected retry option: ${key}`);
		}
		if (this.#merging) safeObjectAssign(this.#internals.retry, value);
		else this.#internals.retry = { ...value };
		const { retry } = this.#internals;
		retry.methods = [...new Set(retry.methods.map((method) => method.toUpperCase()))];
		retry.statusCodes = [...new Set(retry.statusCodes)];
		retry.errorCodes = [...new Set(retry.errorCodes)];
	}
	/**
	From `http.RequestOptions`.
	
	The IP address used to send the request from.
	*/
	get localAddress() {
		return this.#internals.localAddress;
	}
	set localAddress(value) {
		assertAny("localAddress", [is.string, is.undefined], value);
		this.#internals.localAddress = value;
	}
	/**
	The HTTP method used to make the request.
	
	@default 'GET'
	*/
	get method() {
		return this.#internals.method;
	}
	set method(value) {
		assert$1.string(value);
		this.#internals.method = value.toUpperCase();
	}
	get createConnection() {
		return this.#internals.createConnection;
	}
	set createConnection(value) {
		assertAny("createConnection", [is.function, is.undefined], value);
		this.#internals.createConnection = value;
	}
	/**
	From `http-cache-semantics`
	
	@default {}
	*/
	get cacheOptions() {
		return this.#internals.cacheOptions;
	}
	set cacheOptions(value) {
		assertPlainObject("cacheOptions", value);
		assertAny("cacheOptions.shared", [is.boolean, is.undefined], value.shared);
		assertAny("cacheOptions.cacheHeuristic", [is.number, is.undefined], value.cacheHeuristic);
		assertAny("cacheOptions.immutableMinTimeToLive", [is.number, is.undefined], value.immutableMinTimeToLive);
		assertAny("cacheOptions.ignoreCargoCult", [is.boolean, is.undefined], value.ignoreCargoCult);
		for (const key of Object.keys(value)) {
			if (key === "__proto__") continue;
			if (!(key in this.#internals.cacheOptions)) throw new Error(`Cache option \`${key}\` does not exist`);
		}
		if (this.#merging) safeObjectAssign(this.#internals.cacheOptions, value);
		else this.#internals.cacheOptions = { ...value };
	}
	/**
	Options for the advanced HTTPS API.
	*/
	get https() {
		return this.#internals.https;
	}
	set https(value) {
		assertPlainObject("https", value);
		assertAny("https.rejectUnauthorized", [is.boolean, is.undefined], value.rejectUnauthorized);
		assertAny("https.checkServerIdentity", [is.function, is.undefined], value.checkServerIdentity);
		assertAny("https.serverName", [is.string, is.undefined], value.serverName);
		assertAny("https.certificateAuthority", [
			is.string,
			is.object,
			is.array,
			is.undefined
		], value.certificateAuthority);
		assertAny("https.key", [
			is.string,
			is.object,
			is.array,
			is.undefined
		], value.key);
		assertAny("https.certificate", [
			is.string,
			is.object,
			is.array,
			is.undefined
		], value.certificate);
		assertAny("https.passphrase", [is.string, is.undefined], value.passphrase);
		assertAny("https.pfx", [
			is.string,
			is.buffer,
			is.array,
			is.undefined
		], value.pfx);
		assertAny("https.alpnProtocols", [is.array, is.undefined], value.alpnProtocols);
		assertAny("https.ciphers", [is.string, is.undefined], value.ciphers);
		assertAny("https.dhparam", [
			is.string,
			is.buffer,
			is.undefined
		], value.dhparam);
		assertAny("https.signatureAlgorithms", [is.string, is.undefined], value.signatureAlgorithms);
		assertAny("https.minVersion", [is.string, is.undefined], value.minVersion);
		assertAny("https.maxVersion", [is.string, is.undefined], value.maxVersion);
		assertAny("https.honorCipherOrder", [is.boolean, is.undefined], value.honorCipherOrder);
		assertAny("https.tlsSessionLifetime", [is.number, is.undefined], value.tlsSessionLifetime);
		assertAny("https.ecdhCurve", [is.string, is.undefined], value.ecdhCurve);
		assertAny("https.certificateRevocationLists", [
			is.string,
			is.buffer,
			is.array,
			is.undefined
		], value.certificateRevocationLists);
		assertAny("https.secureOptions", [is.number, is.undefined], value.secureOptions);
		for (const key of Object.keys(value)) {
			if (key === "__proto__") continue;
			if (!(key in this.#internals.https)) throw new Error(`HTTPS option \`${key}\` does not exist`);
		}
		if (this.#merging) safeObjectAssign(this.#internals.https, value);
		else this.#internals.https = { ...value };
	}
	/**
	[Encoding](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings) to be used on `setEncoding` of the response data.
	
	To get a [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), you need to set `responseType` to `buffer` instead.
	Don't set this option to `null`.
	
	__Note__: This doesn't affect streams! Instead, you need to do `got.stream(...).setEncoding(encoding)`.
	
	@default 'utf-8'
	*/
	get encoding() {
		return this.#internals.encoding;
	}
	set encoding(value) {
		if (value === null) throw new TypeError("To get a Uint8Array, set `options.responseType` to `buffer` instead");
		assertAny("encoding", [is.string, is.undefined], value);
		this.#internals.encoding = value;
	}
	/**
	When set to `true` the promise will return the Response body instead of the Response object.
	
	@default false
	*/
	get resolveBodyOnly() {
		return this.#internals.resolveBodyOnly;
	}
	set resolveBodyOnly(value) {
		assert$1.boolean(value);
		this.#internals.resolveBodyOnly = value;
	}
	/**
	Returns a `Stream` instead of a `Promise`.
	Set internally by `got.stream()`.
	
	@default false
	@internal
	*/
	get isStream() {
		return this.#internals.isStream;
	}
	set isStream(value) {
		assert$1.boolean(value);
		this.#internals.isStream = value;
	}
	/**
	The parsing method.
	
	The promise also has `.text()`, `.json()` and `.buffer()` methods which return another Got promise for the parsed body.
	
	It's like setting the options to `{responseType: 'json', resolveBodyOnly: true}` but without affecting the main Got promise.
	
	__Note__: When using streams, this option is ignored.
	
	@example
	```
	const responsePromise = got(url);
	const bufferPromise = responsePromise.buffer();
	const jsonPromise = responsePromise.json();
	
	const [response, buffer, json] = Promise.all([responsePromise, bufferPromise, jsonPromise]);
	// `response` is an instance of Got Response
	// `buffer` is an instance of Uint8Array
	// `json` is an object
	```
	
	@example
	```
	// This
	const body = await got(url).json();
	
	// is semantically the same as this
	const body = await got(url, {responseType: 'json', resolveBodyOnly: true});
	```
	*/
	get responseType() {
		return this.#internals.responseType;
	}
	set responseType(value) {
		if (value === void 0) {
			this.#internals.responseType = "text";
			return;
		}
		if (value !== "text" && value !== "buffer" && value !== "json") throw new Error(`Invalid \`responseType\` option: ${value}`);
		this.#internals.responseType = value;
	}
	get pagination() {
		return this.#internals.pagination;
	}
	set pagination(value) {
		assert$1.object(value);
		if (this.#merging) safeObjectAssign(this.#internals.pagination, value);
		else this.#internals.pagination = value;
	}
	get auth() {
		throw new Error("Parameter `auth` is deprecated. Use `username` / `password` instead.");
	}
	set auth(_value) {
		throw new Error("Parameter `auth` is deprecated. Use `username` / `password` instead.");
	}
	get setHost() {
		return this.#internals.setHost;
	}
	set setHost(value) {
		assert$1.boolean(value);
		this.#internals.setHost = value;
	}
	get maxHeaderSize() {
		return this.#internals.maxHeaderSize;
	}
	set maxHeaderSize(value) {
		assertAny("maxHeaderSize", [is.number, is.undefined], value);
		this.#internals.maxHeaderSize = value;
	}
	get enableUnixSockets() {
		return this.#internals.enableUnixSockets;
	}
	set enableUnixSockets(value) {
		assert$1.boolean(value);
		this.#internals.enableUnixSockets = value;
	}
	/**
	Throw an error if the server response's `content-length` header value doesn't match the number of bytes received.
	
	This is useful for detecting truncated responses and follows RFC 9112 requirements for message completeness.
	
	__Note__: Responses without a `content-length` header are not validated.
	__Note__: When enabled and validation fails, a `ReadError` with code `ERR_HTTP_CONTENT_LENGTH_MISMATCH` will be thrown.
	
	@default true
	*/
	get strictContentLength() {
		return this.#internals.strictContentLength;
	}
	set strictContentLength(value) {
		assert$1.boolean(value);
		this.#internals.strictContentLength = value;
	}
	toJSON() {
		return { ...this.#internals };
	}
	[Symbol.for("nodejs.util.inspect.custom")](_depth, options) {
		return inspect(this.#internals, options);
	}
	createNativeRequestOptions() {
		const internals = this.#internals;
		const url = internals.url;
		let agent;
		if (url.protocol === "https:") {
			if (internals.http2) agent = {
				...internals.agent,
				http2: internals.agent.http2 ?? import_source.default.globalAgent
			};
			else agent = internals.agent.https;
		} else agent = internals.agent.http;
		const { https } = internals;
		let { pfx } = https;
		if (is.array(pfx) && is.plainObject(pfx[0])) pfx = pfx.map((object) => ({
			buf: object.buffer,
			passphrase: object.passphrase
		}));
		const unixSocketPath = getUnixSocketPath(url);
		if (usesUnixSocket(url) && !internals.enableUnixSockets) throw new Error("Using UNIX domain sockets but option `enableUnixSockets` is not enabled");
		let unixSocketGroups;
		if (unixSocketPath !== void 0) unixSocketGroups = new RegExp("^(?<socketPath>[^:]+):(?<path>.+)$", "v").exec(`${url.pathname}${url.search}`)?.groups;
		const unixOptions = unixSocketGroups ? {
			socketPath: unixSocketGroups.socketPath,
			path: unixSocketGroups.path,
			host: ""
		} : void 0;
		return {
			...internals.cacheOptions,
			...unixOptions,
			ALPNProtocols: https.alpnProtocols,
			ca: https.certificateAuthority,
			cert: https.certificate,
			key: https.key,
			passphrase: https.passphrase,
			pfx,
			rejectUnauthorized: https.rejectUnauthorized,
			checkServerIdentity: https.checkServerIdentity ?? checkServerIdentity,
			servername: https.serverName,
			ciphers: https.ciphers,
			honorCipherOrder: https.honorCipherOrder,
			minVersion: https.minVersion,
			maxVersion: https.maxVersion,
			sigalgs: https.signatureAlgorithms,
			sessionTimeout: https.tlsSessionLifetime,
			dhparam: https.dhparam,
			ecdhCurve: https.ecdhCurve,
			crl: https.certificateRevocationLists,
			secureOptions: https.secureOptions,
			lookup: internals.dnsLookup ?? internals.dnsCache?.lookup,
			family: internals.dnsLookupIpVersion,
			agent,
			setHost: internals.setHost,
			method: internals.method,
			maxHeaderSize: internals.maxHeaderSize,
			localAddress: internals.localAddress,
			headers: internals.headers,
			createConnection: internals.createConnection,
			timeout: internals.http2 ? getHttp2TimeoutOption(internals) : void 0,
			h2session: internals.h2session
		};
	}
	getRequestFunction() {
		const { request: customRequest } = this.#internals;
		if (!customRequest) return this.#getFallbackRequestFunction();
		const requestWithFallback = (url, options, callback) => {
			const result = customRequest(url, options, callback);
			if (is.promise(result)) return this.#resolveRequestWithFallback(result, url, options, callback);
			if (result !== void 0) return result;
			return this.#callFallbackRequest(url, options, callback);
		};
		return requestWithFallback;
	}
	freeze() {
		const options = this.#internals;
		Object.freeze(options);
		Object.freeze(options.hooks);
		Object.freeze(options.hooks.afterResponse);
		Object.freeze(options.hooks.beforeError);
		Object.freeze(options.hooks.beforeRedirect);
		Object.freeze(options.hooks.beforeRequest);
		Object.freeze(options.hooks.beforeRetry);
		Object.freeze(options.hooks.init);
		Object.freeze(options.https);
		Object.freeze(options.cacheOptions);
		Object.freeze(options.agent);
		Object.freeze(options.headers);
		Object.freeze(options.timeout);
		Object.freeze(options.retry);
		Object.freeze(options.retry.errorCodes);
		Object.freeze(options.retry.methods);
		Object.freeze(options.retry.statusCodes);
	}
	#createHeadersProxy() {
		return new Proxy(this.#internals.headers, {
			get(target, property, receiver) {
				if (typeof property === "string") {
					if (Reflect.has(target, property)) return Reflect.get(target, property, receiver);
					const normalizedProperty = property.toLowerCase();
					return Reflect.get(target, normalizedProperty, receiver);
				}
				return Reflect.get(target, property, receiver);
			},
			set: (target, property, value) => {
				if (typeof property === "string") {
					const normalizedProperty = property.toLowerCase();
					assertValidHeaderName(normalizedProperty);
					const isSuccess = Reflect.set(target, normalizedProperty, value);
					if (isSuccess) markHeaderAsExplicit(this.#explicitHeaders, this.#trackedStateMutations, normalizedProperty);
					return isSuccess;
				}
				return Reflect.set(target, property, value);
			},
			deleteProperty: (target, property) => {
				if (typeof property === "string") {
					const normalizedProperty = property.toLowerCase();
					const isSuccess = Reflect.deleteProperty(target, normalizedProperty);
					if (isSuccess) {
						this.#explicitHeaders.delete(normalizedProperty);
						trackStateMutation(this.#trackedStateMutations, normalizedProperty);
					}
					return isSuccess;
				}
				return Reflect.deleteProperty(target, property);
			}
		});
	}
	#getFallbackRequestFunction() {
		const url = this.#internals.url;
		if (!url) return;
		if (url.protocol === "https:") {
			if (this.#internals.http2) {
				if (major < 15 || major === 15 && minor < 10) {
					const error = /* @__PURE__ */ new Error("To use the `http2` option, install Node.js 15.10.0 or above");
					error.code = "EUNSUPPORTED";
					throw error;
				}
				return import_source.default.auto;
			}
			return nodeHTTPS.request;
		}
		return nodeHTTP.request;
	}
	#callFallbackRequest(url, options, callback) {
		const fallbackRequest = this.#getFallbackRequestFunction();
		if (!fallbackRequest) throw new TypeError("The request function must return a value");
		const fallbackResult = fallbackRequest(url, options, callback);
		if (fallbackResult === void 0) throw new TypeError("The request function must return a value");
		if (is.promise(fallbackResult)) return this.#resolveFallbackRequestResult(fallbackResult);
		return fallbackResult;
	}
	async #resolveRequestWithFallback(requestResult, url, options, callback) {
		const result = await requestResult;
		if (result !== void 0) return result;
		return this.#callFallbackRequest(url, options, callback);
	}
	async #resolveFallbackRequestResult(fallbackResult) {
		const resolvedFallbackResult = await fallbackResult;
		if (resolvedFallbackResult === void 0) throw new TypeError("The request function must return a value");
		return resolvedFallbackResult;
	}
};
var snapshotCrossOriginState = (options) => ({
	headers: { ...options.getInternalHeaders() },
	hadCookieJar: options.cookieJar !== void 0,
	cookieWasExplicitlySet: options.isHeaderExplicitlySet("cookie"),
	username: options.username,
	password: options.password,
	body: options.body,
	json: options.json,
	form: options.form,
	bodySnapshot: cloneCrossOriginBodyValue(options.body),
	jsonSnapshot: cloneCrossOriginBodyValue(options.json),
	formSnapshot: cloneCrossOriginBodyValue(options.form)
});
var cloneCrossOriginBodyValue = (value) => {
	if (value === void 0 || value === null || typeof value !== "object") return value;
	try {
		return structuredClone(value);
	} catch {
		return;
	}
};
var isUnchangedCrossOriginBodyValue = (currentValue, previousValue, previousSnapshot) => {
	if (currentValue !== previousValue) return false;
	if (currentValue === void 0 || currentValue === null || typeof currentValue !== "object") return true;
	if (previousSnapshot === void 0) return true;
	return isDeepStrictEqual(currentValue, previousSnapshot);
};
var isCrossOriginCredentialChanged = (previousUrl, nextUrl, credential) => nextUrl[credential] !== "" && nextUrl[credential] !== previousUrl[credential];
var isBodyUnchanged = (options, previousState) => isUnchangedCrossOriginBodyValue(options.body, previousState.body, previousState.bodySnapshot) && isUnchangedCrossOriginBodyValue(options.json, previousState.json, previousState.jsonSnapshot) && isUnchangedCrossOriginBodyValue(options.form, previousState.form, previousState.formSnapshot);
//#endregion
//#region node_modules/got/dist/source/core/response.js
var decodedBodyCache = /* @__PURE__ */ new WeakMap();
var textDecoder = new TextDecoder();
var isUtf8Encoding = (encoding) => encoding === void 0 || encoding.toLowerCase().replace("-", "") === "utf8";
var decodeUint8Array = (data, encoding) => {
	if (isUtf8Encoding(encoding)) return textDecoder.decode(data);
	return Buffer$1.from(data).toString(encoding);
};
var isResponseOk = (response) => {
	const { statusCode } = response;
	const { followRedirect } = response.request.options;
	const limitStatusCode = (typeof followRedirect === "function" ? followRedirect(response) : followRedirect) ? 299 : 399;
	return statusCode >= 200 && statusCode <= limitStatusCode || statusCode === 304;
};
/**
An error to be thrown when server response code is 2xx, and parsing body fails.
Includes a `response` property.
*/
var ParseError = class extends RequestError {
	name = "ParseError";
	code = "ERR_BODY_PARSE_FAILURE";
	constructor(error, response) {
		const { options } = response.request;
		super(`${error.message} in "${stripUrlAuth(options.url)}"`, error, response.request);
	}
};
var cacheDecodedBody = (response, decodedBody) => {
	decodedBodyCache.set(response, decodedBody);
};
var parseBody = (response, responseType, parseJson, encoding) => {
	const { rawBody } = response;
	const cachedDecodedBody = decodedBodyCache.get(response);
	try {
		if (responseType === "text") {
			if (cachedDecodedBody !== void 0) return cachedDecodedBody;
			return decodeUint8Array(rawBody, encoding);
		}
		if (responseType === "json") {
			if (rawBody.length === 0) return "";
			return parseJson(cachedDecodedBody ?? decodeUint8Array(rawBody, encoding));
		}
		if (responseType === "buffer") return rawBody;
	} catch (error) {
		throw new ParseError(error, response);
	}
	throw new ParseError({
		message: `Unknown body type '${responseType}'`,
		name: "Error"
	}, response);
};
//#endregion
//#region node_modules/got/dist/source/core/utils/is-client-request.js
function isClientRequest(clientRequest) {
	return clientRequest.writable && !clientRequest.writableEnded;
}
//#endregion
//#region node_modules/got/dist/source/core/diagnostics-channel.js
var channels = {
	requestCreate: diagnosticsChannel.channel("got:request:create"),
	requestStart: diagnosticsChannel.channel("got:request:start"),
	responseStart: diagnosticsChannel.channel("got:response:start"),
	responseEnd: diagnosticsChannel.channel("got:response:end"),
	retry: diagnosticsChannel.channel("got:request:retry"),
	error: diagnosticsChannel.channel("got:request:error"),
	redirect: diagnosticsChannel.channel("got:response:redirect")
};
function generateRequestId() {
	return randomUUID();
}
var publishToChannel = (channel, message) => {
	if (channel.hasSubscribers) channel.publish(message);
};
function publishRequestCreate(message) {
	publishToChannel(channels.requestCreate, message);
}
function publishRequestStart(message) {
	publishToChannel(channels.requestStart, message);
}
function publishResponseStart(message) {
	publishToChannel(channels.responseStart, message);
}
function publishResponseEnd(message) {
	publishToChannel(channels.responseEnd, message);
}
function publishRetry(message) {
	publishToChannel(channels.retry, message);
}
function publishError(message) {
	publishToChannel(channels.error, message);
}
function publishRedirect(message) {
	publishToChannel(channels.redirect, message);
}
//#endregion
//#region node_modules/got/dist/source/core/index.js
var supportsBrotli = is.string(process$1.versions.brotli);
var supportsZstd = is.string(process$1.versions.zstd);
var methodsWithoutBody = /* @__PURE__ */ new Set(["GET", "HEAD"]);
var singleValueRequestHeaders = /* @__PURE__ */ new Set([
	"authorization",
	"content-length",
	"proxy-authorization"
]);
var cacheableStore = new WeakableMap();
var redirectCodes = /* @__PURE__ */ new Set([
	301,
	302,
	303,
	307,
	308
]);
var transientWriteErrorCodes = /* @__PURE__ */ new Set(["EPIPE", "ECONNRESET"]);
var omittedPipedHeaders = /* @__PURE__ */ new Set([
	"host",
	"connection",
	"keep-alive",
	"proxy-authenticate",
	"proxy-authorization",
	"proxy-connection",
	"te",
	"trailer",
	"transfer-encoding",
	"upgrade"
]);
var errorsProcessedByHooks = /* @__PURE__ */ new WeakSet();
var proxiedRequestEvents$1 = [
	"socket",
	"connect",
	"continue",
	"information",
	"upgrade"
];
var noop = () => {};
var serializeNativeFormDataBody = (form) => {
	const response = new globalThis.Response(form);
	return {
		body: response.body,
		contentType: response.headers.get("content-type") ?? "multipart/form-data"
	};
};
var isNonReplayableBody = (body) => is.nodeStream(body) || typeof ReadableStream !== "undefined" && body instanceof ReadableStream || is.generator(body) || is.asyncIterable(body) && body[Symbol.asyncIterator]() === body || is.iterable(body) && body[Symbol.iterator]() === body;
var isTransientWriteError = (error) => {
	const { code } = error;
	return typeof code === "string" && transientWriteErrorCodes.has(code);
};
var getConnectionListedHeaders = (headers) => {
	const connectionListedHeaders = /* @__PURE__ */ new Set();
	for (const [header, connectionHeader] of Object.entries(headers)) {
		const normalizedHeader = header.toLowerCase();
		if (normalizedHeader !== "connection" && normalizedHeader !== "proxy-connection") continue;
		const connectionHeaderValues = Array.isArray(connectionHeader) ? connectionHeader : [connectionHeader];
		for (const value of connectionHeaderValues) {
			if (typeof value !== "string") continue;
			for (const token of value.split(",")) {
				const normalizedToken = token.trim().toLowerCase();
				if (normalizedToken.length > 0) connectionListedHeaders.add(normalizedToken);
			}
		}
	}
	return connectionListedHeaders;
};
var normalizeError = (error) => {
	if (error instanceof globalThis.Error) return error;
	if (is.object(error)) {
		const errorLike = error;
		const message = typeof errorLike.message === "string" ? errorLike.message : "Non-error object thrown";
		const normalizedError = new globalThis.Error(message, { cause: error });
		if (typeof errorLike.stack === "string") normalizedError.stack = errorLike.stack;
		if (typeof errorLike.code === "string") normalizedError.code = errorLike.code;
		if (typeof errorLike.input === "string") normalizedError.input = errorLike.input;
		return normalizedError;
	}
	return new globalThis.Error(String(error));
};
var getSanitizedUrl = (options) => options?.url ? stripUrlAuth(options.url) : "";
var makeProgress = (transferred, total) => {
	let percent = 0;
	if (total) percent = transferred / total;
	else if (total === transferred) percent = 1;
	return {
		percent,
		transferred,
		total
	};
};
var Request = class Request extends Duplex {
	["constructor"];
	_noPipe;
	options;
	response;
	requestUrl;
	redirectUrls = [];
	retryCount = 0;
	_stopReading = false;
	_stopRetry;
	_downloadedSize = 0;
	_uploadedSize = 0;
	_pipedServerResponses = /* @__PURE__ */ new Set();
	_request;
	_responseSize;
	_bodySize;
	_nativeFormDataBody;
	_unproxyEvents;
	_triggerRead = false;
	_jobs = [];
	_cancelTimeouts;
	_abortListenerDisposer;
	_flushed = false;
	_aborted = false;
	_expectedContentLength;
	_compressedBytesCount;
	_skipRequestEndInFinal = false;
	_hasWrittenBody = false;
	_hasWritableBody = false;
	_incrementalDecode;
	_requestId = generateRequestId();
	_requestInitialized = false;
	constructor(url, options, defaults) {
		super({
			autoDestroy: false,
			highWaterMark: 0
		});
		this.on("pipe", (source) => {
			if (this.options.copyPipedHeaders && source?.headers) {
				const connectionListedHeaders = getConnectionListedHeaders(source.headers);
				for (const [header, value] of Object.entries(source.headers)) {
					const normalizedHeader = header.toLowerCase();
					if (omittedPipedHeaders.has(normalizedHeader) || connectionListedHeaders.has(normalizedHeader)) continue;
					if (!this.options.shouldCopyPipedHeader(normalizedHeader)) continue;
					this.options.setPipedHeader(normalizedHeader, value);
				}
			}
		});
		this.on("newListener", (event) => {
			if (event === "retry" && this.listenerCount("retry") > 0) throw new Error("A retry listener has been attached already.");
		});
		try {
			this.options = new Options(url, options, defaults);
			if (!this.options.url) {
				if (this.options.prefixUrl === "") throw new TypeError("Missing `url` property");
				this.options.url = "";
			}
			this.requestUrl = this.options.url;
			publishRequestCreate({
				requestId: this._requestId,
				url: getSanitizedUrl(this.options),
				method: this.options.method
			});
		} catch (error) {
			const { options } = error;
			if (options) this.options = options;
			this.flush = async () => {
				this.flush = async () => {};
				process$1.nextTick(() => {
					if (this.options) this._beforeError(normalizeError(error));
					else {
						const normalizedError = normalizeError(error);
						const requestError = normalizedError instanceof RequestError ? normalizedError : new RequestError(normalizedError.message, normalizedError, this);
						this.destroy(requestError);
					}
				});
			};
			return;
		}
		const { body } = this.options;
		if (is.nodeStream(body)) body.once("error", this._onBodyError);
	}
	async flush() {
		if (this._flushed) return;
		this._flushed = true;
		try {
			this._attachAbortListener();
			if (this.destroyed) return;
			await this._finalizeBody();
			if (this.destroyed) return;
			this._hasWritableBody = this._canWriteBody();
			await this._makeRequest();
			if (this.destroyed) {
				this._request?.destroy();
				return;
			}
			for (const job of this._jobs) job();
			this._jobs.length = 0;
			this._requestInitialized = true;
		} catch (error) {
			this._beforeError(normalizeError(error));
		}
	}
	_beforeError(error) {
		if (this._stopReading) return;
		const { response, options } = this;
		const attemptCount = this.retryCount + (error.name === "RetryError" ? 0 : 1);
		this._stopReading = true;
		if (!(error instanceof RequestError)) error = new RequestError(error.message, error, this);
		const typedError = error;
		(async () => {
			if (response?.readable && !response.rawBody && !this._request?.socket?.destroyed) {
				response.setEncoding(this.readableEncoding);
				if (await this._setRawBody(response)) response.body = decodeUint8Array(response.rawBody);
			}
			if (this.listenerCount("retry") !== 0) {
				let backoff;
				try {
					let retryAfter;
					if (response && "retry-after" in response.headers) {
						retryAfter = Number(response.headers["retry-after"]);
						if (Number.isNaN(retryAfter)) {
							retryAfter = Date.parse(response.headers["retry-after"]) - Date.now();
							if (retryAfter <= 0) retryAfter = 1;
						} else retryAfter *= 1e3;
					}
					const retryOptions = options.retry;
					const computedValue = calculateRetryDelay({
						attemptCount,
						retryOptions,
						error: typedError,
						retryAfter,
						computedValue: retryOptions.maxRetryAfter ?? options.timeout.request ?? Number.POSITIVE_INFINITY
					});
					if (retryOptions.enforceRetryRules && computedValue === 0) backoff = 0;
					else backoff = await retryOptions.calculateDelay({
						attemptCount,
						retryOptions,
						error: typedError,
						retryAfter,
						computedValue
					});
				} catch (error_) {
					const normalizedError = normalizeError(error_);
					this._error(new RequestError(normalizedError.message, normalizedError, this));
					return;
				}
				if (backoff) {
					await new Promise((resolve) => {
						const timeout = setTimeout(resolve, backoff);
						this._stopRetry = () => {
							clearTimeout(timeout);
							resolve();
						};
					});
					if (this.destroyed) return;
					const bodyBeforeHooks = this.options.body;
					try {
						for (const hook of this.options.hooks.beforeRetry) await hook(typedError, this.retryCount + 1);
					} catch (error_) {
						const normalizedError = normalizeError(error_);
						this._error(new RequestError(normalizedError.message, normalizedError, this));
						return;
					}
					if (this.destroyed) return;
					const bodyAfterHooks = this.options.body;
					const bodyWasReassigned = bodyBeforeHooks !== bodyAfterHooks;
					try {
						if (bodyWasReassigned) {
							const oldBody = bodyBeforeHooks;
							this.options.body = void 0;
							this.destroy();
							if (is.nodeStream(oldBody) && oldBody !== bodyAfterHooks) oldBody.destroy();
							if (is.nodeStream(bodyAfterHooks) && (bodyAfterHooks.readableEnded || bodyAfterHooks.destroyed)) throw new TypeError("The reassigned stream body must be readable. Ensure you provide a fresh, readable stream in the beforeRetry hook.");
							this.options.body = bodyAfterHooks;
						} else this.destroy();
					} catch (error_) {
						const normalizedError = normalizeError(error_);
						this._error(new RequestError(normalizedError.message, normalizedError, this));
						return;
					}
					publishRetry({
						requestId: this._requestId,
						retryCount: this.retryCount + 1,
						error: typedError,
						delay: backoff
					});
					this.emit("retry", this.retryCount + 1, error, (updatedOptions) => {
						const request = new Request(void 0, updatedOptions, options);
						request.retryCount = this.retryCount + 1;
						process$1.nextTick(() => {
							request.flush();
						});
						return request;
					});
					return;
				}
			}
			this._error(typedError);
		})();
	}
	_read() {
		this._triggerRead = true;
		const { response } = this;
		if (response && !this._stopReading) {
			if (response.readableLength) this._triggerRead = false;
			let data;
			while ((data = response.read()) !== null) {
				this._downloadedSize += data.length;
				if (this._incrementalDecode) try {
					const decodedChunk = typeof data === "string" ? data : this._incrementalDecode.decoder.decode(data, { stream: true });
					if (decodedChunk.length > 0) this._incrementalDecode.chunks.push(decodedChunk);
				} catch {
					this._incrementalDecode = void 0;
				}
				const progress = this.downloadProgress;
				if (progress.percent < 1) this.emit("downloadProgress", progress);
				if (this._stopReading) return;
				this.push(data);
				if (this._stopReading) return;
			}
		}
	}
	_write(chunk, encoding, callback) {
		this._hasWrittenBody = true;
		const write = () => {
			this._writeRequest(chunk, encoding, callback);
		};
		if (this._requestInitialized) write();
		else this._jobs.push(write);
	}
	_final(callback) {
		const endRequest = () => {
			if (this._skipRequestEndInFinal) {
				this._skipRequestEndInFinal = false;
				callback();
				return;
			}
			const request = this._request;
			if (!request || request.destroyed) {
				this._hasWritableBody = false;
				callback();
				return;
			}
			request.end((error) => {
				if (request?._writableState?.errored) return;
				if (!error) this._emitUploadComplete(request);
				this._hasWritableBody = false;
				callback(error);
			});
		};
		if (this._requestInitialized) endRequest();
		else this._jobs.push(endRequest);
	}
	_destroy(error, callback) {
		this._stopReading = true;
		this.flush = async () => {};
		this._stopRetry?.();
		this._cancelTimeouts?.();
		this._abortListenerDisposer?.[Symbol.dispose]();
		if (this.options) {
			const { body } = this.options;
			if (is.nodeStream(body)) body.destroy();
		}
		if (this._request) this._request.destroy();
		const timings = this._request?.timings;
		if (timings && is.undefined(timings.end) && !is.undefined(timings.response) && is.undefined(timings.error) && is.undefined(timings.abort)) {
			timings.end = Date.now();
			if (is.undefined(timings.phases.total)) {
				timings.phases.download = timings.end - timings.response;
				timings.phases.total = timings.end - timings.start;
			}
		}
		if (error !== null && !is.undefined(error)) {
			if (!(error instanceof Error && errorsProcessedByHooks.has(error)) && !(error instanceof RequestError)) error = error instanceof Error ? new RequestError(error.message, error, this) : new RequestError(String(error), {}, this);
		}
		callback(error);
	}
	pipe(destination, options) {
		if (destination instanceof ServerResponse) this._pipedServerResponses.add(destination);
		return super.pipe(destination, options);
	}
	unpipe(destination) {
		if (destination instanceof ServerResponse) this._pipedServerResponses.delete(destination);
		super.unpipe(destination);
		return this;
	}
	_attachAbortListener() {
		if (this._abortListenerDisposer) return;
		const { signal } = this.options;
		if (!signal) return;
		const abort = () => {
			if (signal.reason?.name === "TimeoutError") this.destroy(new TimeoutError$1(signal.reason, this.timings, this));
			else this.destroy(new AbortError(this));
		};
		if (signal.aborted) abort();
		else this._abortListenerDisposer = addAbortListener(signal, abort);
	}
	_shouldIncrementallyDecodeBody() {
		const { responseType, encoding } = this.options;
		return Boolean(this._noPipe) && (responseType === "text" || responseType === "json") && isUtf8Encoding(encoding) && typeof globalThis.TextDecoder === "function";
	}
	_checkContentLengthMismatch() {
		if (this.options.strictContentLength && this._expectedContentLength !== void 0) {
			const actualSize = this._compressedBytesCount ?? this._downloadedSize;
			if (actualSize !== this._expectedContentLength) {
				this._beforeError(new ReadError({
					message: `Content-Length mismatch: expected ${this._expectedContentLength} bytes, received ${actualSize} bytes`,
					name: "Error",
					code: "ERR_HTTP_CONTENT_LENGTH_MISMATCH"
				}, this));
				return true;
			}
		}
		return false;
	}
	async _finalizeBody() {
		const { options } = this;
		const headers = options.getInternalHeaders();
		const isForm = !is.undefined(options.form);
		const isJSON = !is.undefined(options.json);
		const isBody = !is.undefined(options.body);
		const cannotHaveBody = !this._methodCanHaveBody;
		if (isForm || isJSON || isBody) {
			if (cannotHaveBody) throw new TypeError(`The \`${options.method}\` method cannot be used with a body`);
			const noContentType = !is.string(headers["content-type"]);
			if (isBody) {
				if (options.body instanceof FormData) {
					const { body, contentType } = serializeNativeFormDataBody(options.body);
					this._nativeFormDataBody = {
						form: options.body,
						body,
						contentTypeWasGenerated: noContentType
					};
					if (noContentType) headers["content-type"] = contentType;
					options.body = body;
				} else if (Object.prototype.toString.call(options.body) === "[object FormData]") throw new TypeError("Non-native FormData is not supported. Use globalThis.FormData instead.");
			} else if (isForm) {
				if (noContentType) headers["content-type"] = "application/x-www-form-urlencoded";
				const { form } = options;
				options.form = void 0;
				options.body = new URLSearchParams(form).toString();
			} else {
				if (noContentType) headers["content-type"] = "application/json";
				const { json } = options;
				options.json = void 0;
				options.body = options.stringifyJson(json);
			}
			const uploadBodySize = getBodySize(options.body, headers);
			if (is.undefined(headers["content-length"]) && is.undefined(headers["transfer-encoding"]) && !cannotHaveBody && !is.undefined(uploadBodySize)) headers["content-length"] = String(uploadBodySize);
		}
		if (options.responseType === "json" && !("accept" in headers)) headers.accept = "application/json";
		this._bodySize = Number(headers["content-length"]) || void 0;
	}
	async _onResponseBase(response) {
		if (this.isAborted) return;
		const { options } = this;
		const { url } = options;
		const nativeResponse = response;
		const statusCode = response.statusCode;
		const { method } = options;
		const redirectLocationHeader = response.headers.location;
		const redirectLocation = Array.isArray(redirectLocationHeader) ? redirectLocationHeader[0] : redirectLocationHeader;
		const isRedirect = Boolean(redirectLocation && redirectCodes.has(statusCode));
		const hasNoBody = method === "HEAD" || statusCode >= 100 && statusCode < 200 || statusCode === 204 || statusCode === 205 || statusCode === 304;
		const prepareResponse = (response) => {
			if (!Object.hasOwn(response, "headers")) Object.defineProperty(response, "headers", {
				value: response.headers,
				enumerable: true,
				writable: true,
				configurable: true
			});
			response.statusMessage ||= nodeHTTP.STATUS_CODES[statusCode];
			response.url = stripUrlAuth(options.url);
			response.requestUrl = this.requestUrl;
			response.redirectUrls = this.redirectUrls;
			response.request = this;
			response.isFromCache = nativeResponse.fromCache ?? false;
			response.ip = this.ip;
			response.retryCount = this.retryCount;
			response.ok = isResponseOk(response);
			return response;
		};
		let typedResponse = prepareResponse(response);
		const shouldFollowRedirect = isRedirect && (typeof options.followRedirect === "function" ? options.followRedirect(typedResponse) : options.followRedirect);
		if (options.decompress && !hasNoBody && !shouldFollowRedirect) {
			if (options.strictContentLength) {
				this._compressedBytesCount = 0;
				nativeResponse.on("data", (chunk) => {
					this._compressedBytesCount += byteLength(chunk);
				});
			}
			response = decompressResponse(response);
			typedResponse = prepareResponse(response);
		}
		const wasDecompressed = response !== nativeResponse;
		this._responseSize = Number(response.headers["content-length"]) || void 0;
		this.response = typedResponse;
		this._incrementalDecode = this._shouldIncrementallyDecodeBody() ? {
			decoder: new globalThis.TextDecoder("utf8", { ignoreBOM: true }),
			chunks: []
		} : void 0;
		publishResponseStart({
			requestId: this._requestId,
			url: typedResponse.url,
			statusCode,
			headers: response.headers,
			isFromCache: typedResponse.isFromCache
		});
		response.once("error", (error) => {
			if (!wasDecompressed && response.complete && this._responseSize === void 0 && error.code === "ECONNRESET") return;
			this._aborted = true;
			this._beforeError(new ReadError(error, this));
		});
		response.once("aborted", () => {
			if (this._responseSize === void 0 && nativeResponse.complete) return;
			this._aborted = true;
			if (!this._checkContentLengthMismatch()) this._beforeError(new ReadError({
				name: "Error",
				message: "The server aborted pending request",
				code: "ECONNRESET"
			}, this));
		});
		let canFinalizeResponse = false;
		const handleResponseEnd = () => {
			if (!canFinalizeResponse || !response.readableEnded) return;
			canFinalizeResponse = false;
			if (this._stopReading) return;
			if (this._checkContentLengthMismatch()) return;
			this._responseSize = this._downloadedSize;
			this.emit("downloadProgress", this.downloadProgress);
			publishResponseEnd({
				requestId: this._requestId,
				url: typedResponse.url,
				statusCode,
				bodySize: this._downloadedSize,
				timings: this.timings
			});
			this.push(null);
		};
		if (!shouldFollowRedirect) response.once("end", handleResponseEnd);
		const noPipeCookieJarRawBodyPromise = this._noPipe && is.object(options.cookieJar) && !isRedirect ? this._setRawBody(response) : void 0;
		const rawCookies = response.headers["set-cookie"];
		if (is.object(options.cookieJar) && rawCookies) {
			let promises = rawCookies.map(async (rawCookie) => options.cookieJar.setCookie(rawCookie, url.toString()));
			if (options.ignoreInvalidCookies) promises = promises.map(async (promise) => {
				try {
					await promise;
				} catch {}
			});
			try {
				await Promise.all(promises);
			} catch (error) {
				this._beforeError(normalizeError(error));
				return;
			}
		}
		if (this.isAborted) return;
		if (shouldFollowRedirect) {
			response.resume();
			this._cancelTimeouts?.();
			this._unproxyEvents?.();
			if (this.redirectUrls.length >= options.maxRedirects) {
				this._beforeError(new MaxRedirectsError(this));
				return;
			}
			this._request = void 0;
			this._downloadedSize = 0;
			this._uploadedSize = 0;
			const updatedOptions = new Options(void 0, void 0, this.options);
			try {
				const redirectBuffer = Buffer$1.from(redirectLocation, "binary").toString();
				const redirectUrl = new URL(redirectBuffer, url);
				const currentUnixSocketPath = getUnixSocketPath(url);
				const redirectUnixSocketPath = getUnixSocketPath(redirectUrl);
				if (redirectUrl.protocol === "unix:" && redirectUnixSocketPath === void 0) {
					this._beforeError(new RequestError("Cannot redirect to UNIX socket", {}, this));
					return;
				}
				if (redirectUnixSocketPath !== void 0 && currentUnixSocketPath !== redirectUnixSocketPath) {
					this._beforeError(new RequestError("Cannot redirect to UNIX socket", {}, this));
					return;
				}
				const isDifferentOrigin = redirectUrl.origin !== url.origin || currentUnixSocketPath !== redirectUnixSocketPath;
				const serverRequestedGet = statusCode === 303 && updatedOptions.method !== "GET" && updatedOptions.method !== "HEAD";
				const crossOriginRequestedGet = isDifferentOrigin && (statusCode === 301 || statusCode === 302) && updatedOptions.method === "POST";
				const canRewrite = statusCode !== 307 && statusCode !== 308;
				const userRequestedGet = updatedOptions.methodRewriting && canRewrite;
				if (serverRequestedGet || crossOriginRequestedGet || userRequestedGet) {
					updatedOptions.method = "GET";
					this._dropBody(updatedOptions);
				} else if (isDifferentOrigin && canRewrite && this._hasBodyForRedirect(updatedOptions)) this._dropBody(updatedOptions);
				if (isDifferentOrigin) this._stripCrossOriginState(updatedOptions, redirectUrl);
				else {
					redirectUrl.username = updatedOptions.username;
					redirectUrl.password = updatedOptions.password;
				}
				const { allowAbsoluteUrls } = updatedOptions;
				try {
					updatedOptions.allowAbsoluteUrls = true;
					updatedOptions.url = redirectUrl;
				} finally {
					updatedOptions.allowAbsoluteUrls = allowAbsoluteUrls;
				}
				this.redirectUrls.push(redirectUrl);
				const boundaryBeforeRedirectHooks = getUrlPrefixBoundary(updatedOptions);
				const bodyBeforeRedirectHooks = updatedOptions.body;
				const preHookState = isDifferentOrigin ? void 0 : {
					...snapshotCrossOriginState(updatedOptions),
					url: new URL(updatedOptions.url)
				};
				const changedState = await updatedOptions.trackStateMutations(async (changedState) => {
					for (const hook of updatedOptions.hooks.beforeRedirect) await hook(updatedOptions, typedResponse);
					return changedState;
				});
				if (hasUrlOrPrefixUrlBoundaryChanged(updatedOptions, updatedOptions.url, boundaryBeforeRedirectHooks)) assertUrlHasSameOriginAsPrefixUrlIfNeeded(updatedOptions, updatedOptions.url);
				updatedOptions.clearUnchangedCookieHeader(preHookState, changedState);
				const nativeFormDataBody = this._nativeFormDataBody;
				if (statusCode === 307 || statusCode === 308) {
					const bodyUnchangedByHooks = updatedOptions.body === bodyBeforeRedirectHooks;
					const wasNonReplayable = isNonReplayableBody(bodyBeforeRedirectHooks);
					if (!bodyUnchangedByHooks && wasNonReplayable) this._destroyBody(bodyBeforeRedirectHooks);
					else if (bodyUnchangedByHooks && nativeFormDataBody !== void 0 && updatedOptions.body === nativeFormDataBody.body) {
						const { body, contentType } = serializeNativeFormDataBody(nativeFormDataBody.form);
						nativeFormDataBody.body = body;
						updatedOptions.body = body;
						if (changedState.has("content-type")) nativeFormDataBody.contentTypeWasGenerated = false;
						else if (nativeFormDataBody.contentTypeWasGenerated) updatedOptions.setInternalHeader("content-type", contentType);
					} else if (bodyUnchangedByHooks && (wasNonReplayable || is.undefined(updatedOptions.body) && (this._hasWrittenBody || this._hasWritableBody))) {
						this._dropBody(updatedOptions);
						this._beforeError(new RequestError("Cannot follow redirect with a non-replayable body", {}, this));
						return;
					}
				}
				if (!isDifferentOrigin) {
					const state = preHookState;
					const hookUrl = updatedOptions.url;
					const hookChangedOrigin = !isSameOrigin(state.url, hookUrl);
					if (hookChangedOrigin && (statusCode === 301 || statusCode === 302) && updatedOptions.method === "POST") {
						updatedOptions.method = "GET";
						this._dropBody(updatedOptions);
					}
					if (hookChangedOrigin) {
						if (canRewrite && this._hasUnchangedBodyForRedirect(updatedOptions, state, changedState)) this._dropBody(updatedOptions);
						this._stripUnchangedCrossOriginState(updatedOptions, hookUrl, {
							...state,
							changedState,
							preserveUsername: hasExplicitCredentialInUrlChange(changedState, hookUrl, "username") || isCrossOriginCredentialChanged(state.url, hookUrl, "username"),
							preservePassword: hasExplicitCredentialInUrlChange(changedState, hookUrl, "password") || isCrossOriginCredentialChanged(state.url, hookUrl, "password")
						});
					}
				}
				publishRedirect({
					requestId: this._requestId,
					fromUrl: url.toString(),
					toUrl: updatedOptions.url.toString(),
					statusCode
				});
				this.emit("redirect", updatedOptions, typedResponse);
				this.options = updatedOptions;
				await this._makeRequest();
			} catch (error) {
				this._beforeError(normalizeError(error));
				return;
			}
			return;
		}
		canFinalizeResponse = true;
		handleResponseEnd();
		if (options.isStream && options.throwHttpErrors && !isResponseOk(typedResponse)) {
			this._beforeError(new HTTPError(typedResponse));
			return;
		}
		if (!hasNoBody && (!wasDecompressed || options.strictContentLength)) {
			const contentLengthHeader = nativeResponse.headers["content-length"];
			if (contentLengthHeader !== void 0) {
				const expectedLength = Number(contentLengthHeader);
				if (!Number.isNaN(expectedLength) && expectedLength >= 0) this._expectedContentLength = expectedLength;
			}
		}
		this.emit("downloadProgress", this.downloadProgress);
		response.on("readable", () => {
			if (this._triggerRead) this._read();
		});
		this.on("resume", () => {
			response.resume();
		});
		this.on("pause", () => {
			response.pause();
		});
		if (this._noPipe) {
			const captureFromResponse = response.readableEnded || noPipeCookieJarRawBodyPromise !== void 0;
			const success = noPipeCookieJarRawBodyPromise ? await noPipeCookieJarRawBodyPromise : await this._setRawBody(captureFromResponse ? response : this);
			if (captureFromResponse) handleResponseEnd();
			if (success) this.emit("response", response);
			return;
		}
		this.emit("response", response);
		for (const destination of this._pipedServerResponses) {
			if (destination.headersSent) continue;
			for (const key in response.headers) if (Object.hasOwn(response.headers, key)) {
				const value = response.headers[key];
				if (wasDecompressed && (key === "content-encoding" || key === "content-length")) continue;
				if (value !== void 0) destination.setHeader(key, value);
			}
			destination.statusCode = statusCode;
		}
	}
	async _setRawBody(from = this) {
		try {
			const fromArray = await from.toArray();
			const rawBody = fromArray.some((chunk) => typeof chunk !== "string") ? concatUint8Arrays(fromArray.map((chunk) => typeof chunk === "string" ? stringToUint8Array(chunk) : chunk)) : stringToUint8Array(fromArray.join(""));
			const shouldUseIncrementalDecodedBody = from === this && this._incrementalDecode !== void 0;
			if (!this.isAborted && this.response) {
				this.response.rawBody = rawBody;
				if (from !== this) this._downloadedSize = rawBody.byteLength;
				if (shouldUseIncrementalDecodedBody) try {
					const { decoder, chunks } = this._incrementalDecode;
					const finalDecodedChunk = decoder.decode();
					if (finalDecodedChunk.length > 0) chunks.push(finalDecodedChunk);
					cacheDecodedBody(this.response, chunks.join(""));
				} catch {}
				return true;
			}
		} catch {} finally {
			this._incrementalDecode = void 0;
		}
		return false;
	}
	async _onResponse(response) {
		try {
			await this._onResponseBase(response);
		} catch (error) {
			/* istanbul ignore next: better safe than sorry */
			this._beforeError(normalizeError(error));
		}
	}
	_onRequest(request) {
		const { options } = this;
		const { timeout, url } = options;
		publishRequestStart({
			requestId: this._requestId,
			url: getSanitizedUrl(this.options),
			method: options.method,
			headers: options.headers
		});
		timer(request);
		this._cancelTimeouts = timedOut(request, timeout, url);
		if (this.options.http2) {
			request.removeAllListeners("timeout");
			request.once("socket", (socket) => {
				socket.removeAllListeners("timeout");
			});
		}
		let lastRequestError;
		const responseEventName = options.cache ? "cacheableResponse" : "response";
		request.once(responseEventName, (response) => {
			this._onResponse(response);
		});
		const emitRequestError = (error) => {
			this._aborted = true;
			request.destroy();
			const wrappedError = error instanceof TimeoutError ? new TimeoutError$1(error, this.timings, this) : new RequestError(error.message, error, this);
			this._beforeError(wrappedError);
		};
		request.once("error", (error) => {
			lastRequestError = error;
			if (this._request !== request) return;
			if (isTransientWriteError(error)) {
				queueMicrotask(() => {
					if (this._isRequestStale(request)) return;
					emitRequestError(error);
				});
				return;
			}
			emitRequestError(error);
		});
		if (!options.cache) request.once("close", () => {
			if (this._request !== request || Boolean(request.res) || this._stopReading) return;
			this._beforeError(lastRequestError ?? new ReadError({
				name: "Error",
				message: "The server aborted pending request",
				code: "ECONNRESET"
			}, this));
		});
		this._unproxyEvents = proxyEvents(request, this, proxiedRequestEvents$1);
		this._request = request;
		this.emit("uploadProgress", this.uploadProgress);
		this._sendBody();
		this.emit("request", request);
	}
	_isRequestStale(request) {
		return this._request !== request || Boolean(request.res) || request.destroyed || request.writableEnded;
	}
	async _asyncWrite(chunk, request = this) {
		return new Promise((resolve, reject) => {
			if (request === this) {
				super.write(chunk, (error) => {
					if (error) {
						reject(error);
						return;
					}
					resolve();
				});
				return;
			}
			this._writeRequest(chunk, void 0, (error) => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			}, request);
		});
	}
	_sendBody() {
		const { body } = this.options;
		const currentRequest = this.redirectUrls.length === 0 ? this : this._request ?? this;
		if (is.nodeStream(body)) body.pipe(currentRequest);
		else if (is.buffer(body)) this._writeBodyInChunks(body, currentRequest);
		else if (is.typedArray(body)) {
			const typedArray = body;
			const uint8View = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
			this._writeBodyInChunks(uint8View, currentRequest);
		} else if (is.asyncIterable(body) || is.iterable(body) && !is.string(body) && !isBuffer(body)) (async () => {
			const isInitialRequest = currentRequest === this;
			const bodyOptions = this.options;
			try {
				for await (const chunk of body) {
					if (this.options !== bodyOptions || this.options.body !== body) return;
					await this._asyncWrite(chunk, currentRequest);
					if (this.options !== bodyOptions || this.options.body !== body) return;
				}
				if (this.options === bodyOptions && this.options.body === body) {
					if (isInitialRequest) {
						super.end();
						return;
					}
					await this._endWritableRequest(currentRequest);
				}
			} catch (error) {
				if (this.options !== bodyOptions || this.options.body !== body) return;
				this._beforeError(normalizeError(error));
			}
		})();
		else if (is.undefined(body)) {
			if ((this._noPipe ?? false) || !this._methodCanHaveBody || currentRequest !== this) currentRequest.end();
		} else this._writeBodyInChunks(stringToUint8Array(body), currentRequest);
	}
	_writeBodyInChunks(buffer, currentRequest) {
		const isInitialRequest = currentRequest === this;
		(async () => {
			let request;
			try {
				request = isInitialRequest ? this._request : currentRequest;
				const activeRequest = request;
				if (!activeRequest) {
					if (isInitialRequest) super.end();
					return;
				}
				if (activeRequest.destroyed) return;
				await this._writeChunksToRequest(buffer, activeRequest);
				if (this._isRequestStale(activeRequest)) {
					this._finalizeStaleChunkedWrite(activeRequest, isInitialRequest);
					return;
				}
				if (isInitialRequest) {
					super.end();
					return;
				}
				await this._endWritableRequest(activeRequest);
			} catch (error) {
				const normalizedError = normalizeError(error);
				if (isTransientWriteError(normalizedError)) {
					if (isInitialRequest && request) {
						const initialRequest = request;
						let didFinalize = false;
						const finalizeIfStale = () => {
							if (didFinalize || !this._isRequestStale(initialRequest)) return;
							didFinalize = true;
							this._finalizeStaleChunkedWrite(initialRequest, true);
						};
						finalizeIfStale();
						if (!didFinalize) {
							initialRequest.once("response", finalizeIfStale);
							queueMicrotask(finalizeIfStale);
						}
					}
					return;
				}
				if (!isInitialRequest && this._isRequestStale(currentRequest)) return;
				this._beforeError(normalizedError);
			}
		})();
	}
	_finalizeStaleChunkedWrite(request, isInitialRequest) {
		if (!request.destroyed && !request.writableEnded) request.destroy();
		if (isInitialRequest) {
			this._skipRequestEndInFinal = true;
			super.end();
		}
	}
	_emitUploadComplete(request) {
		this._bodySize = this._uploadedSize;
		this.emit("uploadProgress", this.uploadProgress);
		request.emit("upload-complete");
	}
	async _endWritableRequest(request) {
		await new Promise((resolve, reject) => {
			request.end((error) => {
				if (error) {
					reject(error);
					return;
				}
				if (this._request === request && !request.destroyed) this._emitUploadComplete(request);
				resolve();
			});
		});
	}
	_stripCrossOriginState(options, urlToClear) {
		for (const header of crossOriginStripHeaders) options.deleteInternalHeader(header);
		options.username = "";
		options.password = "";
		urlToClear.username = "";
		urlToClear.password = "";
	}
	_stripUnchangedCrossOriginState(options, urlToClear, state) {
		const headers = options.getInternalHeaders();
		for (const header of crossOriginStripHeaders) if (!state.changedState.has(header) && headers[header] === state.headers[header]) options.deleteInternalHeader(header);
		if (!state.preserveUsername) {
			options.username = "";
			urlToClear.username = "";
		}
		if (!state.preservePassword) {
			options.password = "";
			urlToClear.password = "";
		}
	}
	get _methodCanHaveBody() {
		return !methodsWithoutBody.has(this.options.method) || this.options.method === "GET" && this.options.allowGetBody;
	}
	_canWriteBody() {
		return !this._noPipe && !this.isReadonly && this._methodCanHaveBody;
	}
	_hasBodyForRedirect(options) {
		return !is.undefined(options.body) || !is.undefined(options.json) || !is.undefined(options.form) || this._hasWrittenBody || this._hasWritableBody;
	}
	_hasUnchangedBodyForRedirect(options, state, changedState) {
		return !changedState.has("body") && !changedState.has("json") && !changedState.has("form") && this._hasBodyForRedirect(options) && isBodyUnchanged(options, state);
	}
	_dropBody(updatedOptions) {
		const { body } = this.options;
		const hadOptionBody = !is.undefined(body) || !is.undefined(this.options.json) || !is.undefined(this.options.form);
		this.options.clearBody();
		this._destroyBody(body);
		if (!hadOptionBody && !this.writableEnded) {
			this._skipRequestEndInFinal = true;
			super.end();
		}
		updatedOptions.clearBody();
		this._bodySize = void 0;
		this._hasWrittenBody = false;
		this._hasWritableBody = false;
	}
	_destroyBody(body) {
		if (is.nodeStream(body)) {
			const bodyStream = body;
			bodyStream.off("error", this._onBodyError);
			bodyStream.unpipe();
			bodyStream.on("error", noop);
			bodyStream.destroy();
		} else if (is.asyncIterable(body) || is.iterable(body) && !is.string(body) && !isBuffer(body)) {
			const iterableBody = body;
			if (typeof iterableBody.return === "function") try {
				const result = iterableBody.return();
				if (result instanceof Promise) result.catch(noop);
			} catch {}
		}
	}
	_onBodyError = (error) => {
		if (this._flushed) this._beforeError(new UploadError(error, this));
		else this.flush = async () => {
			this.flush = async () => {};
			this._beforeError(new UploadError(error, this));
		};
	};
	async _writeChunksToRequest(buffer, request) {
		const chunkSize = 65536;
		const isStale = () => this._isRequestStale(request);
		for (const part of chunk(buffer, chunkSize)) {
			if (isStale()) return;
			await new Promise((resolve, reject) => {
				this._writeRequest(part, void 0, (error) => {
					if (isStale()) {
						resolve();
						return;
					}
					if (error) reject(error);
					else setImmediate(resolve);
				}, request);
			});
		}
	}
	_prepareCache(cache) {
		if (cacheableStore.has(cache)) return;
		const cacheableRequest = new CacheableRequest(((requestOptions, handler) => {
			/**
			Wraps the cacheable-request handler to run beforeCache hooks.
			These hooks control caching behavior by:
			- Directly mutating the response object (changes apply to what gets cached)
			- Returning `false` to prevent caching
			- Returning `void`/`undefined` to use default caching behavior
			
			Hooks use direct mutation - they can modify response.headers, response.statusCode, etc.
			Mutations take effect immediately and determine what gets cached.
			*/
			const wrappedHandler = handler ? (response) => {
				const { beforeCacheHooks, gotRequest } = requestOptions;
				if (!beforeCacheHooks || beforeCacheHooks.length === 0) {
					handler(response);
					return;
				}
				try {
					for (const hook of beforeCacheHooks) {
						const result = hook(response);
						if (result === false) {
							response.headers["cache-control"] = "no-cache, no-store, must-revalidate";
							response.headers.pragma = "no-cache";
							response.headers.expires = "0";
							handler(response);
							return;
						}
						if (is.promise(result)) throw new TypeError("beforeCache hooks must be synchronous. The hook returned a Promise, but this hook must return synchronously. If you need async logic, use beforeRequest hook instead.");
						if (result !== void 0) throw new TypeError("beforeCache hook must return false or undefined. To modify the response, mutate it directly.");
					}
				} catch (error) {
					const normalizedError = normalizeError(error);
					if (gotRequest) {
						gotRequest._beforeError(normalizedError instanceof RequestError ? normalizedError : new RequestError(normalizedError.message, normalizedError, gotRequest));
						return;
					}
					console.error("Got: beforeCache hook error (request context unavailable):", normalizedError);
					handler(response);
					return;
				}
				handler(response);
			} : handler;
			const result = requestOptions._request(requestOptions, wrappedHandler);
			if (is.promise(result)) result.once = (event, handler) => {
				if (event === "error") (async () => {
					try {
						await result;
					} catch (error) {
						handler(error);
					}
				})();
				else if (event === "abort" || event === "destroy") (async () => {
					try {
						(await result).once(event, handler);
					} catch {}
				})();
				else
 /* istanbul ignore next: safety check */
				throw new Error(`Unknown HTTP2 promise event: ${event}`);
				return result;
			};
			return result;
		}), cache);
		cacheableStore.set(cache, cacheableRequest.request());
	}
	async _createCacheableRequest(url, options) {
		return new Promise((resolve, reject) => {
			Object.assign(options, {
				protocol: url.protocol,
				hostname: is.string(url.hostname) && url.hostname.startsWith("[") ? url.hostname.slice(1, -1) : url.hostname,
				host: url.host,
				hash: url.hash === "" ? "" : url.hash ?? null,
				search: url.search === "" ? "" : url.search ?? null,
				pathname: url.pathname,
				href: url.href,
				path: `${url.pathname || ""}${url.search || ""}`,
				...is.string(url.port) && url.port.length > 0 ? { port: Number(url.port) } : {},
				...url.username || url.password ? { auth: `${url.username || ""}:${url.password || ""}` } : {}
			});
			let request;
			const cacheRequest = cacheableStore.get(options.cache)(options, (response) => {
				(async () => {
					response._readableState.autoDestroy = false;
					if (request) {
						const fix = () => {
							if (response.req) response.complete = response.req.res.complete;
							else if (response.complete === void 0) response.complete = true;
						};
						response.prependOnceListener("end", fix);
						fix();
						(await request).emit("cacheableResponse", response);
					}
					resolve(response);
				})();
			});
			cacheRequest.once("error", reject);
			cacheRequest.once("request", (requestOrPromise) => {
				request = requestOrPromise;
				resolve(request);
			});
		});
	}
	async _makeRequest() {
		const { options } = this;
		const shouldDeleteGeneratedHeader = (currentHeader, generatedHeader) => currentHeader === generatedHeader || is.undefined(currentHeader);
		const syncGeneratedHeader = (name, { currentHeader, explicitHeader, nextHeader, staleGeneratedHeader }) => {
			if (!is.undefined(nextHeader)) options.setInternalHeader(name, nextHeader);
			else if (!is.undefined(explicitHeader) && currentHeader === staleGeneratedHeader) options.setInternalHeader(name, explicitHeader);
			else if (shouldDeleteGeneratedHeader(currentHeader, staleGeneratedHeader)) options.deleteInternalHeader(name);
		};
		const getAuthorizationHeader = (username, password, isExplicitlyOmitted) => !isExplicitlyOmitted && (username || password) ? `Basic ${stringToBase64(`${username}:${password}`)}` : void 0;
		const sanitizeHeaders = () => {
			const currentHeaders = options.getInternalHeaders();
			for (const key in currentHeaders) if (is.undefined(currentHeaders[key])) options.deleteInternalHeader(key);
			else if (is.null(currentHeaders[key])) throw new TypeError(`Use \`undefined\` instead of \`null\` to delete the \`${key}\` header`);
			else if (Array.isArray(currentHeaders[key]) && key === "transfer-encoding") {
				if (currentHeaders[key].length !== 1) throw new TypeError(`The \`${key}\` header must be a single value`);
				options.setInternalHeader(key, currentHeaders[key][0]);
			} else if (Array.isArray(currentHeaders[key]) && singleValueRequestHeaders.has(key)) {
				if (currentHeaders[key].length !== 1) throw new TypeError(`The \`${key}\` header must be a single value`);
				options.setInternalHeader(key, currentHeaders[key][0]);
			}
			return currentHeaders;
		};
		const getCookieHeader = async (cookieJar) => {
			if (!cookieJar) return;
			const cookieString = await cookieJar.getCookieString(options.url.toString());
			return is.nonEmptyString(cookieString) ? cookieString : void 0;
		};
		const headers = sanitizeHeaders();
		const initialHeaders = options.getInternalHeaders();
		const authorizationWasInitiallyExplicit = options.isHeaderExplicitlySet("authorization");
		const explicitAuthorizationHeader = authorizationWasInitiallyExplicit ? initialHeaders.authorization : void 0;
		const explicitCookieHeader = options.isHeaderExplicitlySet("cookie") ? initialHeaders.cookie : void 0;
		const authorizationWasInitiallyOmitted = options.isHeaderExplicitlySet("authorization") && is.undefined(initialHeaders.authorization);
		const cookieWasInitiallyOmitted = options.isHeaderExplicitlySet("cookie") && is.undefined(initialHeaders.cookie);
		if (options.decompress && is.undefined(headers["accept-encoding"])) {
			const encodings = ["gzip", "deflate"];
			if (supportsBrotli) encodings.push("br");
			if (supportsZstd) encodings.push("zstd");
			options.setInternalHeader("accept-encoding", encodings.join(", "));
		}
		const { username, password } = options;
		const cookieJar = options.cookieJar;
		const generatedAuthorizationHeader = is.undefined(explicitAuthorizationHeader) ? getAuthorizationHeader(username, password, authorizationWasInitiallyOmitted) : void 0;
		let generatedCookieHeader;
		if (!is.undefined(generatedAuthorizationHeader)) options.setInternalHeader("authorization", generatedAuthorizationHeader);
		if (!cookieWasInitiallyOmitted) {
			generatedCookieHeader = await getCookieHeader(cookieJar);
			if (!is.undefined(generatedCookieHeader)) options.setInternalHeader("cookie", generatedCookieHeader);
		}
		let request;
		let shouldOmitRequestUrlCredentials = false;
		const urlBeforeRequestHooks = options.url instanceof URL ? new URL(options.url) : void 0;
		const boundaryBeforeRequestHooks = getUrlPrefixBoundary(options);
		const changedState = await options.trackStateMutations(async (changedState) => {
			for (const hook of options.hooks.beforeRequest) {
				const result = await hook(options, { retryCount: this.retryCount });
				if (!is.undefined(result)) {
					request = () => result;
					break;
				}
			}
			return changedState;
		});
		if (urlBeforeRequestHooks && options.url instanceof URL && hasUrlOrPrefixUrlBoundaryChanged(options, options.url, boundaryBeforeRequestHooks)) assertUrlHasSameOriginAsPrefixUrlIfNeeded(options, options.url);
		if (request === void 0) {
			const currentHeaders = options.getInternalHeaders();
			const isHeaderExplicitlyOmitted = (header) => options.isHeaderExplicitlySet(header) && Object.hasOwn(currentHeaders, header) && is.undefined(currentHeaders[header]);
			const currentAuthorizationHeader = currentHeaders.authorization;
			const currentCookieHeader = currentHeaders.cookie;
			const authorizationWasExplicitlyOmitted = isHeaderExplicitlyOmitted("authorization") || authorizationWasInitiallyExplicit && is.undefined(currentAuthorizationHeader);
			const cookieWasExplicitlyOmitted = is.undefined(currentCookieHeader) && (cookieWasInitiallyOmitted || isHeaderExplicitlyOmitted("cookie"));
			sanitizeHeaders();
			if (!is.undefined(currentHeaders["transfer-encoding"]) && !is.undefined(currentHeaders["content-length"])) options.deleteInternalHeader("content-length");
			if (authorizationWasExplicitlyOmitted) {
				shouldOmitRequestUrlCredentials = true;
				options.deleteInternalHeader("authorization");
				if (changedState.has("authorization") && is.undefined(explicitAuthorizationHeader) && !authorizationWasInitiallyOmitted) delete options.headers.authorization;
			}
			const authorizationHeader = !authorizationWasInitiallyExplicit && !authorizationWasInitiallyOmitted && !authorizationWasExplicitlyOmitted ? getAuthorizationHeader(options.username, options.password, authorizationWasExplicitlyOmitted) : void 0;
			const cookieJar = options.cookieJar;
			if (changedState.has("authorization") && !is.undefined(currentAuthorizationHeader)) {} else syncGeneratedHeader("authorization", {
				currentHeader: currentAuthorizationHeader,
				explicitHeader: changedState.has("authorization") && is.undefined(currentAuthorizationHeader) ? void 0 : explicitAuthorizationHeader,
				nextHeader: authorizationHeader,
				staleGeneratedHeader: generatedAuthorizationHeader
			});
			if (cookieWasExplicitlyOmitted) {
				options.deleteInternalHeader("cookie");
				if (changedState.has("cookie") && is.undefined(explicitCookieHeader) && !cookieWasInitiallyOmitted) delete options.headers.cookie;
			} else if (changedState.has("cookie")) {} else syncGeneratedHeader("cookie", {
				currentHeader: currentCookieHeader,
				explicitHeader: explicitCookieHeader,
				nextHeader: !cookieWasInitiallyOmitted && !cookieWasExplicitlyOmitted ? await getCookieHeader(cookieJar) : void 0,
				staleGeneratedHeader: generatedCookieHeader
			});
		}
		request ??= options.getRequestFunction();
		const url = shouldOmitRequestUrlCredentials ? new URL(stripUrlAuth(options.url)) : options.url;
		this._requestOptions = options.createNativeRequestOptions();
		if (shouldOmitRequestUrlCredentials) this._requestOptions.auth = void 0;
		if (options.cache) {
			this._requestOptions._request = request;
			this._requestOptions.cache = options.cache;
			this._requestOptions.body = options.body;
			this._requestOptions.beforeCacheHooks = options.hooks.beforeCache;
			this._requestOptions.gotRequest = this;
			try {
				this._prepareCache(options.cache);
			} catch (error) {
				throw new CacheError(normalizeError(error), this);
			}
		}
		const function_ = options.cache ? this._createCacheableRequest : request;
		try {
			let requestOrResponse = function_(url, this._requestOptions);
			if (is.promise(requestOrResponse)) requestOrResponse = await requestOrResponse;
			if (isClientRequest(requestOrResponse)) this._onRequest(requestOrResponse);
			else if (this.writableEnded) this._onResponse(requestOrResponse);
			else {
				this.once("finish", () => {
					this._onResponse(requestOrResponse);
				});
				this._sendBody();
			}
		} catch (error) {
			if (error instanceof CacheError$1) throw new CacheError(error, this);
			throw error;
		}
	}
	async _error(error) {
		try {
			if (this.options && (!(error instanceof HTTPError) || this.options.throwHttpErrors)) {
				const hooks = this.options.hooks.beforeError;
				if (hooks.length > 0) {
					for (const hook of hooks) {
						error = await hook(error);
						if (!(error instanceof Error)) throw new TypeError(`The \`beforeError\` hook must return an Error instance. Received ${is.string(error) ? "string" : String(typeof error)}.`);
					}
					if (!(error instanceof RequestError)) errorsProcessedByHooks.add(error);
				}
			}
		} catch (error_) {
			const normalizedError = normalizeError(error_);
			error = new RequestError(normalizedError.message, normalizedError, this);
		}
		publishError({
			requestId: this._requestId,
			url: getSanitizedUrl(this.options),
			error,
			timings: this.timings
		});
		this.destroy(error);
		if (this._noPipe) process$1.nextTick(() => {
			this.emit("error", error);
		});
	}
	_writeRequest(chunk, encoding, callback, request = this._request) {
		if (!request || request.destroyed) {
			callback();
			return;
		}
		request.write(chunk, encoding, (error) => {
			if (!error && !request.destroyed && this._request === request) {
				const bytes = typeof chunk === "string" ? Buffer$1.from(chunk, encoding) : chunk;
				this._uploadedSize += byteLength(bytes);
				const progress = this.uploadProgress;
				if (progress.percent < 1) this.emit("uploadProgress", progress);
			}
			callback(error);
		});
	}
	/**
	The remote IP address.
	*/
	get ip() {
		return this.socket?.remoteAddress;
	}
	/**
	Indicates whether the request has been aborted or not.
	*/
	get isAborted() {
		return this._aborted;
	}
	get socket() {
		return this._request?.socket ?? void 0;
	}
	/**
	Progress event for downloading (receiving a response).
	*/
	get downloadProgress() {
		return makeProgress(this._downloadedSize, this._responseSize);
	}
	/**
	Progress event for uploading (sending a request).
	*/
	get uploadProgress() {
		return makeProgress(this._uploadedSize, this._bodySize);
	}
	/**
	The object contains the following properties:
	
	- `start` - Time when the request started.
	- `socket` - Time when a socket was assigned to the request.
	- `lookup` - Time when the DNS lookup finished.
	- `connect` - Time when the socket successfully connected.
	- `secureConnect` - Time when the socket securely connected.
	- `upload` - Time when the request finished uploading.
	- `response` - Time when the request fired `response` event.
	- `end` - Time when the response fired `end` event.
	- `error` - Time when the request fired `error` event.
	- `abort` - Time when the request fired `abort` event.
	- `phases`
	- `wait` - `timings.socket - timings.start`
	- `dns` - `timings.lookup - timings.socket`
	- `tcp` - `timings.connect - timings.lookup`
	- `tls` - `timings.secureConnect - timings.connect`
	- `request` - `timings.upload - (timings.secureConnect || timings.connect)`
	- `firstByte` - `timings.response - timings.upload`
	- `download` - `timings.end - timings.response`
	- `total` - `(timings.end || timings.error || timings.abort) - timings.start`
	
	If something has not been measured yet, it will be `undefined`.
	
	__Note__: The time is a `number` representing the milliseconds elapsed since the UNIX epoch.
	*/
	get timings() {
		return this._request?.timings;
	}
	/**
	Whether the response was retrieved from the cache.
	*/
	get isFromCache() {
		return this.response?.isFromCache;
	}
	get reusedSocket() {
		return this._request?.reusedSocket;
	}
	/**
	Whether the stream is read-only. Returns `true` when `body`, `json`, or `form` options are provided.
	*/
	get isReadonly() {
		return !is.undefined(this.options?.body) || !is.undefined(this.options?.json) || !is.undefined(this.options?.form);
	}
};
//#endregion
//#region node_modules/got/dist/source/as-promise/index.js
var compressedEncodings = /* @__PURE__ */ new Set([
	"gzip",
	"deflate",
	"br",
	"zstd"
]);
var proxiedRequestEvents = [
	"request",
	"response",
	"redirect",
	"uploadProgress",
	"downloadProgress"
];
function asPromise(firstRequest) {
	let globalRequest;
	let globalResponse;
	const emitter = new EventEmitter();
	let promiseSettled = false;
	const promise = new Promise((resolve, reject) => {
		const makeRequest = (retryCount, defaultOptions) => {
			const request = firstRequest ?? new Request(void 0, void 0, defaultOptions);
			request.retryCount = retryCount;
			request._noPipe = true;
			globalRequest = request;
			request.once("response", (response) => {
				(async () => {
					const contentEncoding = (response.headers["content-encoding"] ?? "").toLowerCase();
					const isCompressed = compressedEncodings.has(contentEncoding);
					const { options } = request;
					if (isCompressed && !options.decompress) response.body = response.rawBody;
					else try {
						response.body = parseBody(response, options.responseType, options.parseJson, options.encoding);
					} catch (error) {
						try {
							response.body = decodeUint8Array(response.rawBody);
						} catch (error) {
							request._beforeError(new ParseError(normalizeError(error), response));
							return;
						}
						if (isResponseOk(response)) {
							request._beforeError(normalizeError(error));
							return;
						}
					}
					try {
						const hooks = options.hooks.afterResponse;
						for (const [index, hook] of hooks.entries()) {
							const previousUrl = options.url ? new URL(options.url) : void 0;
							const previousBoundary = getUrlPrefixBoundary(options);
							const previousState = previousUrl ? snapshotCrossOriginState(options) : void 0;
							const requestOptions = response.request.options;
							const responseSnapshot = response;
							response = await requestOptions.trackStateMutations(async (changedState) => hook(responseSnapshot, async (updatedOptions) => {
								const preserveHooks = updatedOptions.preserveHooks ?? false;
								const reusesRequestOptions = updatedOptions === requestOptions;
								const hasExplicitBody = reusesRequestOptions ? changedState.has("body") || changedState.has("json") || changedState.has("form") : Object.hasOwn(updatedOptions, "body") && updatedOptions.body !== void 0 || Object.hasOwn(updatedOptions, "json") && updatedOptions.json !== void 0 || Object.hasOwn(updatedOptions, "form") && updatedOptions.form !== void 0;
								const clearsCookieJar = Object.hasOwn(updatedOptions, "cookieJar") && updatedOptions.cookieJar === void 0;
								if (hasExplicitBody && !reusesRequestOptions) options.clearBody();
								if (!reusesRequestOptions && clearsCookieJar) options.cookieJar = void 0;
								if (!reusesRequestOptions) {
									const { url, ...updatedOptionsWithoutUrl } = updatedOptions;
									options.merge(updatedOptionsWithoutUrl);
									options.syncCookieHeaderAfterMerge(previousState, updatedOptionsWithoutUrl.headers);
								}
								options.clearUnchangedCookieHeader(previousState, reusesRequestOptions ? changedState : void 0);
								const currentUrl = options.url;
								if (previousUrl && currentUrl instanceof URL && hasUrlOrPrefixUrlBoundaryChanged(options, currentUrl, previousBoundary)) assertUrlHasSameOriginAsPrefixUrlIfNeeded(options, currentUrl);
								if (updatedOptions.url !== void 0) {
									const nextUrl = reusesRequestOptions ? options.url : applyUrlOverride(options, updatedOptions.url, updatedOptions);
									if (previousUrl) {
										if (reusesRequestOptions && !isSameOrigin(previousUrl, nextUrl)) options.stripUnchangedCrossOriginState(previousState, changedState, { clearBody: !hasExplicitBody });
										else {
											options.stripSensitiveHeaders(previousUrl, nextUrl, updatedOptions);
											if (!isSameOrigin(previousUrl, nextUrl) && !hasExplicitBody) options.clearBody();
										}
									}
								}
								if (!preserveHooks) options.hooks.afterResponse = options.hooks.afterResponse.slice(0, index);
								throw new RetryError(request);
							}));
							if (!(is.object(response) && is.number(response.statusCode) && "body" in response)) throw new TypeError("The `afterResponse` hook returned an invalid value");
						}
					} catch (error) {
						request._beforeError(normalizeError(error));
						return;
					}
					globalResponse = response;
					if (!isResponseOk(response)) {
						request._beforeError(new HTTPError(response));
						return;
					}
					request.destroy();
					promiseSettled = true;
					resolve(request.options.resolveBodyOnly ? response.body : response);
				})();
			});
			let handledFinalError = false;
			const onError = (error) => {
				if (!request._stopReading) {
					request._beforeError(error);
					return;
				}
				if (handledFinalError) return;
				handledFinalError = true;
				promiseSettled = true;
				const { options } = request;
				if (error instanceof HTTPError && !options.throwHttpErrors) {
					const { response } = error;
					request.destroy();
					resolve(request.options.resolveBodyOnly ? response.body : response);
					return;
				}
				reject(error);
			};
			request.on("error", onError);
			const previousBody = request.options?.body;
			request.once("retry", (newRetryCount, error) => {
				firstRequest = void 0;
				if (promiseSettled) return;
				const newBody = request.options.body;
				if (previousBody === newBody && (is.nodeStream(newBody) || newBody instanceof ReadableStream)) {
					error.message = "Cannot retry with consumed body stream";
					onError(error);
					return;
				}
				makeRequest(newRetryCount, request.options);
			});
			proxyEvents(request, emitter, proxiedRequestEvents);
			if (is.undefined(firstRequest)) request.flush();
		};
		makeRequest(0);
	});
	promise.on = function(event, function_) {
		emitter.on(event, function_);
		return this;
	};
	promise.once = function(event, function_) {
		emitter.once(event, function_);
		return this;
	};
	promise.off = function(event, function_) {
		emitter.off(event, function_);
		return this;
	};
	const shortcut = (promiseToAwait, responseType) => {
		const newPromise = (async () => {
			await promiseToAwait;
			const { options } = globalResponse.request;
			if (responseType === "text") {
				const text = decodeUint8Array(globalResponse.rawBody, options.encoding);
				return isUtf8Encoding(options.encoding) ? text.replace(new RegExp("^\\u{FEFF}", "v"), "") : text;
			}
			return parseBody(globalResponse, responseType, options.parseJson, options.encoding);
		})();
		Object.defineProperties(newPromise, Object.getOwnPropertyDescriptors(promiseToAwait));
		return newPromise;
	};
	promise.json = function() {
		if (globalRequest.options) {
			const { headers } = globalRequest.options;
			if (!globalRequest.writableFinished && !("accept" in headers)) headers.accept = "application/json";
		}
		return shortcut(this, "json");
	};
	promise.buffer = function() {
		return shortcut(this, "buffer");
	};
	promise.text = function() {
		return shortcut(this, "text");
	};
	return promise;
}
//#endregion
//#region node_modules/got/dist/source/create.js
var isGotInstance = (value) => is.function(value);
var aliases = [
	"get",
	"post",
	"put",
	"patch",
	"head",
	"delete"
];
var optionsObjectUrlErrorMessage = "The `url` option is not supported in options objects. Pass it as the first argument instead.";
var assertNoUrlInOptionsObject = (options) => {
	if (Object.hasOwn(options, "url")) throw new TypeError(optionsObjectUrlErrorMessage);
};
var cloneWithProperty = (value, property, propertyValue) => {
	const clone = Object.create(Object.getPrototypeOf(value), Object.getOwnPropertyDescriptors(value));
	Object.defineProperty(clone, property, {
		value: propertyValue,
		enumerable: true,
		configurable: true,
		writable: true
	});
	return clone;
};
var create = (defaults) => {
	defaults = {
		options: new Options(void 0, void 0, defaults.options),
		handlers: [...defaults.handlers],
		mutableDefaults: defaults.mutableDefaults
	};
	Object.defineProperty(defaults, "mutableDefaults", {
		enumerable: true,
		configurable: false,
		writable: false
	});
	const makeRequest = (url, options, defaultOptions, isStream) => {
		if (is.plainObject(url)) assertNoUrlInOptionsObject(url);
		if (is.plainObject(options)) assertNoUrlInOptionsObject(options);
		const request = new Request(isStream && is.plainObject(url) ? cloneWithProperty(url, "isStream", true) : url, isStream && !is.plainObject(url) && options ? cloneWithProperty(options, "isStream", true) : options, defaultOptions);
		if (isStream && request.options) request.options.isStream = true;
		let promise;
		const urlBeforeHandlers = request.options?.url instanceof URL ? new URL(request.options.url) : void 0;
		const boundaryBeforeHandlers = request.options ? getUrlPrefixBoundary(request.options) : void 0;
		const lastHandler = (normalized) => {
			if (urlBeforeHandlers && boundaryBeforeHandlers && normalized?.url instanceof URL && hasUrlOrPrefixUrlBoundaryChanged(normalized, normalized.url, boundaryBeforeHandlers)) assertUrlHasSameOriginAsPrefixUrlIfNeeded(normalized, normalized.url);
			request.options = normalized;
			const shouldReturnStream = normalized?.isStream ?? isStream;
			request._noPipe = !shouldReturnStream;
			request.flush();
			if (shouldReturnStream) return request;
			promise ??= asPromise(request);
			return promise;
		};
		let iteration = 0;
		const iterateHandlers = (newOptions) => {
			const result = (defaults.handlers[iteration++] ?? lastHandler)(newOptions, iterateHandlers);
			if (is.promise(result) && !request.options?.isStream) {
				promise ??= asPromise(request);
				if (result !== promise) {
					const descriptors = Object.getOwnPropertyDescriptors(promise);
					for (const key in descriptors) if (key in result) delete descriptors[key];
					Object.defineProperties(result, descriptors);
				}
			}
			return result;
		};
		return iterateHandlers(request.options);
	};
	const got = ((url, options, defaultOptions = defaults.options) => makeRequest(url, options, defaultOptions, false));
	got.extend = (...instancesOrOptions) => {
		const options = new Options(void 0, void 0, defaults.options);
		const handlers = [...defaults.handlers];
		let mutableDefaults;
		for (const value of instancesOrOptions) if (isGotInstance(value)) {
			options.merge(value.defaults.options);
			handlers.push(...value.defaults.handlers);
			mutableDefaults = value.defaults.mutableDefaults;
		} else {
			assertNoUrlInOptionsObject(value);
			options.merge(value);
			if (value.handlers) handlers.push(...value.handlers);
			mutableDefaults = value.mutableDefaults;
		}
		return create({
			options,
			handlers,
			mutableDefaults: Boolean(mutableDefaults)
		});
	};
	const paginateEach = (async function* (url, options) {
		if (is.plainObject(url)) assertNoUrlInOptionsObject(url);
		if (is.plainObject(options)) assertNoUrlInOptionsObject(options);
		let normalizedOptions = new Options(url, options, defaults.options);
		normalizedOptions.resolveBodyOnly = false;
		const { pagination } = normalizedOptions;
		assert$1.function(pagination.transform);
		assert$1.function(pagination.shouldContinue);
		assert$1.function(pagination.filter);
		assert$1.function(pagination.paginate);
		assert$1.number(pagination.countLimit);
		assert$1.number(pagination.requestLimit);
		assert$1.number(pagination.backoff);
		const allItems = [];
		let { countLimit } = pagination;
		let numberOfRequests = 0;
		while (numberOfRequests < pagination.requestLimit) {
			if (numberOfRequests !== 0) await setTimeout$1(pagination.backoff);
			const response = await got(void 0, void 0, normalizedOptions);
			const parsed = await pagination.transform(response);
			const currentItems = [];
			assert$1.array(parsed);
			for (const item of parsed) if (pagination.filter({
				item,
				currentItems,
				allItems
			})) {
				if (!pagination.shouldContinue({
					item,
					currentItems,
					allItems
				})) return;
				yield item;
				if (pagination.stackAllItems) allItems.push(item);
				currentItems.push(item);
				if (--countLimit <= 0) return;
			}
			const requestOptions = response.request.options;
			const previousUrl = requestOptions.url ? new URL(requestOptions.url) : void 0;
			const previousBoundary = getUrlPrefixBoundary(requestOptions);
			const previousState = previousUrl ? snapshotCrossOriginState(requestOptions) : void 0;
			const [optionsToMerge, changedState] = await requestOptions.trackStateMutations(async (changedState) => [pagination.paginate({
				response,
				currentItems,
				allItems
			}), changedState]);
			if (optionsToMerge === false) return;
			if (optionsToMerge === response.request.options) {
				normalizedOptions = response.request.options;
				normalizedOptions.clearUnchangedCookieHeader(previousState, changedState);
				if (previousUrl) {
					const nextUrl = normalizedOptions.url;
					if (nextUrl && hasUrlOrPrefixUrlBoundaryChanged(normalizedOptions, nextUrl, previousBoundary)) assertUrlHasSameOriginAsPrefixUrlIfNeeded(normalizedOptions, nextUrl);
					if (nextUrl && !isSameOrigin(previousUrl, nextUrl)) {
						normalizedOptions.prefixUrl = "";
						normalizedOptions.stripUnchangedCrossOriginState(previousState, changedState);
					}
				}
			} else {
				const paginationOptions = normalizedOptions;
				const paginationUrl = paginationOptions.url instanceof URL ? new URL(paginationOptions.url) : void 0;
				const paginationBoundary = getUrlPrefixBoundary(paginationOptions);
				const hasExplicitBody = Object.hasOwn(optionsToMerge, "body") && optionsToMerge.body !== void 0 || Object.hasOwn(optionsToMerge, "json") && optionsToMerge.json !== void 0 || Object.hasOwn(optionsToMerge, "form") && optionsToMerge.form !== void 0;
				const clearsCookieJar = Object.hasOwn(optionsToMerge, "cookieJar") && optionsToMerge.cookieJar === void 0;
				if (hasExplicitBody) paginationOptions.clearBody();
				if (clearsCookieJar) paginationOptions.cookieJar = void 0;
				const { url, ...optionsToMergeWithoutUrl } = optionsToMerge;
				paginationOptions.merge(optionsToMergeWithoutUrl);
				paginationOptions.syncCookieHeaderAfterMerge(previousState, optionsToMergeWithoutUrl.headers);
				if (paginationOptions.url instanceof URL && hasUrlOrPrefixUrlBoundaryChanged(paginationOptions, paginationOptions.url, paginationBoundary)) assertUrlHasSameOriginAsPrefixUrlIfNeeded(paginationOptions, paginationOptions.url);
				if (previousUrl && paginationUrl && !isSameOrigin(paginationUrl, previousUrl)) {
					paginationOptions.stripSensitiveHeaders(paginationUrl, previousUrl, optionsToMerge);
					if (!hasExplicitBody) paginationOptions.clearBody();
				}
				try {
					assert$1.any([
						is.string,
						is.urlInstance,
						is.undefined
					], optionsToMerge.url);
				} catch (error) {
					if (error instanceof Error) error.message = `Option 'pagination.paginate.url': ${error.message}`;
					throw error;
				}
				if (url !== void 0) {
					const nextUrl = applyUrlOverride(paginationOptions, url, {
						...optionsToMerge,
						baseUrl: previousUrl
					});
					if (paginationOptions.prefixUrl.toString() !== paginationBoundary.prefixUrl || paginationOptions.allowAbsoluteUrls !== paginationBoundary.allowAbsoluteUrls) assertUrlHasSameOriginAsPrefixUrlIfNeeded(paginationOptions, nextUrl);
					if (previousUrl) {
						paginationOptions.stripSensitiveHeaders(previousUrl, nextUrl, optionsToMerge);
						if (!isSameOrigin(previousUrl, nextUrl) && !hasExplicitBody) paginationOptions.clearBody();
					}
				}
				normalizedOptions = paginationOptions;
			}
			numberOfRequests++;
		}
	});
	got.paginate = paginateEach;
	got.paginate.all = (async (url, options) => Array.fromAsync(paginateEach(url, options)));
	got.paginate.each = paginateEach;
	got.stream = ((url, options) => makeRequest(url, options, defaults.options, true));
	for (const method of aliases) {
		got[method] = ((url, options) => got(url, {
			...options,
			method
		}));
		got.stream[method] = ((url, options) => makeRequest(url, {
			...options,
			method
		}, defaults.options, true));
	}
	if (!defaults.mutableDefaults) {
		Object.freeze(defaults.handlers);
		defaults.options.freeze();
	}
	Object.defineProperty(got, "defaults", {
		value: defaults,
		writable: false,
		configurable: false,
		enumerable: true
	});
	return got;
};
var got = create({
	options: new Options(),
	handlers: [],
	mutableDefaults: false
});
//#endregion
export { got as t };
