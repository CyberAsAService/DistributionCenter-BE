import { LooseObject } from "../../utils/models";
import * as provider from './task-provider';

export const createTask = async (params: LooseObject) => {
    return provider.createTask(params);
};

export const createSubtask = async (params: LooseObject) => {
    await provider.createSubtask(params);
};

export const getSubtask = async (params: LooseObject) => {
    return provider.getSubtask(params);
};

export const getMicrotask = async (params: LooseObject) => {
    return provider.getMicrotask(params);
};

export const createStep = async (params: LooseObject) => {
    return provider.createStep(params);
};