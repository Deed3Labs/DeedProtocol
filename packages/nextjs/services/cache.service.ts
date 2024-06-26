import logger from "./logger.service";
import { Address } from "viem";
import "viem";
import { FeesClient } from "~~/clients/fees.client";
import deployedContracts from "~~/contracts/deployedContracts";
import { FeesModel } from "~~/models/fees.model";
import { getContractInstance } from "~~/servers/contract";
import { getTargetNetwork } from "~~/utils/scaffold-eth";
import { sleepAsync } from "~~/utils/sleepAsync";

let cacheActivated = true;
const validatorCacheTimeSec = 3600;
const adminCacheTimeSec = validatorCacheTimeSec;

let cacheMap: Map<
  string,
  Map<string, { value: any; expirationMs?: number } | null>
> = retrieveCache();

// #region Cache definitions

export async function cacheIsValidator(wallet: Address, forceCacheRefresh: boolean = false) {
  const keyParam = {
    chainId: getTargetNetwork().id,
    accessManagerAddress:
      deployedContracts[getTargetNetwork().id as keyof typeof deployedContracts].AccessManager
        .address,
    wallet,
  };
  return buildCache<boolean>(
    "contract-write",
    JSON.stringify(keyParam),
    () => {
      return getContractInstance(
        window.location.host,
        keyParam.chainId,
        "AccessManager",
      ).read.hasValidatorRole([keyParam.wallet]);
    },
    3600,
    forceCacheRefresh,
  );
}

export async function cacheIsAdmin(wallet: Address, forceCacheRefresh: boolean = false) {
  const keyParam = {
    chainId: getTargetNetwork().id,
    accessManagerAddress:
      deployedContracts[getTargetNetwork().id as keyof typeof deployedContracts].AccessManager
        .address,
    wallet,
  };
  return buildCache<boolean>(
    "contract-write",
    JSON.stringify(keyParam),
    () => {
      return getContractInstance(
        window.location.host,
        keyParam.chainId,
        "AccessManager",
      ).read.hasAdminRole([keyParam.wallet]);
    },
    adminCacheTimeSec,
    forceCacheRefresh,
  );
}

export async function cacheFees(forceCacheRefresh: boolean = false) {
  const keyParam = {
    chainId: getTargetNetwork().id,
  };
  return buildCache<FeesModel>(
    "fees",
    JSON.stringify(keyParam),
    () => new FeesClient().getFees().then(x => x ?? {}),
    5000,
    forceCacheRefresh,
  );
}

// #endregion

// #region Cache helpers

async function buildCache<TValue>(
  cacheId: string,
  valueId: string | undefined,
  fetchValue: () => Promise<TValue>,
  cacheDurationMs?: number, // Undefined for permanent cache
  forceCacheRefresh?: boolean,
): Promise<TValue> {
  if (!cacheActivated) {
    const value = await fetchValue();
    console.debug("Skiping cache", {
      cacheId,
      valueId,
      value,
    });
    return value;
  }
  if (!cacheMap) {
    cacheMap = retrieveCache();
  }
  let cache = cacheMap.get(cacheId);
  if (!cache) {
    cache = new Map<string, { value: TValue; expirationMs: number } | null>();
    cacheMap.set(cacheId, cache);
  } else if (valueId) {
    let cached = cache.get(valueId); // Will set cache to undefined if valueId is undefined
    if (cached !== undefined) {
      // Token is being fetched
      let retryCount = 20;
      while (cached === null) {
        // eslint-disable-next-line no-await-in-loop
        await sleepAsync(200);
        cached = cache.get(valueId);
        retryCount -= 1;
        if (retryCount <= 0) {
          logger.debug(`Failed to retrieve cache item, reseting cache ${cacheId}`);
          resetCache(cacheId);
          break;
        }
      }
      if (
        cached &&
        (!cached.expirationMs || cached.expirationMs > Date.now()) &&
        !forceCacheRefresh
      ) {
        console.debug("Using cached version of", {
          cacheId,
          valueId,
          value: cached.value,
          cacheDurationMs,
        });
        return cached.value;
      }
    }
  }

  if (valueId) {
    cache.set(valueId, null); // Set to null to indicate that it is being fetched
  }
  const value = await fetchValue();
  if (!valueId) {
    // Only build the cache if the valueId is defined
    console.debug("Skiping caching result because valueId is not defined", {
      cacheId,
      valueId,
      value,
      cacheDurationMs,
    });
    return value;
  }
  cache.set(valueId, {
    value,
    expirationMs: cacheDurationMs ? Date.now() + cacheDurationMs : undefined,
  });
  console.debug("Building cached version of", { cacheId, valueId, value, cacheDurationMs });
  saveCache(); // Save cache without waiting for it to be saved
  return value;
}

function replacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  }
  return value;
}

function reviver(key: string, value: any) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

function saveCache() {
  const { id } = getTargetNetwork();
  // localStorage.setItem(`${id}.cache`, JSON.stringify({ cacheVersion, cacheMap }, replacer));
}

function retrieveCache() {
  // const { id } = getTargetNetwork();
  // const cacheId = `${id}.cache`;

  // try {
  //   const cacheJson = localStorage.getItem(cacheId);
  //   if (cacheJson) {
  //     const result = JSON.parse(cacheJson, reviver) as {
  //       cacheVersion: number;
  //       cacheMap: Map<string, Map<string, any>>;
  //     };
  //     if (result.cacheVersion !== cacheVersion) {
  //       logger.debug("Cache version mismatch, clearing cache");
  //       localStorage.removeItem(cacheId);
  //     } else if (result.cacheMap.size > 0) {
  //       return result.cacheMap;
  //     }
  //   }
  // } catch (error) {
  //   logger.debug("Error retrieving cache from storage, clearing cache", error);
  //   localStorage.removeItem(cacheId);
  // }

  return new Map<string, Map<string, any>>();
}

function resetCache(cacheId?: string) {
  if (cacheId) {
    cacheMap.get(cacheId)?.clear();
  } else {
    cacheMap.clear();
  }
  saveCache();
  return "Cache reset";
}

function disableCache() {
  cacheActivated = false;
  return "Cache disabled";
}

// (window as any).resetCache = resetCache;
// (window as any).disableCache = disableCache;

// #endregion
