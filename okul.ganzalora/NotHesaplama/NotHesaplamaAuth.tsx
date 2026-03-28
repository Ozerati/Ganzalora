import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

interface NotHesaplamaAuthProps {
  onBack: () => void
  children: (userId: string) => React.ReactNode
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

type Tab = 'login' | 'register' | 'changePw' | 'resetPw'

export default function NotHesaplamaAuth({ onBack, children }: NotHesaplamaAuthProps) {
  const [userId, setUserId] = useState<string | null>(() => sessionStorage.getItem('nh_user_id'))
  const [tab, setTab] = useState<Tab>('login')

  // Login state
  const [loginUser, setLoginUser] = useState('')
  const [loginPw, setLoginPw] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Register state
  const [regUser, setRegUser] = useState('')
  const [regPw, setRegPw] = useState('')
  const [regPwConfirm, setRegPwConfirm] = useState('')
  const [regError, setRegError] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  // Change password state
  const [cpUser, setCpUser] = useState('')
  const [cpOldPw, setCpOldPw] = useState('')
  const [cpNewPw, setCpNewPw] = useState('')
  const [cpNewPwConfirm, setCpNewPwConfirm] = useState('')
  const [cpError, setCpError] = useState('')
  const [cpSuccess, setCpSuccess] = useState('')
  const [cpLoading, setCpLoading] = useState(false)

  // Reset password state
  const [rpUser, setRpUser] = useState('')
  const [rpNewPw, setRpNewPw] = useState('')
  const [rpNewPwConfirm, setRpNewPwConfirm] = useState('')
  const [rpError, setRpError] = useState('')
  const [rpSuccess, setRpSuccess] = useState('')
  const [rpLoading, setRpLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    const username = loginUser.trim().toLowerCase()
    if (!username) { setLoginError('Kullanıcı adı girin'); return }
    setLoginLoading(true)
    try {
      const snap = await getDoc(doc(db, 'notHesaplamaUsers', username))
      if (!snap.exists()) {
        setLoginError('Kullanıcı bulunamadı')
        return
      }
      const data = snap.data()
      const hash = await sha256(loginPw)
      if (hash !== data.passwordHash) {
        setLoginError('Şifre yanlış')
        return
      }
      sessionStorage.setItem('nh_user_id', username)
      setUserId(username)
    } catch (err) {
      setLoginError('Bir hata oluştu. Tekrar deneyin.')
      console.error(err)
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')
    const username = regUser.trim().toLowerCase()
    if (username.length < 5) { setRegError('Kullanıcı adı en az 5 karakter olmalı'); return }
    if (regPw.length < 4) { setRegError('Şifre en az 4 karakter olmalı'); return }
    if (regPw !== regPwConfirm) { setRegError('Şifreler eşleşmiyor'); return }
    setRegLoading(true)
    try {
      const snap = await getDoc(doc(db, 'notHesaplamaUsers', username))
      if (snap.exists()) {
        setRegError('Bu kullanıcı adı zaten alınmış')
        return
      }
      const hash = await sha256(regPw)
      await setDoc(doc(db, 'notHesaplamaUsers', username), {
        passwordHash: hash,
        createdAt: Date.now(),
      })
      sessionStorage.setItem('nh_user_id', username)
      setUserId(username)
    } catch (err) {
      setRegError('Bir hata oluştu. Tekrar deneyin.')
      console.error(err)
    } finally {
      setRegLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setCpError(''); setCpSuccess('')
    const username = cpUser.trim().toLowerCase()
    if (!username) { setCpError('Kullanıcı adı girin'); return }
    if (cpNewPw.length < 4) { setCpError('Yeni şifre en az 4 karakter olmalı'); return }
    if (cpNewPw !== cpNewPwConfirm) { setCpError('Yeni şifreler eşleşmiyor'); return }
    setCpLoading(true)
    try {
      const snap = await getDoc(doc(db, 'notHesaplamaUsers', username))
      if (!snap.exists()) { setCpError('Kullanıcı bulunamadı'); return }
      const oldHash = await sha256(cpOldPw)
      if (oldHash !== snap.data().passwordHash) { setCpError('Mevcut şifre yanlış'); return }
      const newHash = await sha256(cpNewPw)
      await setDoc(doc(db, 'notHesaplamaUsers', username), { ...snap.data(), passwordHash: newHash })
      setCpSuccess('Şifre başarıyla değiştirildi!')
      setCpOldPw(''); setCpNewPw(''); setCpNewPwConfirm('')
    } catch (err) {
      setCpError('Bir hata oluştu. Tekrar deneyin.')
      console.error(err)
    } finally { setCpLoading(false) }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setRpError(''); setRpSuccess('')
    const username = rpUser.trim().toLowerCase()
    if (!username) { setRpError('Kullanıcı adı girin'); return }
    if (rpNewPw.length < 4) { setRpError('Yeni şifre en az 4 karakter olmalı'); return }
    if (rpNewPw !== rpNewPwConfirm) { setRpError('Şifreler eşleşmiyor'); return }
    setRpLoading(true)
    try {
      const snap = await getDoc(doc(db, 'notHesaplamaUsers', username))
      if (!snap.exists()) { setRpError('Kullanıcı bulunamadı'); return }
      const newHash = await sha256(rpNewPw)
      await setDoc(doc(db, 'notHesaplamaUsers', username), { ...snap.data(), passwordHash: newHash })
      setRpSuccess('Şifre sıfırlandı! Artık yeni şifrenizle giriş yapabilirsiniz.')
      setRpNewPw(''); setRpNewPwConfirm('')
    } catch (err) {
      setRpError('Bir hata oluştu. Tekrar deneyin.')
      console.error(err)
    } finally { setRpLoading(false) }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('nh_user_id')
    setUserId(null)
    setLoginUser('')
    setLoginPw('')
    setRegUser('')
    setRegPw('')
    setRegPwConfirm('')
    onBack()
  }

  const handleBack = () => {
    sessionStorage.removeItem('nh_user_id')
    setUserId(null)
    onBack()
  }

  // Hesap ayarları modal state
  const [showAccountModal, setShowAccountModal] = useState(false)

  // --- Authenticated ---
  if (userId) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        {/* Header */}
        <div className="no-print sticky top-0 z-50 flex items-center justify-between px-4 py-2 bg-amber-600 text-white shadow-md">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-white/10 hover:bg-white/20 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Geri
          </button>

          <h1 className="text-sm font-bold tracking-wide">Not Dağıtım Sistemi</h1>

          <div className="flex items-center gap-2">
            {/* Hesap Ayarları */}
            <button
              type="button"
              onClick={() => { setCpUser(userId); setCpError(''); setCpSuccess(''); setCpOldPw(''); setCpNewPw(''); setCpNewPwConfirm(''); setShowAccountModal(true) }}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-white/10 hover:bg-white/20 transition"
              title="Hesap Ayarları"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
              <span className="hidden sm:inline">{userId}</span>
            </button>

            {/* Çıkış */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-white/10 hover:bg-white/20 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Çıkış
            </button>
          </div>
        </div>

        {/* Hesap Ayarları Modalı */}
        {showAccountModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowAccountModal(false)}>
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-amber-50">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Hesap Ayarları</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Kullanıcı: <span className="font-semibold text-amber-700">{userId}</span></p>
                </div>
                <button onClick={() => setShowAccountModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <form onSubmit={async (e) => { await handleChangePassword(e); }} className="p-6 space-y-4">
                {cpError && <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">{cpError}</div>}
                {cpSuccess && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">{cpSuccess}</div>}
                <div>
                  <label className="text-sm font-semibold text-slate-600 block mb-1">Mevcut Şifre</label>
                  <input type="password" value={cpOldPw} onChange={e => setCpOldPw(e.target.value)} required autoComplete="current-password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-200" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 block mb-1">Yeni Şifre</label>
                  <input type="password" value={cpNewPw} onChange={e => setCpNewPw(e.target.value)} required autoComplete="new-password" placeholder="En az 4 karakter"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-200 placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 block mb-1">Yeni Şifre Tekrar</label>
                  <input type="password" value={cpNewPwConfirm} onChange={e => setCpNewPwConfirm(e.target.value)} required autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-200" />
                </div>
                <button type="submit" disabled={cpLoading}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50">
                  {cpLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children(userId)}
        </div>
      </div>
    )
  }

  // --- Auth screen ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm mb-6 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Ana Sayfa
        </button>

        {/* Icon + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="16" y1="14" x2="16" y2="18" />
              <line x1="14" y1="16" x2="18" y2="16" />
              <line x1="8" y1="10" x2="12" y2="10" />
              <line x1="8" y1="14" x2="12" y2="14" />
              <line x1="8" y1="18" x2="12" y2="18" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">Not Dağıtım Sistemi</h1>
          <p className="text-slate-500 text-sm mt-1">Hesabınızla giriş yapın</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {([
              { id: 'login' as Tab, label: 'Giriş' },
              { id: 'register' as Tab, label: 'Hesap Oluştur' },
              { id: 'changePw' as Tab, label: 'Şifre Değiştir' },
            ]).map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setTab(t.id); setLoginError(''); setRegError(''); setCpError(''); setCpSuccess(''); setRpError(''); setRpSuccess('') }}
                className={`flex-1 py-3 text-xs font-bold transition ${
                  tab === t.id
                    ? 'text-amber-600 border-b-2 border-amber-500'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Login tab */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4">
              {loginError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
                  {loginError}
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Kullanıcı Adı</label>
                <input
                  type="text"
                  value={loginUser}
                  onChange={e => setLoginUser(e.target.value)}
                  autoFocus
                  required
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-200"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Şifre</label>
                <input
                  type="password"
                  value={loginPw}
                  onChange={e => setLoginPw(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-200"
                />
              </div>
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
              >
                {loginLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Giriş yapılıyor...
                  </span>
                ) : 'Giriş Yap'}
              </button>
            </form>
          )}

          {/* Register tab */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="p-6 sm:p-8 space-y-4">
              {regError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
                  {regError}
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Kullanıcı Adı</label>
                <input
                  type="text"
                  value={regUser}
                  onChange={e => setRegUser(e.target.value)}
                  autoFocus
                  required
                  autoComplete="username"
                  placeholder="En az 5 karakter"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-200 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Şifre</label>
                <input
                  type="password"
                  value={regPw}
                  onChange={e => setRegPw(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="En az 4 karakter"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-200 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Şifre Tekrar</label>
                <input
                  type="password"
                  value={regPwConfirm}
                  onChange={e => setRegPwConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-200"
                />
              </div>
              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
              >
                {regLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Hesap oluşturuluyor...
                  </span>
                ) : 'Hesap Oluştur'}
              </button>
            </form>
          )}
          {/* Change Password tab */}
          {tab === 'changePw' && (
            <form onSubmit={handleChangePassword} className="p-6 sm:p-8 space-y-4">
              {cpError && <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">{cpError}</div>}
              {cpSuccess && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">{cpSuccess}</div>}
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Kullanıcı Adı</label>
                <input type="text" value={cpUser} onChange={e => setCpUser(e.target.value)} required autoComplete="username"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-200" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Mevcut Şifre</label>
                <input type="password" value={cpOldPw} onChange={e => setCpOldPw(e.target.value)} required autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-200" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Yeni Şifre</label>
                <input type="password" value={cpNewPw} onChange={e => setCpNewPw(e.target.value)} required autoComplete="new-password" placeholder="En az 4 karakter"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-200 placeholder:text-slate-400" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Yeni Şifre Tekrar</label>
                <input type="password" value={cpNewPwConfirm} onChange={e => setCpNewPwConfirm(e.target.value)} required autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-200" />
              </div>
              <button type="submit" disabled={cpLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50">
                {cpLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
