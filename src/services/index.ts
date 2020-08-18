import taskRoutes from "./task/routes";
import userRoutes from "./users/routes";
import groupRoutes from "./group/routes";
import paasRoutes from "./paas/routes";
import executerRoutes from "./executer/routes"
import repositoryRoutes from "./repo/routes"
export default [...taskRoutes, ...userRoutes, ...groupRoutes, ...paasRoutes, ...executerRoutes,...repositoryRoutes];
