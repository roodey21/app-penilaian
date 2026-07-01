"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, MessageSquare } from "lucide-react";
import UserNavbar from "../../../components/layout/UserNavbar";
import session from "../../../utils/session";
import SurveyApi from "../../../services/surveyApi";

// Rich mock data to showcase the UI if API data is not yet ready or incomplete
const MOCK_PERIODS = [
  { id: "q2-2025", name: "Q2 2025" },
  { id: "q1-2025", name: "Q1 2025" },
];

const MOCK_PILLARS = [
  { id: "owner-mindset", title: "Owner Mindset", question_count: 5 },
  { id: "networking", title: "Networking", question_count: 4 },
  { id: "excellence-services", title: "Excellence Services", question_count: 6 },
];

const MOCK_RECAP_DETAILS = {
  "owner-mindset": {
    stats: { total_reviewers: 20 },
    questions: [
      {
        id: 1,
        code: "Q 1",
        text: "Yang Bersangkutan Memahami bagaimana pekerjaannya berdampak langsung pada kenyamanan tamu dan citra hotel",
        total_responses: 17,
        distribution: {
          detractor: { count: 3, percentage: 17.6 },
          passive: { count: 4, percentage: 23.5 },
          promoter: { count: 10, percentage: 58.8 }
        }
      },
      {
        id: 2,
        code: "Q 2",
        text: "Yang Bersangkutan Menjaga serta menggunakan fasilitas, peralatan, dan aset hotel dengan penuh tanggung jawab",
        total_responses: 17,
        distribution: {
          detractor: { count: 2, percentage: 11.7 },
          passive: { count: 3, percentage: 17.6 },
          promoter: { count: 12, percentage: 70.6 }
        }
      },
      {
        id: 3,
        code: "Q 3",
        text: "Yang Bersangkutan Menunjukkan inisiatif untuk memperbaiki kondisi kerja atau layanan tanpa harus menunggu instruksi",
        total_responses: 17,
        distribution: {
          detractor: { count: 1, percentage: 5.9 },
          passive: { count: 5, percentage: 29.4 },
          promoter: { count: 11, percentage: 64.7 }
        }
      },
      {
        id: 4,
        code: "Q 4",
        text: "Yang Bersangkutan Memiliki kepedulian tinggi terhadap hasil kerja agar tamu dan rekan kerja merasa puas",
        total_responses: 17,
        distribution: {
          detractor: { count: 3, percentage: 17.6 },
          passive: { count: 4, percentage: 23.5 },
          promoter: { count: 10, percentage: 58.8 }
        }
      },
      {
        id: 5,
        code: "Q 5",
        text: "Yang Bersangkutan Menunjukkan kebanggaan dan integritas sebagai bagian dari LIFE Ecosystem",
        total_responses: 17,
        distribution: {
          detractor: { count: 1, percentage: 5.9 },
          passive: { count: 3, percentage: 17.6 },
          promoter: { count: 13, percentage: 76.5 }
        }
      }
    ],
    feedbacks: [
      "Arahan strategis yang diberikan telah mencapai sasaran pada seluruh departemen. Ke depan, komunikasi mengenai keputusan bisnis dan target perusahaan dapat disampaikan lebih awal sehingga setiap departemen memiliki waktu yang memadai untuk menyusun strategi implementasi dan mitigasi risiko. Terus mendorong budaya pengambilan keputusan berbasis data. Menjadwalkan sesi coaching atau mentoring secara berkala.",
      "Sangat baik dan komunikatif, mohon dipertahankan kinerjanya.",
      "Sebagai seorang leader ada baiknya sangat memahami saya 'cara bagaimana menjadi good leader' hanya untuk di LIFE sendiri karena belum ada kebijakan yang valid atau tertulis yang terkadang aturan atau kebijakan dapat berubah-ubah sesuai dengan kejadian. Ini juga menjadi pengingat bagi saya",
      "Sangat solutif dalam menangani masalah di operasional.",
      "Keren!",
      "Sehat-sehat selalu ya dan tetap semangat terus",
      "Terimakasih banyak atas arahan dan masukannya selama ini",
      "Semoga sukses selalu",
      "Izin pak dari saya terkait load pekerjaan yang menurut saya belum sesuai dengan apa yang saya terima, maupun perbedaan load pekerjaan saya bahkan dengan posisi yang ada diatas saya",
      "Tetap menjadi mentor saya pak, mohon bimbingannya",
      "Mantap 👍👍",
      "Semangat terus"
    ]
  },
  "networking": {
    stats: { total_reviewers: 15 },
    questions: [
      {
        id: 6,
        code: "Q 1",
        text: "Mampu membangun hubungan baik dengan pihak internal maupun eksternal perusahaan",
        total_responses: 15,
        distribution: {
          detractor: { count: 1, percentage: 6.7 },
          passive: { count: 3, percentage: 20 },
          promoter: { count: 11, percentage: 73.3 }
        }
      },
      {
        id: 7,
        code: "Q 2",
        text: "Aktif berkolaborasi lintas divisi untuk kelancaran operasional",
        total_responses: 15,
        distribution: {
          detractor: { count: 0, percentage: 0 },
          passive: { count: 2, percentage: 13.3 },
          promoter: { count: 13, percentage: 86.7 }
        }
      }
    ],
    feedbacks: [
      "Kerjasama yang baik antar divisi sudah mulai terlihat manfaatnya.",
      "Komunikasi ditingkatkan kembali agar terhindar dari miskomunikasi."
    ]
  },
  "excellence-services": {
    stats: { total_reviewers: 18 },
    questions: [
      {
        id: 10,
        code: "Q 1",
        text: "Memberikan respon cepat and tepat terhadap keluhan atau kebutuhan pelanggan",
        total_responses: 16,
        distribution: {
          detractor: { count: 2, percentage: 12.5 },
          passive: { count: 4, percentage: 25 },
          promoter: { count: 10, percentage: 62.5 }
        }
      }
    ],
    feedbacks: [
      "Pelayanan sudah sangat memuaskan pelanggan.",
      "Pertahankan keramahan saat melayani tamu."
    ]
  }
};

export default function RekapPenilaianPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Navigation & filter states
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedPillarId, setSelectedPillarId] = useState("");
  const [activeTab, setActiveTab] = useState("pillar"); // "pillar" or "feedback"

  // Data states
  const [pillars, setPillars] = useState([]);
  const [recapScores, setRecapScores] = useState(null);
  const [recapFeedback, setRecapFeedback] = useState([]);
  
  const contentRef = useRef(null);

  // 1. Initial Authentication & Load Periods
  useEffect(() => {
    const sess = session.getSession();
    if (!sess?.user) {
      router.replace("/login");
      return;
    }
    setUser(sess.user);

    async function initPage() {
      try {
        const periodList = await SurveyApi.getPeriods();
        const activePeriod = await SurveyApi.getActivePeriod();
        
        const formattedPeriods = Array.isArray(periodList) 
          ? periodList.map(p => ({ id: p.id, name: p.name }))
          : Array.isArray(periodList?.data)
          ? periodList.data.map(p => ({ id: p.id, name: p.name }))
          : [];

        if (formattedPeriods.length > 0) {
          setPeriods(formattedPeriods);
          const initialPeriod = activePeriod?.id || formattedPeriods[0].id;
          setSelectedPeriod(String(initialPeriod));
        } else {
          setPeriods(MOCK_PERIODS);
          setSelectedPeriod(MOCK_PERIODS[0].id);
        }
      } catch (err) {
        console.warn("Failed fetching periods from API, using fallback periods.");
        setPeriods(MOCK_PERIODS);
        setSelectedPeriod(MOCK_PERIODS[0].id);
      } finally {
        setLoading(false);
      }
    }

    initPage();
  }, [router]);

  // 2. Fetch scores when period or selected pillar changes
  useEffect(() => {
    if (!user || !selectedPeriod) return;

    async function loadScores() {
      try {
        const res = await SurveyApi.getRecapScores({
          user_id: user.id,
          period_id: selectedPeriod,
          pillar_id: selectedPillarId || undefined
        });

        if (res) {
          if (Array.isArray(res.pillars)) {
            setPillars(res.pillars.map(p => ({
              id: String(p.id || p.key),
              title: p.title,
              question_count: p.questions_count || p.question_count || 0
            })));
          }

          if (res.selected_pillar && !selectedPillarId) {
            setSelectedPillarId(String(res.selected_pillar.id || res.selected_pillar.key));
          }

          setRecapScores({
            stats: { total_reviewers: res.total_raters || 0 },
            questions: (res.question_cards || []).map((q, idx) => ({
              id: q.id,
              code: `Q ${idx + 1}`,
              text: q.question,
              total_responses: q.total_responses,
              distribution: {
                detractor: { count: q.detractors || 0 },
                passive: { count: q.passives || 0 },
                promoter: { count: q.promoters || 0 }
              }
            }))
          });
        }
      } catch (err) {
        console.warn("RecapScores API failed/unavailable, using fallback mock data.");
        const fallbackPillars = MOCK_PILLARS;
        setPillars(fallbackPillars);
        if (!selectedPillarId) {
          setSelectedPillarId(fallbackPillars[0].id);
        }
        
        const activeId = selectedPillarId || fallbackPillars[0].id;
        const details = MOCK_RECAP_DETAILS[activeId] || MOCK_RECAP_DETAILS["owner-mindset"];
        setRecapScores(details);
      }
    }

    loadScores();
  }, [user, selectedPeriod, selectedPillarId]);

  // 3. Fetch anonymous feedbacks when period changes or feedback tab is selected
  useEffect(() => {
    if (!user || !selectedPeriod || activeTab !== "feedback") return;

    async function loadFeedback() {
      try {
        const res = await SurveyApi.getRecapFeedback({
          user_id: user.id,
          period_id: selectedPeriod
        });

        if (res && Array.isArray(res.feedback_cards)) {
          setRecapFeedback(res.feedback_cards.map(f => f.feedback_text));
        } else {
          setRecapFeedback([]);
        }
      } catch (err) {
        console.warn("RecapFeedback API failed/unavailable, using compiled mock feedbacks.");
        const allMock = Object.values(MOCK_RECAP_DETAILS).flatMap(d => d.feedbacks);
        setRecapFeedback(allMock);
      }
    }

    loadFeedback();
  }, [user, selectedPeriod, activeTab]);

  // Handle pillar sidebar clicks
  const handlePillarChange = (pillarId) => {
    setSelectedPillarId(pillarId);
    setActiveTab("pillar");

    if (window.innerWidth < 1024 && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleFeedbackClick = () => {
    setActiveTab("feedback");
    
    if (window.innerWidth < 1024 && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 border-4 rounded-full border-emerald-200 border-t-emerald-600 animate-spin"></div>
            <p className="text-sm text-gray-500">Memuat rekap penilaian...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <UserNavbar />

      {/* Main Container width adjusted to max-w-6xl to align perfectly with Navbar */}
      <div className="max-w-6xl px-4 py-4 sm:py-6 mx-auto space-y-4 sm:space-y-6">
        
        {/* 2-COLUMN LAYOUT: Sidebar + Main Content Card */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
          
          {/* Left Column - Navigation Sidebar (Span 1 of 4) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Pillar</h3>
              <p className="text-[11px] text-gray-400 mb-4 leading-normal">Pilih pilar untuk melihat detail sebaran skor, atau lihat kritik & saran.</p>
              
              <div className="space-y-2">
                {/* Pillar Buttons */}
                {pillars.map((p) => {
                  const isActive = activeTab === "pillar" && String(p.id) === String(selectedPillarId);
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePillarChange(p.id)}
                      className={`w-full text-left p-3 rounded-lg border text-xs font-semibold transition-all duration-200 flex items-center justify-between
                        ${isActive 
                          ? "bg-[#0d9488] text-white border-[#0d9488]" 
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"}`}
                    >
                      <div>
                        <div className="font-bold leading-tight">{p.title}</div>
                        <div className={`text-[10px] mt-0.5 ${isActive ? "text-teal-100" : "text-gray-400"}`}>
                          {p.question_count} pertanyaan
                        </div>
                      </div>
                      <span className={`text-[14px] font-bold ${isActive ? "text-white" : "text-gray-400"}`}>&rsaquo;</span>
                    </button>
                  );
                })}

                {/* Divider */}
                <div className="border-t border-gray-100 my-2" />

                {/* Kritik & Saran Button */}
                <button
                  onClick={handleFeedbackClick}
                  className={`w-full text-left p-3 rounded-lg border text-xs font-semibold transition-all duration-200 flex items-center justify-between
                    ${activeTab === "feedback" 
                      ? "bg-[#0d9488] text-white border-[#0d9488]" 
                      : "bg-white text-gray-700 border-gray-200 hover:bg-[#fafafa] hover:border-gray-350"}`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-bold leading-tight">Kritik & Saran</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Umpan balik anonim</div>
                    </div>
                  </div>
                  <span className="text-[14px] font-bold">&rsaquo;</span>
                </button>
              </div>
            </div>

            {/* Note info box */}
            <div className="p-4 border border-sky-100 rounded-xl bg-sky-50/50">
              <p className="text-[10px] text-sky-800 leading-normal">
                <strong>Catatan:</strong> Identitas penilai menjaga kerahasiaan sesuai prinsip survey 360°.
              </p>
            </div>
          </div>

          {/* Right Column - Main Content Card (Span 3 of 4) */}
          <div className="lg:col-span-3" ref={contentRef}>
            
            {activeTab === "pillar" ? (
              /* TAB 1: Scores Distribution Detail */
              <div className="p-4 sm:p-6 bg-white border border-gray-100 shadow-sm rounded-xl space-y-4 sm:space-y-6">
                
                {/* Category header with aligned Period dropdown on the right */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-[9px] font-bold text-[#0d9488] uppercase tracking-widest leading-none">
                      // {pillars.find(p => String(p.id) === String(selectedPillarId))?.title.toUpperCase() || "PILLAR"} FEEDBACK
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 mt-1">
                      Akumulasi Sebaran Skor Responden
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Total penilai: {recapScores?.stats?.total_reviewers || 0} orang</p>
                  </div>

                  {/* Period Filter + Legends block */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Periode:</span>
                      <select 
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-2 py-1 text-xs bg-white border border-gray-250 rounded-lg text-gray-700 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      >
                        {periods.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                        <span className="text-gray-500">Detractor 1-6</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                        <span className="text-gray-500">Passive 7-8</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#0d9488]" />
                        <span className="text-gray-500">Promoter 9-10</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions Grid list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recapScores?.questions?.length > 0 ? (
                    recapScores.questions.map((q) => {
                      const detCount = q.distribution?.detractor?.count || 0;
                      const pasCount = q.distribution?.passive?.count || 0;
                      const proCount = q.distribution?.promoter?.count || 0;
                      const totalCount = detCount + pasCount + proCount || 1;

                      const detPct = ((detCount / totalCount) * 100).toFixed(1);
                      const pasPct = ((pasCount / totalCount) * 100).toFixed(1);
                      const proPct = ((proCount / totalCount) * 100).toFixed(1);

                      return (
                        <div key={q.id} className="p-4 border border-gray-100 bg-[#fafafa] rounded-xl flex flex-col justify-between space-y-4">
                          <div>
                            <h4 className="text-xs font-bold text-gray-700 leading-normal">
                              {q.code}. {q.text}
                            </h4>
                            <p className="text-[10px] text-gray-400 mt-1">{q.total_responses} penilaian anonim</p>
                          </div>

                          {/* Stacked bar */}
                          <div>
                            <div className="w-full h-7 overflow-hidden rounded-lg flex text-[10px] font-bold text-white shadow-inner">
                              {detCount > 0 && (
                                <div 
                                  className="bg-[#ef4444] flex items-center justify-center transition-all duration-300 border-r border-white/20 last:border-r-0"
                                  style={{ width: `${detPct}%` }}
                                >
                                  ({detCount})
                                </div>
                              )}
                              {pasCount > 0 && (
                                <div 
                                  className="bg-[#f59e0b] flex items-center justify-center transition-all duration-300 border-r border-white/20 last:border-r-0"
                                  style={{ width: `${pasPct}%` }}
                                >
                                  ({pasCount})
                                </div>
                              )}
                              {proCount > 0 && (
                                <div 
                                  className="bg-[#0d9488] flex items-center justify-center transition-all duration-300"
                                  style={{ width: `${proPct}%` }}
                                >
                                  ({proCount})
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between text-[9px] text-gray-400 mt-1.5 font-bold">
                              <span className={detCount > 0 ? "text-[#ef4444]" : ""}>Detractor ({detCount})</span>
                              <span className={pasCount > 0 ? "text-[#f59e0b]" : ""}>Passive ({pasCount})</span>
                              <span className={proCount > 0 ? "text-[#0d9488]" : ""}>Promoter ({proCount})</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-center py-10 text-xs text-gray-400">
                      Tidak ada data sebaran skor untuk pilar ini.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* TAB 2: Umpan Balik / Kritik & Saran Detail */
              <div className="p-4 sm:p-6 bg-white border border-gray-100 shadow-sm rounded-xl space-y-4">
                
                {/* Header with aligned Period dropdown on the right */}
                <div className="border-b border-gray-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#0d9488]" />
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-800">Umpan Balik / Kritik & Saran</h3>
                      <p className="text-xs text-gray-400">Kritik dan saran responden dikumpulkan tanpa identitas penilai.</p>
                    </div>
                  </div>

                  {/* Period Filter Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Periode:</span>
                    <select 
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="px-2 py-1 text-xs bg-white border border-gray-250 rounded-lg text-gray-700 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                      {periods.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-1">
                  {recapFeedback.length > 0 ? (
                    recapFeedback.map((text, idx) => (
                      <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-white space-y-2 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 tracking-wider">
                          <span>UMPAN BALIK ANONIM #{idx + 1}</span>
                          <span className="px-2 py-0.5 bg-gray-50 border border-gray-150 rounded text-gray-500 font-bold uppercase text-[8px]">Anonim</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed italic">
                          &ldquo;{text}&rdquo;
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-xs text-gray-400">
                      Tidak ada kritik dan saran tertulis untuk periode ini.
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
