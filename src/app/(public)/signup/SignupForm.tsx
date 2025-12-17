"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signupSchema, type SignupValues } from "@/lib/validators/auth";
import { signUp } from "@/app/actions/auth";

export default function SignupForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = (values: SignupValues) => {
    const fd = new FormData();
    fd.set("username", values.username);
    fd.set("email", values.email);
    fd.set("password", values.password);
    fd.set("confirmPassword", values.confirmPassword);
    if (values.acceptTerms) fd.set("acceptTerms", "on");

    startTransition(async () => {
      await signUp(fd);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm text-foreground-secondary">Username</label>
        <input
          {...register("username")}
          className="mt-1 w-full rounded-xl border border-border-primary bg-background-muted px-3 py-2 text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent-highlight"
        />
        {errors.username && (
          <p className="mt-1 text-xs text-accent-highlight">
            {errors.username.message}
          </p>
        )}
      </div>

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

      <div>
        <label className="text-sm text-foreground-secondary">
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          type="password"
          className="mt-1 w-full rounded-xl border border-border-primary bg-background-muted px-3 py-2 text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent-highlight"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-accent-highlight">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <label className="flex items-start gap-3 text-sm text-foreground-secondary">
        <input
          type="checkbox"
          {...register("acceptTerms")}
          className="mt-1 accent-accent-primary"
        />
        <span>I agree to the Terms of Service and Privacy Policy</span>
      </label>
      {errors.acceptTerms && (
        <p className="text-xs text-accent-highlight">
          {errors.acceptTerms.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || !isValid}
        className="w-full rounded-xl bg-accent-primary py-2 font-medium text-black hover:bg-accent-highlight disabled:opacity-60"
      >
        {isPending ? "Creating…" : "Create Account"}
      </button>
    </form>
  );
}
