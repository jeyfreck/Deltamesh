import * as $protobuf from "protobufjs";
import Long = require("long");

/** Namespace sync. */
export namespace sync {

    /** OperationType enum. */
    enum OperationType {

        /** INSERT value */
        INSERT = 0,

        /** UPDATE value */
        UPDATE = 1,

        /** DELETE value */
        DELETE = 2
    }

    /**
     * Properties of a HlcTimestamp.
     * @deprecated Use sync.HlcTimestamp.$Properties instead.
     */
    interface IHlcTimestamp extends sync.HlcTimestamp.$Properties {
    }

    /** Represents a HlcTimestamp. */
    class HlcTimestamp {

        /**
         * Constructs a new HlcTimestamp.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.HlcTimestamp.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** HlcTimestamp wallTime. */
        wallTime: (number|Long);

        /** HlcTimestamp counter. */
        counter: number;

        /** HlcTimestamp nodeId. */
        nodeId: string;

        /**
         * Creates a new HlcTimestamp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HlcTimestamp instance
         */
        static create(properties: sync.HlcTimestamp.$Shape): sync.HlcTimestamp & sync.HlcTimestamp.$Shape;
        static create(properties?: sync.HlcTimestamp.$Properties): sync.HlcTimestamp;

        /**
         * Encodes the specified HlcTimestamp message. Does not implicitly {@link sync.HlcTimestamp.verify|verify} messages.
         * @param message HlcTimestamp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: sync.HlcTimestamp.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HlcTimestamp message, length delimited. Does not implicitly {@link sync.HlcTimestamp.verify|verify} messages.
         * @param message HlcTimestamp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: sync.HlcTimestamp.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HlcTimestamp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {sync.HlcTimestamp & sync.HlcTimestamp.$Shape} HlcTimestamp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.HlcTimestamp & sync.HlcTimestamp.$Shape;

        /**
         * Decodes a HlcTimestamp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {sync.HlcTimestamp & sync.HlcTimestamp.$Shape} HlcTimestamp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): sync.HlcTimestamp & sync.HlcTimestamp.$Shape;

        /**
         * Verifies a HlcTimestamp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HlcTimestamp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HlcTimestamp
         */
        static fromObject(object: { [k: string]: any }): sync.HlcTimestamp;

        /**
         * Creates a plain object from a HlcTimestamp message. Also converts values to other types if specified.
         * @param message HlcTimestamp
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: sync.HlcTimestamp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HlcTimestamp to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for HlcTimestamp
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace HlcTimestamp {

        /** Properties of a HlcTimestamp. */
        interface $Properties {

            /** HlcTimestamp wallTime */
            wallTime?: (number|Long|null);

            /** HlcTimestamp counter */
            counter?: (number|null);

            /** HlcTimestamp nodeId */
            nodeId?: (string|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a HlcTimestamp. */
        type $Shape = sync.HlcTimestamp.$Properties;
    }

    /**
     * Properties of a FieldMutation.
     * @deprecated Use sync.FieldMutation.$Properties instead.
     */
    interface IFieldMutation extends sync.FieldMutation.$Properties {
    }

    /** Represents a FieldMutation. */
    class FieldMutation {

        /**
         * Constructs a new FieldMutation.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.FieldMutation.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** FieldMutation fieldName. */
        fieldName: string;

        /** FieldMutation valueJson. */
        valueJson: string;

        /** FieldMutation timestamp. */
        timestamp?: (sync.HlcTimestamp.$Properties|null);

        /**
         * Creates a new FieldMutation instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FieldMutation instance
         */
        static create(properties: sync.FieldMutation.$Shape): sync.FieldMutation & sync.FieldMutation.$Shape;
        static create(properties?: sync.FieldMutation.$Properties): sync.FieldMutation;

        /**
         * Encodes the specified FieldMutation message. Does not implicitly {@link sync.FieldMutation.verify|verify} messages.
         * @param message FieldMutation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: sync.FieldMutation.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FieldMutation message, length delimited. Does not implicitly {@link sync.FieldMutation.verify|verify} messages.
         * @param message FieldMutation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: sync.FieldMutation.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FieldMutation message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {sync.FieldMutation & sync.FieldMutation.$Shape} FieldMutation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.FieldMutation & sync.FieldMutation.$Shape;

        /**
         * Decodes a FieldMutation message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {sync.FieldMutation & sync.FieldMutation.$Shape} FieldMutation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): sync.FieldMutation & sync.FieldMutation.$Shape;

        /**
         * Verifies a FieldMutation message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FieldMutation message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FieldMutation
         */
        static fromObject(object: { [k: string]: any }): sync.FieldMutation;

        /**
         * Creates a plain object from a FieldMutation message. Also converts values to other types if specified.
         * @param message FieldMutation
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: sync.FieldMutation, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FieldMutation to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for FieldMutation
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace FieldMutation {

        /** Properties of a FieldMutation. */
        interface $Properties {

            /** FieldMutation fieldName */
            fieldName?: (string|null);

            /** FieldMutation valueJson */
            valueJson?: (string|null);

            /** FieldMutation timestamp */
            timestamp?: (sync.HlcTimestamp.$Properties|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a FieldMutation. */
        type $Shape = sync.FieldMutation.$Properties;
    }

    /**
     * Properties of a MutationOp.
     * @deprecated Use sync.MutationOp.$Properties instead.
     */
    interface IMutationOp extends sync.MutationOp.$Properties {
    }

    /** Represents a MutationOp. */
    class MutationOp {

        /**
         * Constructs a new MutationOp.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.MutationOp.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** MutationOp mutationId. */
        mutationId: string;

        /** MutationOp entityId. */
        entityId: string;

        /** MutationOp entityType. */
        entityType: string;

        /** MutationOp opType. */
        opType: sync.OperationType;

        /** MutationOp fields. */
        fields: sync.FieldMutation.$Properties[];

        /** MutationOp timestamp. */
        timestamp?: (sync.HlcTimestamp.$Properties|null);

        /**
         * Creates a new MutationOp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MutationOp instance
         */
        static create(properties: sync.MutationOp.$Shape): sync.MutationOp & sync.MutationOp.$Shape;
        static create(properties?: sync.MutationOp.$Properties): sync.MutationOp;

        /**
         * Encodes the specified MutationOp message. Does not implicitly {@link sync.MutationOp.verify|verify} messages.
         * @param message MutationOp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: sync.MutationOp.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MutationOp message, length delimited. Does not implicitly {@link sync.MutationOp.verify|verify} messages.
         * @param message MutationOp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: sync.MutationOp.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MutationOp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {sync.MutationOp & sync.MutationOp.$Shape} MutationOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.MutationOp & sync.MutationOp.$Shape;

        /**
         * Decodes a MutationOp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {sync.MutationOp & sync.MutationOp.$Shape} MutationOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): sync.MutationOp & sync.MutationOp.$Shape;

        /**
         * Verifies a MutationOp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MutationOp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MutationOp
         */
        static fromObject(object: { [k: string]: any }): sync.MutationOp;

        /**
         * Creates a plain object from a MutationOp message. Also converts values to other types if specified.
         * @param message MutationOp
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: sync.MutationOp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MutationOp to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for MutationOp
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace MutationOp {

        /** Properties of a MutationOp. */
        interface $Properties {

            /** MutationOp mutationId */
            mutationId?: (string|null);

            /** MutationOp entityId */
            entityId?: (string|null);

            /** MutationOp entityType */
            entityType?: (string|null);

            /** MutationOp opType */
            opType?: (sync.OperationType|null);

            /** MutationOp fields */
            fields?: (sync.FieldMutation.$Properties[]|null);

            /** MutationOp timestamp */
            timestamp?: (sync.HlcTimestamp.$Properties|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a MutationOp. */
        type $Shape = sync.MutationOp.$Properties;
    }

    /**
     * Properties of a ClientSyncRequest.
     * @deprecated Use sync.ClientSyncRequest.$Properties instead.
     */
    interface IClientSyncRequest extends sync.ClientSyncRequest.$Properties {
    }

    /** Represents a ClientSyncRequest. */
    class ClientSyncRequest {

        /**
         * Constructs a new ClientSyncRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.ClientSyncRequest.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** ClientSyncRequest clientId. */
        clientId: string;

        /** ClientSyncRequest pendingMutations. */
        pendingMutations: sync.MutationOp.$Properties[];

        /** ClientSyncRequest lastSyncedTimestamp. */
        lastSyncedTimestamp?: (sync.HlcTimestamp.$Properties|null);

        /**
         * Creates a new ClientSyncRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ClientSyncRequest instance
         */
        static create(properties: sync.ClientSyncRequest.$Shape): sync.ClientSyncRequest & sync.ClientSyncRequest.$Shape;
        static create(properties?: sync.ClientSyncRequest.$Properties): sync.ClientSyncRequest;

        /**
         * Encodes the specified ClientSyncRequest message. Does not implicitly {@link sync.ClientSyncRequest.verify|verify} messages.
         * @param message ClientSyncRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: sync.ClientSyncRequest.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ClientSyncRequest message, length delimited. Does not implicitly {@link sync.ClientSyncRequest.verify|verify} messages.
         * @param message ClientSyncRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: sync.ClientSyncRequest.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ClientSyncRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {sync.ClientSyncRequest & sync.ClientSyncRequest.$Shape} ClientSyncRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.ClientSyncRequest & sync.ClientSyncRequest.$Shape;

        /**
         * Decodes a ClientSyncRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {sync.ClientSyncRequest & sync.ClientSyncRequest.$Shape} ClientSyncRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): sync.ClientSyncRequest & sync.ClientSyncRequest.$Shape;

        /**
         * Verifies a ClientSyncRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ClientSyncRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ClientSyncRequest
         */
        static fromObject(object: { [k: string]: any }): sync.ClientSyncRequest;

        /**
         * Creates a plain object from a ClientSyncRequest message. Also converts values to other types if specified.
         * @param message ClientSyncRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: sync.ClientSyncRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ClientSyncRequest to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for ClientSyncRequest
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace ClientSyncRequest {

        /** Properties of a ClientSyncRequest. */
        interface $Properties {

            /** ClientSyncRequest clientId */
            clientId?: (string|null);

            /** ClientSyncRequest pendingMutations */
            pendingMutations?: (sync.MutationOp.$Properties[]|null);

            /** ClientSyncRequest lastSyncedTimestamp */
            lastSyncedTimestamp?: (sync.HlcTimestamp.$Properties|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a ClientSyncRequest. */
        type $Shape = sync.ClientSyncRequest.$Properties;
    }

    /**
     * Properties of a ServerSyncResponse.
     * @deprecated Use sync.ServerSyncResponse.$Properties instead.
     */
    interface IServerSyncResponse extends sync.ServerSyncResponse.$Properties {
    }

    /** Represents a ServerSyncResponse. */
    class ServerSyncResponse {

        /**
         * Constructs a new ServerSyncResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: sync.ServerSyncResponse.$Properties);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];

        /** ServerSyncResponse acknowledgedMutationIds. */
        acknowledgedMutationIds: string[];

        /** ServerSyncResponse appliedDeltas. */
        appliedDeltas: sync.MutationOp.$Properties[];

        /**
         * Creates a new ServerSyncResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ServerSyncResponse instance
         */
        static create(properties: sync.ServerSyncResponse.$Shape): sync.ServerSyncResponse & sync.ServerSyncResponse.$Shape;
        static create(properties?: sync.ServerSyncResponse.$Properties): sync.ServerSyncResponse;

        /**
         * Encodes the specified ServerSyncResponse message. Does not implicitly {@link sync.ServerSyncResponse.verify|verify} messages.
         * @param message ServerSyncResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encode(message: sync.ServerSyncResponse.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ServerSyncResponse message, length delimited. Does not implicitly {@link sync.ServerSyncResponse.verify|verify} messages.
         * @param message ServerSyncResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: sync.ServerSyncResponse.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ServerSyncResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns {sync.ServerSyncResponse & sync.ServerSyncResponse.$Shape} ServerSyncResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): sync.ServerSyncResponse & sync.ServerSyncResponse.$Shape;

        /**
         * Decodes a ServerSyncResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns {sync.ServerSyncResponse & sync.ServerSyncResponse.$Shape} ServerSyncResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): sync.ServerSyncResponse & sync.ServerSyncResponse.$Shape;

        /**
         * Verifies a ServerSyncResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ServerSyncResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ServerSyncResponse
         */
        static fromObject(object: { [k: string]: any }): sync.ServerSyncResponse;

        /**
         * Creates a plain object from a ServerSyncResponse message. Also converts values to other types if specified.
         * @param message ServerSyncResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        static toObject(message: sync.ServerSyncResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ServerSyncResponse to JSON.
         * @returns JSON object
         */
        toJSON(): { [k: string]: any };

        /**
         * Gets the type url for ServerSyncResponse
         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns The type url
         */
        static getTypeUrl(prefix?: string): string;
    }

    namespace ServerSyncResponse {

        /** Properties of a ServerSyncResponse. */
        interface $Properties {

            /** ServerSyncResponse acknowledgedMutationIds */
            acknowledgedMutationIds?: (string[]|null);

            /** ServerSyncResponse appliedDeltas */
            appliedDeltas?: (sync.MutationOp.$Properties[]|null);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];
        }

        /** Shape of a ServerSyncResponse. */
        type $Shape = sync.ServerSyncResponse.$Properties;
    }
}
