import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { AlertCircle, Eye, EyeOff, Copy, Check, ArrowLeft, Shield } from 'lucide-react';
import VidacureLogo from '@/assets/vidacure_png.png';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const {
    isAdminAuthenticated,
    checkAdminAuth,
    isLoading,
    error,
    loginStep,
    loginAdmin,
    verify2FA,
    setup2FA,
    confirm2FA,
    completeSetup,
    clearError,
    resetLoginFlow,
    qrCodeUrl,
    totpSecret,
    backupCodes,
  } = useAdminAuthStore();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [backupCodeInput, setBackupCodeInput] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [setupCode, setSetupCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [codesConfirmed, setCodesConfirmed] = useState(false);

  const totpInputRef = useRef<HTMLInputElement>(null);
  const setupCodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  useEffect(() => {
    if (isAdminAuthenticated && loginStep === 'credentials') {
      navigate('/admin');
    }
  }, [isAdminAuthenticated, loginStep, navigate]);

  // Auto-focus TOTP input when step changes
  useEffect(() => {
    if (loginStep === '2fa') {
      setTimeout(() => totpInputRef.current?.focus(), 100);
    }
  }, [loginStep]);

  // Fetch 2FA setup data when entering setup step
  useEffect(() => {
    if (loginStep === '2fa-setup' && !qrCodeUrl) {
      setup2FA();
    }
  }, [loginStep, qrCodeUrl, setup2FA]);

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await loginAdmin(email, password);
  };

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (useBackupCode) {
      await verify2FA(backupCodeInput.trim(), true);
    } else {
      await verify2FA(totpCode.trim());
    }
  };

  const handleSetupConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await confirm2FA(setupCode.trim());
  };

  const handleTotpCodeChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setTotpCode(digits);
  };

  const handleSetupCodeChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setSetupCode(digits);
  };

  const handleCopyBackupCodes = () => {
    if (backupCodes) {
      navigator.clipboard.writeText(backupCodes.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBackToCredentials = () => {
    resetLoginFlow();
    setTotpCode('');
    setBackupCodeInput('');
    setUseBackupCode(false);
    setSetupCode('');
    setCopied(false);
    setCodesConfirmed(false);
  };

  const handleCompleteSetup = () => {
    completeSetup();
    navigate('/admin');
  };

  // ─── Render Steps ────────────────────────────────────────

  const renderCredentialsStep = () => (
    <form onSubmit={handleCredentialSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@vidacure.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
        size="lg"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );

  const render2FAStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-zinc-600 mb-2">
        <Shield className="h-5 w-5 text-teal-600" />
        <span className="text-sm font-medium">Two-factor authentication</span>
      </div>

      {!useBackupCode ? (
        <form onSubmit={handleTotpSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="totp-code">Enter the 6-digit code from your authenticator app</Label>
            <Input
              ref={totpInputRef}
              id="totp-code"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={totpCode}
              onChange={(e) => handleTotpCodeChange(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-widest font-mono"
              autoComplete="one-time-code"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || totpCode.length !== 6}
            className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
            size="lg"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>

          <button
            type="button"
            onClick={() => {
              setUseBackupCode(true);
              clearError();
            }}
            className="w-full text-sm text-zinc-500 hover:text-zinc-700"
          >
            Use a backup code instead
          </button>
        </form>
      ) : (
        <form onSubmit={handleTotpSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backup-code">Enter a backup code</Label>
            <Input
              id="backup-code"
              type="text"
              placeholder="Enter backup code"
              value={backupCodeInput}
              onChange={(e) => setBackupCodeInput(e.target.value)}
              className="font-mono"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !backupCodeInput.trim()}
            className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
            size="lg"
          >
            {isLoading ? 'Verifying...' : 'Verify backup code'}
          </Button>

          <button
            type="button"
            onClick={() => {
              setUseBackupCode(false);
              clearError();
            }}
            className="w-full text-sm text-zinc-500 hover:text-zinc-700"
          >
            Use authenticator app instead
          </button>
        </form>
      )}

      <button
        type="button"
        onClick={handleBackToCredentials}
        className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700"
      >
        <ArrowLeft className="h-3 w-3" /> Back to sign in
      </button>
    </div>
  );

  const render2FASetupStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-zinc-600 mb-2">
        <Shield className="h-5 w-5 text-teal-600" />
        <span className="text-sm font-medium">Set up two-factor authentication</span>
      </div>

      {isLoading && !qrCodeUrl ? (
        <div className="text-center py-8 text-zinc-500">Loading...</div>
      ) : qrCodeUrl ? (
        <>
          <p className="text-sm text-zinc-500">
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </p>

          <div className="flex justify-center p-4 bg-white rounded-lg border">
            <img src={qrCodeUrl} alt="QR Code for 2FA setup" className="w-48 h-48" />
          </div>

          {totpSecret && (
            <div className="space-y-1">
              <p className="text-xs text-zinc-400">
                Can't scan? Enter this code manually:
              </p>
              <code className="block text-sm bg-zinc-50 border rounded px-3 py-2 font-mono break-all select-all">
                {totpSecret}
              </code>
            </div>
          )}

          <form onSubmit={handleSetupConfirm} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="setup-code">
                Enter the 6-digit code from your authenticator app to verify
              </Label>
              <Input
                ref={setupCodeRef}
                id="setup-code"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={setupCode}
                onChange={(e) => handleSetupCodeChange(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest font-mono"
                autoComplete="one-time-code"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || setupCode.length !== 6}
              className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
              size="lg"
            >
              {isLoading ? 'Verifying...' : 'Verify and activate'}
            </Button>
          </form>
        </>
      ) : null}

      <button
        type="button"
        onClick={handleBackToCredentials}
        className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700"
      >
        <ArrowLeft className="h-3 w-3" /> Back to sign in
      </button>
    </div>
  );

  const renderBackupCodesStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-teal-600 mb-2">
        <Check className="h-5 w-5" />
        <span className="text-sm font-medium">2FA setup complete!</span>
      </div>

      <p className="text-sm text-zinc-500">
        Save these backup codes in a safe place. Each code can only be used once.
        You won't be able to see them again.
      </p>

      <div className="bg-zinc-50 border rounded-lg p-4 space-y-1">
        {backupCodes?.map((code, i) => (
          <code key={i} className="block text-sm font-mono text-zinc-700">
            {code}
          </code>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleCopyBackupCodes}
        className="w-full"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" /> Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" /> Copy all codes
          </>
        )}
      </Button>

      <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
        <input
          type="checkbox"
          checked={codesConfirmed}
          onChange={(e) => setCodesConfirmed(e.target.checked)}
          className="rounded"
        />
        I've saved my backup codes
      </label>

      <Button
        type="button"
        onClick={handleCompleteSetup}
        disabled={!codesConfirmed}
        className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
        size="lg"
      >
        Continue to dashboard
      </Button>
    </div>
  );

  const renderStep = () => {
    switch (loginStep) {
      case 'credentials':
        return renderCredentialsStep();
      case '2fa':
        return render2FAStep();
      case '2fa-setup':
        return render2FASetupStep();
      case '2fa-backup-codes':
        return renderBackupCodesStep();
    }
  };

  const getStepTitle = () => {
    switch (loginStep) {
      case 'credentials':
        return 'Sign in';
      case '2fa':
        return 'Verify identity';
      case '2fa-setup':
        return 'Secure your account';
      case '2fa-backup-codes':
        return 'Backup codes';
    }
  };

  const getStepSubtitle = () => {
    switch (loginStep) {
      case 'credentials':
        return 'Enter your credentials to access the admin dashboard';
      case '2fa':
        return 'Enter the code from your authenticator app';
      case '2fa-setup':
        return 'Set up two-factor authentication to secure your account';
      case '2fa-backup-codes':
        return 'Save these codes for emergency access';
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-teal-600 p-12 flex-col justify-between">
        <div>
          <img src={VidacureLogo} alt="Vidacure" className="h-8 brightness-0 invert" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">Admin Portal</h1>
          <p className="text-teal-100 text-lg">
            Manage patients, doctors, and subscriptions from one place.
          </p>
        </div>
        <p className="text-teal-200 text-sm">
          &copy; {new Date().getFullYear()} Vidacure. All rights reserved.
        </p>
      </div>

      {/* Right side - Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <img src={VidacureLogo} alt="Vidacure" className="h-6" />
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-1">
              {getStepTitle()}
            </h2>
            <p className="text-zinc-500 text-sm">{getStepSubtitle()}</p>
          </div>

          {error && (
            <div className="mb-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {renderStep()}

          {loginStep === 'credentials' && (
            <>
              <p className="mt-6 text-xs text-zinc-400 text-center">
                Only registered administrators can access this portal.
              </p>

              <div className="mt-8 pt-6 border-t border-zinc-100">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm text-zinc-500 hover:text-zinc-700"
                >
                  &larr; Back to website
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
