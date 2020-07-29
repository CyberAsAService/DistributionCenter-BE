import taskRoutes from "./task/routes";
import userRoutes from "./users/routes";
import groupRoutes from "./group/routes";
import paasRoutes from "./paas/routes";
export default [...taskRoutes, ...userRoutes, ...groupRoutes,...paasRoutes];
