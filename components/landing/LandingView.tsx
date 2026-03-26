'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path
      d="M2 7h10M7 2l5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function LandingView() {
  const [demoInput, setDemoInput] = useState('')
  const [demoVisible, setDemoVisible] = useState(false)
  const [demoShown, setDemoShown] = useState<number[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const demoTimers = useRef<number[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user)
    })
  }, [])

  const runDemo = useCallback(() => {
    const v = demoInput.trim()
    if (!v) return
    demoTimers.current.forEach((id) => window.clearTimeout(id))
    demoTimers.current = []
    setDemoVisible(true)
    setDemoShown([])
    for (let i = 0; i < 6; i++) {
      const id = window.setTimeout(() => {
        setDemoShown((prev) => [...prev, i])
      }, i * 180)
      demoTimers.current.push(id)
    }
  }, [demoInput])

  useEffect(() => {
    return () => demoTimers.current.forEach((id) => window.clearTimeout(id))
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('#landing .reveal')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => entry.target.classList.add('visible'), 80)
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index))
  }

  const year = new Date().getFullYear()

  return (
    <>
      <nav>
        <div className="nav-logo">
          Fikir<span>ge</span>
        </div>
        <div className="nav-links">
          <a href="#nasil">Nasıl Çalışır</a>
          <a href="#ciktilar">Çıktılar</a>
          <a href="#fiyat">Fiyatlar</a>
          <a href="#sss">SSS</a>
        </div>
        {isLoggedIn ? (
          <Link href="/dashboard" className="nav-cta">
            Dashboard →
          </Link>
        ) : (
          <Link href="/auth/login" className="nav-cta">
            Ücretsiz Dene →
          </Link>
        )}
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <div className="hero-badge-dot" />
          AI destekli proje oluşturma motoru
        </div>

        <h1>
          Fikrini yaz.
          <span className="line2">Her şeyini</span>
          <span className="line3">biz oluştururuz.</span>
        </h1>

        <p className="hero-sub">
          Pazar analizi, rakip haritası, marka kimliği, teknik altyapı, yol haritası — hepsi tek bir akışta,
          saniyeler içinde.
        </p>

        <div className="hero-actions">
          <a href="#demo" className="btn-primary">
            Hemen Dene
            <ArrowIcon />
          </a>
          <a href="#nasil" className="btn-ghost">
            Nasıl çalışır?
          </a>
        </div>

        <p className="hero-note">Kayıt gerekmez · Ücretsiz başla · Kredi kartı yok</p>

        <div className="hero-window" id="demo">
          <div className="window-bar">
            <div className="wdot r" />
            <div className="wdot y" />
            <div className="wdot g" />
            <div className="window-title">fikirge.com — proje oluşturucu</div>
          </div>
          <div className="window-body">
            <div className="demo-label">// FİKRİNİ YAZIN</div>
            <div className="demo-input-wrap">
              <input
                type="text"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runDemo()}
                placeholder="örn. yapay zeka destekli muhasebe programı kurmak istiyorum..."
              />
              <button type="button" className="demo-btn" onClick={runDemo}>
                Analiz Et →
              </button>
            </div>
            <div className={`demo-output${demoVisible ? ' visible' : ''}`}>
              <div className="demo-label">// ÇIKTILAR OLUŞTURULUYOR</div>
              <div className="demo-modules">
                {[
                  ['PAZAR ANALİZİ', <>TAM: <strong>$8.2B</strong> · Büyüme: <strong>%24/yıl</strong></>],
                  ['MARKA İSMİ', <><strong>LedgerAI</strong> · ledgerai.com ✓</>],
                  ['RAKIP DURUMU', <><strong>4 rakip</strong> tespit edildi · Boşluk var</>],
                  ['TEKNİK STACK', <>Next.js · Supabase · <strong>Stripe</strong></>],
                  ['FİYATLANDIRMA', <>Freemium · $29 Pro · <strong>$99 Business</strong></>],
                  ['YOL HARİTASI', <>MVP: <strong>6 hafta</strong> · İlk kullanıcı: 8. hafta</>],
                ].map(([label, val], i) => (
                  <div key={i} className={`demo-module${demoShown.includes(i) ? ' show' : ''}`}>
                    <div className="dm-label">{label}</div>
                    <div className="dm-val">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="logos-section">
        <div className="logos-label">
          PAZAR ANALİZİ · MARKA KİMLİĞİ · TEKNİK STACK · YOL HARİTASI · RAKIP HARİTASI · FİYATLANDIRMA · DOMAIN
          KONTROLÜ · PİTCH DECK
        </div>
        <div className="logos-track">
          <div className="logos-track-wrap">
            {['Next.js', 'Supabase', 'Vercel', 'Stripe', 'Claude API', 'Tailwind CSS', 'TypeScript', 'PostgreSQL', 'Resend', 'Posthog', 'React', 'Framer Motion'].map((x) => (
              <span key={x} className="logo-pill">
                {x}
              </span>
            ))}
          </div>
          <div className="logos-track-wrap" aria-hidden>
            {['Next.js', 'Supabase', 'Vercel', 'Stripe', 'Claude API', 'Tailwind CSS', 'TypeScript', 'PostgreSQL', 'Resend', 'Posthog', 'React', 'Framer Motion'].map((x) => (
              <span key={`d-${x}`} className="logo-pill">
                {x}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div id="nasil">
        <div className="section">
          <div className="section-tag reveal">// nasıl çalışır</div>
          <h2 className="reveal">
            Fikrinden lansmana
            <br />
            tek bir akışta.
          </h2>
          <p className="section-sub reveal">4 adımda tüm proje altyapın hazır. Saatler değil, dakikalar.</p>

          <div className="steps-grid reveal">
            {[
              ['01', 'Fikrini Anlat', 'Tek cümle bile yeter. Ne istediğini bilmiyorsan sistem sana sorular sorar, fikri birlikte netleştiriz.'],
              ['02', 'Piyasayı Analiz Et', 'Gerçek zamanlı veri ile pazar büyüklüğü, doğrudan rakipler, fiyatlandırma stratejileri ve boşluklar ortaya çıkar.'],
              ['03', 'Markanı Oluştur', 'Proje ismi, renk paleti, tipografi, ses tonu — marka kimliğinin tamamı, ayrı bir araç gerektirmeden.'],
              ['04', 'Paketi İndir', 'Teknik altyapı, yol haritası ve tüm kararlar PDF veya Notion olarak hazır. Hemen geliştirmeye başla.'],
            ].map(([n, t, d]) => (
              <div key={n} className="step-card">
                <div className="step-num">{n}</div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="outputs-section" id="ciktilar">
        <div className="section">
          <div className="section-tag reveal">// ne alırsın</div>
          <h2 className="reveal">
            6 modül.
            <br />
            Tam bir proje paketi.
          </h2>
          <p className="section-sub reveal">
            Her modül bağımsız çalışır ama hepsi birbirine bağlı tutarlı bir bütün oluşturur.
          </p>

          <div className="outputs-grid reveal">
            {[
              ['📊', 'Pazar Analizi', 'TAM/SAM/SOM hesapları, büyüme trendleri, hedef kitle profili ve gelir potansiyeli.', 'Gerçek Veri'],
              ['🔍', 'Rakip Haritası', 'Mevcut rakipler, güçlü/zayıf yönleri, fiyatlandırmaları ve senin için boşluk analizi.', 'Canlı Analiz'],
              ['🎨', 'Marka Kimliği', 'Proje ismi, domain kontrolü, renk paleti, tipografi ve ses tonu rehberi.', 'Özgün'],
              ['⚙️', 'Teknik Stack', 'Frontend, backend, veritabanı, ödeme sistemi — projeye özel teknoloji seçimi ve gerekçesi.', 'Production-Ready'],
              ['🗺️', 'Yol Haritası', "MVP'den ilk müşteriye kadar haftalık milestonelar. Gerçekçi, uygulanabilir plan.", 'Aksiyon Odaklı'],
              ['💰', 'Gelir Modeli', 'Fiyatlandırma stratejisi, abonelik yapısı, freemium/premium dengesi ve ARR hedefi.', 'SaaS Optimize'],
            ].map(([icon, title, desc, tag]) => (
              <div key={title} className="output-card">
                <div className="output-icon">{icon}</div>
                <h4>{title}</h4>
                <p>{desc}</p>
                <span className="output-tag">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-tag reveal">// rakip analizi</div>
        <h2 className="reveal">Neden Fikirge?</h2>
        <p className="section-sub reveal">Diğer araçlar parçalı çözer. Biz uçtan uca.</p>

        <div className="compare-wrap reveal">
          <table className="compare">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Pazar Analizi</th>
                <th>Marka Kimliği</th>
                <th>Teknik Stack</th>
                <th>Fikir Geliştirme</th>
                <th>Tek Akış</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['IdeaProof', 'tick', 'partial', 'cross', 'cross', 'cross'],
                ['Preuve AI', 'tick', 'cross', 'cross', 'cross', 'cross'],
                ['ValidatorAI', 'partial', 'cross', 'cross', 'cross', 'cross'],
                ['SystemMD', 'cross', 'cross', 'tick', 'cross', 'cross'],
              ].map(([name, a, b, c, d, e]) => (
                <tr key={String(name)}>
                  <td>{name}</td>
                  {[a, b, c, d, e].map((cell, j) => (
                    <td key={j}>
                      {cell === 'tick' && <span className="tick">✓</span>}
                      {cell === 'cross' && <span className="cross">✗</span>}
                      {cell === 'partial' && <span className="partial">Kısmi</span>}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="hero-row">
                <td>Fikirge</td>
                <td>
                  <span className="tick">✓</span>
                </td>
                <td>
                  <span className="tick">✓</span>
                </td>
                <td>
                  <span className="tick">✓</span>
                </td>
                <td>
                  <span className="tick">✓</span>
                </td>
                <td>
                  <span className="tick">✓</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div id="fiyat" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section">
          <div className="section-tag reveal">// fiyatlandırma</div>
          <h2 className="reveal">Basit. Dürüst. Şeffaf.</h2>
          <p className="section-sub reveal">Ücretsiz başla, büyüdükçe yükselt. Gizli ücret yok.</p>

          <div className="pricing-grid reveal">
            <div className="plan-card">
              <div className="plan-name">Starter</div>
              <div className="plan-price">
                <sup>$</sup>0<sub> / ay</sub>
              </div>
              <div className="plan-note">Denemek isteyenler için</div>
              <ul className="plan-features">
                {['Ayda 2 proje paketi', 'Temel pazar analizi', 'Marka ismi önerisi', 'PDF export (filigran)'].map((t) => (
                  <li key={t}>
                    <span className="pf-icon">→</span> {t}
                  </li>
                ))}
              </ul>
              <Link href="/auth/login" className="plan-btn outline">
                Ücretsiz Başla
              </Link>
            </div>

            <div className="plan-card featured">
              <div className="plan-badge-top">En Çok Tercih Edilen</div>
              <div className="plan-name">Builder</div>
              <div className="plan-price">
                <sup>$</sup>29<sub> / ay</sub>
              </div>
              <div className="plan-note">Aktif kurucular için</div>
              <ul className="plan-features">
                {[
                  'Ayda 15 proje paketi',
                  'Tam pazar + rakip analizi',
                  'Tam marka kimliği',
                  'Teknik stack + yol haritası',
                  'PDF + Notion export',
                  'Email desteği',
                ].map((t) => (
                  <li key={t}>
                    <span className="pf-icon">→</span> {t}
                  </li>
                ))}
              </ul>
              <Link href="/auth/login" className="plan-btn solid">
                Builder&apos;a Geç
              </Link>
            </div>

            <div className="plan-card">
              <div className="plan-name">Studio</div>
              <div className="plan-price">
                <sup>$</sup>79<sub> / ay</sub>
              </div>
              <div className="plan-note">Ajanslar ve ekipler için</div>
              <ul className="plan-features">
                {['Sınırsız proje', 'White-label çıktı', 'API erişimi', 'Ekip paylaşımı', 'Öncelikli destek'].map((t) => (
                  <li key={t}>
                    <span className="pf-icon">→</span> {t}
                  </li>
                ))}
              </ul>
              <Link href="/auth/login" className="plan-btn outline">
                Studio&apos;ya Geç
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div id="sss">
        <div className="section">
          <div className="section-tag reveal">// sık sorulan sorular</div>
          <h2 className="reveal">Aklındaki sorular.</h2>
          <br />
          <div className="faq-list reveal">
            {[
              [
                'Teknik bilgim olmasa da kullanabilir miyim?',
                'Kesinlikle. Fikirge teknik olmayan kurucular için de tasarlandı. Teknik stack modülü hangi teknolojilerin kullanılacağını açıklar; çıktıyı bir geliştiriciye veya Cursor gibi araçlara verebilirsin.',
              ],
              [
                'Pazar analizi gerçek veriye mi dayanıyor?',
                'Evet. Canlı web araması, trend sinyalleri ve sektörel veri kaynaklarından beslenen analizdir; kaynak göstermeye önem verilir.',
              ],
              ['Bir proje oluşturmak ne kadar sürer?', 'Tam paket tipik olarak 60–90 saniyede tamamlanır. Fikir netleştirme modu kullanılırsa süre biraz uzayabilir.'],
              [
                'Fikirlerim güvende mi?',
                'Fikirlerin model eğitiminde kullanılmaz. İşlenen veriler şifrelenir; proje paketin yalnızca sana aittir.',
              ],
              [
                'Çıktıları nasıl kullanabilirim?',
                "PDF olarak indir, Notion'a aktar veya paylaşılabilir link oluştur. Teknik dosyaları doğrudan geliştirme araçlarına taşıyabilirsin.",
              ],
            ].map(([q, a], i) => (
              <div key={q} className="faq-item">
                <button type="button" className={`faq-q${openFaq === i ? ' open' : ''}`} onClick={() => toggleFaq(i)}>
                  {q}
                  <span className="faq-icon">+</span>
                </button>
                <div className={`faq-a${openFaq === i ? ' open' : ''}`}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2 className="reveal">
          Fikrin hazır.
          <br />
          <span style={{ color: 'var(--blue)' }}>Başlamak için ne bekliyorsun?</span>
        </h2>
        <p className="reveal">Ücretsiz hesap aç, ilk projenizi bugün oluştur.</p>
        <Link href="/auth/login" className="btn-primary reveal" style={{ display: 'inline-flex', margin: '0 auto' }}>
          Ücretsiz Başla
          <ArrowIcon />
        </Link>
      </div>

      <footer>
        <div className="footer-logo">
          Fikir<span>ge</span>
        </div>
        <div className="footer-links">
          <a href="#">Gizlilik</a>
          <a href="#">Kullanım Koşulları</a>
          <a href="#">İletişim</a>
        </div>
        <div className="footer-copy">
          © {year} Fikirge · Tüm hakları saklıdır.
        </div>
      </footer>
    </>
  )
}
