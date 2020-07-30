import taskRoutes from "./task/routes";
import userRoutes from "./users/routes";
import groupRoutes from "./group/routes";
export default [...taskRoutes, ...userRoutes, ...groupRoutes,];
