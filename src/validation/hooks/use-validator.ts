import { useCallback, useEffect, useMemo } from "react";
import { RuleResultSet } from "../rule-result-set.ts";
import { RuleSet } from "../rule-set.ts";
import type { Rule } from "../rule.ts";

import type { Validator } from "../validator.ts";

interface CacheKey<TSubject> {
  subject: TSubject;
  rules: Rule<TSubject>[];
}

const validationCache = new Map<CacheKey<unknown>, RuleResultSet>();

function getFromCache<TSubject>(cacheKey: CacheKey<TSubject>) {
  for (const [key, value] of validationCache.entries()) {
    if (
      key.subject === cacheKey.subject &&
      key.rules.every((rule, i) => rule === cacheKey.rules[i])
    ) {
      console.debug("Cache hit");
      return value;
    }
  }
  console.debug("Cache miss");
  return null;
}

export function useValidator<TSubject>(
  subject: TSubject,
  rules: Rule<TSubject>[],
) {
  const cacheKey = useMemo<CacheKey<TSubject>>(
    () => ({ subject, rules }),
    [subject, rules],
  );

  const getResultSet = useCallback(() => {
    const cache = getFromCache(cacheKey);
    if (cache) {
      return cache;
    }
    const ruleSet = RuleSet.of(rules);
    const resultSet = new RuleResultSet(ruleSet.validate(subject));
    validationCache.set(cacheKey as CacheKey<unknown>, resultSet);
    return resultSet;
  }, [cacheKey, rules, subject]);

  useEffect(() => {
    return () => {
      validationCache.delete(cacheKey as CacheKey<unknown>);
    };
  }, [cacheKey]);

  return useMemo(
    () => ({
      getResultSet,
    }),
    [getResultSet],
  ) satisfies Validator as Validator;
}
