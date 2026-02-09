import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/services/apiAuth";
import { Loader2 } from "lucide-react";

// export default function ProtectedRoute() {
//   const location = useLocation();

//   const { data: user, isLoading, isError } = useQuery({
//     queryKey: ["me"],
//     queryFn: getMe,
//     retry: false, 
//   });

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
//         <Loader2 className="w-10 h-10 animate-spin text-brand mb-4" />
//         <p className="text-xs font-bold tracking-widest uppercase opacity-40">
//           Checking Credentials...
//         </p>
//       </div>
//     );
//   }

//   if (isError || !user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return <Outlet />;
// }

export default function ProtectedRoute() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false, 
  });

  // 1. THIS IS THE BRAKES: 
  // We stop the entire app here until the backend answers.
  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-brand" />
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
            Securing Session...
          </p>
        </div>
      </div>
    );
  }

  // 2. Only if we have the user do we let them pass to the AdminLayout
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}