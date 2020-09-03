import { LooseObject } from "../../utils/models";
import * as provider from './task-provider';

export const createTask = async (params: LooseObject) => {
    return provider.createTask(params);
};

export const insertSubtask = async (params: LooseObject) => {
    await provider.insertSubtask(params);
};