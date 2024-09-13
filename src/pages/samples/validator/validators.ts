import { Validator } from "../../../validation/validator.ts";
import {
  ageRules,
  compositeRules,
  emailRules,
  itemsRules,
  nameRules,
} from "./rules.ts";

export const sampleNameValidator = Validator.of(nameRules);

export const sampleEmailValidator = Validator.of(emailRules);

export const sampleCompositeValidator = Validator.of(compositeRules);

export const sampleItemsValidator = Validator.of(itemsRules);

export const sampleAgeValidator = Validator.of(ageRules);
