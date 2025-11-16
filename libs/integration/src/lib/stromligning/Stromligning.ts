/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Consumption data, optional electricity price, and relevant details for calculating electricity cost. */
export interface CalculationsCostCreatePayload {
  /**
   * ID of the specific product used by the company (optional). You can find this using the `/api/companies` endpoint.
   * @example "nrgi_time"
   */
  productId?: string;
  /**
   * ID of the supplier providing the electricity (optional). You can find this using the `/api/suppliers` or `/api/suppliers/find` endpoints.
   * @example "rah_c"
   */
  supplierId?: string;
  /**
   * ID of the customer group (optional). If not provided, the default customer group will be used.
   * @example "c"
   */
  customerGroupId?: string;
  /**
   * Fixed electricity price (optional, but required if productId of a fixed price product is used). If provided, this value will be used instead of the variable hourly price.
   * @example 1.2
   */
  electricityPrice?: number;
  /** List of consumption data with date and amount. */
  consumption?: {
    /**
     * The date and time of consumption (in UTC).
     * @format date-time
     * @example "2024-08-27T18:00:00.000+00:00"
     */
    date?: string;
    /**
     * The amount of electricity consumed in kWh.
     * @example 10.1
     */
    amount?: number;
    /**
     * The time resolution of the consumption data. Defaults to "1h" if not provided. Valid values are "1h" for hourly data and "15m" for 15-minute interval data.
     * @example "1h"
     */
    resolution?: string;
  }[];
}

export interface CalculationsCostCreateData {
  /**
   * The price area used for the calculation.
   * @example "DK1"
   */
  priceArea?: string;
  consumption?: {
    /**
     * Total electricity consumption.
     * @example 2.1
     */
    value?: number;
    /**
     * Unit of consumption.
     * @example "kWh"
     */
    unit?: string;
  };
  cost?: {
    /**
     * Total electricity cost without VAT.
     * @example 3.476035
     */
    value?: number;
    /**
     * VAT applied to the cost.
     * @example 0.869009
     */
    vat?: number;
    /**
     * Total electricity cost including VAT.
     * @example 4.345044
     */
    total?: number;
    /**
     * Unit of cost.
     * @example "kr"
     */
    unit?: string;
  };
  averagePrice?: {
    /**
     * Average price per kWh without VAT.
     * @example 1.655255
     */
    value?: number;
    /**
     * VAT applied to the average price.
     * @example 0.413814
     */
    vat?: number;
    /**
     * Average price per kWh including VAT.
     * @example 2.069069
     */
    total?: number;
    /**
     * Unit of average price.
     * @example "kr/kWh"
     */
    unit?: string;
  };
  /** Detailed breakdown of consumption and price for each entry. */
  details?: {
    /**
     * Date and time of the consumption.
     * @format date-time
     * @example "2024-08-27T18:00:00.000Z"
     */
    date?: string;
    amount?: {
      /**
       * Amount of electricity consumed (kWh).
       * @example 1
       */
      value?: number;
      /**
       * Unit of consumption.
       * @example "kWh"
       */
      unit?: string;
    };
    prices?: {
      electricity?: {
        /**
         * Electricity price (per kWh).
         * @example 0.22254
         */
        value?: number;
        /**
         * VAT applied to the electricity price.
         * @example 0.055635
         */
        vat?: number;
        /**
         * Total electricity price including VAT.
         * @example 0.278175
         */
        total?: number;
        /**
         * Unit of electricity price.
         * @example "kr/kWh"
         */
        unit?: string;
      };
      surcharge?: {
        /**
         * Surcharge price.
         * @example 0
         */
        value?: number;
        /**
         * VAT applied to surcharge.
         * @example 0
         */
        vat?: number;
        /**
         * Total surcharge including VAT.
         * @example 0
         */
        total?: number;
        /**
         * Unit of surcharge price.
         * @example "kr/kWh"
         */
        unit?: string;
      };
      electricityTax?: {
        /**
         * Electricity tax per kWh.
         * @example 0.761
         */
        value?: number;
        /**
         * VAT applied to the electricity tax.
         * @example 0.19025
         */
        vat?: number;
        /**
         * Total electricity tax including VAT.
         * @example 0.95125
         */
        total?: number;
        /**
         * Unit of electricity tax.
         * @example "kr/kWh"
         */
        unit?: string;
      };
      transmission?: {
        systemTariff?: {
          /**
           * System tariff.
           * @example 0.051
           */
          value?: number;
          /**
           * VAT applied to system tariff.
           * @example 0.01275
           */
          vat?: number;
          /**
           * Total system tariff including VAT.
           * @example 0.06375
           */
          total?: number;
          /**
           * Unit of system tariff.
           * @example "kr/kWh"
           */
          unit?: string;
        };
        netTariff?: {
          /**
           * Net tariff.
           * @example 0.074
           */
          value?: number;
          /**
           * VAT applied to net tariff.
           * @example 0.0185
           */
          vat?: number;
          /**
           * Total net tariff including VAT.
           * @example 0.0925
           */
          total?: number;
          /**
           * Unit of net tariff.
           * @example "kr/kWh"
           */
          unit?: string;
        };
      };
      distribution?: {
        /**
         * Distribution cost per kWh.
         * @example 0.4464
         */
        value?: number;
        /**
         * VAT applied to distribution cost.
         * @example 0.1116
         */
        vat?: number;
        /**
         * Total distribution cost including VAT.
         * @example 0.558
         */
        total?: number;
        /**
         * Unit of distribution cost.
         * @example "kr/kWh"
         */
        unit?: string;
      };
    };
    cost?: {
      /**
       * Total cost for the specific consumption period.
       * @example 1.55494
       */
      value?: number;
      /**
       * VAT applied to the cost.
       * @example 0.388735
       */
      vat?: number;
      /**
       * Total cost including VAT.
       * @example 1.943675
       */
      total?: number;
      /**
       * Unit of cost.
       * @example "kr"
       */
      unit?: string;
    };
  }[];
}

export type CompaniesListData = {
  /**
   * The name of the company.
   * @example "LOOAD"
   */
  name?: string;
  /** List of products the company offers. */
  products?: {
    /**
     * The product name.
     * @example "Standard"
     */
    name?: string;
    /**
     * Calculated consumption cost.
     * @example 1200
     */
    consumptionCost?: number;
    /**
     * Calculated fee cost.
     * @example 150
     */
    feeCost?: number;
    /**
     * Total calculated cost.
     * @example 1350
     */
    totalCost?: number;
    /**
     * Monthly subscription price.
     * @example 50
     */
    subscriptionMonthly?: number;
    /**
     * Monthly fees.
     * @example 10
     */
    feesMonthly?: number;
    /**
     * Consumption surcharge price.
     * @example 5
     */
    consumptionSurcharge?: number;
    /**
     * Fixed price component.
     * @example 100
     */
    fixedPrice?: number;
    /**
     * One-time creation fee.
     * @example 200
     */
    creationFee?: number;
  }[];
}[];

export type CompaniesFindListData = {
  /**
   * The name of the company.
   * @example "LOOAD"
   */
  name?: string;
  /** List of products the company offers. */
  products?: {
    /**
     * The product name.
     * @example "Standard"
     */
    name?: string;
    /**
     * Calculated consumption cost.
     * @example 1200
     */
    consumptionCost?: number;
    /**
     * Calculated fee cost.
     * @example 150
     */
    feeCost?: number;
    /**
     * Total calculated cost.
     * @example 1350
     */
    totalCost?: number;
    /**
     * Monthly subscription price.
     * @example 50
     */
    subscriptionMonthly?: number;
    /**
     * Monthly fees.
     * @example 10
     */
    feesMonthly?: number;
    /**
     * Consumption surcharge price.
     * @example 5
     */
    consumptionSurcharge?: number;
    /**
     * Fixed price component.
     * @example 100
     */
    fixedPrice?: number;
    /**
     * One-time creation fee.
     * @example 200
     */
    creationFee?: number;
  }[];
}[];

export type FactorsListData = {
  /**
   * Unique identifier for the factor.
   * @example "6495bd67431cf1de8e86c3c9"
   */
  _id?: string;
  /**
   * Short name for the factor.
   * @example "Skjulte udgifter"
   */
  shortName?: string;
  /**
   * Full name of the factor.
   * @example "Lægger skjulte udgifter på elregningerne"
   */
  name?: string;
  /**
   * Description of how the factor affects the rating.
   * @example "Elselskabet har skjulte udgifter på elregningerne, som bliver fundet, når vi gennemgår elregninger for elforbrugere."
   */
  description?: string;
  /**
   * The numeric value of the factor, where negative values indicate a negative impact and positive values indicate a positive impact.
   * @example -100
   */
  ratingFactor?: number;
}[];

export interface ForecastsListData {
  /** @format date-time */
  generatedAt?: string;
  /** @format date-time */
  start?: string;
  /** @format date-time */
  end?: string;
  model?: string;
  /** @example "DK2" */
  priceArea?: string;
  prices?: {
    /** @format date-time */
    datetime?: string;
    price?: number;
  }[];
  tag?: string;
}

export interface PricesNowListData {
  /** Price area used to resolve the price. */
  priceArea?: string;
  supplier?: {
    id?: string;
    name?: string;
    customerGroup?: {
      id?: string;
      name?: string;
      description?: string;
    } | null;
  };
  company?: {
    id?: string;
    name?: string;
    product?: {
      id?: string;
      name?: string;
      productType?: string;
    } | null;
  };
  price?: {
    /** @format date-time */
    date?: string;
    price?: {
      value?: number;
      vat?: number;
      total?: number;
      /** @example "kr/kWh" */
      unit?: string;
    };
    forecast?: boolean;
    /** @example "1h" */
    resolution?: string;
    details?: {
      electricity?: {
        value?: number;
        vat?: number;
        total?: number;
        unit?: string;
      };
      surcharge?: {
        value?: number;
        vat?: number;
        total?: number;
        unit?: string;
      } | null;
      transmission?: {
        systemTariff?: {
          value?: number;
          vat?: number;
          total?: number;
          unit?: string;
        };
        netTariff?: {
          value?: number;
          vat?: number;
          total?: number;
          unit?: string;
        };
      };
      electricityTax?: {
        value?: number;
        vat?: number;
        total?: number;
        unit?: string;
      };
      distribution?: {
        value?: number;
        vat?: number;
        total?: number;
        unit?: string;
      } | null;
    };
  };
}

export interface PricesListData {
  /**
   * Price area of the electricity.
   * @example "DK1"
   */
  priceArea?: string;
  prices?: {
    /**
     * Date and time of the price entry.
     * @format date-time
     */
    date?: string;
    price?: {
      value?: number;
      vat?: number;
      total?: number;
      /** @example "kr/kWh" */
      unit?: string;
    };
    /** True if the entry is forecasted (undefined if not forecasted) */
    forecast?: boolean;
    /**
     * The resolution of the price entry (e.g., "15m", "1h").
     * @example "1h"
     */
    resolution?: string;
    details?: {
      electricity?: {
        value?: number;
        vat?: number;
        total?: number;
        /** @example "kr/kWh" */
        unit?: string;
      };
      surcharge?: {
        value?: number;
        vat?: number;
        total?: number;
        /** @example "kr/kWh" */
        unit?: string;
      };
      transmission?: {
        systemTariff?: {
          value?: number;
          vat?: number;
          total?: number;
          /** @example "kr/kWh" */
          unit?: string;
        };
        netTariff?: {
          value?: number;
          vat?: number;
          total?: number;
          /** @example "kr/kWh" */
          unit?: string;
        };
      };
      electricityTax?: {
        value?: number;
        vat?: number;
        total?: number;
        /** @example "kr/kWh" */
        unit?: string;
      };
      distribution?: {
        value?: number;
        vat?: number;
        total?: number;
        /** @example "kr/kWh" */
        unit?: string;
      };
    };
  }[];
}

export type SuppliersListData = {
  /**
   * The supplier ID.
   * @example "radius_c"
   */
  id?: string;
  /**
   * The name of the supplier.
   * @example "Radius C"
   */
  name?: string;
  /**
   * The company name of the supplier.
   * @example "Radius Elnet A/S"
   */
  companyName?: string;
  /**
   * The price area of the supplier.
   * @example "DK1"
   */
  priceArea?: string;
  customerGroups?: {
    /**
     * The customer group ID.
     * @example "c"
     */
    id?: string;
    /**
     * Whether the customer group is the default group.
     * @example true
     */
    default?: boolean;
    /**
     * The name of the customer group.
     * @example "C"
     */
    name?: string;
    /**
     * The description of the customer group.
     * @example "Privatkunder og mindre erhvervskunder"
     */
    description?: string;
  }[];
}[];

export type SuppliersFindListData = {
  /**
   * The supplier ID.
   * @example "radius_c"
   */
  id?: string;
  /**
   * The name of the supplier.
   * @example "Radius C"
   */
  name?: string;
  /**
   * The company name of the supplier.
   * @example "Radius Elnet A/S"
   */
  companyName?: string;
  /**
   * The price area of the supplier.
   * @example "DK1"
   */
  priceArea?: string;
}[];

export type SuppliersAreasListData = {
  /**
   * The geometry of the coverage area.
   * @example {"type":"Polygon","coordinates":[[[12.5683,55.6761],[12.5683,55.6761],[12.5683,55.6761],[12.5683,55.6761]]]}
   */
  geometry?: object;
  supplierId?: {
    /**
     * The supplier ID.
     * @example "radius_c"
     */
    id?: string;
    /**
     * The name of the supplier.
     * @example "Radius C"
     */
    name?: string;
    /**
     * The company name of the supplier.
     * @example "Radius Elnet A/S"
     */
    companyName?: string;
    /**
     * The price area of the supplier.
     * @example "DK1"
     */
    priceArea?: string;
  };
}[];

export interface WebhooksMetadataListData {
  resources?: string[];
}

export type WebhooksListData = {
  /** The unique identifier for the webhook. */
  _id?: string;
  /** The resources for which the webhook listens. */
  resources?: string[];
  /**
   * The URL to which webhook notifications are sent.
   * @format uri
   */
  callbackUrl?: string;
  /**
   * The creation timestamp of the webhook.
   * @format date-time
   */
  createdAt?: string;
  /** Whether the webhook is active or not. */
  active?: boolean;
}[];

export interface WebhooksCreatePayload {
  /**
   * The resources the webhook subscribes to.
   * @example ["PRICES","COMPANIES"]
   */
  resources: string[];
  /**
   * The URL to which webhook notifications will be sent.
   * @format uri
   * @example "https://example.com/webhook"
   */
  callbackUrl: string;
}

export interface WebhooksCreateData {
  /**
   * The unique identifier for the webhook.
   * @example "64fb3f5e2c3d4c001f9a84ef"
   */
  _id?: string;
  /**
   * The resources the webhook listens to.
   * @example ["PRICES","COMPANIES"]
   */
  resources?: string[];
  /**
   * The URL to which webhook notifications are sent.
   * @format uri
   * @example "https://example.com/webhook"
   */
  callbackUrl?: string;
  /**
   * The creation timestamp of the webhook.
   * @format date-time
   * @example "2024-11-29T12:00:00.000Z"
   */
  createdAt?: string;
  /**
   * Whether the webhook is active.
   * @example true
   */
  active?: boolean;
}

export interface WebhooksDetailData {
  /** The unique identifier for the webhook. */
  _id?: string;
  /** The resources for which the webhook listens. */
  resources?: string[];
  /**
   * The URL to which webhook notifications are sent.
   * @format uri
   */
  callbackUrl?: string;
  /**
   * The creation timestamp of the webhook.
   * @format date-time
   */
  createdAt?: string;
  /** Whether the webhook is active or not. */
  active?: boolean;
}

export interface WebhooksDeleteData {
  /** @example "Webhook successfully deleted." */
  message?: string;
}

export type WebhooksLogsListData = {
  /**
   * The log entry timestamp.
   * @format date-time
   */
  timestamp?: string;
  /** The log entry message. */
  message?: string;
}[];

export interface SchedulingOptimizeCreatePayload {
  /**
   * List of electricity prices per hour.
   * @maxItems 35
   * @minItems 6
   */
  prices: number[];
  /** Optional list of solar energy production per hour. Must match `prices` array in length. */
  solar_input?: number[] | null;
  /** Optional list of electricity consumption per hour. Must match `prices` array in length. Usage should not include any consumption from the devices being scheduled. */
  usage?: number[] | null;
  /** List of batteries (EVs, home storage) to be scheduled. */
  battery_entities?: {
    /** Name of the battery entity. */
    name: string;
    /**
     * Initial battery charge in kWh.
     * @min 0
     * @max 1000
     */
    initial: number;
    /**
     * Target battery charge in kWh.
     * @min 0
     * @max 1000
     */
    target: number;
    /**
     * Minimum allowable charge level.
     * @min 0
     * @max 1000
     */
    minimum?: number | null;
    /**
     * Maximum battery capacity in kWh.
     * @min 0
     * @max 1000
     */
    capacity: number;
    /**
     * Charging rate in kW.
     * @min 0
     * @max 100
     */
    charge_rate?: number | null;
    /** Charging power per time step. */
    charge_curve?: number[] | null;
    /** Discharging power per time step. */
    discharge_curve?: number[] | null;
    /** Whether the battery can be charged with solar energy. */
    solar_input?: boolean | null;
  }[];
  /** List of comfort-based devices (e.g., heat pumps) to be scheduled. */
  comfort_entities?:
    | {
        /** Name of the comfort entity. */
        name: string;
        /**
         * Initial comfort level in percentage.
         * @min 0
         * @max 100
         */
        initial: number;
        /**
         * Minimum allowed comfort level.
         * @min 0
         * @max 100
         */
        minimum: number;
        /** Comfort level gain per time step. */
        comfort_gain_curve: number[];
        /** Comfort level loss per time step. */
        comfort_loss_curve: number[];
        /**
         * Energy consumption in kW.
         * @min 0
         * @max 100
         */
        energy_usage: number;
        /**
         * Reward coefficient for higher comfort levels.
         * @min 0
         * @max 0.05
         */
        reward: number;
      }[]
    | null;
}

export interface SchedulingOptimizeCreateData {
  /** Execution time in seconds. */
  execution_time?: number;
  /** Number of generations in the optimization process. */
  generations?: number;
  /** The final fitness score of the optimization. */
  fitness?: number;
  /** The average electricity price in the optimized schedule. */
  avg_price?: number;
  /** Whether the schedule was overconstrained. */
  overconstrained?: boolean;
  /** List of any problems encountered during scheduling. */
  problems?: string[];
  /** The scheduled entities and their states over time. */
  entities?: {
    /** The name of the entity. */
    name?: string;
    /** The type of the entity (e.g., "battery" or "comfort"). */
    type?: string;
    schedule?: {
      /** The operational state of the entity. */
      state?: string;
      /** The charge level (for batteries) or comfort level. */
      level?: number;
    }[];
  }[];
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Strømligning API documentation, licensing and guidelines
 * @version 1.0.1
 *
 *
 *   This API provides access to data related to Danish electricity pricing, including hourly rates, network costs, and other associated metrics. The data can be used to develop analytics tools, comparison platforms, and energy management solutions.
 *
 *   **License**: This API and data are licensed under the **[Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/)**. Usage must comply with the attribution and non-commercial requirements as described in the terms of use section below.
 *
 *   ---
 *
 *   ## Upcoming Change: 15-Minute Resolution in the Strømligning Price API
 *
 *   Starting **30 September**, the Strømligning Price API will begin serving prices in **15-minute resolution**.
 *
 *   ### What stays the same
 *   The API itself and its **response structure** remain unchanged.
 *
 *   ### What's new
 *
 *   **From 30 September onwards**, the API will by default provide future prices in 15-minute intervals instead of the current 1-hour intervals.
 *   Historical data will remain in 1-hour resolution.
 *
 *   **A new resolution field** will be added to the prices array.
 *   "resolution" → currently "1h", will switch to "15m" when the change takes effect.
 *
 *   **Aggregation options** are introduced for users that wish to continue receiving prices in 1-hour resolution.
 *   This allows receiving aggregated mean prices in 1-hour resolution, even after the switch to 15-minute data. Please see the updated API documentation for details on how to use this feature.
 *   If no aggregation is specified, the API will return prices in the stored resolution by default. That means 1h prices until 30 September, and 15m prices thereafter.
 *
 *   ### Why the change
 *   The transition to 15-minute pricing is driven by Nord Pool's move to a 15-minute Market Time Unit (MTU) starting 1 October. This change aims to better reflect real-time supply and demand dynamics in the electricity market, providing more accurate price signals.
 *
 *   More information about the transition to 15-minute Market Time Units (MTU): [Nord Pool Announcement](https://www.nordpoolgroup.com/en/trading/transition-to-15-minute-market-time-unit-mtu/)
 *
 *   ---
 *
 *   ## Terms of use
 *
 *   This API is available for **non-commercial use** to everyone, including private individuals, hobbyists, and developers. However, **commercial use** of the API requires a formal agreement with Strømligning.
 *
 *   ### Usage guidelines
 *
 *   - **Non-commercial use**:
 *
 *     - Use the Strømligning API and data for personal, educational, or editorial purposes without needing a formal agreement.
 *
 *     - Proper attribution must always be given, including a link to [https://stromligning.dk](https://stromligning.dk). See attribution requirements section for details.
 *       Attribution is not required for personal use that is not published or publicly visible (e.g., personal home automation)
 *
 *     - Modifying, distributing, or using the data to create derivative works is allowed, as long as the attribution requirements are met, the use remains non-commercial and the guidelines for responsible use are followed.
 *
 *   - **Commercial use**:
 *
 *     - Commercial use without explicit agreement is prohibited. Examples include using the data in products or services that are sold, monetized, or used for internal business purposes.
 *
 *     - Use of the data on social media or personal platforms to promote companies, either for monetary gain or personal influence, is considered commercial use and requires explicit permission.
 *
 *     - Contact [info@stromligning.dk](mailto:info@stromligning.dk) to discuss commercial usage.
 *
 *   ### Responsible use
 *
 *   Users must use the Strømligning data responsibly to prevent modification or misuse that could mislead or misrepresent the original data.
 *
 *   - **Integrity**: Users must not modify the data or create derivative works in ways that alter its integrity or intended meaning, especially if it could mislead or misrepresent the information.
 *
 *   - **Complete representation**: Users must ensure that all relevant data is presented fairly, without selectively omitting parts that could provide an incomplete or biased perspective of the data.
 *
 *   - **Verification**: Strømligning reserves the right to verify how the data is being used to ensure compliance with responsible use standards. Misuse may lead to legal action.
 *
 *   ### GDPR and personal data
 *   - Strømligning does not collect, process, or store any personal data submitted to the API. All data received by the API is processed in-memory and discarded after the response is sent.
 *
 *   - The API does not accept inputs containing personal information. Users must ensure that no personal data is included in requests.
 *
 *   - As no personal data is stored or retained, Strømligning is fully compliant with GDPR regarding data minimization and privacy protection.
 *
 *   ### Attribution requirements
 *
 *   - **Visibility**: Attribution must be clearly visible and at least the same size as other text content used in the same context.
 *
 *   - **Link requirement**: For online material, the attribution must include an active link to [https://stromligning.dk](https://stromligning.dk), and it must be clearly clickable with a suitable UI hint.
 *
 *   - **Proximity**: Attribution must be placed close to the content where Strømligning's data is used, such as a caption for a graph or chart.
 *
 *   - **Non-obstruction**: Attribution must not be obstructed or placed in a way that diminishes visibility, such as in tiny print or in an inconspicuous location.
 *
 *   - **Persistence**: Attribution must always appear with the content, even when shared on social media or downloaded as a PDF.
 *
 *   - **Multiple usage locations**: If the data is used in multiple sections of a page or app, attribution must be provided at each usage location to ensure clarity and transparency.
 *
 *   - **Template for attribution**: Use the following template:
 *     - "Data provided by Strømligning. [https://stromligning.dk](https://stromligning.dk)"
 *     - For printed or offline materials, replace the link with: "Data provided by Strømligning ([https://stromligning.dk](https://stromligning.dk))."
 *
 *   - **Verification**: Strømligning reserves the right to request proof of correct attribution. Users must be able to demonstrate compliance.
 *
 *   - **Non-compliance**: Failure to follow these requirements may lead to withdrawal of usage rights. Strømligning reserves the right to request immediate removal of content if attribution is incorrect or missing.
 *
 *   **Examples**:
 *
 *   - **Web article**: "Electricity pricing data provided by Strømligning. [https://stromligning.dk](https://stromligning.dk)"
 *   - **PDF report**: "Data provided by Strømligning ([https://stromligning.dk](https://stromligning.dk))."
 *
 *   ### Commercial use
 *
 *   Strømligning is open to allowing data to be used for **commercial purposes**, but explicit permission is required to ensure responsible use.
 *   The conditions for commercial use are as follows:
 *
 *   - **Permission required**: Commercial use of the Strømligning API or data requires explicit written permission.
 *
 *   - **Verification and oversight**: Strømligning reserves the right to verify how the data is used commercially to ensure compliance. Misuse may lead to legal action.
 *
 *   - **Contact for permission**: To obtain commercial usage rights, contact [info@stromligning.dk](mailto:info@stromligning.dk).
 *
 *   ### Intellectual property
 *
 *   The content provided through the API, including but not limited to data, responses, and any other material, is protected by copyright and is the property of Strømligning. Unauthorized reproduction, distribution, or commercial use without permission is prohibited.
 *
 *   ### Updates to terms
 *
 *   Strømligning reserves the right to modify these terms at any time without prior notice. You are responsible for regularly reviewing the terms to ensure compliance.
 *
 *   For more information or to request permission for commercial use, please contact us at [info@stromligning.dk](mailto:info@stromligning.dk).
 *
 *   ## Rate limiting
 *   To ensure fair usage of the API, the following rate limits apply:
 *   - **Unauthenticated users**: Limited to 5-10 requests per 15-minute window.
 *
 *   - **Authenticated users** (with an API key): As per the agreed-upon rate limits.
 *
 *   If you require higher rate limits for commercial or non-commercial use, please contact us to discuss your needs.
 *   Excessive usage or violation of rate limits may result in temporary or permanent suspension of access.
 *
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description This endpoint calculates the total electricity cost based on consumption data, the selected region, and optionally, the supplier and product information. If a fixed electricity price is provided via `electricityPrice`, the calculation uses this value instead of the variable hourly price. The `supplierId` can be retrieved from the `/api/suppliers` or `/api/suppliers/find` endpoints, and the `productId` can be retrieved from the `/api/companies` endpoint.
     *
     * @tags Cost
     * @name CalculationsCostCreate
     * @summary Calculate electricity cost based on consumption, region, and supplier/product information, with optional fixed price.
     * @request POST:/api/calculations/cost
     * @secure
     */
    calculationsCostCreate: (
      data: CalculationsCostCreatePayload,
      params: RequestParams = {},
    ) =>
      this.request<CalculationsCostCreateData, void>({
        path: `/api/calculations/cost`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Companies
     * @name CompaniesList
     * @summary Retrieve a list of companies with optional filtering by region and yearly consumption.
     * @request GET:/api/companies
     * @secure
     */
    companiesList: (
      query?: {
        /**
         * Yearly electricity consumption in kWh.
         * @example 5000
         */
        yearlyConsumption?: number;
        /**
         * Region to filter companies by (defaults to DK1).
         * @example "DK1"
         */
        region?: string;
        /**
         * The period in months for which the pricing should be calculated (defaults to 12).
         * @example 12
         */
        periodMonths?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<CompaniesListData, void>({
        path: `/api/companies`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Companies
     * @name CompaniesFindList
     * @summary Find companies based on id, name, cvr, verification status, and more.
     * @request GET:/api/companies/find
     * @secure
     */
    companiesFindList: (
      query?: {
        /**
         * ID or slug of the company.
         * @example "looad"
         */
        id?: string;
        /**
         * The name of the company.
         * @example "LOOAD"
         */
        name?: string;
        /**
         * The CVR number of the company.
         * @example "DK42642789"
         */
        cvr?: string;
        /**
         * Whether the company is verified or not.
         * @example true
         */
        verified?: boolean;
        /**
         * Whether the company offers electric vehicle charging tax refund.
         * @example true
         */
        electricVehicleChargingTaxRefund?: boolean;
        /**
         * Yearly electricity consumption in kWh.
         * @example 5000
         */
        yearlyConsumption?: number;
        /**
         * Region to filter companies by (defaults to DK1).
         * @example "DK1"
         */
        region?: string;
        /**
         * The period in months for which the pricing should be calculated (defaults to 12).
         * @example 12
         */
        periodMonths?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<CompaniesFindListData, void>({
        path: `/api/companies/find`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description These factors are used to calculate a compliance score for electric companies. Each factor affects the overall rating (0-5 stars) based on the company's behavior. Negative rating factors indicate practices that harm the consumer, while positive rating factors indicate practices that benefit the consumer.
     *
     * @tags Factors
     * @name FactorsList
     * @summary Retrieve a list of factors used to calculate company ratings.
     * @request GET:/api/factors
     * @secure
     */
    factorsList: (params: RequestParams = {}) =>
      this.request<FactorsListData, void>({
        path: `/api/factors`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description ## BETA: This endpoint is in beta and will change without notice. Retrieve the most recently generated electricity price forecast for a given price area. The response includes the generation timestamp, the covered time window, the model name, the price area, a list of hourly prices, and an optional tag identifying the forecast run. Note: - Forecasts are model-based estimates and may differ from actual market prices.
     *
     * @tags Forecasts
     * @name ForecastsList
     * @summary Get the latest forecast for a specific price area
     * @request GET:/api/forecasts
     * @secure
     */
    forecastsList: (
      query: {
        /**
         * Price area code.
         * @example "DK2"
         */
        priceArea: "DK1" | "DK2";
      },
      params: RequestParams = {},
    ) =>
      this.request<ForecastsListData, void>({
        path: `/api/forecasts`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the price that is currently in effect for the specified price area, supplier, or product. Optionally aggregate to the current hour, return lean payloads, or return only the numeric price.
     *
     * @tags Prices
     * @name PricesNowList
     * @summary Get the current electricity price and cost breakdown
     * @request GET:/api/prices/now
     * @secure
     */
    pricesNowList: (
      query?: {
        /**
         * Product ID used to determine tariffs and surcharges (optional).
         * @example "nrgi_time"
         */
        productId?: string;
        /**
         * Supplier ID used to resolve price area and tariffs (optional).
         * @example "radius_c"
         */
        supplierId?: string;
        /**
         * Supplier customer group ID (optional).
         * @example "c"
         */
        customerGroupId?: string;
        /** Fixed electricity price in kr/kWh (required when using fixed price products). */
        electricityPrice?: number;
        /** Price area identifier (optional, inferred from supplier when omitted). */
        priceArea?: string;
        /** Aggregate the current price to the active hourly bucket. */
        aggregation?: "1h";
        /** Aggregation method to apply when `aggregation` is requested (defaults to `mean`). */
        aggregationMethod?: "mean" | "min" | "max";
        /** Return only `date`, `price`, and `resolution` (defaults to false). */
        lean?: boolean;
        /** Return only the total price as text/plain (defaults to false). */
        priceOnly?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<PricesNowListData, void>({
        path: `/api/prices/now`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve electricity prices for a specified date range, supplier, and product. The response includes electricity, surcharge, transmission, distribution, electricity tax, and the total price, all rounded to six decimal places.
     *
     * @tags Prices
     * @name PricesList
     * @summary Get electricity prices and costs breakdown
     * @request GET:/api/prices
     * @secure
     */
    pricesList: (
      query?: {
        /**
         * Start date for the pricing data (optional, defaults to the start of yesterday if not provided).
         * @format date-time
         */
        from?: string;
        /**
         * End date for the pricing data (optional, defaults to the end of tomorrow if not provided).
         * @format date-time
         */
        to?: string;
        /**
         * Product ID (optional).
         * @example "nrgi_time"
         */
        productId?: string;
        /**
         * Supplier ID (optional).
         * @example "radius_c"
         */
        supplierId?: string;
        /**
         * Supplier CustomerGroup ID (optional).
         * @example "c"
         */
        customerGroupId?: string;
        /** Fixed electricity price (optional, required if using a fixed-price product). */
        electricityPrice?: number;
        /** Price area (optional, derived from supplier if supplierId is provided). */
        priceArea?: string;
        /** Return only an array of date and price (optional, defaults to false). */
        lean?: boolean;
        /** Include forecasted prices appended after real prices without overlap (optional, defaults to false). */
        forecast?: boolean;
        /**
         * Optional aggregation interval. If omitted the raw resolution (stored resolution)
         * is returned.
         */
        aggregation?: "1h" | "1d" | "1M" | "1Y";
        /** Aggregation method to use when aggregation is provided. "mean" is the default. */
        aggregationMethod?: "mean" | "min" | "max";
      },
      params: RequestParams = {},
    ) =>
      this.request<PricesListData, void>({
        path: `/api/prices`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description This endpoint returns all electricity suppliers stored in the database.
     *
     * @tags Suppliers
     * @name SuppliersList
     * @summary Retrieve a list of all suppliers.
     * @request GET:/api/suppliers
     * @secure
     */
    suppliersList: (params: RequestParams = {}) =>
      this.request<SuppliersListData, void>({
        path: `/api/suppliers`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description This endpoint allows users to find electricity suppliers based on geographical coordinates (latitude and longitude) or a postal code. It returns an array of suppliers if found. If no suppliers are found, it returns a 404 status. When using gps coordinates, the endpoint will only return one supplier covering the given point but still returns an array.
     *
     * @tags Suppliers
     * @name SuppliersFindList
     * @summary Find suppliers by geographical coordinates or postal code.
     * @request GET:/api/suppliers/find
     * @secure
     */
    suppliersFindList: (
      query?: {
        /**
         * Latitude coordinate to find the supplier.
         * @example 55.6761
         */
        lat?: number;
        /**
         * Longitude coordinate to find the supplier.
         * @example 12.5683
         */
        long?: number;
        /**
         * Postal code to find suppliers.
         * @example 4320
         */
        postalCode?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SuppliersFindListData, void>({
        path: `/api/suppliers/find`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description This endpoint returns all coverage areas for danish distribution system operators as GeoJSON. This endpoint is only available to authenticated users with API key. The dataset and response size is about 40MB. Don't try to execute this in the swagger UI as it will crash the browser.
     *
     * @tags Suppliers
     * @name SuppliersAreasList
     * @summary Retrieve all coverage areas as GeoJSON.
     * @request GET:/api/suppliers/areas
     * @secure
     */
    suppliersAreasList: (params: RequestParams = {}) =>
      this.request<SuppliersAreasListData, void>({
        path: `/api/suppliers/areas`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve possible enum values for the `resources` field.
     *
     * @tags Webhooks
     * @name WebhooksMetadataList
     * @summary Get webhook metadata
     * @request GET:/api/webhooks/metadata
     * @secure
     */
    webhooksMetadataList: (params: RequestParams = {}) =>
      this.request<WebhooksMetadataListData, void>({
        path: `/api/webhooks/metadata`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve all webhooks associated with the current API key.
     *
     * @tags Webhooks
     * @name WebhooksList
     * @summary Get all webhooks
     * @request GET:/api/webhooks
     * @secure
     */
    webhooksList: (params: RequestParams = {}) =>
      this.request<WebhooksListData, void>({
        path: `/api/webhooks`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new webhook for the current API key. If a webhook with the same `resources` and `callbackUrl` already exists, it returns the existing webhook.
     *
     * @tags Webhooks
     * @name WebhooksCreate
     * @summary Create or retrieve a webhook
     * @request POST:/api/webhooks
     * @secure
     */
    webhooksCreate: (data: WebhooksCreatePayload, params: RequestParams = {}) =>
      this.request<
        WebhooksCreateData,
        | {
            /** @example "Invalid resources. Allowed values are: PRICES, COMPANIES, SUPPLIERS, FACTORS" */
            error?: string;
          }
        | {
            /** @example "Unauthorized: Missing or invalid API key" */
            error?: string;
          }
        | {
            /** @example "Internal server error" */
            error?: string;
            /** @example "An unexpected error occurred." */
            details?: string;
          }
      >({
        path: `/api/webhooks`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve a specific webhook by its ID.
     *
     * @tags Webhooks
     * @name WebhooksDetail
     * @summary Get a specific webhook
     * @request GET:/api/webhooks/{id}
     * @secure
     */
    webhooksDetail: (id: string, params: RequestParams = {}) =>
      this.request<WebhooksDetailData, void>({
        path: `/api/webhooks/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes a webhook by its ID associated with the current API key.
     *
     * @tags Webhooks
     * @name WebhooksDelete
     * @summary Delete a specific webhook
     * @request DELETE:/api/webhooks/{id}
     * @secure
     */
    webhooksDelete: (id: string, params: RequestParams = {}) =>
      this.request<
        WebhooksDeleteData,
        | {
            /** @example "Unauthorized: Missing or invalid API key" */
            error?: string;
          }
        | {
            /** @example "Webhook not found" */
            error?: string;
          }
        | {
            /** @example "Internal server error" */
            error?: string;
            /** @example "An unexpected error occurred." */
            details?: string;
          }
      >({
        path: `/api/webhooks/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description See the logs for a webhook including any http errors from callbacks.
     *
     * @tags Webhooks
     * @name WebhooksLogsList
     * @summary View live logs for a webhook
     * @request GET:/api/webhooks/{id}/logs
     * @secure
     */
    webhooksLogsList: (id: string, params: RequestParams = {}) =>
      this.request<WebhooksLogsListData, void>({
        path: `/api/webhooks/${id}/logs`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description ## BETA: This endpoint is in beta and will change without notice. This endpoint calculates the energy schedule for various electrical devices such as **EVs, heat pumps, and home energy storage systems**. The optimization considers **electricity prices, solar input, and energy consumption** to find the most cost-effective schedule for the complete solution. That includes charging, holding or discharging of home energy storage system, enabling/disabling comfort devices like heat pumps and charging EVs. Its possible to calculate a complete solution with multiple devices and constraints but scheduling a single device like an EV is also possible. The response includes the optimized schedule for each device, as well as the overall cost and execution time. All calculations are done using a genetic algorithm to find the optimal solution. **Note**: This endpoint is in beta and may change without notice. Contact us at [info@stromligning.dk](mailto:info@stromligning.dk) for more information, more examples of usage, or to provide feedback.
     *
     * @tags Scheduling
     * @name SchedulingOptimizeCreate
     * @summary BETA - Optimize energy scheduling
     * @request POST:/api/scheduling/optimize
     * @secure
     */
    schedulingOptimizeCreate: (
      data: SchedulingOptimizeCreatePayload,
      params: RequestParams = {},
    ) =>
      this.request<
        SchedulingOptimizeCreateData,
        | {
            errors?: {
              /** Description of the validation error. */
              msg?: string;
            }[];
          }
        | {
            /** Description of the server error. */
            error?: string;
          }
      >({
        path: `/api/scheduling/optimize`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
