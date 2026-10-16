/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-mixed-operators, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, default-case, jsdoc/require-param*/
import $protobuf from "protobufjs/minimal.js";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
const $Object = $util.global.Object, $undefined = $util.global.undefined, $Error = $util.global.Error, $RangeError = $util.global.RangeError, $TypeError = $util.global.TypeError, $Number = $util.global.Number, $parseInt = $util.global.parseInt, $String = $util.global.String, $BigInt = $util.global.BigInt, $Array = $util.global.Array;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const sync = $root.sync = (() => {

    /**
     * Namespace sync.
     * @exports sync
     * @namespace
     */
    const sync = {};

    /**
     * OperationType enum.
     * @name sync.OperationType
     * @enum {number}
     * @property {number} INSERT=0 INSERT value
     * @property {number} UPDATE=1 UPDATE value
     * @property {number} DELETE=2 DELETE value
     */
    sync.OperationType = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "INSERT"] = 0;
        values[valuesById[1] = "UPDATE"] = 1;
        values[valuesById[2] = "DELETE"] = 2;
        return values;
    })();

    sync.HlcTimestamp = (function() {

        /**
         * Properties of a HlcTimestamp.
         * @typedef {Object} sync.HlcTimestamp.$Properties
         * @property {number|Long|null} [wallTime] HlcTimestamp wallTime
         * @property {number|null} [counter] HlcTimestamp counter
         * @property {string|null} [nodeId] HlcTimestamp nodeId
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a HlcTimestamp.
         * @memberof sync
         * @interface IHlcTimestamp
         * @augments sync.HlcTimestamp.$Properties
         * @deprecated Use sync.HlcTimestamp.$Properties instead.
         */

        /**
         * Shape of a HlcTimestamp.
         * @typedef {sync.HlcTimestamp.$Properties} sync.HlcTimestamp.$Shape
         */

        /**
         * Constructs a new HlcTimestamp.
         * @memberof sync
         * @classdesc Represents a HlcTimestamp.
         * @constructor
         * @param {sync.HlcTimestamp.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const HlcTimestamp = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * HlcTimestamp wallTime.
         * @member {number|Long} wallTime
         * @memberof sync.HlcTimestamp
         * @instance
         */
        HlcTimestamp.prototype.wallTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * HlcTimestamp counter.
         * @member {number} counter
         * @memberof sync.HlcTimestamp
         * @instance
         */
        HlcTimestamp.prototype.counter = 0;

        /**
         * HlcTimestamp nodeId.
         * @member {string} nodeId
         * @memberof sync.HlcTimestamp
         * @instance
         */
        HlcTimestamp.prototype.nodeId = "";

        /**
         * Creates a new HlcTimestamp instance using the specified properties.
         * @function create
         * @memberof sync.HlcTimestamp
         * @static
         * @param {sync.HlcTimestamp.$Properties=} [properties] Properties to set
         * @returns {sync.HlcTimestamp} HlcTimestamp instance
         * @type {{
         *   (properties: sync.HlcTimestamp.$Shape): sync.HlcTimestamp & sync.HlcTimestamp.$Shape;
         *   (properties?: sync.HlcTimestamp.$Properties): sync.HlcTimestamp;
         * }}
         */
        HlcTimestamp.create = function(properties) {
            return new HlcTimestamp(properties);
        };

        /**
         * Encodes the specified HlcTimestamp message. Does not implicitly {@link sync.HlcTimestamp.verify|verify} messages.
         * @function encode
         * @memberof sync.HlcTimestamp
         * @static
         * @param {sync.HlcTimestamp.$Properties} message HlcTimestamp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HlcTimestamp.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.wallTime != null && $Object.hasOwnProperty.call(message, "wallTime") && (typeof message.wallTime === "object" ? message.wallTime.low || message.wallTime.high : message.wallTime !== 0))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.wallTime);
            if (message.counter != null && $Object.hasOwnProperty.call(message, "counter") && message.counter !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.counter);
            if (message.nodeId != null && $Object.hasOwnProperty.call(message, "nodeId") && message.nodeId !== "")
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.nodeId);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified HlcTimestamp message, length delimited. Does not implicitly {@link sync.HlcTimestamp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof sync.HlcTimestamp
         * @static
         * @param {sync.HlcTimestamp.$Properties} message HlcTimestamp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HlcTimestamp.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a HlcTimestamp message from the specified reader or buffer.
         * @function decode
         * @memberof sync.HlcTimestamp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.HlcTimestamp & sync.HlcTimestamp.$Shape} HlcTimestamp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HlcTimestamp.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end, message, value;
            if (length === $undefined)
                end = reader.len;
            else {
                end = reader.pos + length;
                if (end > reader.len)
                    throw $RangeError("index out of range");
                length = reader.len;
                reader.len = end;
            }
            message = _target || new $root.sync.HlcTimestamp();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                            message.wallTime = value;
                        else
                            delete message.wallTime;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.counter = value;
                        else
                            delete message.counter;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.nodeId = value;
                        else
                            delete message.nodeId;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (length !== $undefined) {
                if (reader.pos !== end)
                    throw $RangeError("index out of range");
                reader.len = length;
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a HlcTimestamp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof sync.HlcTimestamp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {sync.HlcTimestamp & sync.HlcTimestamp.$Shape} HlcTimestamp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HlcTimestamp.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.size());
        };

        /**
         * Verifies a HlcTimestamp message.
         * @function verify
         * @memberof sync.HlcTimestamp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HlcTimestamp.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.wallTime != null && $Object.hasOwnProperty.call(message, "wallTime"))
                if (!$util.isInteger(message.wallTime) && !(message.wallTime && $util.isInteger(message.wallTime.low) && $util.isInteger(message.wallTime.high)))
                    return "wallTime: integer|Long expected";
            if (message.counter != null && $Object.hasOwnProperty.call(message, "counter"))
                if (!$util.isInteger(message.counter))
                    return "counter: integer expected";
            if (message.nodeId != null && $Object.hasOwnProperty.call(message, "nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            return null;
        };

        /**
         * Creates a HlcTimestamp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof sync.HlcTimestamp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {sync.HlcTimestamp} HlcTimestamp
         */
        HlcTimestamp.fromObject = function (object, _depth) {
            if (object instanceof $root.sync.HlcTimestamp)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".sync.HlcTimestamp: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.sync.HlcTimestamp();
            if (object.wallTime != null)
                if (typeof object.wallTime === "object" ? object.wallTime.low || object.wallTime.high : $Number(object.wallTime) !== 0)
                    if ($util.Long)
                        message.wallTime = $util.Long.fromValue(object.wallTime, true);
                    else if (typeof object.wallTime === "string")
                        message.wallTime = $parseInt(object.wallTime, 10);
                    else if (typeof object.wallTime === "number")
                        message.wallTime = object.wallTime;
                    else if (typeof object.wallTime === "object")
                        message.wallTime = new $util.LongBits(object.wallTime.low >>> 0, object.wallTime.high >>> 0).toNumber(true);
            if (object.counter != null)
                if ($Number(object.counter) !== 0)
                    message.counter = object.counter >>> 0;
            if (object.nodeId != null)
                if (typeof object.nodeId !== "string" || object.nodeId.length)
                    message.nodeId = $String(object.nodeId);
            return message;
        };

        /**
         * Creates a plain object from a HlcTimestamp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof sync.HlcTimestamp
         * @static
         * @param {sync.HlcTimestamp} message HlcTimestamp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HlcTimestamp.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.wallTime = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                } else
                    object.wallTime = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                object.counter = 0;
                object.nodeId = "";
            }
            if (message.wallTime != null && $Object.hasOwnProperty.call(message, "wallTime"))
                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                    object.wallTime = typeof message.wallTime === "number" ? $BigInt(message.wallTime) : $util.Long.fromBits(message.wallTime.low >>> 0, message.wallTime.high >>> 0, true).toBigInt();
                else if (typeof message.wallTime === "number")
                    object.wallTime = options.longs === $String ? $String(message.wallTime) : message.wallTime;
                else
                    object.wallTime = options.longs === $String ? $util.Long.prototype.toString.call(message.wallTime) : options.longs === $Number ? new $util.LongBits(message.wallTime.low >>> 0, message.wallTime.high >>> 0).toNumber(true) : message.wallTime;
            if (message.counter != null && $Object.hasOwnProperty.call(message, "counter"))
                object.counter = message.counter;
            if (message.nodeId != null && $Object.hasOwnProperty.call(message, "nodeId"))
                object.nodeId = message.nodeId;
            return object;
        };

        /**
         * Converts this HlcTimestamp to JSON.
         * @function toJSON
         * @memberof sync.HlcTimestamp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HlcTimestamp.prototype.toJSON = function() {
            return HlcTimestamp.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for HlcTimestamp
         * @function getTypeUrl
         * @memberof sync.HlcTimestamp
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        HlcTimestamp.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/sync.HlcTimestamp";
        };

        return HlcTimestamp;
    })();

    sync.FieldMutation = (function() {

        /**
         * Properties of a FieldMutation.
         * @typedef {Object} sync.FieldMutation.$Properties
         * @property {string|null} [fieldName] FieldMutation fieldName
         * @property {string|null} [valueJson] FieldMutation valueJson
         * @property {sync.HlcTimestamp.$Properties|null} [timestamp] FieldMutation timestamp
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a FieldMutation.
         * @memberof sync
         * @interface IFieldMutation
         * @augments sync.FieldMutation.$Properties
         * @deprecated Use sync.FieldMutation.$Properties instead.
         */

        /**
         * Shape of a FieldMutation.
         * @typedef {sync.FieldMutation.$Properties} sync.FieldMutation.$Shape
         */

        /**
         * Constructs a new FieldMutation.
         * @memberof sync
         * @classdesc Represents a FieldMutation.
         * @constructor
         * @param {sync.FieldMutation.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const FieldMutation = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * FieldMutation fieldName.
         * @member {string} fieldName
         * @memberof sync.FieldMutation
         * @instance
         */
        FieldMutation.prototype.fieldName = "";

        /**
         * FieldMutation valueJson.
         * @member {string} valueJson
         * @memberof sync.FieldMutation
         * @instance
         */
        FieldMutation.prototype.valueJson = "";

        /**
         * FieldMutation timestamp.
         * @member {sync.HlcTimestamp.$Properties|null|undefined} timestamp
         * @memberof sync.FieldMutation
         * @instance
         */
        FieldMutation.prototype.timestamp = null;

        /**
         * Creates a new FieldMutation instance using the specified properties.
         * @function create
         * @memberof sync.FieldMutation
         * @static
         * @param {sync.FieldMutation.$Properties=} [properties] Properties to set
         * @returns {sync.FieldMutation} FieldMutation instance
         * @type {{
         *   (properties: sync.FieldMutation.$Shape): sync.FieldMutation & sync.FieldMutation.$Shape;
         *   (properties?: sync.FieldMutation.$Properties): sync.FieldMutation;
         * }}
         */
        FieldMutation.create = function(properties) {
            return new FieldMutation(properties);
        };

        /**
         * Encodes the specified FieldMutation message. Does not implicitly {@link sync.FieldMutation.verify|verify} messages.
         * @function encode
         * @memberof sync.FieldMutation
         * @static
         * @param {sync.FieldMutation.$Properties} message FieldMutation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FieldMutation.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.fieldName != null && $Object.hasOwnProperty.call(message, "fieldName") && message.fieldName !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.fieldName);
            if (message.valueJson != null && $Object.hasOwnProperty.call(message, "valueJson") && message.valueJson !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.valueJson);
            if (message.timestamp != null && $Object.hasOwnProperty.call(message, "timestamp"))
                $root.sync.HlcTimestamp.encode(message.timestamp, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified FieldMutation message, length delimited. Does not implicitly {@link sync.FieldMutation.verify|verify} messages.
         * @function encodeDelimited
         * @memberof sync.FieldMutation
         * @static
         * @param {sync.FieldMutation.$Properties} message FieldMutation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FieldMutation.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a FieldMutation message from the specified reader or buffer.
         * @function decode
         * @memberof sync.FieldMutation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.FieldMutation & sync.FieldMutation.$Shape} FieldMutation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FieldMutation.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end, message, value;
            if (length === $undefined)
                end = reader.len;
            else {
                end = reader.pos + length;
                if (end > reader.len)
                    throw $RangeError("index out of range");
                length = reader.len;
                reader.len = end;
            }
            message = _target || new $root.sync.FieldMutation();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.fieldName = value;
                        else
                            delete message.fieldName;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.valueJson = value;
                        else
                            delete message.valueJson;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.timestamp = $root.sync.HlcTimestamp.decode(reader, reader.size(), $undefined, _depth + 1, message.timestamp);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (length !== $undefined) {
                if (reader.pos !== end)
                    throw $RangeError("index out of range");
                reader.len = length;
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a FieldMutation message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof sync.FieldMutation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {sync.FieldMutation & sync.FieldMutation.$Shape} FieldMutation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FieldMutation.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.size());
        };

        /**
         * Verifies a FieldMutation message.
         * @function verify
         * @memberof sync.FieldMutation
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FieldMutation.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.fieldName != null && $Object.hasOwnProperty.call(message, "fieldName"))
                if (!$util.isString(message.fieldName))
                    return "fieldName: string expected";
            if (message.valueJson != null && $Object.hasOwnProperty.call(message, "valueJson"))
                if (!$util.isString(message.valueJson))
                    return "valueJson: string expected";
            if (message.timestamp != null && $Object.hasOwnProperty.call(message, "timestamp")) {
                let error = $root.sync.HlcTimestamp.verify(message.timestamp, _depth + 1);
                if (error)
                    return "timestamp." + error;
            }
            return null;
        };

        /**
         * Creates a FieldMutation message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof sync.FieldMutation
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {sync.FieldMutation} FieldMutation
         */
        FieldMutation.fromObject = function (object, _depth) {
            if (object instanceof $root.sync.FieldMutation)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".sync.FieldMutation: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.sync.FieldMutation();
            if (object.fieldName != null)
                if (typeof object.fieldName !== "string" || object.fieldName.length)
                    message.fieldName = $String(object.fieldName);
            if (object.valueJson != null)
                if (typeof object.valueJson !== "string" || object.valueJson.length)
                    message.valueJson = $String(object.valueJson);
            if (object.timestamp != null) {
                if (!$util.isObject(object.timestamp))
                    throw $TypeError(".sync.FieldMutation.timestamp: object expected");
                message.timestamp = $root.sync.HlcTimestamp.fromObject(object.timestamp, _depth + 1);
            }
            return message;
        };

        /**
         * Creates a plain object from a FieldMutation message. Also converts values to other types if specified.
         * @function toObject
         * @memberof sync.FieldMutation
         * @static
         * @param {sync.FieldMutation} message FieldMutation
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FieldMutation.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.fieldName = "";
                object.valueJson = "";
                object.timestamp = null;
            }
            if (message.fieldName != null && $Object.hasOwnProperty.call(message, "fieldName"))
                object.fieldName = message.fieldName;
            if (message.valueJson != null && $Object.hasOwnProperty.call(message, "valueJson"))
                object.valueJson = message.valueJson;
            if (message.timestamp != null && $Object.hasOwnProperty.call(message, "timestamp"))
                object.timestamp = $root.sync.HlcTimestamp.toObject(message.timestamp, options, _depth + 1);
            return object;
        };

        /**
         * Converts this FieldMutation to JSON.
         * @function toJSON
         * @memberof sync.FieldMutation
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FieldMutation.prototype.toJSON = function() {
            return FieldMutation.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for FieldMutation
         * @function getTypeUrl
         * @memberof sync.FieldMutation
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        FieldMutation.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/sync.FieldMutation";
        };

        return FieldMutation;
    })();

    sync.MutationOp = (function() {

        /**
         * Properties of a MutationOp.
         * @typedef {Object} sync.MutationOp.$Properties
         * @property {string|null} [mutationId] MutationOp mutationId
         * @property {string|null} [entityId] MutationOp entityId
         * @property {string|null} [entityType] MutationOp entityType
         * @property {sync.OperationType|null} [opType] MutationOp opType
         * @property {Array.<sync.FieldMutation.$Properties>|null} [fields] MutationOp fields
         * @property {sync.HlcTimestamp.$Properties|null} [timestamp] MutationOp timestamp
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a MutationOp.
         * @memberof sync
         * @interface IMutationOp
         * @augments sync.MutationOp.$Properties
         * @deprecated Use sync.MutationOp.$Properties instead.
         */

        /**
         * Shape of a MutationOp.
         * @typedef {sync.MutationOp.$Properties} sync.MutationOp.$Shape
         */

        /**
         * Constructs a new MutationOp.
         * @memberof sync
         * @classdesc Represents a MutationOp.
         * @constructor
         * @param {sync.MutationOp.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const MutationOp = function (properties) {
            this.fields = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * MutationOp mutationId.
         * @member {string} mutationId
         * @memberof sync.MutationOp
         * @instance
         */
        MutationOp.prototype.mutationId = "";

        /**
         * MutationOp entityId.
         * @member {string} entityId
         * @memberof sync.MutationOp
         * @instance
         */
        MutationOp.prototype.entityId = "";

        /**
         * MutationOp entityType.
         * @member {string} entityType
         * @memberof sync.MutationOp
         * @instance
         */
        MutationOp.prototype.entityType = "";

        /**
         * MutationOp opType.
         * @member {sync.OperationType} opType
         * @memberof sync.MutationOp
         * @instance
         */
        MutationOp.prototype.opType = 0;

        /**
         * MutationOp fields.
         * @member {Array.<sync.FieldMutation.$Properties>} fields
         * @memberof sync.MutationOp
         * @instance
         */
        MutationOp.prototype.fields = $util.emptyArray;

        /**
         * MutationOp timestamp.
         * @member {sync.HlcTimestamp.$Properties|null|undefined} timestamp
         * @memberof sync.MutationOp
         * @instance
         */
        MutationOp.prototype.timestamp = null;

        /**
         * Creates a new MutationOp instance using the specified properties.
         * @function create
         * @memberof sync.MutationOp
         * @static
         * @param {sync.MutationOp.$Properties=} [properties] Properties to set
         * @returns {sync.MutationOp} MutationOp instance
         * @type {{
         *   (properties: sync.MutationOp.$Shape): sync.MutationOp & sync.MutationOp.$Shape;
         *   (properties?: sync.MutationOp.$Properties): sync.MutationOp;
         * }}
         */
        MutationOp.create = function(properties) {
            return new MutationOp(properties);
        };

        /**
         * Encodes the specified MutationOp message. Does not implicitly {@link sync.MutationOp.verify|verify} messages.
         * @function encode
         * @memberof sync.MutationOp
         * @static
         * @param {sync.MutationOp.$Properties} message MutationOp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MutationOp.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.mutationId != null && $Object.hasOwnProperty.call(message, "mutationId") && message.mutationId !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.mutationId);
            if (message.entityId != null && $Object.hasOwnProperty.call(message, "entityId") && message.entityId !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.entityId);
            if (message.entityType != null && $Object.hasOwnProperty.call(message, "entityType") && message.entityType !== "")
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.entityType);
            if (message.opType != null && $Object.hasOwnProperty.call(message, "opType") && message.opType !== 0)
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.opType);
            if (message.fields != null && message.fields.length)
                for (let i = 0; i < message.fields.length; ++i)
                    $root.sync.FieldMutation.encode(message.fields[i], writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
            if (message.timestamp != null && $Object.hasOwnProperty.call(message, "timestamp"))
                $root.sync.HlcTimestamp.encode(message.timestamp, writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified MutationOp message, length delimited. Does not implicitly {@link sync.MutationOp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof sync.MutationOp
         * @static
         * @param {sync.MutationOp.$Properties} message MutationOp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MutationOp.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a MutationOp message from the specified reader or buffer.
         * @function decode
         * @memberof sync.MutationOp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.MutationOp & sync.MutationOp.$Shape} MutationOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MutationOp.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end, message, value;
            if (length === $undefined)
                end = reader.len;
            else {
                end = reader.pos + length;
                if (end > reader.len)
                    throw $RangeError("index out of range");
                length = reader.len;
                reader.len = end;
            }
            message = _target || new $root.sync.MutationOp();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.mutationId = value;
                        else
                            delete message.mutationId;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.entityId = value;
                        else
                            delete message.entityId;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.entityType = value;
                        else
                            delete message.entityType;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.opType = value;
                        else
                            delete message.opType;
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        if (!(message.fields && message.fields.length))
                            message.fields = [];
                        message.fields.push($root.sync.FieldMutation.decode(reader, reader.size(), $undefined, _depth + 1));
                        continue;
                    }
                case 6: {
                        if (wireType !== 2)
                            break;
                        message.timestamp = $root.sync.HlcTimestamp.decode(reader, reader.size(), $undefined, _depth + 1, message.timestamp);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (length !== $undefined) {
                if (reader.pos !== end)
                    throw $RangeError("index out of range");
                reader.len = length;
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a MutationOp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof sync.MutationOp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {sync.MutationOp & sync.MutationOp.$Shape} MutationOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MutationOp.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.size());
        };

        /**
         * Verifies a MutationOp message.
         * @function verify
         * @memberof sync.MutationOp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MutationOp.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.mutationId != null && $Object.hasOwnProperty.call(message, "mutationId"))
                if (!$util.isString(message.mutationId))
                    return "mutationId: string expected";
            if (message.entityId != null && $Object.hasOwnProperty.call(message, "entityId"))
                if (!$util.isString(message.entityId))
                    return "entityId: string expected";
            if (message.entityType != null && $Object.hasOwnProperty.call(message, "entityType"))
                if (!$util.isString(message.entityType))
                    return "entityType: string expected";
            if (message.opType != null && $Object.hasOwnProperty.call(message, "opType"))
                if (typeof message.opType !== "number" || (message.opType | 0) !== message.opType)
                    return "opType: enum value expected";
            if (message.fields != null && $Object.hasOwnProperty.call(message, "fields")) {
                if (!$Array.isArray(message.fields))
                    return "fields: array expected";
                for (let i = 0; i < message.fields.length; ++i) {
                    let error = $root.sync.FieldMutation.verify(message.fields[i], _depth + 1);
                    if (error)
                        return "fields." + error;
                }
            }
            if (message.timestamp != null && $Object.hasOwnProperty.call(message, "timestamp")) {
                let error = $root.sync.HlcTimestamp.verify(message.timestamp, _depth + 1);
                if (error)
                    return "timestamp." + error;
            }
            return null;
        };

        /**
         * Creates a MutationOp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof sync.MutationOp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {sync.MutationOp} MutationOp
         */
        MutationOp.fromObject = function (object, _depth) {
            if (object instanceof $root.sync.MutationOp)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".sync.MutationOp: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.sync.MutationOp();
            if (object.mutationId != null)
                if (typeof object.mutationId !== "string" || object.mutationId.length)
                    message.mutationId = $String(object.mutationId);
            if (object.entityId != null)
                if (typeof object.entityId !== "string" || object.entityId.length)
                    message.entityId = $String(object.entityId);
            if (object.entityType != null)
                if (typeof object.entityType !== "string" || object.entityType.length)
                    message.entityType = $String(object.entityType);
            if (object.opType !== 0 && (typeof object.opType !== "string" || $root.sync.OperationType[object.opType] !== 0))
                switch (object.opType) {
                case "INSERT":
                case 0:
                    message.opType = 0;
                    break;
                case "UPDATE":
                case 1:
                    message.opType = 1;
                    break;
                case "DELETE":
                case 2:
                    message.opType = 2;
                    break;
                default:
                    if (typeof object.opType === "number" && (object.opType | 0) === object.opType)
                        message.opType = object.opType;
                }
            if (object.fields) {
                if (!$Array.isArray(object.fields))
                    throw $TypeError(".sync.MutationOp.fields: array expected");
                message.fields = $Array(object.fields.length);
                for (let i = 0; i < object.fields.length; ++i) {
                    if (!$util.isObject(object.fields[i]))
                        throw $TypeError(".sync.MutationOp.fields: object expected");
                    message.fields[i] = $root.sync.FieldMutation.fromObject(object.fields[i], _depth + 1);
                }
            }
            if (object.timestamp != null) {
                if (!$util.isObject(object.timestamp))
                    throw $TypeError(".sync.MutationOp.timestamp: object expected");
                message.timestamp = $root.sync.HlcTimestamp.fromObject(object.timestamp, _depth + 1);
            }
            return message;
        };

        /**
         * Creates a plain object from a MutationOp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof sync.MutationOp
         * @static
         * @param {sync.MutationOp} message MutationOp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MutationOp.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.fields = [];
            if (options.defaults) {
                object.mutationId = "";
                object.entityId = "";
                object.entityType = "";
                object.opType = options.enums === $String ? "INSERT" : 0;
                object.timestamp = null;
            }
            if (message.mutationId != null && $Object.hasOwnProperty.call(message, "mutationId"))
                object.mutationId = message.mutationId;
            if (message.entityId != null && $Object.hasOwnProperty.call(message, "entityId"))
                object.entityId = message.entityId;
            if (message.entityType != null && $Object.hasOwnProperty.call(message, "entityType"))
                object.entityType = message.entityType;
            if (message.opType != null && $Object.hasOwnProperty.call(message, "opType"))
                object.opType = options.enums === $String ? $root.sync.OperationType[message.opType] === $undefined ? message.opType : $root.sync.OperationType[message.opType] : message.opType;
            if (message.fields && message.fields.length) {
                object.fields = $Array(message.fields.length);
                for (let j = 0; j < message.fields.length; ++j)
                    object.fields[j] = $root.sync.FieldMutation.toObject(message.fields[j], options, _depth + 1);
            }
            if (message.timestamp != null && $Object.hasOwnProperty.call(message, "timestamp"))
                object.timestamp = $root.sync.HlcTimestamp.toObject(message.timestamp, options, _depth + 1);
            return object;
        };

        /**
         * Converts this MutationOp to JSON.
         * @function toJSON
         * @memberof sync.MutationOp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MutationOp.prototype.toJSON = function() {
            return MutationOp.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for MutationOp
         * @function getTypeUrl
         * @memberof sync.MutationOp
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        MutationOp.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/sync.MutationOp";
        };

        return MutationOp;
    })();

    sync.ClientSyncRequest = (function() {

        /**
         * Properties of a ClientSyncRequest.
         * @typedef {Object} sync.ClientSyncRequest.$Properties
         * @property {string|null} [clientId] ClientSyncRequest clientId
         * @property {Array.<sync.MutationOp.$Properties>|null} [pendingMutations] ClientSyncRequest pendingMutations
         * @property {sync.HlcTimestamp.$Properties|null} [lastSyncedTimestamp] ClientSyncRequest lastSyncedTimestamp
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a ClientSyncRequest.
         * @memberof sync
         * @interface IClientSyncRequest
         * @augments sync.ClientSyncRequest.$Properties
         * @deprecated Use sync.ClientSyncRequest.$Properties instead.
         */

        /**
         * Shape of a ClientSyncRequest.
         * @typedef {sync.ClientSyncRequest.$Properties} sync.ClientSyncRequest.$Shape
         */

        /**
         * Constructs a new ClientSyncRequest.
         * @memberof sync
         * @classdesc Represents a ClientSyncRequest.
         * @constructor
         * @param {sync.ClientSyncRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const ClientSyncRequest = function (properties) {
            this.pendingMutations = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * ClientSyncRequest clientId.
         * @member {string} clientId
         * @memberof sync.ClientSyncRequest
         * @instance
         */
        ClientSyncRequest.prototype.clientId = "";

        /**
         * ClientSyncRequest pendingMutations.
         * @member {Array.<sync.MutationOp.$Properties>} pendingMutations
         * @memberof sync.ClientSyncRequest
         * @instance
         */
        ClientSyncRequest.prototype.pendingMutations = $util.emptyArray;

        /**
         * ClientSyncRequest lastSyncedTimestamp.
         * @member {sync.HlcTimestamp.$Properties|null|undefined} lastSyncedTimestamp
         * @memberof sync.ClientSyncRequest
         * @instance
         */
        ClientSyncRequest.prototype.lastSyncedTimestamp = null;

        /**
         * Creates a new ClientSyncRequest instance using the specified properties.
         * @function create
         * @memberof sync.ClientSyncRequest
         * @static
         * @param {sync.ClientSyncRequest.$Properties=} [properties] Properties to set
         * @returns {sync.ClientSyncRequest} ClientSyncRequest instance
         * @type {{
         *   (properties: sync.ClientSyncRequest.$Shape): sync.ClientSyncRequest & sync.ClientSyncRequest.$Shape;
         *   (properties?: sync.ClientSyncRequest.$Properties): sync.ClientSyncRequest;
         * }}
         */
        ClientSyncRequest.create = function(properties) {
            return new ClientSyncRequest(properties);
        };

        /**
         * Encodes the specified ClientSyncRequest message. Does not implicitly {@link sync.ClientSyncRequest.verify|verify} messages.
         * @function encode
         * @memberof sync.ClientSyncRequest
         * @static
         * @param {sync.ClientSyncRequest.$Properties} message ClientSyncRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClientSyncRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.clientId != null && $Object.hasOwnProperty.call(message, "clientId") && message.clientId !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.clientId);
            if (message.pendingMutations != null && message.pendingMutations.length)
                for (let i = 0; i < message.pendingMutations.length; ++i)
                    $root.sync.MutationOp.encode(message.pendingMutations[i], writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.lastSyncedTimestamp != null && $Object.hasOwnProperty.call(message, "lastSyncedTimestamp"))
                $root.sync.HlcTimestamp.encode(message.lastSyncedTimestamp, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified ClientSyncRequest message, length delimited. Does not implicitly {@link sync.ClientSyncRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof sync.ClientSyncRequest
         * @static
         * @param {sync.ClientSyncRequest.$Properties} message ClientSyncRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClientSyncRequest.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a ClientSyncRequest message from the specified reader or buffer.
         * @function decode
         * @memberof sync.ClientSyncRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.ClientSyncRequest & sync.ClientSyncRequest.$Shape} ClientSyncRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClientSyncRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end, message, value;
            if (length === $undefined)
                end = reader.len;
            else {
                end = reader.pos + length;
                if (end > reader.len)
                    throw $RangeError("index out of range");
                length = reader.len;
                reader.len = end;
            }
            message = _target || new $root.sync.ClientSyncRequest();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.clientId = value;
                        else
                            delete message.clientId;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if (!(message.pendingMutations && message.pendingMutations.length))
                            message.pendingMutations = [];
                        message.pendingMutations.push($root.sync.MutationOp.decode(reader, reader.size(), $undefined, _depth + 1));
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.lastSyncedTimestamp = $root.sync.HlcTimestamp.decode(reader, reader.size(), $undefined, _depth + 1, message.lastSyncedTimestamp);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (length !== $undefined) {
                if (reader.pos !== end)
                    throw $RangeError("index out of range");
                reader.len = length;
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a ClientSyncRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof sync.ClientSyncRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {sync.ClientSyncRequest & sync.ClientSyncRequest.$Shape} ClientSyncRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClientSyncRequest.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.size());
        };

        /**
         * Verifies a ClientSyncRequest message.
         * @function verify
         * @memberof sync.ClientSyncRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ClientSyncRequest.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.clientId != null && $Object.hasOwnProperty.call(message, "clientId"))
                if (!$util.isString(message.clientId))
                    return "clientId: string expected";
            if (message.pendingMutations != null && $Object.hasOwnProperty.call(message, "pendingMutations")) {
                if (!$Array.isArray(message.pendingMutations))
                    return "pendingMutations: array expected";
                for (let i = 0; i < message.pendingMutations.length; ++i) {
                    let error = $root.sync.MutationOp.verify(message.pendingMutations[i], _depth + 1);
                    if (error)
                        return "pendingMutations." + error;
                }
            }
            if (message.lastSyncedTimestamp != null && $Object.hasOwnProperty.call(message, "lastSyncedTimestamp")) {
                let error = $root.sync.HlcTimestamp.verify(message.lastSyncedTimestamp, _depth + 1);
                if (error)
                    return "lastSyncedTimestamp." + error;
            }
            return null;
        };

        /**
         * Creates a ClientSyncRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof sync.ClientSyncRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {sync.ClientSyncRequest} ClientSyncRequest
         */
        ClientSyncRequest.fromObject = function (object, _depth) {
            if (object instanceof $root.sync.ClientSyncRequest)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".sync.ClientSyncRequest: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.sync.ClientSyncRequest();
            if (object.clientId != null)
                if (typeof object.clientId !== "string" || object.clientId.length)
                    message.clientId = $String(object.clientId);
            if (object.pendingMutations) {
                if (!$Array.isArray(object.pendingMutations))
                    throw $TypeError(".sync.ClientSyncRequest.pendingMutations: array expected");
                message.pendingMutations = $Array(object.pendingMutations.length);
                for (let i = 0; i < object.pendingMutations.length; ++i) {
                    if (!$util.isObject(object.pendingMutations[i]))
                        throw $TypeError(".sync.ClientSyncRequest.pendingMutations: object expected");
                    message.pendingMutations[i] = $root.sync.MutationOp.fromObject(object.pendingMutations[i], _depth + 1);
                }
            }
            if (object.lastSyncedTimestamp != null) {
                if (!$util.isObject(object.lastSyncedTimestamp))
                    throw $TypeError(".sync.ClientSyncRequest.lastSyncedTimestamp: object expected");
                message.lastSyncedTimestamp = $root.sync.HlcTimestamp.fromObject(object.lastSyncedTimestamp, _depth + 1);
            }
            return message;
        };

        /**
         * Creates a plain object from a ClientSyncRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof sync.ClientSyncRequest
         * @static
         * @param {sync.ClientSyncRequest} message ClientSyncRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ClientSyncRequest.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.pendingMutations = [];
            if (options.defaults) {
                object.clientId = "";
                object.lastSyncedTimestamp = null;
            }
            if (message.clientId != null && $Object.hasOwnProperty.call(message, "clientId"))
                object.clientId = message.clientId;
            if (message.pendingMutations && message.pendingMutations.length) {
                object.pendingMutations = $Array(message.pendingMutations.length);
                for (let j = 0; j < message.pendingMutations.length; ++j)
                    object.pendingMutations[j] = $root.sync.MutationOp.toObject(message.pendingMutations[j], options, _depth + 1);
            }
            if (message.lastSyncedTimestamp != null && $Object.hasOwnProperty.call(message, "lastSyncedTimestamp"))
                object.lastSyncedTimestamp = $root.sync.HlcTimestamp.toObject(message.lastSyncedTimestamp, options, _depth + 1);
            return object;
        };

        /**
         * Converts this ClientSyncRequest to JSON.
         * @function toJSON
         * @memberof sync.ClientSyncRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ClientSyncRequest.prototype.toJSON = function() {
            return ClientSyncRequest.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for ClientSyncRequest
         * @function getTypeUrl
         * @memberof sync.ClientSyncRequest
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        ClientSyncRequest.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/sync.ClientSyncRequest";
        };

        return ClientSyncRequest;
    })();

    sync.ServerSyncResponse = (function() {

        /**
         * Properties of a ServerSyncResponse.
         * @typedef {Object} sync.ServerSyncResponse.$Properties
         * @property {Array.<string>|null} [acknowledgedMutationIds] ServerSyncResponse acknowledgedMutationIds
         * @property {Array.<sync.MutationOp.$Properties>|null} [appliedDeltas] ServerSyncResponse appliedDeltas
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a ServerSyncResponse.
         * @memberof sync
         * @interface IServerSyncResponse
         * @augments sync.ServerSyncResponse.$Properties
         * @deprecated Use sync.ServerSyncResponse.$Properties instead.
         */

        /**
         * Shape of a ServerSyncResponse.
         * @typedef {sync.ServerSyncResponse.$Properties} sync.ServerSyncResponse.$Shape
         */

        /**
         * Constructs a new ServerSyncResponse.
         * @memberof sync
         * @classdesc Represents a ServerSyncResponse.
         * @constructor
         * @param {sync.ServerSyncResponse.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const ServerSyncResponse = function (properties) {
            this.acknowledgedMutationIds = [];
            this.appliedDeltas = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * ServerSyncResponse acknowledgedMutationIds.
         * @member {Array.<string>} acknowledgedMutationIds
         * @memberof sync.ServerSyncResponse
         * @instance
         */
        ServerSyncResponse.prototype.acknowledgedMutationIds = $util.emptyArray;

        /**
         * ServerSyncResponse appliedDeltas.
         * @member {Array.<sync.MutationOp.$Properties>} appliedDeltas
         * @memberof sync.ServerSyncResponse
         * @instance
         */
        ServerSyncResponse.prototype.appliedDeltas = $util.emptyArray;

        /**
         * Creates a new ServerSyncResponse instance using the specified properties.
         * @function create
         * @memberof sync.ServerSyncResponse
         * @static
         * @param {sync.ServerSyncResponse.$Properties=} [properties] Properties to set
         * @returns {sync.ServerSyncResponse} ServerSyncResponse instance
         * @type {{
         *   (properties: sync.ServerSyncResponse.$Shape): sync.ServerSyncResponse & sync.ServerSyncResponse.$Shape;
         *   (properties?: sync.ServerSyncResponse.$Properties): sync.ServerSyncResponse;
         * }}
         */
        ServerSyncResponse.create = function(properties) {
            return new ServerSyncResponse(properties);
        };

        /**
         * Encodes the specified ServerSyncResponse message. Does not implicitly {@link sync.ServerSyncResponse.verify|verify} messages.
         * @function encode
         * @memberof sync.ServerSyncResponse
         * @static
         * @param {sync.ServerSyncResponse.$Properties} message ServerSyncResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerSyncResponse.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.acknowledgedMutationIds != null && message.acknowledgedMutationIds.length)
                for (let i = 0; i < message.acknowledgedMutationIds.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.acknowledgedMutationIds[i]);
            if (message.appliedDeltas != null && message.appliedDeltas.length)
                for (let i = 0; i < message.appliedDeltas.length; ++i)
                    $root.sync.MutationOp.encode(message.appliedDeltas[i], writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified ServerSyncResponse message, length delimited. Does not implicitly {@link sync.ServerSyncResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof sync.ServerSyncResponse
         * @static
         * @param {sync.ServerSyncResponse.$Properties} message ServerSyncResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerSyncResponse.encodeDelimited = function(message, writer) {
            return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
        };

        /**
         * Decodes a ServerSyncResponse message from the specified reader or buffer.
         * @function decode
         * @memberof sync.ServerSyncResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sync.ServerSyncResponse & sync.ServerSyncResponse.$Shape} ServerSyncResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerSyncResponse.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end, message;
            if (length === $undefined)
                end = reader.len;
            else {
                end = reader.pos + length;
                if (end > reader.len)
                    throw $RangeError("index out of range");
                length = reader.len;
                reader.len = end;
            }
            message = _target || new $root.sync.ServerSyncResponse();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (!(message.acknowledgedMutationIds && message.acknowledgedMutationIds.length))
                            message.acknowledgedMutationIds = [];
                        message.acknowledgedMutationIds.push(reader.stringVerify());
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if (!(message.appliedDeltas && message.appliedDeltas.length))
                            message.appliedDeltas = [];
                        message.appliedDeltas.push($root.sync.MutationOp.decode(reader, reader.size(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (length !== $undefined) {
                if (reader.pos !== end)
                    throw $RangeError("index out of range");
                reader.len = length;
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Decodes a ServerSyncResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof sync.ServerSyncResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {sync.ServerSyncResponse & sync.ServerSyncResponse.$Shape} ServerSyncResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerSyncResponse.decodeDelimited = function(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.size());
        };

        /**
         * Verifies a ServerSyncResponse message.
         * @function verify
         * @memberof sync.ServerSyncResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ServerSyncResponse.verify = function (message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.acknowledgedMutationIds != null && $Object.hasOwnProperty.call(message, "acknowledgedMutationIds")) {
                if (!$Array.isArray(message.acknowledgedMutationIds))
                    return "acknowledgedMutationIds: array expected";
                for (let i = 0; i < message.acknowledgedMutationIds.length; ++i)
                    if (!$util.isString(message.acknowledgedMutationIds[i]))
                        return "acknowledgedMutationIds: string[] expected";
            }
            if (message.appliedDeltas != null && $Object.hasOwnProperty.call(message, "appliedDeltas")) {
                if (!$Array.isArray(message.appliedDeltas))
                    return "appliedDeltas: array expected";
                for (let i = 0; i < message.appliedDeltas.length; ++i) {
                    let error = $root.sync.MutationOp.verify(message.appliedDeltas[i], _depth + 1);
                    if (error)
                        return "appliedDeltas." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ServerSyncResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof sync.ServerSyncResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {sync.ServerSyncResponse} ServerSyncResponse
         */
        ServerSyncResponse.fromObject = function (object, _depth) {
            if (object instanceof $root.sync.ServerSyncResponse)
                return object;
            if (!$util.isObject(object))
                throw $TypeError(".sync.ServerSyncResponse: object expected");
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let message = new $root.sync.ServerSyncResponse();
            if (object.acknowledgedMutationIds) {
                if (!$Array.isArray(object.acknowledgedMutationIds))
                    throw $TypeError(".sync.ServerSyncResponse.acknowledgedMutationIds: array expected");
                message.acknowledgedMutationIds = $Array(object.acknowledgedMutationIds.length);
                for (let i = 0; i < object.acknowledgedMutationIds.length; ++i)
                    message.acknowledgedMutationIds[i] = $String(object.acknowledgedMutationIds[i]);
            }
            if (object.appliedDeltas) {
                if (!$Array.isArray(object.appliedDeltas))
                    throw $TypeError(".sync.ServerSyncResponse.appliedDeltas: array expected");
                message.appliedDeltas = $Array(object.appliedDeltas.length);
                for (let i = 0; i < object.appliedDeltas.length; ++i) {
                    if (!$util.isObject(object.appliedDeltas[i]))
                        throw $TypeError(".sync.ServerSyncResponse.appliedDeltas: object expected");
                    message.appliedDeltas[i] = $root.sync.MutationOp.fromObject(object.appliedDeltas[i], _depth + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a ServerSyncResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof sync.ServerSyncResponse
         * @static
         * @param {sync.ServerSyncResponse} message ServerSyncResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ServerSyncResponse.toObject = function (message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults) {
                object.acknowledgedMutationIds = [];
                object.appliedDeltas = [];
            }
            if (message.acknowledgedMutationIds && message.acknowledgedMutationIds.length) {
                object.acknowledgedMutationIds = $Array(message.acknowledgedMutationIds.length);
                for (let j = 0; j < message.acknowledgedMutationIds.length; ++j)
                    object.acknowledgedMutationIds[j] = message.acknowledgedMutationIds[j];
            }
            if (message.appliedDeltas && message.appliedDeltas.length) {
                object.appliedDeltas = $Array(message.appliedDeltas.length);
                for (let j = 0; j < message.appliedDeltas.length; ++j)
                    object.appliedDeltas[j] = $root.sync.MutationOp.toObject(message.appliedDeltas[j], options, _depth + 1);
            }
            return object;
        };

        /**
         * Converts this ServerSyncResponse to JSON.
         * @function toJSON
         * @memberof sync.ServerSyncResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ServerSyncResponse.prototype.toJSON = function() {
            return ServerSyncResponse.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the type url for ServerSyncResponse
         * @function getTypeUrl
         * @memberof sync.ServerSyncResponse
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        ServerSyncResponse.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/sync.ServerSyncResponse";
        };

        return ServerSyncResponse;
    })();

    return sync;
})();

export {
  $root as default
};
