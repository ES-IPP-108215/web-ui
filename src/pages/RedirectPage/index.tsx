import { useEffect } from "react";
import { LogIn, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { UserService } from "@/services/Client/UserService";
import { useUserStore } from "@/stores/useUserStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RedirectPage() {
  const navigate = useNavigate();

  const getCodeFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("code");
  };

  const login = async (code: string) => {
    const test = (await UserService.login(code)).data;
    return test;
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      useUserStore.getState().login(data.token.token);
      navigate('/');
    },
    onError: (error) => {
      console.error("Login failed:", error);
    }
  });

  useEffect(() => {
    const code = getCodeFromUrl();
    if (code) {
      loginMutation.mutate(code.toString());
    } else {
      console.error("No code found in URL");
    }
  }, []); 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <LogIn className="w-20 h-20 text-primary" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                We're redirecting you to the homepage...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please wait a moment.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <Button variant="outline" disabled>
                Redirecting...
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}