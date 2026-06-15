import { useState } from "react";
import { useGame } from "../context/GameContext";
import { CosmicBackground } from "../components/CosmicBackground";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Globe, Eye, EyeOff } from "lucide-react";

type Tab = "login" | "signup";

const REGIONS = [
  { value: "NA", label: "North America" },
  { value: "EU", label: "Europe" },
  { value: "ASIA", label: "Asia" },
  { value: "SA", label: "South America" },
  { value: "OCE", label: "Oceania" },
];

function saveUser(data: { username: string; email: string; region: string; password: string }) {
  const users = JSON.parse(localStorage.getItem("r2r_users") || "[]");
  users.push(data);
  localStorage.setItem("r2r_users", JSON.stringify(users));
}

function findUser(email: string, password: string) {
  const users: { username: string; email: string; region: string; password: string }[] =
    JSON.parse(localStorage.getItem("r2r_users") || "[]");
  return users.find((u) => u.email === email && u.password === password) || null;
}

function emailExists(email: string) {
  const users: { email: string }[] = JSON.parse(localStorage.getItem("r2r_users") || "[]");
  return users.some((u) => u.email === email);
}

function InputField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required,
  testId,
  showToggle,
  onToggle,
  showPassword,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ElementType;
  required?: boolean;
  testId?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  showPassword?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-purple-300 tracking-widest uppercase">
        {label}
      </label>
      <div className="relative flex items-center">
        <Icon size={15} className="absolute left-3.5 text-purple-400/60 pointer-events-none" />
        <input
          id={id}
          type={showToggle ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          data-testid={testId}
          className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3.5 text-purple-400/50 hover:text-purple-300 transition-colors"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

export function LoginSignup() {
  const { setPlayerProfile, setScreen } = useGame();
  const [tab, setTab] = useState<Tab>("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);

  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupRegion, setSignupRegion] = useState("NA");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [showSignupPw, setShowSignupPw] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const user = findUser(loginEmail.trim(), loginPassword);
    if (!user) {
      setLoginError("Invalid email or password.");
      return;
    }
    setPlayerProfile(user.username, user.region);
    setScreen("AVATAR_SELECTION");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    if (!signupUsername.trim()) { setSignupError("Username is required."); return; }
    if (!signupEmail.trim()) { setSignupError("Email is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) { setSignupError("Enter a valid email."); return; }
    if (signupPassword.length < 6) { setSignupError("Password must be at least 6 characters."); return; }
    if (emailExists(signupEmail.trim())) { setSignupError("An account with this email already exists."); return; }
    saveUser({ username: signupUsername.trim(), email: signupEmail.trim(), region: signupRegion, password: signupPassword });
    setPlayerProfile(signupUsername.trim(), signupRegion);
    setScreen("AVATAR_SELECTION");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden p-4"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,rgba(2,8,23,1)_70%)] pointer-events-none" />
      <CosmicBackground />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]"
      >
        <h1 className="text-3xl font-black text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] mb-6 tracking-widest">
          ROCK 2 ROCK
        </h1>

        <div className="flex bg-black/40 rounded-xl p-1 mb-7 border border-white/10">
          {(["login", "signup"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setLoginError(""); setSignupError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold tracking-widest uppercase transition-all ${
                tab === t
                  ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "login" ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.18 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <InputField
                id="login-email"
                label="Gmail"
                type="email"
                value={loginEmail}
                onChange={setLoginEmail}
                placeholder="you@gmail.com"
                icon={Mail}
                required
                testId="input-login-email"
              />
              <InputField
                id="login-password"
                label="Password"
                type="password"
                value={loginPassword}
                onChange={setLoginPassword}
                placeholder="••••••••"
                icon={Lock}
                required
                testId="input-login-password"
                showToggle
                onToggle={() => setShowLoginPw((v) => !v)}
                showPassword={showLoginPw}
              />

              {loginError && (
                <p className="text-red-400 text-xs text-center font-semibold">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={!loginEmail.trim() || !loginPassword}
                className="w-full py-3.5 mt-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 disabled:opacity-50 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-all uppercase tracking-widest text-sm disabled:cursor-not-allowed"
                data-testid="btn-login-submit"
              >
                Enter Arena
              </button>

              <p className="text-center text-xs text-white/30 pt-1">
                No account?{" "}
                <button type="button" onClick={() => setTab("signup")} className="text-purple-400 hover:text-purple-300 underline transition-colors">
                  Sign up
                </button>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18 }}
              onSubmit={handleSignup}
              className="space-y-4"
            >
              <InputField
                id="signup-username"
                label="Username"
                type="text"
                value={signupUsername}
                onChange={setSignupUsername}
                placeholder="Your game alias"
                icon={User}
                required
                testId="input-signup-username"
              />
              <InputField
                id="signup-email"
                label="Gmail"
                type="email"
                value={signupEmail}
                onChange={setSignupEmail}
                placeholder="you@gmail.com"
                icon={Mail}
                required
                testId="input-signup-email"
              />

              <div className="space-y-1.5">
                <label htmlFor="signup-region" className="text-xs font-semibold text-purple-300 tracking-widest uppercase">
                  Region
                </label>
                <div className="relative flex items-center">
                  <Globe size={15} className="absolute left-3.5 text-purple-400/60 pointer-events-none" />
                  <select
                    id="signup-region"
                    value={signupRegion}
                    onChange={(e) => setSignupRegion(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all [&>option]:bg-slate-900 appearance-none"
                    data-testid="select-signup-region"
                  >
                    {REGIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <InputField
                id="signup-password"
                label="Password"
                type="password"
                value={signupPassword}
                onChange={setSignupPassword}
                placeholder="Min. 6 characters"
                icon={Lock}
                required
                testId="input-signup-password"
                showToggle
                onToggle={() => setShowSignupPw((v) => !v)}
                showPassword={showSignupPw}
              />

              {signupError && (
                <p className="text-red-400 text-xs text-center font-semibold">{signupError}</p>
              )}

              <button
                type="submit"
                disabled={!signupUsername.trim() || !signupEmail.trim() || !signupPassword}
                className="w-full py-3.5 mt-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 disabled:opacity-50 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-all uppercase tracking-widest text-sm disabled:cursor-not-allowed"
                data-testid="btn-signup-submit"
              >
                Create Account
              </button>

              <p className="text-center text-xs text-white/30 pt-1">
                Already have an account?{" "}
                <button type="button" onClick={() => setTab("login")} className="text-purple-400 hover:text-purple-300 underline transition-colors">
                  Log in
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
