import { LooseObject } from "../../utils/models";
import * as provider from './paas-provider';

export const getTasks = async (params: LooseObject) => {
    return provider.getTasks(params);
};

export const updateStep = async (params: LooseObject) => {
    return provider.updateStep(params);
};

export const insertStep = async (params: LooseObject) => {
    provider.insetStep(params);
};