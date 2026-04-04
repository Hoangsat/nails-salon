export function isDevelopmentEnvironment() {
  return process.env.NODE_ENV !== "production";
}

function isTruthy(value?: string) {
  if (!value) {
    return false;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export function isExplicitDemoModeEnabled() {
  return isTruthy(process.env.ENABLE_DEMO_MODE);
}

export function shouldAllowDemoFallback() {
  return isDevelopmentEnvironment() || isExplicitDemoModeEnabled();
}

export function getAdminAllowlistEmails() {
  const raw = process.env.ADMIN_ALLOWLIST_EMAILS ?? "";

  return raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmailAllowed(email?: string | null) {
  if (!email) {
    return false;
  }

  const allowlist = getAdminAllowlistEmails();

  if (!allowlist.length) {
    return isDevelopmentEnvironment();
  }

  return allowlist.includes(email.trim().toLowerCase());
}

export function getProductionReadiness() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;
  const allowlist = getAdminAllowlistEmails();

  const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);
  const hasAuth = hasSupabase;
  const hasServiceRole = Boolean(supabaseServiceRoleKey);
  const hasResend = Boolean(resendApiKey && resendFromEmail);
  const hasAdminAllowlist = allowlist.length > 0;

  return {
    isDevelopment: isDevelopmentEnvironment(),
    demoFallbackEnabled: shouldAllowDemoFallback(),
    supabaseConfigured: hasSupabase,
    authConfigured: hasAuth,
    serviceRoleConfigured: hasServiceRole,
    resendConfigured: hasResend,
    adminAllowlistConfigured: hasAdminAllowlist,
    missing: {
      supabase: !hasSupabase,
      auth: !hasAuth,
      serviceRole: !hasServiceRole,
      resend: !hasResend,
      adminAllowlist: !hasAdminAllowlist,
    },
    isProductionReady: hasSupabase && hasAuth && hasServiceRole && hasResend && hasAdminAllowlist,
  };
}

