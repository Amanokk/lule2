import { t as axios } from "./axios+[...].mjs";
//#region node_modules/tiktok-live-api-sdk/dist/index.js
var BASE_PATH = "https://tiktok.eulerstream.com".replace(/\/+$/, "");
var BaseAPI = class {
	constructor(configuration, basePath = BASE_PATH, axios$1 = axios) {
		this.basePath = basePath;
		this.axios = axios$1;
		if (configuration) {
			this.configuration = configuration;
			this.basePath = configuration.basePath ?? basePath;
		}
	}
};
var RequiredError = class extends Error {
	constructor(field, msg) {
		super(msg);
		this.field = field;
		this.name = "RequiredError";
	}
};
var operationServerMap = {};
var DUMMY_BASE_URL = "https://example.com";
/**
*
* @throws {RequiredError}
*/
var assertParamExists = function(functionName, paramName, paramValue) {
	if (paramValue === null || paramValue === void 0) throw new RequiredError(paramName, `Required parameter ${paramName} was null or undefined when calling ${functionName}.`);
};
var setApiKeyToObject = async function(object, keyParamName, configuration) {
	if (configuration && configuration.apiKey) object[keyParamName] = typeof configuration.apiKey === "function" ? await configuration.apiKey(keyParamName) : await configuration.apiKey;
};
function setFlattenedQueryParams(urlSearchParams, parameter, key = "") {
	if (parameter == null) return;
	if (typeof parameter === "object") if (Array.isArray(parameter) || parameter instanceof Set) parameter.forEach((item) => setFlattenedQueryParams(urlSearchParams, item, key));
	else Object.keys(parameter).forEach((currentKey) => setFlattenedQueryParams(urlSearchParams, parameter[currentKey], `${key}${key !== "" ? "." : ""}${currentKey}`));
	else if (urlSearchParams.has(key)) urlSearchParams.append(key, parameter);
	else urlSearchParams.set(key, parameter);
}
var setSearchParams = function(url, ...objects) {
	const searchParams = new URLSearchParams(url.search);
	setFlattenedQueryParams(searchParams, objects);
	url.search = searchParams.toString();
};
/**
* JSON serialization helper function which replaces instances of unserializable types with serializable ones.
* This function will run for every key-value pair encountered by JSON.stringify while traversing an object.
* Converting a set to a string will return an empty object, so an intermediate conversion to an array is required.
*/
var replaceWithSerializableTypeIfNeeded = function(key, value) {
	if (value instanceof Set) return Array.from(value);
	else return value;
};
var serializeDataIfNeeded = function(value, requestOptions, configuration) {
	const nonString = typeof value !== "string";
	return (nonString && configuration && configuration.isJsonMime ? configuration.isJsonMime(requestOptions.headers["Content-Type"]) : nonString) ? JSON.stringify(value !== void 0 ? value : {}, replaceWithSerializableTypeIfNeeded) : value || "";
};
var toPathString = function(url) {
	return url.pathname + url.search + url.hash;
};
var createRequestFunction = function(axiosArgs, globalAxios, BASE_PATH, configuration) {
	return (axios = globalAxios, basePath = BASE_PATH) => {
		const axiosRequestArgs = {
			...axiosArgs.options,
			url: (axios.defaults.baseURL ? "" : configuration?.basePath ?? basePath) + axiosArgs.url
		};
		return axios.request(axiosRequestArgs);
	};
};
var WebcastFetchPlatform = {
	Mobile: "mobile",
	Web: "web"
};
/**
* AccountsApi - axios parameter creator
*/
var AccountsApiAxiosParamCreator = function(configuration) {
	return {
		/**
		* Retrieve the rate limits for the provided API key (or the unauthenticated limits if no key is provided)
		* @param {RateLimitType} [type] Which set of rate limits to retrieve. Defaults to the webcast (account) limits.
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		getRateLimits: async (type, options = {}) => {
			const localVarUrlObj = new URL(`/accounts/me/rate_limits`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (type !== void 0) localVarQueryParameter["type"] = type;
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve an account from the Sign API
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveAccountSelf: async (options = {}) => {
			const localVarUrlObj = new URL(`/accounts/me`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		}
	};
};
/**
* AccountsApi - functional programming interface
*/
var AccountsApiFp = function(configuration) {
	const localVarAxiosParamCreator = AccountsApiAxiosParamCreator(configuration);
	return {
		/**
		* Retrieve the rate limits for the provided API key (or the unauthenticated limits if no key is provided)
		* @param {RateLimitType} [type] Which set of rate limits to retrieve. Defaults to the webcast (account) limits.
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async getRateLimits(type, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.getRateLimits(type, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["AccountsApi.getRateLimits"]?.[localVarOperationServerIndex]?.url;
			return (axios$2, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$2, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve an account from the Sign API
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveAccountSelf(options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveAccountSelf(options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["AccountsApi.retrieveAccountSelf"]?.[localVarOperationServerIndex]?.url;
			return (axios$3, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$3, localVarOperationServerBasePath || basePath);
		}
	};
};
/**
* AccountsApi - object-oriented interface
*/
var AccountsApi = class extends BaseAPI {
	/**
	* Retrieve the rate limits for the provided API key (or the unauthenticated limits if no key is provided)
	* @param {RateLimitType} [type] Which set of rate limits to retrieve. Defaults to the webcast (account) limits.
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	getRateLimits(type, options) {
		return AccountsApiFp(this.configuration).getRateLimits(type, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve an account from the Sign API
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveAccountSelf(options) {
		return AccountsApiFp(this.configuration).retrieveAccountSelf(options).then((request) => request(this.axios, this.basePath));
	}
};
/**
* AnalyticsApi - axios parameter creator
*/
var AnalyticsApiAxiosParamCreator = function(configuration) {
	return {
		/**
		* Retrieve the currently connected agents
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		fetchAgents: async (options = {}) => {
			const localVarUrlObj = new URL(`/analytics/agents`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve the list of API hosts (used for horizontal scaling)
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		getHosts: async (options = {}) => {
			const localVarUrlObj = new URL(`/analytics/hosts`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve stats as an SVG
		* @param {string} [labelColour] Specify label colour in SVG
		* @param {string} [valueColour] Specify value colour in SVG
		* @param {number} [hours] The number of hours to retrieve the stat for
		* @param {TikTokSignLiveClient} [client] The client to filter for
		* @param {boolean} [json] Add the ability to retrieve the pip as JSON
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		pips: async (labelColour, valueColour, hours, client, json, options = {}) => {
			const localVarUrlObj = new URL(`/analytics/pips`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			if (labelColour !== void 0) localVarQueryParameter["labelColour"] = labelColour;
			if (valueColour !== void 0) localVarQueryParameter["valueColour"] = valueColour;
			if (hours !== void 0) localVarQueryParameter["hours"] = hours;
			if (client !== void 0) localVarQueryParameter["client"] = client;
			if (json !== void 0) localVarQueryParameter["json"] = json;
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		}
	};
};
/**
* AnalyticsApi - functional programming interface
*/
var AnalyticsApiFp = function(configuration) {
	const localVarAxiosParamCreator = AnalyticsApiAxiosParamCreator(configuration);
	return {
		/**
		* Retrieve the currently connected agents
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async fetchAgents(options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.fetchAgents(options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["AnalyticsApi.fetchAgents"]?.[localVarOperationServerIndex]?.url;
			return (axios$4, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$4, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve the list of API hosts (used for horizontal scaling)
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async getHosts(options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.getHosts(options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["AnalyticsApi.getHosts"]?.[localVarOperationServerIndex]?.url;
			return (axios$5, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$5, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve stats as an SVG
		* @param {string} [labelColour] Specify label colour in SVG
		* @param {string} [valueColour] Specify value colour in SVG
		* @param {number} [hours] The number of hours to retrieve the stat for
		* @param {TikTokSignLiveClient} [client] The client to filter for
		* @param {boolean} [json] Add the ability to retrieve the pip as JSON
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async pips(labelColour, valueColour, hours, client, json, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.pips(labelColour, valueColour, hours, client, json, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["AnalyticsApi.pips"]?.[localVarOperationServerIndex]?.url;
			return (axios$6, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$6, localVarOperationServerBasePath || basePath);
		}
	};
};
/**
* AnalyticsApi - object-oriented interface
*/
var AnalyticsApi = class extends BaseAPI {
	/**
	* Retrieve the currently connected agents
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	fetchAgents(options) {
		return AnalyticsApiFp(this.configuration).fetchAgents(options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve the list of API hosts (used for horizontal scaling)
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	getHosts(options) {
		return AnalyticsApiFp(this.configuration).getHosts(options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve stats as an SVG
	* @param {string} [labelColour] Specify label colour in SVG
	* @param {string} [valueColour] Specify value colour in SVG
	* @param {number} [hours] The number of hours to retrieve the stat for
	* @param {TikTokSignLiveClient} [client] The client to filter for
	* @param {boolean} [json] Add the ability to retrieve the pip as JSON
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	pips(labelColour, valueColour, hours, client, json, options) {
		return AnalyticsApiFp(this.configuration).pips(labelColour, valueColour, hours, client, json, options).then((request) => request(this.axios, this.basePath));
	}
};
/**
* AuthenticationApi - axios parameter creator
*/
var AuthenticationApiAxiosParamCreator = function(configuration) {
	return {
		/**
		* Create a JWT for a given API key. Note that these JWT keys are only valid for the non-authenticated Webcast endpoints. They function to attach the rate limits of the API key to the request for client-sided applications.
		* @param {number} accountId The ID of the account to create the JWT for
		* @param {JWTCreateConfig} jWTCreateConfig The configuration for the JWT
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		createJWT: async (accountId, jWTCreateConfig, options = {}) => {
			assertParamExists("createJWT", "accountId", accountId);
			assertParamExists("createJWT", "jWTCreateConfig", jWTCreateConfig);
			const localVarPath = `/accounts/{account_id}/jwt/create`.replace("{account_id}", encodeURIComponent(String(accountId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Content-Type"] = "application/json";
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = serializeDataIfNeeded(jWTCreateConfig, localVarRequestOptions, configuration);
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Create a new API key
		* @param {number} accountId The ID of the account to create the key for
		* @param {CreateKeyPayload} createKeyPayload The configuration for the new key
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		createKey: async (accountId, createKeyPayload, options = {}) => {
			assertParamExists("createKey", "accountId", accountId);
			assertParamExists("createKey", "createKeyPayload", createKeyPayload);
			const localVarPath = `/accounts/{account_id}/api_keys/create`.replace("{account_id}", encodeURIComponent(String(accountId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "PUT",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Content-Type"] = "application/json";
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = serializeDataIfNeeded(createKeyPayload, localVarRequestOptions, configuration);
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Delete an API key by its key value, name, or ID
		* @param {number} accountId The ID of the account to delete the key for
		* @param {DeleteKeyDeleteByEnum} deleteBy The API key field to delete by
		* @param {string} deleteParam The API key field value to delete by
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		deleteKey: async (accountId, deleteBy, deleteParam, options = {}) => {
			assertParamExists("deleteKey", "accountId", accountId);
			assertParamExists("deleteKey", "deleteBy", deleteBy);
			assertParamExists("deleteKey", "deleteParam", deleteParam);
			const localVarPath = `/accounts/{account_id}/api_keys/delete`.replace("{account_id}", encodeURIComponent(String(accountId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "DELETE",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (deleteBy !== void 0) localVarQueryParameter["delete_by"] = deleteBy;
			if (deleteParam !== void 0) localVarQueryParameter["delete_param"] = deleteParam;
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve an API key by its key value, name, or ID
		* @param {number} accountId The ID of the account to retrieve the key for
		* @param {string} retrieveParam The API key field value to retrieve by
		* @param {GetKeyRetrieveByEnum} [retrieveBy] The API key field to retrieve by
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		getKey: async (accountId, retrieveParam, retrieveBy, options = {}) => {
			assertParamExists("getKey", "accountId", accountId);
			assertParamExists("getKey", "retrieveParam", retrieveParam);
			const localVarPath = `/accounts/{account_id}/api_keys/retrieve`.replace("{account_id}", encodeURIComponent(String(accountId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (retrieveBy !== void 0) localVarQueryParameter["retrieve_by"] = retrieveBy;
			if (retrieveParam !== void 0) localVarQueryParameter["retrieve_param"] = retrieveParam;
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve an API key by its key value, name, or ID
		* @param {number} accountId The ID of the account to retrieve the key for
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		listKeys: async (accountId, options = {}) => {
			assertParamExists("listKeys", "accountId", accountId);
			const localVarPath = `/accounts/{account_id}/api_keys/list`.replace("{account_id}", encodeURIComponent(String(accountId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Update an existing API key
		* @param {number} accountId The account to update the key for
		* @param {UpdateKeyUpdateByEnum} updateBy The API key field to update by
		* @param {string} updateParam The API key field value to update by
		* @param {UpdateKeyPayload} updateKeyPayload The new configuration for the key
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		updateKey: async (accountId, updateBy, updateParam, updateKeyPayload, options = {}) => {
			assertParamExists("updateKey", "accountId", accountId);
			assertParamExists("updateKey", "updateBy", updateBy);
			assertParamExists("updateKey", "updateParam", updateParam);
			assertParamExists("updateKey", "updateKeyPayload", updateKeyPayload);
			const localVarPath = `/accounts/{account_id}/api_keys/update`.replace("{account_id}", encodeURIComponent(String(accountId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "PATCH",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (updateBy !== void 0) localVarQueryParameter["update_by"] = updateBy;
			if (updateParam !== void 0) localVarQueryParameter["update_param"] = updateParam;
			localVarHeaderParameter["Content-Type"] = "application/json";
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = serializeDataIfNeeded(updateKeyPayload, localVarRequestOptions, configuration);
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		}
	};
};
/**
* AuthenticationApi - functional programming interface
*/
var AuthenticationApiFp = function(configuration) {
	const localVarAxiosParamCreator = AuthenticationApiAxiosParamCreator(configuration);
	return {
		/**
		* Create a JWT for a given API key. Note that these JWT keys are only valid for the non-authenticated Webcast endpoints. They function to attach the rate limits of the API key to the request for client-sided applications.
		* @param {number} accountId The ID of the account to create the JWT for
		* @param {JWTCreateConfig} jWTCreateConfig The configuration for the JWT
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async createJWT(accountId, jWTCreateConfig, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.createJWT(accountId, jWTCreateConfig, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["AuthenticationApi.createJWT"]?.[localVarOperationServerIndex]?.url;
			return (axios$7, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$7, localVarOperationServerBasePath || basePath);
		},
		/**
		* Create a new API key
		* @param {number} accountId The ID of the account to create the key for
		* @param {CreateKeyPayload} createKeyPayload The configuration for the new key
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async createKey(accountId, createKeyPayload, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.createKey(accountId, createKeyPayload, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["AuthenticationApi.createKey"]?.[localVarOperationServerIndex]?.url;
			return (axios$8, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$8, localVarOperationServerBasePath || basePath);
		},
		/**
		* Delete an API key by its key value, name, or ID
		* @param {number} accountId The ID of the account to delete the key for
		* @param {DeleteKeyDeleteByEnum} deleteBy The API key field to delete by
		* @param {string} deleteParam The API key field value to delete by
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async deleteKey(accountId, deleteBy, deleteParam, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.deleteKey(accountId, deleteBy, deleteParam, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["AuthenticationApi.deleteKey"]?.[localVarOperationServerIndex]?.url;
			return (axios$9, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$9, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve an API key by its key value, name, or ID
		* @param {number} accountId The ID of the account to retrieve the key for
		* @param {string} retrieveParam The API key field value to retrieve by
		* @param {GetKeyRetrieveByEnum} [retrieveBy] The API key field to retrieve by
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async getKey(accountId, retrieveParam, retrieveBy, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.getKey(accountId, retrieveParam, retrieveBy, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["AuthenticationApi.getKey"]?.[localVarOperationServerIndex]?.url;
			return (axios$10, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$10, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve an API key by its key value, name, or ID
		* @param {number} accountId The ID of the account to retrieve the key for
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async listKeys(accountId, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.listKeys(accountId, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["AuthenticationApi.listKeys"]?.[localVarOperationServerIndex]?.url;
			return (axios$11, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$11, localVarOperationServerBasePath || basePath);
		},
		/**
		* Update an existing API key
		* @param {number} accountId The account to update the key for
		* @param {UpdateKeyUpdateByEnum} updateBy The API key field to update by
		* @param {string} updateParam The API key field value to update by
		* @param {UpdateKeyPayload} updateKeyPayload The new configuration for the key
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async updateKey(accountId, updateBy, updateParam, updateKeyPayload, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.updateKey(accountId, updateBy, updateParam, updateKeyPayload, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["AuthenticationApi.updateKey"]?.[localVarOperationServerIndex]?.url;
			return (axios$12, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$12, localVarOperationServerBasePath || basePath);
		}
	};
};
/**
* AuthenticationApi - object-oriented interface
*/
var AuthenticationApi = class extends BaseAPI {
	/**
	* Create a JWT for a given API key. Note that these JWT keys are only valid for the non-authenticated Webcast endpoints. They function to attach the rate limits of the API key to the request for client-sided applications.
	* @param {number} accountId The ID of the account to create the JWT for
	* @param {JWTCreateConfig} jWTCreateConfig The configuration for the JWT
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	createJWT(accountId, jWTCreateConfig, options) {
		return AuthenticationApiFp(this.configuration).createJWT(accountId, jWTCreateConfig, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Create a new API key
	* @param {number} accountId The ID of the account to create the key for
	* @param {CreateKeyPayload} createKeyPayload The configuration for the new key
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	createKey(accountId, createKeyPayload, options) {
		return AuthenticationApiFp(this.configuration).createKey(accountId, createKeyPayload, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Delete an API key by its key value, name, or ID
	* @param {number} accountId The ID of the account to delete the key for
	* @param {DeleteKeyDeleteByEnum} deleteBy The API key field to delete by
	* @param {string} deleteParam The API key field value to delete by
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	deleteKey(accountId, deleteBy, deleteParam, options) {
		return AuthenticationApiFp(this.configuration).deleteKey(accountId, deleteBy, deleteParam, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve an API key by its key value, name, or ID
	* @param {number} accountId The ID of the account to retrieve the key for
	* @param {string} retrieveParam The API key field value to retrieve by
	* @param {GetKeyRetrieveByEnum} [retrieveBy] The API key field to retrieve by
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	getKey(accountId, retrieveParam, retrieveBy, options) {
		return AuthenticationApiFp(this.configuration).getKey(accountId, retrieveParam, retrieveBy, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve an API key by its key value, name, or ID
	* @param {number} accountId The ID of the account to retrieve the key for
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	listKeys(accountId, options) {
		return AuthenticationApiFp(this.configuration).listKeys(accountId, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Update an existing API key
	* @param {number} accountId The account to update the key for
	* @param {UpdateKeyUpdateByEnum} updateBy The API key field to update by
	* @param {string} updateParam The API key field value to update by
	* @param {UpdateKeyPayload} updateKeyPayload The new configuration for the key
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	updateKey(accountId, updateBy, updateParam, updateKeyPayload, options) {
		return AuthenticationApiFp(this.configuration).updateKey(accountId, updateBy, updateParam, updateKeyPayload, options).then((request) => request(this.axios, this.basePath));
	}
};
/**
* TikTokCaptchasApi - axios parameter creator
*/
var TikTokCaptchasApiAxiosParamCreator = function(configuration) {
	return {
		/**
		*  The icons captcha requires just one image & a prompt string.  ## Example Image <img src=\"https://www.eulerstream.com/_static/captchas/icon.png\" alt=\"Icons Captcha Example\" width=\"480\" />  ## Usage  The `prompt` is the text prompt provided by TikTok. The Icon captcha solution is provided as a list of points, where each point marks a location on the image that needs to be clicked. These points are expressed as ratios relative to the image\'s width and height. A point of (0.0, 0.0) corresponds to the image’s upper-left corner, while (1.0, 1.0) represents the lower-right corner. For reference, (0.5, 0.5) sits at the exact center.  The captcha image selector is `.captcha-verify-image`
		* @param {string} prompt The prompt string provided by TikTok
		* @param {File} captchaImage The uploaded image file
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		completeIconCaptcha: async (prompt, captchaImage, options = {}) => {
			assertParamExists("completeIconCaptcha", "prompt", prompt);
			assertParamExists("completeIconCaptcha", "captchaImage", captchaImage);
			const localVarUrlObj = new URL(`/tiktok/captchas/icons`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			const localVarFormParams = new (configuration && configuration.formDataCtor || FormData)();
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (prompt !== void 0) localVarQueryParameter["prompt"] = prompt;
			if (captchaImage !== void 0) localVarFormParams.append("captchaImage", captchaImage);
			localVarHeaderParameter["Content-Type"] = "multipart/form-data";
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = localVarFormParams;
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* The puzzle captcha requires two images  ## Example Image <img src=\"https://www.eulerstream.com/_static/captchas/puzzle.png\" alt=\"Puzzle Piece Example\" width=\"480\" />  ## Usage  The solution to the puzzle captcha is the distance to move the slider to fit the puzzle piece into the background.  The `backgroundImage` is the full background image with the missing piece. The `pieceImage` is the small puzzle piece that needs to be fit into the background.  The captcha image selectors are: - Background: `.captcha-verify-image` - Piece: `#captcha-verify-image ~ div.cap-absolute > img`  The solution is the `x` proportion (0-1) of the width of the background image where the piece fits. It is 1:1 with the slider distance proportion.
		* @param {File} backgroundImage The uploaded background image file
		* @param {File} pieceImage The uploaded puzzle piece image file
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		completePuzzleCaptcha: async (backgroundImage, pieceImage, options = {}) => {
			assertParamExists("completePuzzleCaptcha", "backgroundImage", backgroundImage);
			assertParamExists("completePuzzleCaptcha", "pieceImage", pieceImage);
			const localVarUrlObj = new URL(`/tiktok/captchas/puzzle`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			const localVarFormParams = new (configuration && configuration.formDataCtor || FormData)();
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (backgroundImage !== void 0) localVarFormParams.append("backgroundImage", backgroundImage);
			if (pieceImage !== void 0) localVarFormParams.append("pieceImage", pieceImage);
			localVarHeaderParameter["Content-Type"] = "multipart/form-data";
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = localVarFormParams;
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* The shapes captcha requires just one image.  ## Example Image <img src=\"https://www.eulerstream.com/_static/captchas/threed.png\" alt=\"Shapes Captcha Example\" width=\"480\" />  ## Usage  The solution to the shapes captcha are two points that need to be clicked. To use it in the GUI, convert the proportions to pixel values based on the image size.  The `points` are returned as `x` and `y` proportions (0-1) of the width and height of the source image. The captcha image selector is `.captcha-verify-image`
		* @param {File} shapesCaptchaImage The uploaded image file
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		completeShapesCaptcha: async (shapesCaptchaImage, options = {}) => {
			assertParamExists("completeShapesCaptcha", "shapesCaptchaImage", shapesCaptchaImage);
			const localVarUrlObj = new URL(`/tiktok/captchas/shapes`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			const localVarFormParams = new (configuration && configuration.formDataCtor || FormData)();
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (shapesCaptchaImage !== void 0) localVarFormParams.append("shapesCaptchaImage", shapesCaptchaImage);
			localVarHeaderParameter["Content-Type"] = "multipart/form-data";
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = localVarFormParams;
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* The whirl captcha requires two images: the outer image and the inner image.  ## Example Image <img src=\"https://www.eulerstream.com/_static/captchas/rotate.png\" alt=\"Whirl Captcha Example\" width=\"480\" />  ## Usage  The solution to the whirl captcha is an angle from 0-360. To use it in the GUI, it must be converted to a slider distance:  `px = ((sidebar_length - icon_length) * angle) / 360`  - `sidebar_length` is the width of `.captcha_verify_slide--slidebar` - `icon_length` is the width of `.secsdk-captcha-drag-icon`
		* @param {File} outerImage The outer image file
		* @param {File} innerImage The inner image file
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		completeWhirlCaptcha: async (outerImage, innerImage, options = {}) => {
			assertParamExists("completeWhirlCaptcha", "outerImage", outerImage);
			assertParamExists("completeWhirlCaptcha", "innerImage", innerImage);
			const localVarUrlObj = new URL(`/tiktok/captchas/whirl`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			const localVarFormParams = new (configuration && configuration.formDataCtor || FormData)();
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (outerImage !== void 0) localVarFormParams.append("outerImage", outerImage);
			if (innerImage !== void 0) localVarFormParams.append("innerImage", innerImage);
			localVarHeaderParameter["Content-Type"] = "multipart/form-data";
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = localVarFormParams;
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve the rate limits for the provided API key
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveCaptchaCredits: async (options = {}) => {
			const localVarUrlObj = new URL(`/tiktok/captchas/credits`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		}
	};
};
/**
* TikTokCaptchasApi - functional programming interface
*/
var TikTokCaptchasApiFp = function(configuration) {
	const localVarAxiosParamCreator = TikTokCaptchasApiAxiosParamCreator(configuration);
	return {
		/**
		*  The icons captcha requires just one image & a prompt string.  ## Example Image <img src=\"https://www.eulerstream.com/_static/captchas/icon.png\" alt=\"Icons Captcha Example\" width=\"480\" />  ## Usage  The `prompt` is the text prompt provided by TikTok. The Icon captcha solution is provided as a list of points, where each point marks a location on the image that needs to be clicked. These points are expressed as ratios relative to the image\'s width and height. A point of (0.0, 0.0) corresponds to the image’s upper-left corner, while (1.0, 1.0) represents the lower-right corner. For reference, (0.5, 0.5) sits at the exact center.  The captcha image selector is `.captcha-verify-image`
		* @param {string} prompt The prompt string provided by TikTok
		* @param {File} captchaImage The uploaded image file
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async completeIconCaptcha(prompt, captchaImage, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.completeIconCaptcha(prompt, captchaImage, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokCaptchasApi.completeIconCaptcha"]?.[localVarOperationServerIndex]?.url;
			return (axios$13, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$13, localVarOperationServerBasePath || basePath);
		},
		/**
		* The puzzle captcha requires two images  ## Example Image <img src=\"https://www.eulerstream.com/_static/captchas/puzzle.png\" alt=\"Puzzle Piece Example\" width=\"480\" />  ## Usage  The solution to the puzzle captcha is the distance to move the slider to fit the puzzle piece into the background.  The `backgroundImage` is the full background image with the missing piece. The `pieceImage` is the small puzzle piece that needs to be fit into the background.  The captcha image selectors are: - Background: `.captcha-verify-image` - Piece: `#captcha-verify-image ~ div.cap-absolute > img`  The solution is the `x` proportion (0-1) of the width of the background image where the piece fits. It is 1:1 with the slider distance proportion.
		* @param {File} backgroundImage The uploaded background image file
		* @param {File} pieceImage The uploaded puzzle piece image file
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async completePuzzleCaptcha(backgroundImage, pieceImage, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.completePuzzleCaptcha(backgroundImage, pieceImage, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokCaptchasApi.completePuzzleCaptcha"]?.[localVarOperationServerIndex]?.url;
			return (axios$14, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$14, localVarOperationServerBasePath || basePath);
		},
		/**
		* The shapes captcha requires just one image.  ## Example Image <img src=\"https://www.eulerstream.com/_static/captchas/threed.png\" alt=\"Shapes Captcha Example\" width=\"480\" />  ## Usage  The solution to the shapes captcha are two points that need to be clicked. To use it in the GUI, convert the proportions to pixel values based on the image size.  The `points` are returned as `x` and `y` proportions (0-1) of the width and height of the source image. The captcha image selector is `.captcha-verify-image`
		* @param {File} shapesCaptchaImage The uploaded image file
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async completeShapesCaptcha(shapesCaptchaImage, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.completeShapesCaptcha(shapesCaptchaImage, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokCaptchasApi.completeShapesCaptcha"]?.[localVarOperationServerIndex]?.url;
			return (axios$15, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$15, localVarOperationServerBasePath || basePath);
		},
		/**
		* The whirl captcha requires two images: the outer image and the inner image.  ## Example Image <img src=\"https://www.eulerstream.com/_static/captchas/rotate.png\" alt=\"Whirl Captcha Example\" width=\"480\" />  ## Usage  The solution to the whirl captcha is an angle from 0-360. To use it in the GUI, it must be converted to a slider distance:  `px = ((sidebar_length - icon_length) * angle) / 360`  - `sidebar_length` is the width of `.captcha_verify_slide--slidebar` - `icon_length` is the width of `.secsdk-captcha-drag-icon`
		* @param {File} outerImage The outer image file
		* @param {File} innerImage The inner image file
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async completeWhirlCaptcha(outerImage, innerImage, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.completeWhirlCaptcha(outerImage, innerImage, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokCaptchasApi.completeWhirlCaptcha"]?.[localVarOperationServerIndex]?.url;
			return (axios$16, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$16, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve the rate limits for the provided API key
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveCaptchaCredits(options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveCaptchaCredits(options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokCaptchasApi.retrieveCaptchaCredits"]?.[localVarOperationServerIndex]?.url;
			return (axios$17, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$17, localVarOperationServerBasePath || basePath);
		}
	};
};
/**
* TikTokCaptchasApi - object-oriented interface
*/
var TikTokCaptchasApi = class extends BaseAPI {
	/**
	*  The icons captcha requires just one image & a prompt string.  ## Example Image <img src=\"https://www.eulerstream.com/_static/captchas/icon.png\" alt=\"Icons Captcha Example\" width=\"480\" />  ## Usage  The `prompt` is the text prompt provided by TikTok. The Icon captcha solution is provided as a list of points, where each point marks a location on the image that needs to be clicked. These points are expressed as ratios relative to the image\'s width and height. A point of (0.0, 0.0) corresponds to the image’s upper-left corner, while (1.0, 1.0) represents the lower-right corner. For reference, (0.5, 0.5) sits at the exact center.  The captcha image selector is `.captcha-verify-image`
	* @param {string} prompt The prompt string provided by TikTok
	* @param {File} captchaImage The uploaded image file
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	completeIconCaptcha(prompt, captchaImage, options) {
		return TikTokCaptchasApiFp(this.configuration).completeIconCaptcha(prompt, captchaImage, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* The puzzle captcha requires two images  ## Example Image <img src=\"https://www.eulerstream.com/_static/captchas/puzzle.png\" alt=\"Puzzle Piece Example\" width=\"480\" />  ## Usage  The solution to the puzzle captcha is the distance to move the slider to fit the puzzle piece into the background.  The `backgroundImage` is the full background image with the missing piece. The `pieceImage` is the small puzzle piece that needs to be fit into the background.  The captcha image selectors are: - Background: `.captcha-verify-image` - Piece: `#captcha-verify-image ~ div.cap-absolute > img`  The solution is the `x` proportion (0-1) of the width of the background image where the piece fits. It is 1:1 with the slider distance proportion.
	* @param {File} backgroundImage The uploaded background image file
	* @param {File} pieceImage The uploaded puzzle piece image file
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	completePuzzleCaptcha(backgroundImage, pieceImage, options) {
		return TikTokCaptchasApiFp(this.configuration).completePuzzleCaptcha(backgroundImage, pieceImage, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* The shapes captcha requires just one image.  ## Example Image <img src=\"https://www.eulerstream.com/_static/captchas/threed.png\" alt=\"Shapes Captcha Example\" width=\"480\" />  ## Usage  The solution to the shapes captcha are two points that need to be clicked. To use it in the GUI, convert the proportions to pixel values based on the image size.  The `points` are returned as `x` and `y` proportions (0-1) of the width and height of the source image. The captcha image selector is `.captcha-verify-image`
	* @param {File} shapesCaptchaImage The uploaded image file
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	completeShapesCaptcha(shapesCaptchaImage, options) {
		return TikTokCaptchasApiFp(this.configuration).completeShapesCaptcha(shapesCaptchaImage, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* The whirl captcha requires two images: the outer image and the inner image.  ## Example Image <img src=\"https://www.eulerstream.com/_static/captchas/rotate.png\" alt=\"Whirl Captcha Example\" width=\"480\" />  ## Usage  The solution to the whirl captcha is an angle from 0-360. To use it in the GUI, it must be converted to a slider distance:  `px = ((sidebar_length - icon_length) * angle) / 360`  - `sidebar_length` is the width of `.captcha_verify_slide--slidebar` - `icon_length` is the width of `.secsdk-captcha-drag-icon`
	* @param {File} outerImage The outer image file
	* @param {File} innerImage The inner image file
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	completeWhirlCaptcha(outerImage, innerImage, options) {
		return TikTokCaptchasApiFp(this.configuration).completeWhirlCaptcha(outerImage, innerImage, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve the rate limits for the provided API key
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveCaptchaCredits(options) {
		return TikTokCaptchasApiFp(this.configuration).retrieveCaptchaCredits(options).then((request) => request(this.axios, this.basePath));
	}
};
/**
* TikTokGeneralApi - axios parameter creator
*/
var TikTokGeneralApiAxiosParamCreator = function(configuration) {
	return {
		/**
		* Exchange an authorization code or refresh token for access tokens.  For authorization_code grant: - code: The authorization code from /oauth/complete - redirect_uri: Must match the original redirect_uri  For refresh_token grant: - refresh_token: A valid refresh token
		* @param {ExchangeTokenRequest} exchangeTokenRequest Token request parameters
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		exchangeToken: async (exchangeTokenRequest, options = {}) => {
			assertParamExists("exchangeToken", "exchangeTokenRequest", exchangeTokenRequest);
			const localVarUrlObj = new URL(`/tiktok/oauth/token`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			localVarHeaderParameter["Content-Type"] = "application/json";
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = serializeDataIfNeeded(exchangeTokenRequest, localVarRequestOptions, configuration);
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Get public information about an OAuth client by client_id. This endpoint is used during the authorization flow to display client information to the user before they authorize.  Does not require authentication. Does not expose sensitive information like client_secret_hash.
		* @param {string} clientId The OAuth client ID to look up
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		getPublicClient: async (clientId, options = {}) => {
			assertParamExists("getPublicClient", "clientId", clientId);
			const localVarPath = `/tiktok/oauth/clients/{client_id}`.replace("{client_id}", encodeURIComponent(String(clientId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Get information about the currently authenticated TikTok user. Requires a valid OAuth token with an active TikTok session.  **Authentication:** Provide the following header: - `x-oauth-token`: An OAuth access token. [Read More](https://www.eulerstream.com/docs/oauth)
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		getUserInfo: async (xOauthToken, options = {}) => {
			const localVarUrlObj = new URL(`/tiktok/oauth/userinfo`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Introspect a token to determine its state (RFC 7662). Returns active: true/false along with token metadata. Works for both access tokens and refresh tokens.
		* @param {IntrospectRequestBody} introspectRequestBody Introspection request parameters
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		introspectToken: async (introspectRequestBody, options = {}) => {
			assertParamExists("introspectToken", "introspectRequestBody", introspectRequestBody);
			const localVarUrlObj = new URL(`/tiktok/oauth/introspect`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			localVarHeaderParameter["Content-Type"] = "application/json";
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = serializeDataIfNeeded(introspectRequestBody, localVarRequestOptions, configuration);
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Revoke an access token or refresh token (RFC 7009). This endpoint always returns success for valid client credentials, even if the token was already revoked or invalid.
		* @param {RevokeRequestBody} revokeRequestBody Revoke request parameters
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		revokeToken: async (revokeRequestBody, options = {}) => {
			assertParamExists("revokeToken", "revokeRequestBody", revokeRequestBody);
			const localVarUrlObj = new URL(`/tiktok/oauth/revoke`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			localVarHeaderParameter["Content-Type"] = "application/json";
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = serializeDataIfNeeded(revokeRequestBody, localVarRequestOptions, configuration);
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Sign a non-LIVE TikTok URL. This is NOT available to customers in any public package, and access is approved on a case-by-case basis.
		* @param {SignTikTokUrlBody} signTikTokUrlBody Config for the signature generation
		* @param {string} [client] The TikTokLive client making the request
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		signTikTokUrl: async (signTikTokUrlBody, client, options = {}) => {
			assertParamExists("signTikTokUrl", "signTikTokUrlBody", signTikTokUrlBody);
			const localVarUrlObj = new URL(`/tiktok/sign_url`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (client !== void 0) localVarQueryParameter["client"] = client;
			localVarHeaderParameter["Content-Type"] = "application/json";
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = serializeDataIfNeeded(signTikTokUrlBody, localVarRequestOptions, configuration);
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Check if a stored refresh token is still valid without consuming it. Returns metadata about the session if valid.  This is a public endpoint — no authentication required.
		* @param {ValidateRefreshRequest} validateRefreshRequest The refresh token and client ID to validate
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		validateRefreshToken: async (validateRefreshRequest, options = {}) => {
			assertParamExists("validateRefreshToken", "validateRefreshRequest", validateRefreshRequest);
			const localVarUrlObj = new URL(`/tiktok/oauth/validate-refresh`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			localVarHeaderParameter["Content-Type"] = "application/json";
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = serializeDataIfNeeded(validateRefreshRequest, localVarRequestOptions, configuration);
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		}
	};
};
/**
* TikTokGeneralApi - functional programming interface
*/
var TikTokGeneralApiFp = function(configuration) {
	const localVarAxiosParamCreator = TikTokGeneralApiAxiosParamCreator(configuration);
	return {
		/**
		* Exchange an authorization code or refresh token for access tokens.  For authorization_code grant: - code: The authorization code from /oauth/complete - redirect_uri: Must match the original redirect_uri  For refresh_token grant: - refresh_token: A valid refresh token
		* @param {ExchangeTokenRequest} exchangeTokenRequest Token request parameters
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async exchangeToken(exchangeTokenRequest, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.exchangeToken(exchangeTokenRequest, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokGeneralApi.exchangeToken"]?.[localVarOperationServerIndex]?.url;
			return (axios$18, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$18, localVarOperationServerBasePath || basePath);
		},
		/**
		* Get public information about an OAuth client by client_id. This endpoint is used during the authorization flow to display client information to the user before they authorize.  Does not require authentication. Does not expose sensitive information like client_secret_hash.
		* @param {string} clientId The OAuth client ID to look up
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async getPublicClient(clientId, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.getPublicClient(clientId, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokGeneralApi.getPublicClient"]?.[localVarOperationServerIndex]?.url;
			return (axios$19, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$19, localVarOperationServerBasePath || basePath);
		},
		/**
		* Get information about the currently authenticated TikTok user. Requires a valid OAuth token with an active TikTok session.  **Authentication:** Provide the following header: - `x-oauth-token`: An OAuth access token. [Read More](https://www.eulerstream.com/docs/oauth)
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async getUserInfo(xOauthToken, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.getUserInfo(xOauthToken, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokGeneralApi.getUserInfo"]?.[localVarOperationServerIndex]?.url;
			return (axios$20, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$20, localVarOperationServerBasePath || basePath);
		},
		/**
		* Introspect a token to determine its state (RFC 7662). Returns active: true/false along with token metadata. Works for both access tokens and refresh tokens.
		* @param {IntrospectRequestBody} introspectRequestBody Introspection request parameters
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async introspectToken(introspectRequestBody, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.introspectToken(introspectRequestBody, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokGeneralApi.introspectToken"]?.[localVarOperationServerIndex]?.url;
			return (axios$21, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$21, localVarOperationServerBasePath || basePath);
		},
		/**
		* Revoke an access token or refresh token (RFC 7009). This endpoint always returns success for valid client credentials, even if the token was already revoked or invalid.
		* @param {RevokeRequestBody} revokeRequestBody Revoke request parameters
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async revokeToken(revokeRequestBody, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.revokeToken(revokeRequestBody, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokGeneralApi.revokeToken"]?.[localVarOperationServerIndex]?.url;
			return (axios$22, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$22, localVarOperationServerBasePath || basePath);
		},
		/**
		* Sign a non-LIVE TikTok URL. This is NOT available to customers in any public package, and access is approved on a case-by-case basis.
		* @param {SignTikTokUrlBody} signTikTokUrlBody Config for the signature generation
		* @param {string} [client] The TikTokLive client making the request
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async signTikTokUrl(signTikTokUrlBody, client, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.signTikTokUrl(signTikTokUrlBody, client, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokGeneralApi.signTikTokUrl"]?.[localVarOperationServerIndex]?.url;
			return (axios$23, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$23, localVarOperationServerBasePath || basePath);
		},
		/**
		* Check if a stored refresh token is still valid without consuming it. Returns metadata about the session if valid.  This is a public endpoint — no authentication required.
		* @param {ValidateRefreshRequest} validateRefreshRequest The refresh token and client ID to validate
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async validateRefreshToken(validateRefreshRequest, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.validateRefreshToken(validateRefreshRequest, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokGeneralApi.validateRefreshToken"]?.[localVarOperationServerIndex]?.url;
			return (axios$24, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$24, localVarOperationServerBasePath || basePath);
		}
	};
};
/**
* TikTokGeneralApi - object-oriented interface
*/
var TikTokGeneralApi = class extends BaseAPI {
	/**
	* Exchange an authorization code or refresh token for access tokens.  For authorization_code grant: - code: The authorization code from /oauth/complete - redirect_uri: Must match the original redirect_uri  For refresh_token grant: - refresh_token: A valid refresh token
	* @param {ExchangeTokenRequest} exchangeTokenRequest Token request parameters
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	exchangeToken(exchangeTokenRequest, options) {
		return TikTokGeneralApiFp(this.configuration).exchangeToken(exchangeTokenRequest, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Get public information about an OAuth client by client_id. This endpoint is used during the authorization flow to display client information to the user before they authorize.  Does not require authentication. Does not expose sensitive information like client_secret_hash.
	* @param {string} clientId The OAuth client ID to look up
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	getPublicClient(clientId, options) {
		return TikTokGeneralApiFp(this.configuration).getPublicClient(clientId, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Get information about the currently authenticated TikTok user. Requires a valid OAuth token with an active TikTok session.  **Authentication:** Provide the following header: - `x-oauth-token`: An OAuth access token. [Read More](https://www.eulerstream.com/docs/oauth)
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	getUserInfo(xOauthToken, options) {
		return TikTokGeneralApiFp(this.configuration).getUserInfo(xOauthToken, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Introspect a token to determine its state (RFC 7662). Returns active: true/false along with token metadata. Works for both access tokens and refresh tokens.
	* @param {IntrospectRequestBody} introspectRequestBody Introspection request parameters
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	introspectToken(introspectRequestBody, options) {
		return TikTokGeneralApiFp(this.configuration).introspectToken(introspectRequestBody, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Revoke an access token or refresh token (RFC 7009). This endpoint always returns success for valid client credentials, even if the token was already revoked or invalid.
	* @param {RevokeRequestBody} revokeRequestBody Revoke request parameters
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	revokeToken(revokeRequestBody, options) {
		return TikTokGeneralApiFp(this.configuration).revokeToken(revokeRequestBody, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Sign a non-LIVE TikTok URL. This is NOT available to customers in any public package, and access is approved on a case-by-case basis.
	* @param {SignTikTokUrlBody} signTikTokUrlBody Config for the signature generation
	* @param {string} [client] The TikTokLive client making the request
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	signTikTokUrl(signTikTokUrlBody, client, options) {
		return TikTokGeneralApiFp(this.configuration).signTikTokUrl(signTikTokUrlBody, client, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Check if a stored refresh token is still valid without consuming it. Returns metadata about the session if valid.  This is a public endpoint — no authentication required.
	* @param {ValidateRefreshRequest} validateRefreshRequest The refresh token and client ID to validate
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	validateRefreshToken(validateRefreshRequest, options) {
		return TikTokGeneralApiFp(this.configuration).validateRefreshToken(validateRefreshRequest, options).then((request) => request(this.axios, this.basePath));
	}
};
/**
* TikTokLIVEApi - axios parameter creator
*/
var TikTokLIVEApiAxiosParamCreator = function(configuration) {
	return {
		/**
		* A bulk-check endpoint to determine if a group of TikTok users (up to 50 at once) are live. It uses a highly optimized job-based system for checking large numbers of users quickly.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {RetrieveBulkLiveCheckRequest} retrieveBulkLiveCheckRequest The body of the request containing user numeric IDs (e.g. 7602356191083907865).
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveBulkLiveCheck: async (retrieveBulkLiveCheckRequest, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("retrieveBulkLiveCheck", "retrieveBulkLiveCheckRequest", retrieveBulkLiveCheckRequest);
			const localVarUrlObj = new URL(`/webcast/bulk_live_check`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Content-Type"] = "application/json";
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = serializeDataIfNeeded(retrieveBulkLiveCheckRequest, localVarRequestOptions, configuration);
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve the list of available hashtags for TikTok LIVE streams.
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveHashtagList: async (options = {}) => {
			const localVarUrlObj = new URL(`/webcast/hashtags`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Fetch the TikTok LIVE webcast feed for a specific region. Gets a random sampling of creators for a region.
		* @param {PooledProxyRegion} region The region (country) with which to fetch a feed from.
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveWebcastFeed: async (region, options = {}) => {
			assertParamExists("retrieveWebcastFeed", "region", region);
			const localVarUrlObj = new URL(`/webcast/feed`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (region !== void 0) localVarQueryParameter["region"] = region;
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve TikTok LIVE rankings for a specific region.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {PooledProxyRegion} region The region (country) with which to fetch a feed from.
		* @param {RetrieveWebcastRankingsRankTypeEnum} rankType The type of ranking to fetch. See documentation for more details.
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {string} [sessionId] Use x-oauth-token or x-cookie-header instead
		* @param {string} [ttTargetIdc] Use x-oauth-token or x-cookie-header instead
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveWebcastRankings: async (region, rankType, xOauthToken, xCookieHeader, sessionId, ttTargetIdc, options = {}) => {
			assertParamExists("retrieveWebcastRankings", "region", region);
			assertParamExists("retrieveWebcastRankings", "rankType", rankType);
			const localVarUrlObj = new URL(`/webcast/rankings`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (region !== void 0) localVarQueryParameter["region"] = region;
			if (rankType !== void 0) localVarQueryParameter["rank_type"] = rankType;
			if (sessionId !== void 0) localVarQueryParameter["session_id"] = sessionId;
			if (ttTargetIdc !== void 0) localVarQueryParameter["tt_target_idc"] = ttTargetIdc;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		}
	};
};
/**
* TikTokLIVEApi - functional programming interface
*/
var TikTokLIVEApiFp = function(configuration) {
	const localVarAxiosParamCreator = TikTokLIVEApiAxiosParamCreator(configuration);
	return {
		/**
		* A bulk-check endpoint to determine if a group of TikTok users (up to 50 at once) are live. It uses a highly optimized job-based system for checking large numbers of users quickly.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {RetrieveBulkLiveCheckRequest} retrieveBulkLiveCheckRequest The body of the request containing user numeric IDs (e.g. 7602356191083907865).
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveBulkLiveCheck(retrieveBulkLiveCheckRequest, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveBulkLiveCheck(retrieveBulkLiveCheckRequest, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEApi.retrieveBulkLiveCheck"]?.[localVarOperationServerIndex]?.url;
			return (axios$25, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$25, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve the list of available hashtags for TikTok LIVE streams.
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveHashtagList(options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveHashtagList(options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEApi.retrieveHashtagList"]?.[localVarOperationServerIndex]?.url;
			return (axios$26, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$26, localVarOperationServerBasePath || basePath);
		},
		/**
		* Fetch the TikTok LIVE webcast feed for a specific region. Gets a random sampling of creators for a region.
		* @param {PooledProxyRegion} region The region (country) with which to fetch a feed from.
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveWebcastFeed(region, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveWebcastFeed(region, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEApi.retrieveWebcastFeed"]?.[localVarOperationServerIndex]?.url;
			return (axios$27, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$27, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve TikTok LIVE rankings for a specific region.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {PooledProxyRegion} region The region (country) with which to fetch a feed from.
		* @param {RetrieveWebcastRankingsRankTypeEnum} rankType The type of ranking to fetch. See documentation for more details.
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {string} [sessionId] Use x-oauth-token or x-cookie-header instead
		* @param {string} [ttTargetIdc] Use x-oauth-token or x-cookie-header instead
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveWebcastRankings(region, rankType, xOauthToken, xCookieHeader, sessionId, ttTargetIdc, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveWebcastRankings(region, rankType, xOauthToken, xCookieHeader, sessionId, ttTargetIdc, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEApi.retrieveWebcastRankings"]?.[localVarOperationServerIndex]?.url;
			return (axios$28, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$28, localVarOperationServerBasePath || basePath);
		}
	};
};
/**
* TikTokLIVEApi - object-oriented interface
*/
var TikTokLIVEApi = class extends BaseAPI {
	/**
	* A bulk-check endpoint to determine if a group of TikTok users (up to 50 at once) are live. It uses a highly optimized job-based system for checking large numbers of users quickly.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {RetrieveBulkLiveCheckRequest} retrieveBulkLiveCheckRequest The body of the request containing user numeric IDs (e.g. 7602356191083907865).
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveBulkLiveCheck(retrieveBulkLiveCheckRequest, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEApiFp(this.configuration).retrieveBulkLiveCheck(retrieveBulkLiveCheckRequest, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve the list of available hashtags for TikTok LIVE streams.
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveHashtagList(options) {
		return TikTokLIVEApiFp(this.configuration).retrieveHashtagList(options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Fetch the TikTok LIVE webcast feed for a specific region. Gets a random sampling of creators for a region.
	* @param {PooledProxyRegion} region The region (country) with which to fetch a feed from.
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveWebcastFeed(region, options) {
		return TikTokLIVEApiFp(this.configuration).retrieveWebcastFeed(region, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve TikTok LIVE rankings for a specific region.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {PooledProxyRegion} region The region (country) with which to fetch a feed from.
	* @param {RetrieveWebcastRankingsRankTypeEnum} rankType The type of ranking to fetch. See documentation for more details.
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {string} [sessionId] Use x-oauth-token or x-cookie-header instead
	* @param {string} [ttTargetIdc] Use x-oauth-token or x-cookie-header instead
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveWebcastRankings(region, rankType, xOauthToken, xCookieHeader, sessionId, ttTargetIdc, options) {
		return TikTokLIVEApiFp(this.configuration).retrieveWebcastRankings(region, rankType, xOauthToken, xCookieHeader, sessionId, ttTargetIdc, options).then((request) => request(this.axios, this.basePath));
	}
};
/**
* TikTokLIVEAlertTargetsApi - axios parameter creator
*/
var TikTokLIVEAlertTargetsApiAxiosParamCreator = function(configuration) {
	return {
		/**
		* Create a target for an alert. This is the HTTP endpoint that will be called when an alert is triggered.
		* @param {number} accountId The ID of the account to create the alert target for
		* @param {number} alertId The ID of the alert to create the target for
		* @param {CreateAlertTargetPayload} createAlertTargetPayload Configuration for the alert target
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		createAlertTarget: async (accountId, alertId, createAlertTargetPayload, options = {}) => {
			assertParamExists("createAlertTarget", "accountId", accountId);
			assertParamExists("createAlertTarget", "alertId", alertId);
			assertParamExists("createAlertTarget", "createAlertTargetPayload", createAlertTargetPayload);
			const localVarPath = `/accounts/{account_id}/alerts/{alert_id}/targets/create`.replace("{account_id}", encodeURIComponent(String(accountId))).replace("{alert_id}", encodeURIComponent(String(alertId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "PUT",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Content-Type"] = "application/json";
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = serializeDataIfNeeded(createAlertTargetPayload, localVarRequestOptions, configuration);
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Delete an alert target from the Sign API
		* @param {number} accountId The ID of the account to delete the alert target from
		* @param {number} alertId The ID of the alert to delete the target from
		* @param {number} targetId The ID of the target to delete
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		deleteAlertTarget: async (accountId, alertId, targetId, options = {}) => {
			assertParamExists("deleteAlertTarget", "accountId", accountId);
			assertParamExists("deleteAlertTarget", "alertId", alertId);
			assertParamExists("deleteAlertTarget", "targetId", targetId);
			const localVarPath = `/accounts/{account_id}/alerts/{alert_id}/targets/{target_id}/delete`.replace("{account_id}", encodeURIComponent(String(accountId))).replace("{alert_id}", encodeURIComponent(String(alertId))).replace("{target_id}", encodeURIComponent(String(targetId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "DELETE",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* List all alert targets for a specific alert
		* @param {number} accountId The account that the alert belongs to
		* @param {number} alertId The alert to list targets for
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		listAlertTargets: async (accountId, alertId, options = {}) => {
			assertParamExists("listAlertTargets", "accountId", accountId);
			assertParamExists("listAlertTargets", "alertId", alertId);
			const localVarPath = `/accounts/{account_id}/alerts/{alert_id}/targets/list`.replace("{account_id}", encodeURIComponent(String(accountId))).replace("{alert_id}", encodeURIComponent(String(alertId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Test an alert target
		* @param {number} accountId The account that the alert belongs to
		* @param {number} alertId The alert that the target belongs to
		* @param {number} targetId The target to test
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		testAlertTarget: async (accountId, alertId, targetId, options = {}) => {
			assertParamExists("testAlertTarget", "accountId", accountId);
			assertParamExists("testAlertTarget", "alertId", alertId);
			assertParamExists("testAlertTarget", "targetId", targetId);
			const localVarPath = `/accounts/{account_id}/alerts/{alert_id}/targets/{target_id}/test`.replace("{account_id}", encodeURIComponent(String(accountId))).replace("{alert_id}", encodeURIComponent(String(alertId))).replace("{target_id}", encodeURIComponent(String(targetId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		}
	};
};
/**
* TikTokLIVEAlertTargetsApi - functional programming interface
*/
var TikTokLIVEAlertTargetsApiFp = function(configuration) {
	const localVarAxiosParamCreator = TikTokLIVEAlertTargetsApiAxiosParamCreator(configuration);
	return {
		/**
		* Create a target for an alert. This is the HTTP endpoint that will be called when an alert is triggered.
		* @param {number} accountId The ID of the account to create the alert target for
		* @param {number} alertId The ID of the alert to create the target for
		* @param {CreateAlertTargetPayload} createAlertTargetPayload Configuration for the alert target
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async createAlertTarget(accountId, alertId, createAlertTargetPayload, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.createAlertTarget(accountId, alertId, createAlertTargetPayload, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAlertTargetsApi.createAlertTarget"]?.[localVarOperationServerIndex]?.url;
			return (axios$29, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$29, localVarOperationServerBasePath || basePath);
		},
		/**
		* Delete an alert target from the Sign API
		* @param {number} accountId The ID of the account to delete the alert target from
		* @param {number} alertId The ID of the alert to delete the target from
		* @param {number} targetId The ID of the target to delete
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async deleteAlertTarget(accountId, alertId, targetId, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.deleteAlertTarget(accountId, alertId, targetId, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAlertTargetsApi.deleteAlertTarget"]?.[localVarOperationServerIndex]?.url;
			return (axios$30, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$30, localVarOperationServerBasePath || basePath);
		},
		/**
		* List all alert targets for a specific alert
		* @param {number} accountId The account that the alert belongs to
		* @param {number} alertId The alert to list targets for
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async listAlertTargets(accountId, alertId, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.listAlertTargets(accountId, alertId, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAlertTargetsApi.listAlertTargets"]?.[localVarOperationServerIndex]?.url;
			return (axios$31, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$31, localVarOperationServerBasePath || basePath);
		},
		/**
		* Test an alert target
		* @param {number} accountId The account that the alert belongs to
		* @param {number} alertId The alert that the target belongs to
		* @param {number} targetId The target to test
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async testAlertTarget(accountId, alertId, targetId, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.testAlertTarget(accountId, alertId, targetId, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAlertTargetsApi.testAlertTarget"]?.[localVarOperationServerIndex]?.url;
			return (axios$32, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$32, localVarOperationServerBasePath || basePath);
		}
	};
};
/**
* TikTokLIVEAlertTargetsApi - object-oriented interface
*/
var TikTokLIVEAlertTargetsApi = class extends BaseAPI {
	/**
	* Create a target for an alert. This is the HTTP endpoint that will be called when an alert is triggered.
	* @param {number} accountId The ID of the account to create the alert target for
	* @param {number} alertId The ID of the alert to create the target for
	* @param {CreateAlertTargetPayload} createAlertTargetPayload Configuration for the alert target
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	createAlertTarget(accountId, alertId, createAlertTargetPayload, options) {
		return TikTokLIVEAlertTargetsApiFp(this.configuration).createAlertTarget(accountId, alertId, createAlertTargetPayload, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Delete an alert target from the Sign API
	* @param {number} accountId The ID of the account to delete the alert target from
	* @param {number} alertId The ID of the alert to delete the target from
	* @param {number} targetId The ID of the target to delete
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	deleteAlertTarget(accountId, alertId, targetId, options) {
		return TikTokLIVEAlertTargetsApiFp(this.configuration).deleteAlertTarget(accountId, alertId, targetId, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* List all alert targets for a specific alert
	* @param {number} accountId The account that the alert belongs to
	* @param {number} alertId The alert to list targets for
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	listAlertTargets(accountId, alertId, options) {
		return TikTokLIVEAlertTargetsApiFp(this.configuration).listAlertTargets(accountId, alertId, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Test an alert target
	* @param {number} accountId The account that the alert belongs to
	* @param {number} alertId The alert that the target belongs to
	* @param {number} targetId The target to test
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	testAlertTarget(accountId, alertId, targetId, options) {
		return TikTokLIVEAlertTargetsApiFp(this.configuration).testAlertTarget(accountId, alertId, targetId, options).then((request) => request(this.axios, this.basePath));
	}
};
/**
* TikTokLIVEAlertsApi - axios parameter creator
*/
var TikTokLIVEAlertsApiAxiosParamCreator = function(configuration) {
	return {
		/**
		* Create a creator alert. These Alerts are used to notify users of a new livestream.
		* @param {number} accountId The ID of the account to create the alert for
		* @param {CreateAlertRequest} createAlertRequest Configuration for the alert
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		createAlert: async (accountId, createAlertRequest, options = {}) => {
			assertParamExists("createAlert", "accountId", accountId);
			assertParamExists("createAlert", "createAlertRequest", createAlertRequest);
			const localVarPath = `/accounts/{account_id}/alerts/create`.replace("{account_id}", encodeURIComponent(String(accountId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "PUT",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Content-Type"] = "application/json";
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = serializeDataIfNeeded(createAlertRequest, localVarRequestOptions, configuration);
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Delete an alert from the Sign API
		* @param {number} accountId The ID of the account to delete the alert from
		* @param {number} alertId The ID of the alert to delete
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		deleteAlert: async (accountId, alertId, options = {}) => {
			assertParamExists("deleteAlert", "accountId", accountId);
			assertParamExists("deleteAlert", "alertId", alertId);
			const localVarPath = `/accounts/{account_id}/alerts/{alert_id}/delete`.replace("{account_id}", encodeURIComponent(String(accountId))).replace("{alert_id}", encodeURIComponent(String(alertId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "DELETE",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* 
		* @param {number} accountId 
		* @param {number} [page] 
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		listAlerts: async (accountId, page, options = {}) => {
			assertParamExists("listAlerts", "accountId", accountId);
			const localVarPath = `/accounts/{account_id}/alerts/list`.replace("{account_id}", encodeURIComponent(String(accountId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (page !== void 0) localVarQueryParameter["page"] = page;
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve a specific alert by its ID
		* @param {number} accountId The account that the alert belongs to
		* @param {number} alertId The ID of the alert to retrieve
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveAlert: async (accountId, alertId, options = {}) => {
			assertParamExists("retrieveAlert", "accountId", accountId);
			assertParamExists("retrieveAlert", "alertId", alertId);
			const localVarPath = `/accounts/{account_id}/alerts/{alert_id}/retrieve`.replace("{account_id}", encodeURIComponent(String(accountId))).replace("{alert_id}", encodeURIComponent(String(alertId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		}
	};
};
/**
* TikTokLIVEAlertsApi - functional programming interface
*/
var TikTokLIVEAlertsApiFp = function(configuration) {
	const localVarAxiosParamCreator = TikTokLIVEAlertsApiAxiosParamCreator(configuration);
	return {
		/**
		* Create a creator alert. These Alerts are used to notify users of a new livestream.
		* @param {number} accountId The ID of the account to create the alert for
		* @param {CreateAlertRequest} createAlertRequest Configuration for the alert
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async createAlert(accountId, createAlertRequest, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.createAlert(accountId, createAlertRequest, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAlertsApi.createAlert"]?.[localVarOperationServerIndex]?.url;
			return (axios$33, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$33, localVarOperationServerBasePath || basePath);
		},
		/**
		* Delete an alert from the Sign API
		* @param {number} accountId The ID of the account to delete the alert from
		* @param {number} alertId The ID of the alert to delete
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async deleteAlert(accountId, alertId, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.deleteAlert(accountId, alertId, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAlertsApi.deleteAlert"]?.[localVarOperationServerIndex]?.url;
			return (axios$34, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$34, localVarOperationServerBasePath || basePath);
		},
		/**
		* 
		* @param {number} accountId 
		* @param {number} [page] 
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async listAlerts(accountId, page, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.listAlerts(accountId, page, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAlertsApi.listAlerts"]?.[localVarOperationServerIndex]?.url;
			return (axios$35, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$35, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve a specific alert by its ID
		* @param {number} accountId The account that the alert belongs to
		* @param {number} alertId The ID of the alert to retrieve
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveAlert(accountId, alertId, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveAlert(accountId, alertId, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAlertsApi.retrieveAlert"]?.[localVarOperationServerIndex]?.url;
			return (axios$36, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$36, localVarOperationServerBasePath || basePath);
		}
	};
};
/**
* TikTokLIVEAlertsApi - object-oriented interface
*/
var TikTokLIVEAlertsApi = class extends BaseAPI {
	/**
	* Create a creator alert. These Alerts are used to notify users of a new livestream.
	* @param {number} accountId The ID of the account to create the alert for
	* @param {CreateAlertRequest} createAlertRequest Configuration for the alert
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	createAlert(accountId, createAlertRequest, options) {
		return TikTokLIVEAlertsApiFp(this.configuration).createAlert(accountId, createAlertRequest, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Delete an alert from the Sign API
	* @param {number} accountId The ID of the account to delete the alert from
	* @param {number} alertId The ID of the alert to delete
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	deleteAlert(accountId, alertId, options) {
		return TikTokLIVEAlertsApiFp(this.configuration).deleteAlert(accountId, alertId, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* 
	* @param {number} accountId 
	* @param {number} [page] 
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	listAlerts(accountId, page, options) {
		return TikTokLIVEAlertsApiFp(this.configuration).listAlerts(accountId, page, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve a specific alert by its ID
	* @param {number} accountId The account that the alert belongs to
	* @param {number} alertId The ID of the alert to retrieve
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveAlert(accountId, alertId, options) {
		return TikTokLIVEAlertsApiFp(this.configuration).retrieveAlert(accountId, alertId, options).then((request) => request(this.axios, this.basePath));
	}
};
/**
* TikTokLIVEAnchorsApi - axios parameter creator
*/
var TikTokLIVEAnchorsApiAxiosParamCreator = function(configuration) {
	return {
		/**
		* Add a moderator in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} toUserId The user ID to add as moderator
		* @param {string} anchorId The streamer\&#39;s user ID
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		addRoomModerator: async (toUserId, anchorId, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("addRoomModerator", "toUserId", toUserId);
			assertParamExists("addRoomModerator", "anchorId", anchorId);
			const localVarPath = `/webcast/anchors/{anchor_id}/moderation/moderators`.replace("{anchor_id}", encodeURIComponent(String(anchorId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "PUT",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (toUserId !== void 0) localVarQueryParameter["to_user_id"] = toUserId;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Remove a moderator from a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} toUserId The user ID to remove as moderator
		* @param {string} anchorId The streamer\&#39;s user ID
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		removeRoomModerator: async (toUserId, anchorId, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("removeRoomModerator", "toUserId", toUserId);
			assertParamExists("removeRoomModerator", "anchorId", anchorId);
			const localVarPath = `/webcast/anchors/{anchor_id}/moderation/moderators`.replace("{anchor_id}", encodeURIComponent(String(anchorId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "DELETE",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (toUserId !== void 0) localVarQueryParameter["to_user_id"] = toUserId;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Find out how long a user watched your stream, the # of comments sent, likes, the comments themselves, and more analytics data.  **Note:** The session you attach must own the livestream to check analytics for a given `room_id`.  Returns details about a user\'s activity in a room including comments, likes, shares, and watch duration.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {string} userId The numeric user ID to get interactions for
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveLiveAnalyticsUserInteractions: async (roomId, userId, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("retrieveLiveAnalyticsUserInteractions", "roomId", roomId);
			assertParamExists("retrieveLiveAnalyticsUserInteractions", "userId", userId);
			const localVarPath = `/webcast/anchors/me/rooms/{room_id}/interactions`.replace("{room_id}", encodeURIComponent(String(roomId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (userId !== void 0) localVarQueryParameter["user_id"] = userId;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve detailed analytics for a specific past livestream.  **Note:** The session you attach must own the livestream to check analytics for a given `room_id`.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream to get analytics for
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveLiveAnalyticsVideoDetail: async (roomId, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("retrieveLiveAnalyticsVideoDetail", "roomId", roomId);
			const localVarPath = `/webcast/anchors/me/rooms/{room_id}/details`.replace("{room_id}", encodeURIComponent(String(roomId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve the list of past livestreams with analytics for the authenticated user.  **Note:** The session you attach must own the livestream to check analytics for a given `room_id`.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {number} [count] Number of videos to retrieve (default: 10)
		* @param {number} [offset] Pagination offset (default: 0)
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveLiveAnalyticsVideoList: async (count, offset, xOauthToken, xCookieHeader, options = {}) => {
			const localVarUrlObj = new URL(`/webcast/anchors/me/rooms`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (count !== void 0) localVarQueryParameter["count"] = count;
			if (offset !== void 0) localVarQueryParameter["offset"] = offset;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Fetch TikTok LIVE Stream Cover URL given a uniqueId.
		* @param {string} uniqueId The unique ID of the TikTok to fetch the cover for.
		* @param {boolean} [redirect] Whether to redirect to the URL directly
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveRoomCover: async (uniqueId, redirect, options = {}) => {
			assertParamExists("retrieveRoomCover", "uniqueId", uniqueId);
			const localVarPath = `/webcast/anchors/{unique_id}/room_cover`.replace("{unique_id}", encodeURIComponent(String(uniqueId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (redirect !== void 0) localVarQueryParameter["redirect"] = redirect;
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Fetch Room ID for a given uniqueId & whether that user is live.
		* @param {string} uniqueId The unique ID of the TikTok user to fetch the data for.
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveRoomId: async (uniqueId, options = {}) => {
			assertParamExists("retrieveRoomId", "uniqueId", uniqueId);
			const localVarPath = `/webcast/anchors/{unique_id}/room_id`.replace("{unique_id}", encodeURIComponent(String(uniqueId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve TikTok Live Room Information
		* @param {string} uniqueId The unique identifier for the TikTok user or room
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveRoomInfo: async (uniqueId, options = {}) => {
			assertParamExists("retrieveRoomInfo", "uniqueId", uniqueId);
			const localVarPath = `/webcast/anchors/{unique_id}/room_info`.replace("{unique_id}", encodeURIComponent(String(uniqueId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve the list of moderators in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} anchorId The streamer\&#39;s numeric user ID
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveRoomModerators: async (anchorId, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("retrieveRoomModerators", "anchorId", anchorId);
			const localVarPath = `/webcast/anchors/{anchor_id}/moderation/moderators`.replace("{anchor_id}", encodeURIComponent(String(anchorId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Fetch TikTok LIVE Stream video given a uniqueId.
		* @param {string} uniqueId The unique ID of the TikTok to fetch the data for.
		* @param {StreamType} [streamType] The type of video stream to fetch. Default is HLS_SD.
		* @param {boolean} [redirect] Whether to redirect or return as JSON
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveRoomVideo: async (uniqueId, streamType, redirect, options = {}) => {
			assertParamExists("retrieveRoomVideo", "uniqueId", uniqueId);
			const localVarPath = `/webcast/anchors/{unique_id}/room_video`.replace("{unique_id}", encodeURIComponent(String(uniqueId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (streamType !== void 0) localVarQueryParameter["streamType"] = streamType;
			if (redirect !== void 0) localVarQueryParameter["redirect"] = redirect;
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve the TikTok LIVE gift gallery (sponsorable gifts + sponsorship progress) for a creator.  The gallery is rendered per-viewer, so a session is required.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} uniqueId The creator\&#39;s unique ID (handle).
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveWebcastGiftGallery: async (uniqueId, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("retrieveWebcastGiftGallery", "uniqueId", uniqueId);
			const localVarPath = `/webcast/anchors/{unique_id}/gift_gallery`.replace("{unique_id}", encodeURIComponent(String(uniqueId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve TikTok LIVE earnings for a specific user.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} uniqueId The unique ID (username) of the user to fetch earnings for.
		* @param {WebcastUserEarningsOutputPeriod} [period] Earnings period
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {string} [sessionId] Use x-oauth-token or x-cookie-header instead
		* @param {string} [ttTargetIdc] Use x-oauth-token or x-cookie-header instead
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveWebcastUserEarnings: async (uniqueId, period, xOauthToken, xCookieHeader, sessionId, ttTargetIdc, options = {}) => {
			assertParamExists("retrieveWebcastUserEarnings", "uniqueId", uniqueId);
			const localVarPath = `/webcast/anchors/{unique_id}/earnings`.replace("{unique_id}", encodeURIComponent(String(uniqueId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (period !== void 0) localVarQueryParameter["period"] = period;
			if (sessionId !== void 0) localVarQueryParameter["session_id"] = sessionId;
			if (ttTargetIdc !== void 0) localVarQueryParameter["tt_target_idc"] = ttTargetIdc;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Resolve a TikTok
		* @param {string} uniqueId The unique ID (handle) of the TikTok user.
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveWebcastUserId: async (uniqueId, options = {}) => {
			assertParamExists("retrieveWebcastUserId", "uniqueId", uniqueId);
			const localVarPath = `/webcast/anchors/{unique_id}/user_id`.replace("{unique_id}", encodeURIComponent(String(uniqueId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		}
	};
};
/**
* TikTokLIVEAnchorsApi - functional programming interface
*/
var TikTokLIVEAnchorsApiFp = function(configuration) {
	const localVarAxiosParamCreator = TikTokLIVEAnchorsApiAxiosParamCreator(configuration);
	return {
		/**
		* Add a moderator in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} toUserId The user ID to add as moderator
		* @param {string} anchorId The streamer\&#39;s user ID
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async addRoomModerator(toUserId, anchorId, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.addRoomModerator(toUserId, anchorId, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAnchorsApi.addRoomModerator"]?.[localVarOperationServerIndex]?.url;
			return (axios$37, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$37, localVarOperationServerBasePath || basePath);
		},
		/**
		* Remove a moderator from a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} toUserId The user ID to remove as moderator
		* @param {string} anchorId The streamer\&#39;s user ID
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async removeRoomModerator(toUserId, anchorId, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.removeRoomModerator(toUserId, anchorId, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAnchorsApi.removeRoomModerator"]?.[localVarOperationServerIndex]?.url;
			return (axios$38, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$38, localVarOperationServerBasePath || basePath);
		},
		/**
		* Find out how long a user watched your stream, the # of comments sent, likes, the comments themselves, and more analytics data.  **Note:** The session you attach must own the livestream to check analytics for a given `room_id`.  Returns details about a user\'s activity in a room including comments, likes, shares, and watch duration.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {string} userId The numeric user ID to get interactions for
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveLiveAnalyticsUserInteractions(roomId, userId, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveLiveAnalyticsUserInteractions(roomId, userId, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAnchorsApi.retrieveLiveAnalyticsUserInteractions"]?.[localVarOperationServerIndex]?.url;
			return (axios$39, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$39, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve detailed analytics for a specific past livestream.  **Note:** The session you attach must own the livestream to check analytics for a given `room_id`.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream to get analytics for
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveLiveAnalyticsVideoDetail(roomId, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveLiveAnalyticsVideoDetail(roomId, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAnchorsApi.retrieveLiveAnalyticsVideoDetail"]?.[localVarOperationServerIndex]?.url;
			return (axios$40, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$40, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve the list of past livestreams with analytics for the authenticated user.  **Note:** The session you attach must own the livestream to check analytics for a given `room_id`.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {number} [count] Number of videos to retrieve (default: 10)
		* @param {number} [offset] Pagination offset (default: 0)
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveLiveAnalyticsVideoList(count, offset, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveLiveAnalyticsVideoList(count, offset, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAnchorsApi.retrieveLiveAnalyticsVideoList"]?.[localVarOperationServerIndex]?.url;
			return (axios$41, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$41, localVarOperationServerBasePath || basePath);
		},
		/**
		* Fetch TikTok LIVE Stream Cover URL given a uniqueId.
		* @param {string} uniqueId The unique ID of the TikTok to fetch the cover for.
		* @param {boolean} [redirect] Whether to redirect to the URL directly
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveRoomCover(uniqueId, redirect, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveRoomCover(uniqueId, redirect, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAnchorsApi.retrieveRoomCover"]?.[localVarOperationServerIndex]?.url;
			return (axios$42, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$42, localVarOperationServerBasePath || basePath);
		},
		/**
		* Fetch Room ID for a given uniqueId & whether that user is live.
		* @param {string} uniqueId The unique ID of the TikTok user to fetch the data for.
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveRoomId(uniqueId, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveRoomId(uniqueId, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAnchorsApi.retrieveRoomId"]?.[localVarOperationServerIndex]?.url;
			return (axios$43, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$43, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve TikTok Live Room Information
		* @param {string} uniqueId The unique identifier for the TikTok user or room
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveRoomInfo(uniqueId, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveRoomInfo(uniqueId, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAnchorsApi.retrieveRoomInfo"]?.[localVarOperationServerIndex]?.url;
			return (axios$44, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$44, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve the list of moderators in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} anchorId The streamer\&#39;s numeric user ID
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveRoomModerators(anchorId, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveRoomModerators(anchorId, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAnchorsApi.retrieveRoomModerators"]?.[localVarOperationServerIndex]?.url;
			return (axios$45, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$45, localVarOperationServerBasePath || basePath);
		},
		/**
		* Fetch TikTok LIVE Stream video given a uniqueId.
		* @param {string} uniqueId The unique ID of the TikTok to fetch the data for.
		* @param {StreamType} [streamType] The type of video stream to fetch. Default is HLS_SD.
		* @param {boolean} [redirect] Whether to redirect or return as JSON
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveRoomVideo(uniqueId, streamType, redirect, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveRoomVideo(uniqueId, streamType, redirect, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAnchorsApi.retrieveRoomVideo"]?.[localVarOperationServerIndex]?.url;
			return (axios$46, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$46, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve the TikTok LIVE gift gallery (sponsorable gifts + sponsorship progress) for a creator.  The gallery is rendered per-viewer, so a session is required.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} uniqueId The creator\&#39;s unique ID (handle).
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveWebcastGiftGallery(uniqueId, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveWebcastGiftGallery(uniqueId, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAnchorsApi.retrieveWebcastGiftGallery"]?.[localVarOperationServerIndex]?.url;
			return (axios$47, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$47, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve TikTok LIVE earnings for a specific user.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} uniqueId The unique ID (username) of the user to fetch earnings for.
		* @param {WebcastUserEarningsOutputPeriod} [period] Earnings period
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {string} [sessionId] Use x-oauth-token or x-cookie-header instead
		* @param {string} [ttTargetIdc] Use x-oauth-token or x-cookie-header instead
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveWebcastUserEarnings(uniqueId, period, xOauthToken, xCookieHeader, sessionId, ttTargetIdc, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveWebcastUserEarnings(uniqueId, period, xOauthToken, xCookieHeader, sessionId, ttTargetIdc, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAnchorsApi.retrieveWebcastUserEarnings"]?.[localVarOperationServerIndex]?.url;
			return (axios$48, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$48, localVarOperationServerBasePath || basePath);
		},
		/**
		* Resolve a TikTok
		* @param {string} uniqueId The unique ID (handle) of the TikTok user.
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveWebcastUserId(uniqueId, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveWebcastUserId(uniqueId, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEAnchorsApi.retrieveWebcastUserId"]?.[localVarOperationServerIndex]?.url;
			return (axios$49, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$49, localVarOperationServerBasePath || basePath);
		}
	};
};
/**
* TikTokLIVEAnchorsApi - object-oriented interface
*/
var TikTokLIVEAnchorsApi = class extends BaseAPI {
	/**
	* Add a moderator in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} toUserId The user ID to add as moderator
	* @param {string} anchorId The streamer\&#39;s user ID
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	addRoomModerator(toUserId, anchorId, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEAnchorsApiFp(this.configuration).addRoomModerator(toUserId, anchorId, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Remove a moderator from a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} toUserId The user ID to remove as moderator
	* @param {string} anchorId The streamer\&#39;s user ID
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	removeRoomModerator(toUserId, anchorId, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEAnchorsApiFp(this.configuration).removeRoomModerator(toUserId, anchorId, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Find out how long a user watched your stream, the # of comments sent, likes, the comments themselves, and more analytics data.  **Note:** The session you attach must own the livestream to check analytics for a given `room_id`.  Returns details about a user\'s activity in a room including comments, likes, shares, and watch duration.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} roomId The room ID of the livestream
	* @param {string} userId The numeric user ID to get interactions for
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveLiveAnalyticsUserInteractions(roomId, userId, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEAnchorsApiFp(this.configuration).retrieveLiveAnalyticsUserInteractions(roomId, userId, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve detailed analytics for a specific past livestream.  **Note:** The session you attach must own the livestream to check analytics for a given `room_id`.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} roomId The room ID of the livestream to get analytics for
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveLiveAnalyticsVideoDetail(roomId, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEAnchorsApiFp(this.configuration).retrieveLiveAnalyticsVideoDetail(roomId, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve the list of past livestreams with analytics for the authenticated user.  **Note:** The session you attach must own the livestream to check analytics for a given `room_id`.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {number} [count] Number of videos to retrieve (default: 10)
	* @param {number} [offset] Pagination offset (default: 0)
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveLiveAnalyticsVideoList(count, offset, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEAnchorsApiFp(this.configuration).retrieveLiveAnalyticsVideoList(count, offset, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Fetch TikTok LIVE Stream Cover URL given a uniqueId.
	* @param {string} uniqueId The unique ID of the TikTok to fetch the cover for.
	* @param {boolean} [redirect] Whether to redirect to the URL directly
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveRoomCover(uniqueId, redirect, options) {
		return TikTokLIVEAnchorsApiFp(this.configuration).retrieveRoomCover(uniqueId, redirect, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Fetch Room ID for a given uniqueId & whether that user is live.
	* @param {string} uniqueId The unique ID of the TikTok user to fetch the data for.
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveRoomId(uniqueId, options) {
		return TikTokLIVEAnchorsApiFp(this.configuration).retrieveRoomId(uniqueId, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve TikTok Live Room Information
	* @param {string} uniqueId The unique identifier for the TikTok user or room
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveRoomInfo(uniqueId, options) {
		return TikTokLIVEAnchorsApiFp(this.configuration).retrieveRoomInfo(uniqueId, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve the list of moderators in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} anchorId The streamer\&#39;s numeric user ID
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveRoomModerators(anchorId, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEAnchorsApiFp(this.configuration).retrieveRoomModerators(anchorId, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Fetch TikTok LIVE Stream video given a uniqueId.
	* @param {string} uniqueId The unique ID of the TikTok to fetch the data for.
	* @param {StreamType} [streamType] The type of video stream to fetch. Default is HLS_SD.
	* @param {boolean} [redirect] Whether to redirect or return as JSON
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveRoomVideo(uniqueId, streamType, redirect, options) {
		return TikTokLIVEAnchorsApiFp(this.configuration).retrieveRoomVideo(uniqueId, streamType, redirect, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve the TikTok LIVE gift gallery (sponsorable gifts + sponsorship progress) for a creator.  The gallery is rendered per-viewer, so a session is required.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} uniqueId The creator\&#39;s unique ID (handle).
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveWebcastGiftGallery(uniqueId, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEAnchorsApiFp(this.configuration).retrieveWebcastGiftGallery(uniqueId, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve TikTok LIVE earnings for a specific user.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} uniqueId The unique ID (username) of the user to fetch earnings for.
	* @param {WebcastUserEarningsOutputPeriod} [period] Earnings period
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {string} [sessionId] Use x-oauth-token or x-cookie-header instead
	* @param {string} [ttTargetIdc] Use x-oauth-token or x-cookie-header instead
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveWebcastUserEarnings(uniqueId, period, xOauthToken, xCookieHeader, sessionId, ttTargetIdc, options) {
		return TikTokLIVEAnchorsApiFp(this.configuration).retrieveWebcastUserEarnings(uniqueId, period, xOauthToken, xCookieHeader, sessionId, ttTargetIdc, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Resolve a TikTok
	* @param {string} uniqueId The unique ID (handle) of the TikTok user.
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveWebcastUserId(uniqueId, options) {
		return TikTokLIVEAnchorsApiFp(this.configuration).retrieveWebcastUserId(uniqueId, options).then((request) => request(this.axios, this.basePath));
	}
};
/**
* TikTokLIVEGiftsApi - axios parameter creator
*/
var TikTokLIVEGiftsApiAxiosParamCreator = function(configuration) {
	return {
		/**
		* List the full TikTok LIVE gift catalog, paginated.  This is a special route, it does NOT fetch data live, and therefore does not count to your hourly/daily rate limits.
		* @param {number} [pageSize] Results per page (1–100, server-clamped). Defaults to 50.
		* @param {number} [pageNumber] 1-based page number. Defaults to 1.
		* @param {GiftCatalogOrderBy} [orderBy] Sort order for the catalog. Defaults to price ascending.
		* @param {boolean} [ascending] Whether to sort ascending or descending. Defaults to true.
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		listWebcastGifts: async (pageSize, pageNumber, orderBy, ascending, options = {}) => {
			const localVarUrlObj = new URL(`/webcast/gifts/catalog`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (pageSize !== void 0) localVarQueryParameter["pageSize"] = pageSize;
			if (pageNumber !== void 0) localVarQueryParameter["pageNumber"] = pageNumber;
			if (orderBy !== void 0) localVarQueryParameter["orderBy"] = orderBy;
			if (ascending !== void 0) localVarQueryParameter["ascending"] = ascending;
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve a single TikTok LIVE gift by its numeric gift ID.  This is a special route, it does NOT fetch data live, and therefore does not count to your hourly/daily rate limits.
		* @param {number} giftId The numeric gift ID to look up
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveWebcastGift: async (giftId, options = {}) => {
			assertParamExists("retrieveWebcastGift", "giftId", giftId);
			const localVarPath = `/webcast/gifts/catalog/{gift_id}`.replace("{gift_id}", encodeURIComponent(String(giftId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve Webcast gifts for a given region
		* @param {PooledProxyRegion} [region] The region to fetch gifts for
		* @param {RetrieveWebcastGiftsWebcastLanguageEnum} [webcastLanguage] Webcast language for locale-based fields
		* @param {boolean} [redirect] Whether to redirect directly or return a JSON response
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveWebcastGifts: async (region, webcastLanguage, redirect, options = {}) => {
			const localVarUrlObj = new URL(`/webcast/gifts`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (region !== void 0) localVarQueryParameter["region"] = region;
			if (webcastLanguage !== void 0) localVarQueryParameter["webcast_language"] = webcastLanguage;
			if (redirect !== void 0) localVarQueryParameter["redirect"] = redirect;
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Search the TikTok LIVE gift catalogue by gift name.  This is a special route, it does NOT fetch data live, and therefore does not count to your hourly/daily rate limits.
		* @param {string} query The search query
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		searchWebcastGifts: async (query, options = {}) => {
			assertParamExists("searchWebcastGifts", "query", query);
			const localVarUrlObj = new URL(`/webcast/gifts/catalog/search`, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (query !== void 0) localVarQueryParameter["query"] = query;
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		}
	};
};
/**
* TikTokLIVEGiftsApi - functional programming interface
*/
var TikTokLIVEGiftsApiFp = function(configuration) {
	const localVarAxiosParamCreator = TikTokLIVEGiftsApiAxiosParamCreator(configuration);
	return {
		/**
		* List the full TikTok LIVE gift catalog, paginated.  This is a special route, it does NOT fetch data live, and therefore does not count to your hourly/daily rate limits.
		* @param {number} [pageSize] Results per page (1–100, server-clamped). Defaults to 50.
		* @param {number} [pageNumber] 1-based page number. Defaults to 1.
		* @param {GiftCatalogOrderBy} [orderBy] Sort order for the catalog. Defaults to price ascending.
		* @param {boolean} [ascending] Whether to sort ascending or descending. Defaults to true.
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async listWebcastGifts(pageSize, pageNumber, orderBy, ascending, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.listWebcastGifts(pageSize, pageNumber, orderBy, ascending, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEGiftsApi.listWebcastGifts"]?.[localVarOperationServerIndex]?.url;
			return (axios$50, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$50, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve a single TikTok LIVE gift by its numeric gift ID.  This is a special route, it does NOT fetch data live, and therefore does not count to your hourly/daily rate limits.
		* @param {number} giftId The numeric gift ID to look up
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveWebcastGift(giftId, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveWebcastGift(giftId, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEGiftsApi.retrieveWebcastGift"]?.[localVarOperationServerIndex]?.url;
			return (axios$51, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$51, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve Webcast gifts for a given region
		* @param {PooledProxyRegion} [region] The region to fetch gifts for
		* @param {RetrieveWebcastGiftsWebcastLanguageEnum} [webcastLanguage] Webcast language for locale-based fields
		* @param {boolean} [redirect] Whether to redirect directly or return a JSON response
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveWebcastGifts(region, webcastLanguage, redirect, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveWebcastGifts(region, webcastLanguage, redirect, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEGiftsApi.retrieveWebcastGifts"]?.[localVarOperationServerIndex]?.url;
			return (axios$52, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$52, localVarOperationServerBasePath || basePath);
		},
		/**
		* Search the TikTok LIVE gift catalogue by gift name.  This is a special route, it does NOT fetch data live, and therefore does not count to your hourly/daily rate limits.
		* @param {string} query The search query
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async searchWebcastGifts(query, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.searchWebcastGifts(query, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEGiftsApi.searchWebcastGifts"]?.[localVarOperationServerIndex]?.url;
			return (axios$53, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$53, localVarOperationServerBasePath || basePath);
		}
	};
};
/**
* TikTokLIVEGiftsApi - object-oriented interface
*/
var TikTokLIVEGiftsApi = class extends BaseAPI {
	/**
	* List the full TikTok LIVE gift catalog, paginated.  This is a special route, it does NOT fetch data live, and therefore does not count to your hourly/daily rate limits.
	* @param {number} [pageSize] Results per page (1–100, server-clamped). Defaults to 50.
	* @param {number} [pageNumber] 1-based page number. Defaults to 1.
	* @param {GiftCatalogOrderBy} [orderBy] Sort order for the catalog. Defaults to price ascending.
	* @param {boolean} [ascending] Whether to sort ascending or descending. Defaults to true.
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	listWebcastGifts(pageSize, pageNumber, orderBy, ascending, options) {
		return TikTokLIVEGiftsApiFp(this.configuration).listWebcastGifts(pageSize, pageNumber, orderBy, ascending, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve a single TikTok LIVE gift by its numeric gift ID.  This is a special route, it does NOT fetch data live, and therefore does not count to your hourly/daily rate limits.
	* @param {number} giftId The numeric gift ID to look up
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveWebcastGift(giftId, options) {
		return TikTokLIVEGiftsApiFp(this.configuration).retrieveWebcastGift(giftId, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve Webcast gifts for a given region
	* @param {PooledProxyRegion} [region] The region to fetch gifts for
	* @param {RetrieveWebcastGiftsWebcastLanguageEnum} [webcastLanguage] Webcast language for locale-based fields
	* @param {boolean} [redirect] Whether to redirect directly or return a JSON response
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveWebcastGifts(region, webcastLanguage, redirect, options) {
		return TikTokLIVEGiftsApiFp(this.configuration).retrieveWebcastGifts(region, webcastLanguage, redirect, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Search the TikTok LIVE gift catalogue by gift name.  This is a special route, it does NOT fetch data live, and therefore does not count to your hourly/daily rate limits.
	* @param {string} query The search query
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	searchWebcastGifts(query, options) {
		return TikTokLIVEGiftsApiFp(this.configuration).searchWebcastGifts(query, options).then((request) => request(this.axios, this.basePath));
	}
};
/**
* TikTokLIVEModerationApi - axios parameter creator
*/
var TikTokLIVEModerationApiAxiosParamCreator = function(configuration) {
	return {
		/**
		* Add a sensitive word to a TikTok LIVE room\'s filter list.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} word The sensitive word to add
		* @param {string} secAnchorId The sec_anchor_id of the room owner
		* @param {string} roomId The room ID of the livestream
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		addSensitiveWord: async (word, secAnchorId, roomId, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("addSensitiveWord", "word", word);
			assertParamExists("addSensitiveWord", "secAnchorId", secAnchorId);
			assertParamExists("addSensitiveWord", "roomId", roomId);
			const localVarPath = `/webcast/rooms/{room_id}/moderation/sensitive-words`.replace("{room_id}", encodeURIComponent(String(roomId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (word !== void 0) localVarQueryParameter["word"] = word;
			if (secAnchorId !== void 0) localVarQueryParameter["sec_anchor_id"] = secAnchorId;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Delete a sensitive word from a TikTok LIVE room\'s filter list.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} wordId The ID of the sensitive word to delete
		* @param {string} secAnchorId The sec_anchor_id of the room owner
		* @param {string} roomId The room ID of the livestream
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		deleteSensitiveWord: async (wordId, secAnchorId, roomId, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("deleteSensitiveWord", "wordId", wordId);
			assertParamExists("deleteSensitiveWord", "secAnchorId", secAnchorId);
			assertParamExists("deleteSensitiveWord", "roomId", roomId);
			const localVarPath = `/webcast/rooms/{room_id}/moderation/sensitive-words`.replace("{room_id}", encodeURIComponent(String(roomId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "DELETE",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (wordId !== void 0) localVarQueryParameter["word_id"] = wordId;
			if (secAnchorId !== void 0) localVarQueryParameter["sec_anchor_id"] = secAnchorId;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve the list of sensitive words for a TikTok LIVE room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} secAnchorId The sec_anchor_id of the room owner
		* @param {string} roomId The room ID of the livestream
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		getSensitiveWords: async (secAnchorId, roomId, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("getSensitiveWords", "secAnchorId", secAnchorId);
			assertParamExists("getSensitiveWords", "roomId", roomId);
			const localVarPath = `/webcast/rooms/{room_id}/moderation/sensitive-words`.replace("{room_id}", encodeURIComponent(String(roomId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (secAnchorId !== void 0) localVarQueryParameter["sec_anchor_id"] = secAnchorId;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Kick a user from a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {string} tiktokUserId The numeric user ID for the individual to kick
		* @param {string} [commentMsgId] Optional comment message ID that triggered the kick
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		kickRoomUser: async (roomId, tiktokUserId, commentMsgId, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("kickRoomUser", "roomId", roomId);
			assertParamExists("kickRoomUser", "tiktokUserId", tiktokUserId);
			const localVarPath = `/webcast/rooms/{room_id}/moderation/bans`.replace("{room_id}", encodeURIComponent(String(roomId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "PUT",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (tiktokUserId !== void 0) localVarQueryParameter["tiktok_user_id"] = tiktokUserId;
			if (commentMsgId !== void 0) localVarQueryParameter["comment_msg_id"] = commentMsgId;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Mute a user in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {string} userId The user ID to mute
		* @param {MuteDuration} [duration] Mute duration in seconds (-1 &#x3D; permanent, 5, 30, 60, 300)
		* @param {number} [commentMsgId] Optional comment message ID that triggered the mute
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		muteRoomUser: async (roomId, userId, duration, commentMsgId, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("muteRoomUser", "roomId", roomId);
			assertParamExists("muteRoomUser", "userId", userId);
			const localVarPath = `/webcast/rooms/{room_id}/moderation/mutes`.replace("{room_id}", encodeURIComponent(String(roomId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "PUT",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (userId !== void 0) localVarQueryParameter["user_id"] = userId;
			if (duration !== void 0) localVarQueryParameter["duration"] = duration;
			if (commentMsgId !== void 0) localVarQueryParameter["comment_msg_id"] = commentMsgId;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve the list of banned users in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {number} [page] Page number for pagination
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveRoomBannedUsers: async (roomId, page, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("retrieveRoomBannedUsers", "roomId", roomId);
			const localVarPath = `/webcast/rooms/{room_id}/moderation/bans`.replace("{room_id}", encodeURIComponent(String(roomId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (page !== void 0) localVarQueryParameter["page"] = page;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve the list of muted users in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {number} [page] Page number for pagination
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveRoomMutedUsers: async (roomId, page, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("retrieveRoomMutedUsers", "roomId", roomId);
			const localVarPath = `/webcast/rooms/{room_id}/moderation/mutes`.replace("{room_id}", encodeURIComponent(String(roomId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (page !== void 0) localVarQueryParameter["page"] = page;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Toggle comments on/off in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {boolean} enabled Whether comments should be enabled (true) or disabled (false)
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		toggleRoomComments: async (roomId, enabled, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("toggleRoomComments", "roomId", roomId);
			assertParamExists("toggleRoomComments", "enabled", enabled);
			const localVarPath = `/webcast/rooms/{room_id}/moderation/toggle_comments`.replace("{room_id}", encodeURIComponent(String(roomId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (enabled !== void 0) localVarQueryParameter["enabled"] = enabled;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Unkick a user from a livestream room (allow them back).  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {string} tiktokUserId The numeric user ID of the person to unkick
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		unbanRoomUser: async (roomId, tiktokUserId, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("unbanRoomUser", "roomId", roomId);
			assertParamExists("unbanRoomUser", "tiktokUserId", tiktokUserId);
			const localVarPath = `/webcast/rooms/{room_id}/moderation/bans`.replace("{room_id}", encodeURIComponent(String(roomId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "DELETE",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (tiktokUserId !== void 0) localVarQueryParameter["tiktok_user_id"] = tiktokUserId;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Unmute a user in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {string} userId The user ID to unmute
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		unmuteRoomUser: async (roomId, userId, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("unmuteRoomUser", "roomId", roomId);
			assertParamExists("unmuteRoomUser", "userId", userId);
			const localVarPath = `/webcast/rooms/{room_id}/moderation/mutes`.replace("{room_id}", encodeURIComponent(String(roomId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "DELETE",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (userId !== void 0) localVarQueryParameter["user_id"] = userId;
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		}
	};
};
/**
* TikTokLIVEModerationApi - functional programming interface
*/
var TikTokLIVEModerationApiFp = function(configuration) {
	const localVarAxiosParamCreator = TikTokLIVEModerationApiAxiosParamCreator(configuration);
	return {
		/**
		* Add a sensitive word to a TikTok LIVE room\'s filter list.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} word The sensitive word to add
		* @param {string} secAnchorId The sec_anchor_id of the room owner
		* @param {string} roomId The room ID of the livestream
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async addSensitiveWord(word, secAnchorId, roomId, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.addSensitiveWord(word, secAnchorId, roomId, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEModerationApi.addSensitiveWord"]?.[localVarOperationServerIndex]?.url;
			return (axios$54, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$54, localVarOperationServerBasePath || basePath);
		},
		/**
		* Delete a sensitive word from a TikTok LIVE room\'s filter list.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} wordId The ID of the sensitive word to delete
		* @param {string} secAnchorId The sec_anchor_id of the room owner
		* @param {string} roomId The room ID of the livestream
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async deleteSensitiveWord(wordId, secAnchorId, roomId, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.deleteSensitiveWord(wordId, secAnchorId, roomId, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEModerationApi.deleteSensitiveWord"]?.[localVarOperationServerIndex]?.url;
			return (axios$55, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$55, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve the list of sensitive words for a TikTok LIVE room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} secAnchorId The sec_anchor_id of the room owner
		* @param {string} roomId The room ID of the livestream
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async getSensitiveWords(secAnchorId, roomId, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.getSensitiveWords(secAnchorId, roomId, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEModerationApi.getSensitiveWords"]?.[localVarOperationServerIndex]?.url;
			return (axios$56, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$56, localVarOperationServerBasePath || basePath);
		},
		/**
		* Kick a user from a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {string} tiktokUserId The numeric user ID for the individual to kick
		* @param {string} [commentMsgId] Optional comment message ID that triggered the kick
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async kickRoomUser(roomId, tiktokUserId, commentMsgId, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.kickRoomUser(roomId, tiktokUserId, commentMsgId, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEModerationApi.kickRoomUser"]?.[localVarOperationServerIndex]?.url;
			return (axios$57, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$57, localVarOperationServerBasePath || basePath);
		},
		/**
		* Mute a user in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {string} userId The user ID to mute
		* @param {MuteDuration} [duration] Mute duration in seconds (-1 &#x3D; permanent, 5, 30, 60, 300)
		* @param {number} [commentMsgId] Optional comment message ID that triggered the mute
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async muteRoomUser(roomId, userId, duration, commentMsgId, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.muteRoomUser(roomId, userId, duration, commentMsgId, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEModerationApi.muteRoomUser"]?.[localVarOperationServerIndex]?.url;
			return (axios$58, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$58, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve the list of banned users in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {number} [page] Page number for pagination
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveRoomBannedUsers(roomId, page, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveRoomBannedUsers(roomId, page, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEModerationApi.retrieveRoomBannedUsers"]?.[localVarOperationServerIndex]?.url;
			return (axios$59, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$59, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve the list of muted users in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {number} [page] Page number for pagination
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveRoomMutedUsers(roomId, page, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveRoomMutedUsers(roomId, page, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEModerationApi.retrieveRoomMutedUsers"]?.[localVarOperationServerIndex]?.url;
			return (axios$60, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$60, localVarOperationServerBasePath || basePath);
		},
		/**
		* Toggle comments on/off in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {boolean} enabled Whether comments should be enabled (true) or disabled (false)
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async toggleRoomComments(roomId, enabled, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.toggleRoomComments(roomId, enabled, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEModerationApi.toggleRoomComments"]?.[localVarOperationServerIndex]?.url;
			return (axios$61, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$61, localVarOperationServerBasePath || basePath);
		},
		/**
		* Unkick a user from a livestream room (allow them back).  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {string} tiktokUserId The numeric user ID of the person to unkick
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async unbanRoomUser(roomId, tiktokUserId, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.unbanRoomUser(roomId, tiktokUserId, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEModerationApi.unbanRoomUser"]?.[localVarOperationServerIndex]?.url;
			return (axios$62, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$62, localVarOperationServerBasePath || basePath);
		},
		/**
		* Unmute a user in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID of the livestream
		* @param {string} userId The user ID to unmute
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async unmuteRoomUser(roomId, userId, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.unmuteRoomUser(roomId, userId, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVEModerationApi.unmuteRoomUser"]?.[localVarOperationServerIndex]?.url;
			return (axios$63, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$63, localVarOperationServerBasePath || basePath);
		}
	};
};
/**
* TikTokLIVEModerationApi - object-oriented interface
*/
var TikTokLIVEModerationApi = class extends BaseAPI {
	/**
	* Add a sensitive word to a TikTok LIVE room\'s filter list.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} word The sensitive word to add
	* @param {string} secAnchorId The sec_anchor_id of the room owner
	* @param {string} roomId The room ID of the livestream
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	addSensitiveWord(word, secAnchorId, roomId, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEModerationApiFp(this.configuration).addSensitiveWord(word, secAnchorId, roomId, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Delete a sensitive word from a TikTok LIVE room\'s filter list.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} wordId The ID of the sensitive word to delete
	* @param {string} secAnchorId The sec_anchor_id of the room owner
	* @param {string} roomId The room ID of the livestream
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	deleteSensitiveWord(wordId, secAnchorId, roomId, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEModerationApiFp(this.configuration).deleteSensitiveWord(wordId, secAnchorId, roomId, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve the list of sensitive words for a TikTok LIVE room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} secAnchorId The sec_anchor_id of the room owner
	* @param {string} roomId The room ID of the livestream
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	getSensitiveWords(secAnchorId, roomId, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEModerationApiFp(this.configuration).getSensitiveWords(secAnchorId, roomId, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Kick a user from a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} roomId The room ID of the livestream
	* @param {string} tiktokUserId The numeric user ID for the individual to kick
	* @param {string} [commentMsgId] Optional comment message ID that triggered the kick
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	kickRoomUser(roomId, tiktokUserId, commentMsgId, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEModerationApiFp(this.configuration).kickRoomUser(roomId, tiktokUserId, commentMsgId, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Mute a user in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} roomId The room ID of the livestream
	* @param {string} userId The user ID to mute
	* @param {MuteDuration} [duration] Mute duration in seconds (-1 &#x3D; permanent, 5, 30, 60, 300)
	* @param {number} [commentMsgId] Optional comment message ID that triggered the mute
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	muteRoomUser(roomId, userId, duration, commentMsgId, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEModerationApiFp(this.configuration).muteRoomUser(roomId, userId, duration, commentMsgId, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve the list of banned users in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} roomId The room ID of the livestream
	* @param {number} [page] Page number for pagination
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveRoomBannedUsers(roomId, page, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEModerationApiFp(this.configuration).retrieveRoomBannedUsers(roomId, page, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve the list of muted users in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} roomId The room ID of the livestream
	* @param {number} [page] Page number for pagination
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveRoomMutedUsers(roomId, page, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEModerationApiFp(this.configuration).retrieveRoomMutedUsers(roomId, page, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Toggle comments on/off in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} roomId The room ID of the livestream
	* @param {boolean} enabled Whether comments should be enabled (true) or disabled (false)
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	toggleRoomComments(roomId, enabled, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEModerationApiFp(this.configuration).toggleRoomComments(roomId, enabled, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Unkick a user from a livestream room (allow them back).  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} roomId The room ID of the livestream
	* @param {string} tiktokUserId The numeric user ID of the person to unkick
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	unbanRoomUser(roomId, tiktokUserId, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEModerationApiFp(this.configuration).unbanRoomUser(roomId, tiktokUserId, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Unmute a user in a livestream room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} roomId The room ID of the livestream
	* @param {string} userId The user ID to unmute
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	unmuteRoomUser(roomId, userId, xOauthToken, xCookieHeader, options) {
		return TikTokLIVEModerationApiFp(this.configuration).unmuteRoomUser(roomId, userId, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
};
/**
* TikTokLIVERoomsApi - axios parameter creator
*/
var TikTokLIVERoomsApiAxiosParamCreator = function(configuration) {
	return {
		/**
		* Fetch the WebSocket URL & first payload for a TikTok LIVE Room given a Room ID.  **Authentication (Optional):** Anonymous access is supported. For authenticated requests, provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID to fetch the Webcast URL for.
		* @param {string} [client] The client library identifier. Used for metrics.
		* @param {string} [uniqueId] The unique ID of the TikTok user. Send this instead of a Room ID, if you\&#39;re an Enterprise user. Pass \&quot;0\&quot; to room_id.
		* @param {string} [cursor] Starting cursor for the webcast connection, if any
		* @param {string} [userAgent] Override the user agent used for signing and fetching
		* @param {boolean} [clientEnter] Whether the client enters a room after connecting, or if it\&#39;s done by query parameters
		* @param {PooledProxyRegion} [country] Country code to make the request from.
		* @param {WebcastFetchPlatform} [platform] Platform to connect with
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {string} [sessionId] Use x-oauth-token or x-cookie-header instead
		* @param {string} [ttTargetIdc] Use x-oauth-token or x-cookie-header instead
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		fetchWebcastURL: async (roomId, client, uniqueId, cursor, userAgent, clientEnter, country, platform, xOauthToken, xCookieHeader, sessionId, ttTargetIdc, options = {}) => {
			assertParamExists("fetchWebcastURL", "roomId", roomId);
			const localVarPath = `/webcast/rooms/{room_id}/connect`.replace("{room_id}", encodeURIComponent(String(roomId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-jwt-key", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (client !== void 0) localVarQueryParameter["client"] = client;
			if (uniqueId !== void 0) localVarQueryParameter["unique_id"] = uniqueId;
			if (cursor !== void 0) localVarQueryParameter["cursor"] = cursor;
			if (userAgent !== void 0) localVarQueryParameter["user_agent"] = userAgent;
			if (clientEnter !== void 0) localVarQueryParameter["client_enter"] = clientEnter;
			if (country !== void 0) localVarQueryParameter["country"] = country;
			if (platform !== void 0) localVarQueryParameter["platform"] = platform;
			if (sessionId !== void 0) localVarQueryParameter["session_id"] = sessionId;
			if (ttTargetIdc !== void 0) localVarQueryParameter["tt_target_idc"] = ttTargetIdc;
			localVarHeaderParameter["Accept"] = "application/protobuf,application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve room-specific TikTok LIVE gift data.  Returns the ordered gift list for a specific room, along with room-specific overrides (sponsor info, gallery status, panel visibility). Use this alongside the /webcast/gift_info endpoint which provides the full gift catalog.
		* @param {string} roomId The room ID of the TikTok LIVE session
		* @param {WebcastLanguage} [webcastLanguage] Webcast language for locale-based fields
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveRoomGifts: async (roomId, webcastLanguage, options = {}) => {
			assertParamExists("retrieveRoomGifts", "roomId", roomId);
			const localVarPath = `/webcast/rooms/{room_id}/gifts`.replace("{room_id}", encodeURIComponent(String(roomId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			if (webcastLanguage !== void 0) localVarQueryParameter["webcast_language"] = webcastLanguage;
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Send a chat to a TikTok LIVE room.  Either `targetRoomId` or `targetUniqueId` must be provided to identify the room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId Room ID
		* @param {SendRoomChatRequest} sendRoomChatRequest The payload configuration for sending a chat
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		sendRoomChat: async (roomId, sendRoomChatRequest, xOauthToken, xCookieHeader, options = {}) => {
			assertParamExists("sendRoomChat", "roomId", roomId);
			assertParamExists("sendRoomChat", "sendRoomChatRequest", sendRoomChatRequest);
			const localVarPath = `/webcast/rooms/{room_id}/chat`.replace("{room_id}", encodeURIComponent(String(roomId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Content-Type"] = "application/json";
			localVarHeaderParameter["Accept"] = "application/json";
			if (xOauthToken != null) localVarHeaderParameter["x-oauth-token"] = String(xOauthToken);
			if (xCookieHeader != null) localVarHeaderParameter["x-cookie-header"] = String(xCookieHeader);
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			localVarRequestOptions.data = serializeDataIfNeeded(sendRoomChatRequest, localVarRequestOptions, configuration);
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		}
	};
};
/**
* TikTokLIVERoomsApi - functional programming interface
*/
var TikTokLIVERoomsApiFp = function(configuration) {
	const localVarAxiosParamCreator = TikTokLIVERoomsApiAxiosParamCreator(configuration);
	return {
		/**
		* Fetch the WebSocket URL & first payload for a TikTok LIVE Room given a Room ID.  **Authentication (Optional):** Anonymous access is supported. For authenticated requests, provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId The room ID to fetch the Webcast URL for.
		* @param {string} [client] The client library identifier. Used for metrics.
		* @param {string} [uniqueId] The unique ID of the TikTok user. Send this instead of a Room ID, if you\&#39;re an Enterprise user. Pass \&quot;0\&quot; to room_id.
		* @param {string} [cursor] Starting cursor for the webcast connection, if any
		* @param {string} [userAgent] Override the user agent used for signing and fetching
		* @param {boolean} [clientEnter] Whether the client enters a room after connecting, or if it\&#39;s done by query parameters
		* @param {PooledProxyRegion} [country] Country code to make the request from.
		* @param {WebcastFetchPlatform} [platform] Platform to connect with
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {string} [sessionId] Use x-oauth-token or x-cookie-header instead
		* @param {string} [ttTargetIdc] Use x-oauth-token or x-cookie-header instead
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async fetchWebcastURL(roomId, client, uniqueId, cursor, userAgent, clientEnter, country, platform, xOauthToken, xCookieHeader, sessionId, ttTargetIdc, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.fetchWebcastURL(roomId, client, uniqueId, cursor, userAgent, clientEnter, country, platform, xOauthToken, xCookieHeader, sessionId, ttTargetIdc, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVERoomsApi.fetchWebcastURL"]?.[localVarOperationServerIndex]?.url;
			return (axios$64, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$64, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve room-specific TikTok LIVE gift data.  Returns the ordered gift list for a specific room, along with room-specific overrides (sponsor info, gallery status, panel visibility). Use this alongside the /webcast/gift_info endpoint which provides the full gift catalog.
		* @param {string} roomId The room ID of the TikTok LIVE session
		* @param {WebcastLanguage} [webcastLanguage] Webcast language for locale-based fields
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveRoomGifts(roomId, webcastLanguage, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveRoomGifts(roomId, webcastLanguage, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVERoomsApi.retrieveRoomGifts"]?.[localVarOperationServerIndex]?.url;
			return (axios$65, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$65, localVarOperationServerBasePath || basePath);
		},
		/**
		* Send a chat to a TikTok LIVE room.  Either `targetRoomId` or `targetUniqueId` must be provided to identify the room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
		* @param {string} roomId Room ID
		* @param {SendRoomChatRequest} sendRoomChatRequest The payload configuration for sending a chat
		* @param {string} [xOauthToken] OAuth access token for session resolution
		* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async sendRoomChat(roomId, sendRoomChatRequest, xOauthToken, xCookieHeader, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.sendRoomChat(roomId, sendRoomChatRequest, xOauthToken, xCookieHeader, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokLIVERoomsApi.sendRoomChat"]?.[localVarOperationServerIndex]?.url;
			return (axios$66, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$66, localVarOperationServerBasePath || basePath);
		}
	};
};
/**
* TikTokLIVERoomsApi - object-oriented interface
*/
var TikTokLIVERoomsApi = class extends BaseAPI {
	/**
	* Fetch the WebSocket URL & first payload for a TikTok LIVE Room given a Room ID.  **Authentication (Optional):** Anonymous access is supported. For authenticated requests, provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} roomId The room ID to fetch the Webcast URL for.
	* @param {string} [client] The client library identifier. Used for metrics.
	* @param {string} [uniqueId] The unique ID of the TikTok user. Send this instead of a Room ID, if you\&#39;re an Enterprise user. Pass \&quot;0\&quot; to room_id.
	* @param {string} [cursor] Starting cursor for the webcast connection, if any
	* @param {string} [userAgent] Override the user agent used for signing and fetching
	* @param {boolean} [clientEnter] Whether the client enters a room after connecting, or if it\&#39;s done by query parameters
	* @param {PooledProxyRegion} [country] Country code to make the request from.
	* @param {WebcastFetchPlatform} [platform] Platform to connect with
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {string} [sessionId] Use x-oauth-token or x-cookie-header instead
	* @param {string} [ttTargetIdc] Use x-oauth-token or x-cookie-header instead
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	fetchWebcastURL(roomId, client, uniqueId, cursor, userAgent, clientEnter, country, platform, xOauthToken, xCookieHeader, sessionId, ttTargetIdc, options) {
		return TikTokLIVERoomsApiFp(this.configuration).fetchWebcastURL(roomId, client, uniqueId, cursor, userAgent, clientEnter, country, platform, xOauthToken, xCookieHeader, sessionId, ttTargetIdc, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve room-specific TikTok LIVE gift data.  Returns the ordered gift list for a specific room, along with room-specific overrides (sponsor info, gallery status, panel visibility). Use this alongside the /webcast/gift_info endpoint which provides the full gift catalog.
	* @param {string} roomId The room ID of the TikTok LIVE session
	* @param {WebcastLanguage} [webcastLanguage] Webcast language for locale-based fields
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveRoomGifts(roomId, webcastLanguage, options) {
		return TikTokLIVERoomsApiFp(this.configuration).retrieveRoomGifts(roomId, webcastLanguage, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Send a chat to a TikTok LIVE room.  Either `targetRoomId` or `targetUniqueId` must be provided to identify the room.  **Authentication:** Provide exactly one of the following headers: - `x-oauth-token`: An OAuth access token. The sessionId and ttTargetIdc are resolved from the stored OAuth session. [Read More](https://www.eulerstream.com/docs/oauth) - `x-cookie-header`: A cookie header string containing `sessionid` and `tt-target-idc` cookies from TikTok.
	* @param {string} roomId Room ID
	* @param {SendRoomChatRequest} sendRoomChatRequest The payload configuration for sending a chat
	* @param {string} [xOauthToken] OAuth access token for session resolution
	* @param {string} [xCookieHeader] Cookie header containing sessionid and tt-target-idc
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	sendRoomChat(roomId, sendRoomChatRequest, xOauthToken, xCookieHeader, options) {
		return TikTokLIVERoomsApiFp(this.configuration).sendRoomChat(roomId, sendRoomChatRequest, xOauthToken, xCookieHeader, options).then((request) => request(this.axios, this.basePath));
	}
};
/**
* TikTokWebSocketAPIApi - axios parameter creator
*/
var TikTokWebSocketAPIApiAxiosParamCreator = function(configuration) {
	return {
		/**
		* Retrieve the currently connected WebSocket clients for your account.
		* @param {number} accountId 
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		getWebSockets: async (accountId, options = {}) => {
			assertParamExists("getWebSockets", "accountId", accountId);
			const localVarPath = `/webcast/websockets/{account_id}`.replace("{account_id}", encodeURIComponent(String(accountId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		},
		/**
		* Retrieve the currently connected WebSocket clients for your account.
		* @param {number} accountId 
		* @param {string} websocketId 
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		retrieveWebSocketState: async (accountId, websocketId, options = {}) => {
			assertParamExists("retrieveWebSocketState", "accountId", accountId);
			assertParamExists("retrieveWebSocketState", "websocketId", websocketId);
			const localVarPath = `/webcast/websockets/{account_id}/{websocket_id}`.replace("{account_id}", encodeURIComponent(String(accountId))).replace("{websocket_id}", encodeURIComponent(String(websocketId)));
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) baseOptions = configuration.baseOptions;
			const localVarRequestOptions = {
				method: "GET",
				...baseOptions,
				...options
			};
			const localVarHeaderParameter = {};
			const localVarQueryParameter = {};
			await setApiKeyToObject(localVarQueryParameter, "apiKey", configuration);
			await setApiKeyToObject(localVarHeaderParameter, "x-api-key", configuration);
			localVarHeaderParameter["Accept"] = "application/json";
			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers
			};
			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions
			};
		}
	};
};
/**
* TikTokWebSocketAPIApi - functional programming interface
*/
var TikTokWebSocketAPIApiFp = function(configuration) {
	const localVarAxiosParamCreator = TikTokWebSocketAPIApiAxiosParamCreator(configuration);
	return {
		/**
		* Retrieve the currently connected WebSocket clients for your account.
		* @param {number} accountId 
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async getWebSockets(accountId, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.getWebSockets(accountId, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokWebSocketAPIApi.getWebSockets"]?.[localVarOperationServerIndex]?.url;
			return (axios$67, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$67, localVarOperationServerBasePath || basePath);
		},
		/**
		* Retrieve the currently connected WebSocket clients for your account.
		* @param {number} accountId 
		* @param {string} websocketId 
		* @param {*} [options] Override http request option.
		* @throws {RequiredError}
		*/
		async retrieveWebSocketState(accountId, websocketId, options) {
			const localVarAxiosArgs = await localVarAxiosParamCreator.retrieveWebSocketState(accountId, websocketId, options);
			const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
			const localVarOperationServerBasePath = operationServerMap["TikTokWebSocketAPIApi.retrieveWebSocketState"]?.[localVarOperationServerIndex]?.url;
			return (axios$68, basePath) => createRequestFunction(localVarAxiosArgs, axios, BASE_PATH, configuration)(axios$68, localVarOperationServerBasePath || basePath);
		}
	};
};
/**
* TikTokWebSocketAPIApi - object-oriented interface
*/
var TikTokWebSocketAPIApi = class extends BaseAPI {
	/**
	* Retrieve the currently connected WebSocket clients for your account.
	* @param {number} accountId 
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	getWebSockets(accountId, options) {
		return TikTokWebSocketAPIApiFp(this.configuration).getWebSockets(accountId, options).then((request) => request(this.axios, this.basePath));
	}
	/**
	* Retrieve the currently connected WebSocket clients for your account.
	* @param {number} accountId 
	* @param {string} websocketId 
	* @param {*} [options] Override http request option.
	* @throws {RequiredError}
	*/
	retrieveWebSocketState(accountId, websocketId, options) {
		return TikTokWebSocketAPIApiFp(this.configuration).retrieveWebSocketState(accountId, websocketId, options).then((request) => request(this.axios, this.basePath));
	}
};
function buildConfig(baseConfig) {
	const config = {
		basePath: "https://tiktok.eulerstream.com",
		baseOptions: { validateStatus: () => true },
		isJsonMime: (mime) => mime.toLowerCase().includes("application/json"),
		...baseConfig
	};
	if (!config.apiKey) return config;
	const apiKey = config.apiKey;
	delete config.apiKey;
	config.baseOptions.headers ||= {};
	config.baseOptions.headers["X-Api-Key"] = apiKey;
	return config;
}
var EulerStreamApiClient = class {
	/**
	* EulerStream API Client
	*
	* @param config The configuration for the API client
	*/
	constructor(config = {}) {
		this.configuration = buildConfig(config);
		this.accounts = new AccountsApi(this.configuration);
		this.analytics = new AnalyticsApi(this.configuration);
		this.authentication = new AuthenticationApi(this.configuration);
		this.captchas = new TikTokCaptchasApi(this.configuration);
		this.general = new TikTokGeneralApi(this.configuration);
		this.webcast = new TikTokLIVEApi(this.configuration);
		this.alertTargets = new TikTokLIVEAlertTargetsApi(this.configuration);
		this.alerts = new TikTokLIVEAlertsApi(this.configuration);
		this.anchors = new TikTokLIVEAnchorsApi(this.configuration);
		this.gifts = new TikTokLIVEGiftsApi(this.configuration);
		this.moderation = new TikTokLIVEModerationApi(this.configuration);
		this.rooms = new TikTokLIVERoomsApi(this.configuration);
		this.tikTokWebSocketAPI = new TikTokWebSocketAPIApi(this.configuration);
	}
};
//#endregion
export { WebcastFetchPlatform as n, EulerStreamApiClient as t };
