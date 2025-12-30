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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="username" className="text-sm text-foreground-secondary">
          Username
        </label>
        <input
          id="username"
          {...register("username")}
          aria-invalid={Boolean(errors.username) || undefined}
          aria-describedby={errors.username ? "username-error" : undefined}
          className="mt-1 w-full rounded-xl border border-border-primary bg-background-muted px-3 py-2 text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent-highlight"
          autoComplete="username"
        />
        {errors.username && (
          <p id="username-error" className="mt-1 text-xs text-accent-highlight">
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="text-sm text-foreground-secondary">
          Email
        </label>
        <input
          id="email"
          {...register("email")}
          type="email"
          aria-invalid={Boolean(errors.email) || undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="mt-1 w-full rounded-xl border border-border-primary bg-background-muted px-3 py-2 text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent-highlight"
          autoComplete="email"
          inputMode="email"
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-xs text-accent-highlight">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="text-sm text-foreground-secondary">
          Password
        </label>
        <input
          id="password"
          {...register("password")}
          type="password"
          aria-invalid={Boolean(errors.password) || undefined}
          aria-describedby={errors.password ? "password-error" : undefined}
          className="mt-1 w-full rounded-xl border border-border-primary bg-background-muted px-3 py-2 text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent-highlight"
          autoComplete="new-password"
        />
        {errors.password && (
          <p id="password-error" className="mt-1 text-xs text-accent-highlight">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="text-sm text-foreground-secondary"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          {...register("confirmPassword")}
          type="password"
          aria-invalid={Boolean(errors.confirmPassword) || undefined}
          aria-describedby={
            errors.confirmPassword ? "confirmPassword-error" : undefined
          }
          className="mt-1 w-full rounded-xl border border-border-primary bg-background-muted px-3 py-2 text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent-highlight"
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <p
            id="confirmPassword-error"
            className="mt-1 text-xs text-accent-highlight"
          >
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-foreground-secondary">
          <input
            id="acceptTerms"
            type="checkbox"
            {...register("acceptTerms")}
            aria-invalid={Boolean(errors.acceptTerms) || undefined}
            aria-describedby={
              errors.acceptTerms ? "acceptTerms-error" : undefined
            }
            className="mt-1 accent-accent-primary"
          />
          <span>I agree to the Terms of Service and Privacy Policy</span>
        </label>

        {errors.acceptTerms && (
          <p id="acceptTerms-error" className="text-xs text-accent-highlight">
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending || !isValid}
        aria-disabled={isPending || !isValid}
        className="w-full rounded-xl bg-accent-primary py-2 font-medium text-black hover:bg-accent-highlight disabled:opacity-60"
      >
        {isPending ? "Creating…" : "Create Account"}
      </button>
    </form>
  );
}
