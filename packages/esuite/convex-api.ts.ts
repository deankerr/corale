import { FunctionReference, anyApi } from "convex/server";
import { GenericId as Id } from "convex/values";

export const api: PublicApiType = anyApi as unknown as PublicApiType;
export const internal: InternalApiType = anyApi as unknown as InternalApiType;

export type PublicApiType = {
  db: {
    patterns: {
      create: FunctionReference<
        "mutation",
        "public",
        {
          apiKey?: string;
          description?: string;
          dynamicMessages?: Array<{
            message: {
              channel?: string;
              name?: string;
              role: "system" | "assistant" | "user";
              text: string;
            };
          }>;
          initialMessages?: Array<{
            channel?: string;
            name?: string;
            role: "system" | "assistant" | "user";
            text: string;
          }>;
          instructions?: string;
          kvMetadata?: any;
          model: {
            frequencyPenalty?: number;
            id: string;
            maxTokens?: number;
            presencePenalty?: number;
            provider?: string;
            repetitionPenalty?: number;
            stop?: Array<string>;
            temperature?: number;
            topK?: number;
            topP?: number;
          };
          name?: string;
          options?: { maxCompletionTokens?: number; maxMessages?: number };
        },
        { id: Id<"patterns">; xid: string }
      >;
      get: FunctionReference<
        "query",
        "public",
        { apiKey?: string; id: string },
        any
      >;
      list: FunctionReference<
        "query",
        "public",
        { apiKey?: string },
        null | Array<{
          _creationTime: number;
          _id: Id<"patterns">;
          description: string;
          dynamicMessages: Array<{
            message: {
              channel?: string;
              name?: string;
              role: "system" | "assistant" | "user";
              text: string;
            };
          }>;
          initialMessages: Array<{
            channel?: string;
            name?: string;
            role: "system" | "assistant" | "user";
            text: string;
          }>;
          instructions: string;
          kvMetadata: any;
          lastUsedAt: number;
          model: {
            frequencyPenalty?: number;
            id: string;
            maxTokens?: number;
            presencePenalty?: number;
            provider?: string;
            repetitionPenalty?: number;
            stop?: Array<string>;
            temperature?: number;
            topK?: number;
            topP?: number;
          };
          name: string;
          options?: { maxCompletionTokens?: number; maxMessages?: number };
          updatedAt: number;
          userId: Id<"users">;
          xid: string;
        }>
      >;
      remove: FunctionReference<
        "mutation",
        "public",
        { apiKey?: string; id: string },
        any
      >;
      update: FunctionReference<
        "mutation",
        "public",
        {
          apiKey?: string;
          description?: string;
          dynamicMessages?: Array<{
            message: {
              channel?: string;
              name?: string;
              role: "system" | "assistant" | "user";
              text: string;
            };
          }>;
          id: string;
          initialMessages?: Array<{
            channel?: string;
            name?: string;
            role: "system" | "assistant" | "user";
            text: string;
          }>;
          instructions?: string;
          kvMetadata?: any;
          model?: {
            frequencyPenalty?: number;
            id: string;
            maxTokens?: number;
            presencePenalty?: number;
            provider?: string;
            repetitionPenalty?: number;
            stop?: Array<string>;
            temperature?: number;
            topK?: number;
            topP?: number;
          };
          name?: string;
          options?: { maxCompletionTokens?: number; maxMessages?: number };
        },
        any
      >;
    };
    runs: {
      create: FunctionReference<
        "mutation",
        "public",
        {
          additionalInstructions?: string;
          apiKey?: string;
          appendMessages?: Array<{
            channel?: string;
            kvMetadata?: any;
            name?: string;
            role: "system" | "assistant" | "user";
            text?: string;
          }>;
          instructions?: string;
          kvMetadata?: any;
          model?: {
            frequencyPenalty?: number;
            id: string;
            maxTokens?: number;
            presencePenalty?: number;
            provider?: string;
            repetitionPenalty?: number;
            stop?: Array<string>;
            temperature?: number;
            topK?: number;
            topP?: number;
          };
          options?: { maxCompletionTokens?: number; maxMessages?: number };
          patternId?: string;
          stream: boolean;
          threadId: string;
        },
        any
      >;
      get: FunctionReference<
        "query",
        "public",
        { apiKey?: string; runId: string },
        null | {
          _creationTime: number;
          _id: Id<"runs">;
          additionalInstructions?: string;
          errors?: Array<{ code: string; data?: any; message: string }>;
          instructions?: string;
          kvMetadata: any;
          model: {
            frequencyPenalty?: number;
            id: string;
            maxTokens?: number;
            presencePenalty?: number;
            provider?: string;
            repetitionPenalty?: number;
            stop?: Array<string>;
            temperature?: number;
            topK?: number;
            topP?: number;
          };
          options?: { maxCompletionTokens?: number; maxMessages?: number };
          patternId?: Id<"patterns">;
          providerMetadata?: any;
          results?: Array<{ id: Id<"messages">; type: "message" }>;
          status: "queued" | "active" | "done" | "failed";
          stream: boolean;
          threadId: Id<"threads">;
          timings: {
            endedAt?: number;
            firstTokenAt?: number;
            queuedAt: number;
            startedAt?: number;
          };
          updatedAt: number;
          usage?: {
            completionTokens: number;
            cost?: number;
            finishReason: string;
            modelId: string;
            promptTokens: number;
            requestId: string;
          };
          userId: Id<"users">;
        }
      >;
    };
    texts: {
      deletePrompt: FunctionReference<
        "mutation",
        "public",
        { _id: Id<"texts">; apiKey?: string },
        any
      >;
      getPrompt: FunctionReference<
        "query",
        "public",
        { _id: string; apiKey?: string },
        null | {
          _creationTime: number;
          _id: Id<"texts">;
          content: string;
          title: string;
          type: "prompt";
          updatedAt: number;
          userId: Id<"users">;
        }
      >;
      listPrompts: FunctionReference<
        "query",
        "public",
        { apiKey?: string },
        Array<{
          _creationTime: number;
          _id: Id<"texts">;
          content: string;
          title: string;
          type: "prompt";
          updatedAt: number;
          userId: Id<"users">;
        }>
      >;
      setPrompt: FunctionReference<
        "mutation",
        "public",
        { _id?: Id<"texts">; apiKey?: string; content: string; title: string },
        any
      >;
    };
    thread: {
      messages: {
        get: FunctionReference<
          "query",
          "public",
          { apiKey?: string; series: number; threadId: string },
          null | {
            _creationTime: number;
            _id: Id<"messages">;
            channel?: string;
            kvMetadata: any;
            name?: string;
            role: "system" | "assistant" | "user";
            runId?: Id<"runs">;
            runId_v2?: string;
            series: number;
            text?: string;
            threadId: Id<"threads">;
            threadSlug: string;
            userId: Id<"users">;
          }
        >;
        list: FunctionReference<
          "query",
          "public",
          {
            apiKey?: string;
            limit?: number;
            order?: "asc" | "desc";
            threadId: string;
          },
          null | Array<{
            _creationTime: number;
            _id: Id<"messages">;
            channel?: string;
            kvMetadata: any;
            name?: string;
            role: "system" | "assistant" | "user";
            runId?: Id<"runs">;
            runId_v2?: string;
            series: number;
            text?: string;
            threadId: Id<"threads">;
            threadSlug: string;
            userId: Id<"users">;
          }>
        >;
        search: FunctionReference<
          "query",
          "public",
          {
            apiKey?: string;
            createdAfter?: number;
            createdBefore?: number;
            name?: string;
            order?: "asc" | "desc";
            paginationOpts: {
              cursor: string | null;
              endCursor?: string | null;
              id?: number;
              maximumBytesRead?: number;
              maximumRowsRead?: number;
              numItems: number;
            };
            role?: "system" | "assistant" | "user";
            threadId: string;
          },
          {
            continueCursor: string;
            isDone: boolean;
            page: Array<{
              _creationTime: number;
              _id: Id<"messages">;
              channel?: string;
              kvMetadata: any;
              name?: string;
              role: "system" | "assistant" | "user";
              runId?: Id<"runs">;
              runId_v2?: string;
              series: number;
              text?: string;
              threadId: Id<"threads">;
              threadSlug: string;
              userId: Id<"users">;
            }>;
            pageStatus?: "SplitRequired" | "SplitRecommended" | null;
            splitCursor?: string | null;
          }
        >;
        searchText: FunctionReference<
          "query",
          "public",
          {
            apiKey?: string;
            limit?: number;
            name?: string;
            role?: "system" | "assistant" | "user";
            text: string;
            threadId: string;
          },
          null | Array<{
            _creationTime: number;
            _id: Id<"messages">;
            channel?: string;
            kvMetadata: any;
            name?: string;
            role: "system" | "assistant" | "user";
            runId?: Id<"runs">;
            runId_v2?: string;
            series: number;
            text?: string;
            threadId: Id<"threads">;
            threadSlug: string;
            userId: Id<"users">;
          }>
        >;
      };
      runs: {
        getTextStreams: FunctionReference<
          "query",
          "public",
          { apiKey?: string; runId: Id<"runs"> },
          Array<{ _id: Id<"texts">; content: string }>
        >;
      };
    };
    threads: {
      append: FunctionReference<
        "mutation",
        "public",
        {
          apiKey?: string;
          message: {
            channel?: string;
            kvMetadata?: any;
            name?: string;
            role: "system" | "assistant" | "user";
            text?: string;
          };
          threadId?: string;
        },
        {
          messageId: Id<"messages">;
          series: number;
          slug: string;
          threadId: Id<"threads">;
        }
      >;
      create: FunctionReference<
        "mutation",
        "public",
        {
          apiKey?: string;
          favourite?: boolean;
          instructions?: string;
          kvMetadata?: any;
          title?: string;
        },
        { id: Id<"threads">; slug: string }
      >;
      get: FunctionReference<
        "query",
        "public",
        { apiKey?: string; slugOrId: string },
        null | {
          _creationTime: number;
          _id: string;
          favourite?: boolean;
          instructions?: string;
          kvMetadata: any;
          slug: string;
          title?: string;
          updatedAtTime: number;
          user: {
            _creationTime: number;
            _id: Id<"users">;
            imageUrl: string;
            isViewer: boolean;
            name: string;
            role: "user" | "admin";
          };
          userId: Id<"users">;
        }
      >;
      list: FunctionReference<
        "query",
        "public",
        { apiKey?: string },
        null | Array<{
          _creationTime: number;
          _id: string;
          favourite?: boolean;
          instructions?: string;
          kvMetadata: any;
          slug: string;
          title?: string;
          updatedAtTime: number;
          user: {
            _creationTime: number;
            _id: Id<"users">;
            imageUrl: string;
            isViewer: boolean;
            name: string;
            role: "user" | "admin";
          };
          userId: Id<"users">;
        }>
      >;
      remove: FunctionReference<
        "mutation",
        "public",
        { apiKey?: string; threadId: string },
        null
      >;
      update: FunctionReference<
        "mutation",
        "public",
        {
          apiKey?: string;
          favourite?: boolean;
          instructions?: string;
          threadId: string;
          title?: string;
          updateKv?: { delete?: Array<string>; set?: any; setUnique?: any };
        },
        Id<"threads">
      >;
    };
    users: {
      generateNewApiKey: FunctionReference<
        "mutation",
        "public",
        { apiKey?: string },
        any
      >;
      getViewer: FunctionReference<
        "query",
        "public",
        { apiKey?: string },
        null | {
          _creationTime: number;
          _id: Id<"users">;
          imageUrl: string;
          name: string;
          role: "user" | "admin";
        }
      >;
    };
    images: {
      getByRunId: FunctionReference<
        "query",
        "public",
        { apiKey?: string; runId: string },
        Array<{
          _creationTime: number;
          _id: Id<"images_v2">;
          blurDataUrl: string;
          collectionIds: Array<Id<"collections">>;
          color: string;
          createdAt?: number;
          fileId: string;
          format: string;
          generationId?: Id<"generations_v2">;
          height: number;
          id: string;
          ownerId: Id<"users">;
          runId: string;
          sourceType: string;
          sourceUrl: string;
          width: number;
        }>
      >;
      listAllImagesNotInCollection: FunctionReference<
        "query",
        "public",
        {
          apiKey?: string;
          paginationOpts: {
            cursor: string | null;
            endCursor?: string | null;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
        },
        any
      >;
      listMyImages: FunctionReference<
        "query",
        "public",
        {
          apiKey?: string;
          order?: "asc" | "desc";
          paginationOpts: {
            cursor: string | null;
            endCursor?: string | null;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
        },
        {
          continueCursor: string;
          isDone: boolean;
          page: Array<{
            _creationTime: number;
            _id: Id<"images_v2">;
            blurDataUrl: string;
            collectionIds: Array<Id<"collections">>;
            color: string;
            createdAt?: number;
            fileId: string;
            format: string;
            generationId?: Id<"generations_v2">;
            height: number;
            id: string;
            ownerId: Id<"users">;
            runId: string;
            sourceType: string;
            sourceUrl: string;
            width: number;
          }>;
          pageStatus?: "SplitRequired" | "SplitRecommended" | null;
          splitCursor?: string | null;
        }
      >;
      remove: FunctionReference<
        "mutation",
        "public",
        { apiKey?: string; id: string },
        any
      >;
    };
    messages: {
      create: FunctionReference<
        "mutation",
        "public",
        {
          apiKey?: string;
          channel?: string;
          kvMetadata?: any;
          name?: string;
          role: "system" | "assistant" | "user";
          text?: string;
          threadId: string;
        },
        {
          id: Id<"messages">;
          series: number;
          slug: string;
          threadId: Id<"threads">;
        }
      >;
      get: FunctionReference<
        "query",
        "public",
        { apiKey?: string; messageId: string },
        null | {
          _creationTime: number;
          _id: Id<"messages">;
          channel?: string;
          kvMetadata: any;
          name?: string;
          role: "system" | "assistant" | "user";
          runId?: Id<"runs">;
          runId_v2?: string;
          series: number;
          text?: string;
          threadId: Id<"threads">;
          threadSlug: string;
          userId: Id<"users">;
        }
      >;
      getDoc: FunctionReference<
        "query",
        "public",
        { apiKey?: string; messageId: string },
        null | {
          _creationTime: number;
          _id: Id<"messages">;
          channel?: string;
          kvMetadata: any;
          name?: string;
          role: "system" | "assistant" | "user";
          runId?: Id<"runs">;
          runId_v2?: string;
          series: number;
          text?: string;
          threadId: Id<"threads">;
          userId: Id<"users">;
        }
      >;
      remove: FunctionReference<
        "mutation",
        "public",
        { apiKey?: string; messageId: string },
        null
      >;
      update: FunctionReference<
        "mutation",
        "public",
        {
          apiKey?: string;
          channel?: string;
          messageId: Id<"messages">;
          name?: string;
          role?: "system" | "assistant" | "user";
          text?: string;
          updateKv?: { delete?: Array<string>; set?: any; setUnique?: any };
        },
        Id<"messages">
      >;
    };
    metadata: {
      getMetadata: FunctionReference<
        "query",
        "public",
        { apiKey?: string; id: string; route: string },
        any
      >;
    };
    models: {
      listChatModels: FunctionReference<
        "query",
        "public",
        { apiKey?: string },
        any
      >;
    };
    admin: {
      events: {
        ack: FunctionReference<
          "mutation",
          "public",
          { apiKey?: string; id: Id<"operationsEventLog"> },
          any
        >;
        latest: FunctionReference<
          "query",
          "public",
          { apiKey?: string; limit?: number },
          any
        >;
      };
      see: {
        latestImages: FunctionReference<
          "query",
          "public",
          {
            apiKey?: string;
            paginationOpts: {
              cursor: string | null;
              endCursor?: string | null;
              id?: number;
              maximumBytesRead?: number;
              maximumRowsRead?: number;
              numItems: number;
            };
          },
          any
        >;
      };
    };
    audio: {
      generate: FunctionReference<
        "mutation",
        "public",
        {
          apiKey?: string;
          duration?: number;
          messageId: Id<"messages">;
          prompt: string;
        },
        any
      >;
      get: FunctionReference<
        "query",
        "public",
        { apiKey?: string; audioId: Id<"audio"> },
        null | {
          _creationTime: number;
          _id: Id<"audio">;
          fileId: Id<"_storage">;
          fileUrl: null | string;
          generationData: {
            duration?: number;
            endpointId: string;
            modelId: string;
            modelName: string;
            prompt: string;
          };
          messageId: Id<"messages">;
          threadId: Id<"threads">;
          userId: Id<"users">;
        }
      >;
      getByMessageId: FunctionReference<
        "query",
        "public",
        { apiKey?: string; messageId: Id<"messages"> },
        any
      >;
    };
    collections: {
      create: FunctionReference<
        "mutation",
        "public",
        { apiKey?: string; imageIds?: Array<Id<"images_v2">>; title: string },
        any
      >;
      get: FunctionReference<
        "query",
        "public",
        { apiKey?: string; collectionId: string },
        {
          _creationTime: number;
          _id: Id<"collections">;
          id: string;
          images: Array<{
            _creationTime: number;
            _id: Id<"images_v2">;
            blurDataUrl: string;
            collectionIds: Array<Id<"collections">>;
            color: string;
            createdAt?: number;
            fileId: string;
            format: string;
            generationId?: Id<"generations_v2">;
            height: number;
            id: string;
            ownerId: Id<"users">;
            runId: string;
            sourceType: string;
            sourceUrl: string;
            width: number;
          }>;
          ownerId: Id<"users">;
          title: string;
        } | null
      >;
      latest: FunctionReference<
        "query",
        "public",
        { apiKey?: string },
        null | Array<{
          _creationTime: number;
          _id: Id<"collections">;
          id: string;
          images: Array<{
            _creationTime: number;
            _id: Id<"images_v2">;
            blurDataUrl: string;
            collectionIds: Array<Id<"collections">>;
            color: string;
            createdAt?: number;
            fileId: string;
            format: string;
            generationId?: Id<"generations_v2">;
            height: number;
            id: string;
            ownerId: Id<"users">;
            runId: string;
            sourceType: string;
            sourceUrl: string;
            width: number;
          }>;
          ownerId: Id<"users">;
          title: string;
        }>
      >;
      listImages: FunctionReference<
        "query",
        "public",
        {
          apiKey?: string;
          collectionId: string;
          order?: "asc" | "desc";
          paginationOpts: {
            cursor: string | null;
            endCursor?: string | null;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
        },
        {
          continueCursor: string;
          isDone: boolean;
          page: Array<{
            _creationTime: number;
            _id: Id<"images_v2">;
            blurDataUrl: string;
            collectionIds: Array<Id<"collections">>;
            color: string;
            createdAt?: number;
            fileId: string;
            format: string;
            generationId?: Id<"generations_v2">;
            height: number;
            id: string;
            ownerId: Id<"users">;
            runId: string;
            sourceType: string;
            sourceUrl: string;
            width: number;
          }>;
          pageStatus?: "SplitRequired" | "SplitRecommended" | null;
          splitCursor?: string | null;
        }
      >;
      remove: FunctionReference<
        "mutation",
        "public",
        { apiKey?: string; collectionId: string },
        any
      >;
      update: FunctionReference<
        "mutation",
        "public",
        {
          apiKey?: string;
          collectionId: string;
          images_v2?: {
            add?: Array<Id<"images_v2">>;
            remove?: Array<Id<"images_v2">>;
          };
          title?: string;
        },
        any
      >;
    };
    generations: {
      create: FunctionReference<
        "mutation",
        "public",
        {
          apiKey?: string;
          inputs: Array<{
            guidanceScale?: number;
            height?: number;
            loras?: Array<{ path: string; scale?: number }>;
            modelId: string;
            n?: number;
            negativePrompt?: string;
            prompt: string;
            seed?: number;
            size?: string;
            steps?: number;
            type: "textToImage";
            width?: number;
            workflow?: string;
          }>;
        },
        { generationIds: Array<Id<"generations_v2">>; runId: string }
      >;
      get: FunctionReference<
        "query",
        "public",
        { apiKey?: string; generationId: Id<"generations_v2"> },
        null | {
          _creationTime: number;
          _id: Id<"generations_v2">;
          errors?: Array<any>;
          images: Array<{
            _creationTime: number;
            _id: Id<"images_v2">;
            blurDataUrl: string;
            collectionIds: Array<Id<"collections">>;
            color: string;
            createdAt?: number;
            fileId: string;
            format: string;
            generationId?: Id<"generations_v2">;
            height: number;
            id: string;
            ownerId: Id<"users">;
            runId: string;
            sourceType: string;
            sourceUrl: string;
            width: number;
          }>;
          input: any;
          ownerId: Id<"users">;
          results?: Array<{
            contentType: string;
            height: number;
            url: string;
            width: number;
          }>;
          runId: string;
          status: "queued" | "active" | "done" | "failed";
          updatedAt: number;
          workflow?: string;
        }
      >;
      list: FunctionReference<
        "query",
        "public",
        {
          apiKey?: string;
          paginationOpts: {
            cursor: string | null;
            endCursor?: string | null;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
        },
        {
          continueCursor: string;
          isDone: boolean;
          page: Array<{
            _creationTime: number;
            _id: Id<"generations_v2">;
            errors?: Array<any>;
            images: Array<{
              _creationTime: number;
              _id: Id<"images_v2">;
              blurDataUrl: string;
              collectionIds: Array<Id<"collections">>;
              color: string;
              createdAt?: number;
              fileId: string;
              format: string;
              generationId?: Id<"generations_v2">;
              height: number;
              id: string;
              ownerId: Id<"users">;
              runId: string;
              sourceType: string;
              sourceUrl: string;
              width: number;
            }>;
            input: any;
            ownerId: Id<"users">;
            results?: Array<{
              contentType: string;
              height: number;
              url: string;
              width: number;
            }>;
            runId: string;
            status: "queued" | "active" | "done" | "failed";
            updatedAt: number;
            workflow?: string;
          }>;
          pageStatus?: "SplitRequired" | "SplitRecommended" | null;
          splitCursor?: string | null;
        }
      >;
    };
  };
};
export type InternalApiType = {};
