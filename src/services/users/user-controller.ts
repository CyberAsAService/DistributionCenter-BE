import * as provider from "./users-provider";

export const CreateUser = (id: number) => {
    return provider.CreateUser(id);
}