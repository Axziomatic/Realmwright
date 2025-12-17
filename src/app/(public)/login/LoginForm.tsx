"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginValues } from "@/lib/validators/auth";
import { signIn } from "@/app/actions/auth";

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginValues) => {
    const fd = new FormData();
    fd.set("email", values.email);
    fd.set("password", values.password);

    startTransition(async () => {
      await signIn(fd);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm text-foreground-secondary">Email</label>
        <input
          {...register("email")}
          type="email"
          className="mt-1 w-full rounded-xl border border-border-primary bg-background-muted px-3 py-2 text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent-highlight"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-accent-highlight">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-foreground-secondary">Password</label>
        <input
          {...register("password")}
          type="password"
          className="mt-1 w-full rounded-xl border border-border-primary bg-background-muted px-3 py-2 text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent-highlight"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-accent-highlight">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-foreground-secondary">
          <input type="checkbox" className="accent-accent-primary" />
          Remember me
        </label>

        <a
          href="/forgot-password"
          className="text-accent-highlight hover:text-accent-primary"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isPending || !isValid}
        className="w-full rounded-xl bg-accent-primary py-2 font-medium text-black hover:bg-accent-highlight disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
