import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  Users, 
  Coins, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Download, 
  TrendingUp, 
  ShieldCheck, 
  Calendar,
  AlertCircle,
  RotateCcw,
  UserPlus,
  QrCode,
  Scan,
  Smartphone,
  Check,
  ClipboardList,
  Edit2,
  Trash2,
  ThumbsUp,
  Save,
  ArrowUp,
  BarChart3,
  Trophy,
  Award,
  Filter,
  PieChart,
  ChevronDown,
  ChevronUp,
  Clock,
  UserCheck
} from 'lucide-react';

// Data Awal Mockup Warga
const INITIAL_WARGA = [
  { id: 'W-01', noRumah: 'A-01', nama: 'Bpk. Ahmad Subagyo', blok: 'Anyelir 1', statusHariIni: true, nominalHariIni: 1000, totalBulanIni: 30000 },
  { id: 'W-02', noRumah: 'A-02', nama: 'Bpk. Budi Santoso', blok: 'Anyelir 1', statusHariIni: true, nominalHariIni: 2000, totalBulanIni: 60000 },
  { id: 'W-03', noRumah: 'A-03', nama: 'Ibu Cicih Sulaeman', blok: 'Anyelir 1', statusHariIni: false, nominalHariIni: 0, totalBulanIni: 15000 },
  { id: 'W-04', noRumah: 'B-01', nama: 'Bpk. Dedi Kurniawan', blok: 'Anyelir 2', statusHariIni: true, nominalHariIni: 500, totalBulanIni: 15000 },
  { id: 'W-05', noRumah: 'B-02', nama: 'Bpk. Eko Prasetyo', blok: 'Anyelir 2', statusHariIni: false, nominalHariIni: 0, totalBulanIni: 22000 },
  { id: 'W-06', noRumah: 'B-03', nama: 'Ibu Farida Hartati', blok: 'Anyelir 2', statusHariIni: true, nominalHariIni: 1000, totalBulanIni: 30000 },
  { id: 'W-07', noRumah: 'C-01', nama: 'Bpk. Gunawan Wibowo', blok: 'Bougenville', statusHariIni: true, nominalHariIni: 1000, totalBulanIni: 28000 },
  { id: 'W-08', noRumah: 'C-02', nama: 'Bpk. Hendra Wijaya', blok: 'Bougenville', statusHariIni: false, nominalHariIni: 0, totalBulanIni: 10000 },
];

// Data Awal Pengeluaran
const INITIAL_TRANSAKSI = [
  { id: 'T-101', tanggal: '2026-11-01', tipe: 'pemasukan', kategori: 'Jimpitan Harian', keterangan: 'Penarikan Jimpitan Kolektif Shift Malam', jumlah: 45000 },
  { id: 'T-102', tanggal: '2026-11-02', tipe: 'pengeluaran', kategori: 'Konsumsi Ronda', keterangan: 'Kopi, Teh & Makanan Ringan Pos Ronda 86', jumlah: 25000 },
  { id: 'T-103', tanggal: '2026-11-03', tipe: 'pengeluaran', kategori: 'Perbaikan Pos', keterangan: 'Beli Lampu LED & Kunci Pos Ronda', jumlah: 35000 },
  { id: 'T-104', tanggal: '2026-11-04', tipe: 'pemasukan', kategori: 'Donasi/Kas', keterangan: 'Sumbangan Kas Warga Bpk Budi', jumlah: 100000 },
];

// Data Awal Jadwal Petugas Ronda 1 Minggu (3 orang/hari)
const INITIAL_JADWAL_PETUGAS = {
  Senin: ['Bpk. Ahmad Subagyo', 'Bpk. Budi Santoso', 'Bpk. Luwarno'],
  Selasa: ['Bpk. Dedi Kurniawan', 'Bpk. Eko Prasetyo', 'Bpk. Gunawan Wibowo'],
  Rabu: ['Bpk. Hendra Wijaya', 'Bpk. Bambang', 'Bpk. Slamet'],
  Kamis: ['Bpk. Joko', 'Bpk. Agus', 'Bpk. Supri'],
  Jumat: ['Bpk. Rahmat', 'Bpk. Tri', 'Bpk. Mulyono'],
  Sabtu: ['Bpk. Sugeng', 'Bpk. Hery', 'Bpk. Yudi'],
  Minggu: ['Bpk. Wawan', 'Bpk. Arif', 'Bpk. Didik']
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  // State Sub-Tab khusus di dalam Rekap & Laporan
  const [rekapSubTab, setRekapSubTab] = useState('histori'); // 'histori' | 'form_cetak'

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showTopWargaTooltip, setShowTopWargaTooltip] = useState(false);

  // State Jam Digital Dinamis (Realtime)
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTimeString = useMemo(() => {
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }, [currentTime]);

  // State Accordion Jadwal Petugas
  const [isJadwalOpen, setIsJadwalOpen] = useState(false);
  const [jadwalPetugas, setJadwalPetugas] = useState(() => {
    const saved = localStorage.getItem('jimpitan_jadwal_petugas');
    return saved ? JSON.parse(saved) : INITIAL_JADWAL_PETUGAS;
  });
  const [showEditJadwalModal, setShowEditJadwalModal] = useState(false);
  const [selectedDayToEdit, setSelectedDayToEdit] = useState('');
  const [editPetugasForm, setEditPetugasForm] = useState(['', '', '']);

  // STATE UNTUK ANIMASI ROTASI PETUGAS (KEMARIN, HARI INI, BESOK)
  const [petugasShiftIndex, setPetugasShiftIndex] = useState(0); // 0: Kemarin, 1: Hari Ini, 2: Besok
  const [blinkKey, setBlinkKey] = useState(0); // Pemicu ulang animasi kedip 3x

  // Tanggal Sistem Hari Ini
  const getTodayISO = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const currentDateFormatted = useMemo(() => {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }, []);

  // State Toast Log
  const [toastLog, setToastLog] = useState(null);
  const showNotificationLog = (message, type = 'success') => {
    setToastLog({ message, type, visible: true });
    setTimeout(() => {
      setToastLog(prev => prev ? { ...prev, visible: false } : null);
    }, 2500);
    setTimeout(() => {
      setToastLog(null);
    }, 3000);
  };

  const [selectedBlok, setSelectedBlok] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // State Tanggal Terpilih untuk Form Laporan Ronda & Rekap
  const [selectedDate, setSelectedDate] = useState(getTodayISO);

  // State Rentang Tanggal Rekap (Harian / Mingguan / Bulanan)
  const [rekapPeriod, setRekapPeriod] = useState('bulan_ini'); // 'hari_ini', 'minggu_ini', 'bulan_ini', 'custom'
  const [rekapStartDate, setRekapStartDate] = useState(getTodayISO);
  const [rekapEndDate, setRekapEndDate] = useState(getTodayISO);

  const formatDateToLaporan = (dateStr) => {
    if (!dateStr) return '';
    const [yearStr, monthStr, dayStr] = dateStr.split('-');
    const dateObj = new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr));
    const days = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
    return `${days[dateObj.getDay()]}, ${dayStr}/${monthStr}/${yearStr.slice(-2)}`;
  };

  const setTodaySelectedDate = () => {
    setSelectedDate(getTodayISO());
  };

  const changeSelectedDateByDays = (days) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + days);
    const newY = dateObj.getFullYear();
    const newM = String(dateObj.getMonth() + 1).padStart(2, '0');
    const newD = String(dateObj.getDate()).padStart(2, '0');
    setSelectedDate(`${newY}-${newM}-${newD}`);
  };

  // State Data Warga
  const [wargaList, setWargaList] = useState(() => {
    const saved = localStorage.getItem('jimpitan_warga');
    return saved ? JSON.parse(saved) : INITIAL_WARGA;
  });

  // State DATABASE HISTORI PENARIKAN (Tersimpan Harian)
  const [jimpitanHistory, setJimpitanHistory] = useState(() => {
    const saved = localStorage.getItem('jimpitan_history_logs');
    if (saved) return JSON.parse(saved);
    
    // Default Mock Logs untuk Pengujian Rekap Laporan
    const today = getTodayISO();
    return [
      { id: 'H-1', tanggal: today, wargaId: 'W-01', noRumah: 'A-01', nama: 'Bpk. Ahmad Subagyo', blok: 'Anyelir 1', nominal: 1000 },
      { id: 'H-2', tanggal: today, wargaId: 'W-02', noRumah: 'A-02', nama: 'Bpk. Budi Santoso', blok: 'Anyelir 1', nominal: 2000 },
      { id: 'H-3', tanggal: today, wargaId: 'W-04', noRumah: 'B-01', nama: 'Bpk. Dedi Kurniawan', blok: 'Anyelir 2', nominal: 500 },
      { id: 'H-4', tanggal: today, wargaId: 'W-06', noRumah: 'B-03', nama: 'Ibu Farida Hartati', blok: 'Anyelir 2', nominal: 1000 },
      { id: 'H-5', tanggal: today, wargaId: 'W-07', noRumah: 'C-01', nama: 'Bpk. Gunawan Wibowo', blok: 'Bougenville', nominal: 1000 },
    ];
  });

  // LOGIKA RESET OTOMATIS SAAT BERGANTI HARI (MELEWATI 24:00)
  useEffect(() => {
    const todayStr = getTodayISO();
    const lastActiveDate = localStorage.getItem('jimpitan_last_active_date');

    if (lastActiveDate && lastActiveDate !== todayStr) {
      setWargaList(prev => prev.map(w => ({
        ...w,
        statusHariIni: false,
        nominalHariIni: 0
      })));
    }
    localStorage.setItem('jimpitan_last_active_date', todayStr);
  }, []);

  // State Data Transaksi Kas
  const [transaksiList, setTransaksiList] = useState(() => {
    const saved = localStorage.getItem('jimpitan_transaksi');
    return saved ? JSON.parse(saved) : INITIAL_TRANSAKSI;
  });

  // State Laporan Ronda Tersimpan Berdasarkan Tanggal
  const [laporanByDate, setLaporanByDate] = useState(() => {
    const saved = localStorage.getItem('jimpitan_laporan_by_date');
    return saved ? JSON.parse(saved) : {};
  });

  const currentFormLaporan = useMemo(() => {
    const formattedDateStr = formatDateToLaporan(selectedDate);
    const defaultData = {
      'Anyelir 1': { hariTanggal: formattedDateStr, daftarHadir: '', kondisiLingkungan: '', sieKeamanan: 'LUWARNO', petugasJimpitan: '' },
      'Anyelir 2': { hariTanggal: formattedDateStr, daftarHadir: '', kondisiLingkungan: '', sieKeamanan: 'LUWARNO', petugasJimpitan: '' },
      'Bougenville': { hariTanggal: formattedDateStr, daftarHadir: '', kondisiLingkungan: '', sieKeamanan: 'LUWARNO', petugasJimpitan: '' }
    };

    const savedDateData = laporanByDate[selectedDate];
    if (savedDateData) {
      return {
        'Anyelir 1': { ...defaultData['Anyelir 1'], ...savedDateData['Anyelir 1'], hariTanggal: formattedDateStr },
        'Anyelir 2': { ...defaultData['Anyelir 2'], ...savedDateData['Anyelir 2'], hariTanggal: formattedDateStr },
        'Bougenville': { ...defaultData['Bougenville'], ...savedDateData['Bougenville'], hariTanggal: formattedDateStr }
      };
    }
    return defaultData;
  }, [selectedDate, laporanByDate]);

  const handleUpdateLaporanField = (blokNama, field, value) => {
    setIsSaved(false);
    const updated = {
      ...currentFormLaporan,
      [blokNama]: {
        ...currentFormLaporan[blokNama],
        [field]: value
      }
    };
    const newLaporanByDate = {
      ...laporanByDate,
      [selectedDate]: updated
    };
    setLaporanByDate(newLaporanByDate);
    localStorage.setItem('jimpitan_laporan_by_date', JSON.stringify(newLaporanByDate));
  };

  const handleManualSaveLaporan = () => {
    localStorage.setItem('jimpitan_laporan_by_date', JSON.stringify(laporanByDate));
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  const hitungHasilWilayah = (namaBlok) => {
    return wargaList
      .filter(w => w.blok === namaBlok && w.statusHariIni)
      .reduce((acc, curr) => acc + (curr.nominalHariIni || 0), 0);
  };

  const totalNominalHariIni = useMemo(() => {
    return wargaList
      .filter(w => w.statusHariIni)
      .reduce((acc, curr) => acc + (curr.nominalHariIni || 0), 0);
  }, [wargaList]);

  const totalSudahBayarHariIni = useMemo(() => {
    return wargaList.filter(w => w.statusHariIni).length;
  }, [wargaList]);

  const [targetBulanIni, setTargetBulanIni] = useState(() => {
    const savedTarget = localStorage.getItem('jimpitan_target_kas');
    return savedTarget ? parseInt(savedTarget) : 500000;
  });

  const totalBulanIni = useMemo(() => {
    return wargaList.reduce((acc, curr) => acc + (curr.totalBulanIni || 0), 0);
  }, [wargaList]);

  const handleTargetChange = (val) => {
    const num = parseInt(val);
    setTargetBulanIni(num);
    localStorage.setItem('jimpitan_target_kas', num.toString());
  };

  // RESET SEMUA PENARIKAN HARI INI KE RP 0 & STATUS TARIK
  const handleResetHariIni = () => {
    const todayStr = getTodayISO();
    const updatedList = wargaList.map(w => {
      const oldNom = w.statusHariIni ? w.nominalHariIni : 0;
      return {
        ...w,
        statusHariIni: false,
        nominalHariIni: 0,
        totalBulanIni: Math.max(0, w.totalBulanIni - oldNom)
      };
    });
    
    // Hapus histori hari ini dari database logs
    const updatedHistory = jimpitanHistory.filter(h => h.tanggal !== todayStr);

    setWargaList(updatedList);
    setJimpitanHistory(updatedHistory);
    localStorage.setItem('jimpitan_warga', JSON.stringify(updatedList));
    localStorage.setItem('jimpitan_history_logs', JSON.stringify(updatedHistory));
    showNotificationLog('Semua data penarikan hari ini berhasil di-reset ke Rp 0!', 'info');
  };

  const totalKasJimpitan = useMemo(() => {
    const totalPemasukan = transaksiList
      .filter(t => t.tipe === 'pemasukan')
      .reduce((acc, curr) => acc + curr.jumlah, 0);
    const totalPengeluaran = transaksiList
      .filter(t => t.tipe === 'pengeluaran')
      .reduce((acc, curr) => acc + curr.jumlah, 0);
    return totalPemasukan - totalPengeluaran;
  }, [transaksiList]);

  // REKAP PERINGKAT JIMPITAN PER WILAYAH (ANYELIR 1, ANYELIR 2, BOUGENVILLE)
  const rankingWilayah = useMemo(() => {
    const wilayahList = ['Anyelir 1', 'Anyelir 2', 'Bougenville'];
    const rekap = wilayahList.map(namaWilayah => {
      const wargaInWilayah = wargaList.filter(w => w.blok === namaWilayah);
      const totalNominal = wargaInWilayah.reduce((acc, curr) => acc + (curr.totalBulanIni || 0), 0);
      return {
        wilayah: namaWilayah,
        totalNominal,
        jumlahRumah: wargaInWilayah.length,
        sudahBayarToday: wargaInWilayah.filter(w => w.statusHariIni).length
      };
    });

    // Urutkan dari total nominal terbesar ke terkecil
    return rekap.sort((a, b) => b.totalNominal - a.totalNominal);
  }, [wargaList]);

  // PENARIKAN JIMPITAN & PENYIMPANAN KE DATABASE HISTORI HARIAN
  const handleToggleJimpitan = (id) => {
    const todayStr = getTodayISO();

    setWargaList(prev => prev.map(w => {
      if (w.id === id) {
        const nextStatus = !w.statusHariIni;
        const nomToApply = w.nominalHariIni > 0 ? w.nominalHariIni : 1000;
        const finalNominal = nextStatus ? nomToApply : 0;
        
        const oldNominal = w.statusHariIni ? w.nominalHariIni : 0;
        const diff = finalNominal - oldNominal;
        
        // Simpan / Update Histori ke Database Logs
        setJimpitanHistory(prevLogs => {
          const filtered = prevLogs.filter(h => !(h.tanggal === todayStr && h.wargaId === id));
          if (nextStatus && finalNominal > 0) {
            const newLog = {
              id: `H-${Date.now()}`,
              tanggal: todayStr,
              wargaId: w.id,
              noRumah: w.noRumah,
              nama: w.nama,
              blok: w.blok,
              nominal: finalNominal
            };
            return [newLog, ...filtered];
          }
          return filtered;
        });

        if (nextStatus) {
          showNotificationLog(`Jimpitan ${w.noRumah} (${w.nama}) sebesar Rp ${finalNominal.toLocaleString('id-ID')} tersimpan di database!`, 'success');
        } else {
          showNotificationLog(`Penarikan ${w.noRumah} (${w.nama}) dibatalkan.`, 'info');
        }

        return {
          ...w,
          statusHariIni: nextStatus,
          nominalHariIni: nextStatus ? finalNominal : w.nominalHariIni,
          totalBulanIni: Math.max(0, w.totalBulanIni + diff)
        };
      }
      return w;
    }));
  };

  const handleNominalChange = (id, newNominalValue) => {
    const val = parseInt(newNominalValue) || 0;
    setWargaList(prev => prev.map(w => {
      if (w.id === id) {
        let newTotalBulanIni = w.totalBulanIni;
        if (w.statusHariIni) {
          const diff = val - w.nominalHariIni;
          newTotalBulanIni = Math.max(0, w.totalBulanIni + diff);
        }
        return {
          ...w,
          nominalHariIni: val,
          totalBulanIni: newTotalBulanIni
        };
      }
      return w;
    }));
  };

  useEffect(() => {
    localStorage.setItem('jimpitan_transaksi', JSON.stringify(transaksiList));
  }, [transaksiList]);

  useEffect(() => {
    localStorage.setItem('jimpitan_jadwal_petugas', JSON.stringify(jadwalPetugas));
  }, [jadwalPetugas]);

  const handleOpenEditJadwal = (hari) => {
    setSelectedDayToEdit(hari);
    setEditPetugasForm([...jadwalPetugas[hari]]);
    setShowEditJadwalModal(true);
  };

  const handleSaveEditJadwal = (e) => {
    e.preventDefault();
    setJadwalPetugas(prev => ({
      ...prev,
      [selectedDayToEdit]: editPetugasForm
    }));
    setShowEditJadwalModal(false);
    showNotificationLog(`Jadwal petugas hari ${selectedDayToEdit} berhasil diperbarui!`, 'success');
  };

  const getTodayDayName = () => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[new Date().getDay()];
  };

  // AMBIL DATA PETUGAS KEMARIN, HARI INI, & BESOK
  const infoPetugasRotasi = useMemo(() => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const todayIdx = new Date().getDay();
    const yesterdayIdx = (todayIdx + 6) % 7;
    const tomorrowIdx = (todayIdx + 1) % 7;

    const hariKemarin = days[yesterdayIdx];
    const hariHariIni = days[todayIdx];
    const hariBesok = days[tomorrowIdx];

    const formatPetugas = (list) => {
      if (!list || list.length === 0) return '-';
      return list.join(', ');
    };

    return [
      { label: 'Petugas Kemarin', hari: hariKemarin, nama: formatPetugas(jadwalPetugas[hariKemarin]) },
      { label: 'Petugas Hari Ini', hari: hariHariIni, nama: formatPetugas(jadwalPetugas[hariHariIni]) },
      { label: 'Petugas Besok', hari: hariBesok, nama: formatPetugas(jadwalPetugas[hariBesok]) }
    ];
  }, [jadwalPetugas]);

  // TIMER ROTASI & KEDIP 3X
  useEffect(() => {
    const interval = setInterval(() => {
      setPetugasShiftIndex(prev => (prev + 1) % 3);
      setBlinkKey(prev => prev + 1); // Trigger ulang animasi kedip 3x
    }, 4500); // Berganti setiap 4.5 detik (cukup untuk 3x kedipan)

    return () => clearInterval(interval);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // MEMOIZED FILTERED REKAP LOGS (Harian / Mingguan / Bulanan / Custom)
  const filteredRekapLogs = useMemo(() => {
    let startStr = rekapStartDate;
    let endStr = rekapEndDate;

    const today = new Date();
    if (rekapPeriod === 'hari_ini') {
      startStr = getTodayISO();
      endStr = getTodayISO();
    } else if (rekapPeriod === 'minggu_ini') {
      const curr = new Date();
      const firstDay = curr.getDate() - curr.getDay(); // Minggu
      const lastDay = firstDay + 6;
      const sDate = new Date(curr.setDate(firstDay));
      const eDate = new Date(curr.setDate(lastDay));
      startStr = sDate.toISOString().split('T')[0];
      endStr = eDate.toISOString().split('T')[0];
    } else if (rekapPeriod === 'bulan_ini') {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      startStr = `${year}-${month}-01`;
      const lastDay = new Date(year, today.getMonth() + 1, 0).getDate();
      endStr = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
    }

    return jimpitanHistory.filter(h => h.tanggal >= startStr && h.tanggal <= endStr);
  }, [jimpitanHistory, rekapPeriod, rekapStartDate, rekapEndDate]);

  const totalRekapNominal = useMemo(() => {
    return filteredRekapLogs.reduce((acc, curr) => acc + curr.nominal, 0);
  }, [filteredRekapLogs]);

  // Modal State
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [showAddWargaModal, setShowAddWargaModal] = useState(false);
  const [showEditWargaModal, setShowEditWargaModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingWarga, setEditingWarga] = useState(null);
  const [wargaToDelete, setWargaToDelete] = useState(null);
  const [selectedWargaDana, setSelectedWargaDana] = useState(null);
  const [danaAmount, setDanaAmount] = useState(2000);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const [showEditTransModal, setShowEditTransModal] = useState(false);
  const [showDeleteTransModal, setShowDeleteTransModal] = useState(false);
  const [editingTransaksi, setEditingTransaksi] = useState(null);
  const [transToDelete, setTransToDelete] = useState(null);

  const [newWarga, setNewWarga] = useState({ nama: '', noRumah: '', blok: 'Anyelir 1' });
  const [editWargaData, setEditWargaData] = useState({ id: '', nama: '', noRumah: '', blok: 'Anyelir 1' });
  const [newTrans, setNewTrans] = useState({ 
    tanggal: getTodayISO(), 
    tipe: 'pengeluaran', 
    kategori: '', 
    keterangan: '', 
    jumlah: '' 
  });
  const [editTransData, setEditTransData] = useState({ id: '', tanggal: '', tipe: 'pengeluaran', kategori: '', keterangan: '', jumlah: '' });

  const handleOpenEditWarga = (warga) => {
    setEditingWarga(warga);
    setEditWargaData({ id: warga.id, nama: warga.nama, noRumah: warga.noRumah, blok: warga.blok });
    setShowEditWargaModal(true);
  };

  const handleOpenDeleteModal = (warga) => {
    setWargaToDelete(warga);
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteWarga = () => {
    if (wargaToDelete) {
      setWargaList(prev => prev.filter(w => w.id !== wargaToDelete.id));
      setShowDeleteModal(false);
      setWargaToDelete(null);
    }
  };

  const handleSaveEditWarga = (e) => {
    e.preventDefault();
    if (!editWargaData.nama || !editWargaData.noRumah) return;
    setWargaList(prev => prev.map(w => w.id === editWargaData.id ? { ...w, ...editWargaData } : w));
    setShowEditWargaModal(false);
    setEditingWarga(null);
  };

  const handleOpenDanaModal = (warga = null) => {
    setSelectedWargaDana(warga);
    setDanaAmount(warga ? (warga.nominalHariIni || 2000) : 2000);
    setIsScanning(false);
    setScanSuccess(false);
    setShowQrisModal(true);
  };

  const handleOpenAddWargaWithBlok = (blok = 'Anyelir 1') => {
    setNewWarga({ nama: '', noRumah: '', blok: blok });
    setShowAddWargaModal(true);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
    }, 1800);
  };

  const handleConfirmDanaPayment = () => {
    const todayStr = getTodayISO();
    if (selectedWargaDana) {
      setWargaList(prev => prev.map(w => {
        if (w.id === selectedWargaDana.id) {
          return {
            ...w,
            statusHariIni: true,
            nominalHariIni: danaAmount,
            totalBulanIni: w.totalBulanIni + danaAmount
          };
        }
        return w;
      }));

      // Tambah Log Histori
      setJimpitanHistory(prev => [{
        id: `H-${Date.now()}`,
        tanggal: todayStr,
        wargaId: selectedWargaDana.id,
        noRumah: selectedWargaDana.noRumah,
        nama: selectedWargaDana.nama,
        blok: selectedWargaDana.blok,
        nominal: danaAmount
      }, ...prev]);
    }

    const newTx = {
      id: `T-${Date.now().toString().slice(-4)}`,
      tanggal: todayStr,
      tipe: 'pemasukan',
      kategori: 'Jimpitan Harian',
      keterangan: `Pembayaran QRIS DANA ${selectedWargaDana ? `(${selectedWargaDana.noRumah} - ${selectedWargaDana.nama})` : 'Kolektif Pos Ronda'}`,
      jumlah: danaAmount
    };
    setTransaksiList([newTx, ...transaksiList]);

    setShowQrisModal(false);
    alert(`Pembayaran DANA sebesar Rp ${danaAmount.toLocaleString('id-ID')} Berhasil Dikonfirmasi!`);
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan data ke tampilan default awal?')) {
      localStorage.removeItem('jimpitan_warga');
      localStorage.removeItem('jimpitan_transaksi');
      localStorage.removeItem('jimpitan_laporan_by_date');
      localStorage.removeItem('jimpitan_target_kas');
      localStorage.removeItem('jimpitan_history_logs');
      setWargaList(INITIAL_WARGA);
      setTransaksiList(INITIAL_TRANSAKSI);
      setLaporanByDate({});
      setTargetBulanIni(500000);
      setJimpitanHistory([]);
    }
  };

  const handleAddWarga = (e) => {
    e.preventDefault();
    if (!newWarga.nama || !newWarga.noRumah) return;
    const newEntry = {
      id: `W-${Date.now().toString().slice(-4)}`,
      nama: newWarga.nama,
      noRumah: newWarga.noRumah,
      blok: newWarga.blok,
      statusHariIni: false,
      nominalHariIni: 0,
      totalBulanIni: 0
    };
    setWargaList([...wargaList, newEntry]);
    setNewWarga({ nama: '', noRumah: '', blok: 'Anyelir 1' });
    setShowAddWargaModal(false);
  };

  const handleAddTransaksi = (e) => {
    e.preventDefault();
    if (!newTrans.keterangan || !newTrans.jumlah) return;
    const item = {
      id: `T-${Date.now().toString().slice(-4)}`,
      tanggal: newTrans.tanggal || getTodayISO(),
      tipe: newTrans.tipe,
      kategori: newTrans.kategori || 'Umum',
      keterangan: newTrans.keterangan,
      jumlah: parseInt(newTrans.jumlah)
    };
    setTransaksiList([item, ...transaksiList]);
    setNewTrans({ tanggal: getTodayISO(), tipe: 'pengeluaran', kategori: '', keterangan: '', jumlah: '' });
  };

  const handleOpenEditTransaksi = (trans) => {
    setEditingTransaksi(trans);
    setEditTransData({ id: trans.id, tanggal: trans.tanggal || getTodayISO(), tipe: trans.tipe, kategori: trans.kategori, keterangan: trans.keterangan, jumlah: trans.jumlah });
    setShowEditTransModal(true);
  };

  const handleSaveEditTransaksi = (e) => {
    e.preventDefault();
    if (!editTransData.keterangan || !editTransData.jumlah) return;
    setTransaksiList(prev => prev.map(t => t.id === editTransData.id ? { ...editTransData, jumlah: parseInt(editTransData.jumlah) || 0 } : t));
    setShowEditTransModal(false);
    setEditingTransaksi(null);
  };

  const handleConfirmDeleteTransaksi = () => {
    if (transToDelete) {
      setTransaksiList(prev => prev.filter(t => t.id !== transToDelete.id));
      setShowDeleteTransModal(false);
      setTransToDelete(null);
    }
  };

  const filteredWarga = useMemo(() => {
    return wargaList.filter(w => {
      const matchSearch = w.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.noRumah.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBlok = selectedBlok === 'Semua' || w.blok === selectedBlok;
      const matchStatus = filterStatus === 'Semua' || 
                         (filterStatus === 'Sudah' && w.statusHariIni) || 
                         (filterStatus === 'Belum' && !w.statusHariIni);
      return matchSearch && matchBlok && matchStatus;
    });
  }, [wargaList, searchQuery, selectedBlok, filterStatus]);

  // Cetak PDF Rekapitulasi Histori Penarikan Jimpitan (Harian / Mingguan / Bulanan)
  const handlePrintRekapPDF = () => {
    const win = window.open('', '_blank');
    if (!win) return;

    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Rekap Laporan Histori Penarikan Jimpitan RT 08 RW 06</title>
          <style>
            @page { size: A4 portrait; margin: 12mm 15mm; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #1e293b; font-size: 11px; }
            .header-sec { text-align: center; border-bottom: 2px solid #0f766e; padding-bottom: 8px; margin-bottom: 12px; }
            .header-sec h1 { font-size: 16px; font-weight: 800; color: #0f766e; margin: 0 0 4px 0; text-transform: uppercase; }
            .header-sec p { font-size: 11px; color: #64748b; margin: 0; font-weight: bold; }
            .summary-cards { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 16px; }
            .card { flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; background: #f8fafc; }
            .card-title { font-size: 10px; text-transform: uppercase; font-weight: bold; color: #64748b; margin-bottom: 4px; }
            .card-val { font-size: 14px; font-weight: 800; color: #0f766e; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; }
            th, td { border: 1px solid #cbd5e1; padding: 7px 10px; text-align: left; }
            th { background-color: #0f766e; color: white; text-transform: uppercase; font-size: 10px; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body>
          <div class="header-sec">
            <h1>REKAP HISTORI PENARIKAN JIMPITAN WARGA</h1>
            <p>RT 08 / RW 06, Karanganyar Gunung, SRG</p>
          </div>
          <div class="summary-cards">
            <div class="card"><div class="card-title">Total Transaksi Penarikan</div><div class="card-val">${filteredRekapLogs.length} Penarikan</div></div>
            <div class="card"><div class="card-title">Total Nominal Terkumpul</div><div class="card-val">Rp ${totalRekapNominal.toLocaleString('id-ID')}</div></div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 15%;">Tanggal</th>
                <th style="width: 15%;">No. Rumah</th>
                <th style="width: 30%;">Nama Warga</th>
                <th style="width: 20%;">Wilayah / Blok</th>
                <th style="width: 20%; text-align: right;">Nominal (Rp)</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRekapLogs.map(log => `
                <tr>
                  <td>${log.tanggal}</td>
                  <td style="font-weight: bold;">${log.noRumah}</td>
                  <td>${log.nama}</td>
                  <td>${log.blok}</td>
                  <td class="text-right" style="font-weight: bold; color: #059669;">
                    Rp ${log.nominal.toLocaleString('id-ID')}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    win.document.write(printHTML);
    win.document.close();
  };

  // Cetak PDF Form Laporan
  const handlePrintFormLaporanPDF = () => {
    const formattedDate = formatDateToLaporan(selectedDate);
    const win = window.open('', '_blank');
    if (!win) return;

    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Jimpitan Ronda RT 08 RW 06 - ${selectedDate}</title>
          <style>
            @page { size: A4 portrait; margin: 8mm 10mm; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #1e293b; font-size: 11px; }
            .page-container { width: 100%; display: flex; flex-direction: column; gap: 10px; }
            .card-laporan { border: 1.5px solid #0f766e; border-radius: 12px; padding: 10px 14px; box-sizing: border-box; position: relative; }
            .header-flex { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1.5px solid #0f766e; padding-bottom: 6px; margin-bottom: 8px; }
            .title-sec h2 { font-size: 14px; font-weight: 800; color: #0f766e; margin: 0 0 2px 0; text-transform: uppercase; }
            .title-sec p { font-size: 10px; font-weight: bold; color: #64748b; margin: 0; }
            .badge-wilayah { border: 1px solid #0f766e; border-radius: 6px; font-weight: 800; padding: 3px 10px; font-size: 11px; text-transform: uppercase; }
            .icon-jempol { width: 22px; height: 22px; color: #0f766e; margin-bottom: 3px; display: block; margin-left: auto; }
            .row-data { display: flex; margin-bottom: 4px; font-size: 11px; }
            .lbl { width: 150px; font-weight: 800; text-transform: uppercase; }
            .colon { width: 12px; font-weight: bold; }
            .val { flex: 1; font-weight: 700; }
            .ttd-sec { display: flex; justify-content: space-around; margin-top: 14px; text-align: center; font-size: 10px; font-weight: 800; text-transform: uppercase; }
            .ttd-box { min-width: 140px; }
            .ttd-line { margin-top: 24px; text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="page-container">
            ${['Anyelir 1', 'Anyelir 2', 'Bougenville'].map((blokNama, idx) => {
              const item = currentFormLaporan[blokNama];
              const totalHasil = hitungHasilWilayah(blokNama);
              return `
                <div class="card-laporan">
                  <div style="position: absolute; top: 8px; left: 14px; font-size: 9px; font-weight: 800; color: #059669;">FORM #${idx+1}</div>
                  <div class="header-flex" style="margin-top: 8px;">
                    <div class="title-sec">
                      <h2>FORM LAPORAN JIMPOL</h2>
                      <p>RT 08 / RW 06, Karanganyar Gunung, SRG</p>
                    </div>
                    <div style="text-align: right;">
                      <svg class="icon-jempol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>
                      <div class="badge-wilayah">${blokNama}</div>
                    </div>
                  </div>
                  <div class="row-data"><div class="lbl">HARI / TANGGAL</div><div class="colon">:</div><div class="val">${formattedDate}</div></div>
                  <div class="row-data"><div class="lbl">HASIL JIMPITAN</div><div class="colon">:</div><div class="val">RP ${totalHasil.toLocaleString('id-ID')}</div></div>
                  <div class="row-data"><div class="lbl">DAWIS</div><div class="colon">:</div><div class="val">${blokNama.toUpperCase()}</div></div>
                  <div class="row-data"><div class="lbl">DAFTAR HADIR</div><div class="colon">:</div><div class="val">${item.daftarHadir || '-'}</div></div>
                  <div class="row-data"><div class="lbl">KONDISI LINGKUNGAN</div><div class="colon">:</div><div class="val">${item.kondisiLingkungan || '-'}</div></div>
                  <div class="ttd-sec">
                    <div class="ttd-box"><div>SIE KEAMANAN & KETERTIBAN</div><div class="ttd-line">( ${item.sieKeamanan || 'LUWARNO'} )</div></div>
                    <div class="ttd-box"><div>A.N PETUGAS JIMPITAN</div><div class="ttd-line">( ${item.petugasJimpitan || '...............'} )</div></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    win.document.write(printHTML);
    win.document.close();
  };

  const handlePrintBukuKasPDF = () => {
    const win = window.open('', '_blank');
    if (!win) return;

    const totalMasuk = transaksiList.filter(t => t.tipe === 'pemasukan').reduce((acc, curr) => acc + curr.jumlah, 0);
    const totalKeluar = transaksiList.filter(t => t.tipe === 'pengeluaran').reduce((acc, curr) => acc + curr.jumlah, 0);
    const saldo = totalMasuk - totalKeluar;

    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Buku Kas & Pengeluaran Jimpitan RT 08 RW 06</title>
          <style>
            @page { size: A4 portrait; margin: 12mm 15mm; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #1e293b; font-size: 11px; }
            .header-sec { text-align: center; border-bottom: 2px solid #0f766e; padding-bottom: 8px; margin-bottom: 12px; }
            .header-sec h1 { font-size: 16px; font-weight: 800; color: #0f766e; margin: 0 0 4px 0; text-transform: uppercase; }
            .header-sec p { font-size: 11px; color: #64748b; margin: 0; font-weight: bold; }
            .summary-cards { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 16px; }
            .card { flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; background: #f8fafc; }
            .card-title { font-size: 10px; text-transform: uppercase; font-weight: bold; color: #64748b; margin-bottom: 4px; }
            .card-val { font-size: 14px; font-weight: 800; }
            .val-masuk { color: #059669; }
            .val-keluar { color: #e11d48; }
            .val-saldo { color: #0f766e; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; }
            th, td { border: 1px solid #cbd5e1; padding: 7px 10px; text-align: left; }
            th { background-color: #0f766e; color: white; text-transform: uppercase; font-size: 10px; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .text-right { text-align: right; }
            .badge-pemasukan { color: #059669; font-weight: bold; }
            .badge-pengeluaran { color: #e11d48; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header-sec">
            <h1>BUKU KAS & PENGELUARAN JIMPITAN</h1>
            <p>RT 08 / RW 06, Karanganyar Gunung, SRG</p>
          </div>
          <div class="summary-cards">
            <div class="card"><div class="card-title">Total Pemasukan</div><div class="card-val val-masuk">Rp ${totalMasuk.toLocaleString('id-ID')}</div></div>
            <div class="card"><div class="card-title">Total Pengeluaran</div><div class="card-val val-keluar">Rp ${totalKeluar.toLocaleString('id-ID')}</div></div>
            <div class="card"><div class="card-title">Saldo Kas Bersih</div><div class="card-val val-saldo">Rp ${saldo.toLocaleString('id-ID')}</div></div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 15%;">Tanggal</th>
                <th style="width: 15%;">Tipe</th>
                <th style="width: 20%;">Kategori</th>
                <th>Keterangan</th>
                <th style="width: 20%; text-align: right;">Nominal (Rp)</th>
              </tr>
            </thead>
            <tbody>
              ${transaksiList.map(t => `
                <tr>
                  <td>${t.tanggal}</td>
                  <td class="${t.tipe === 'pemasukan' ? 'badge-pemasukan' : 'badge-pengeluaran'}">${t.tipe.toUpperCase()}</td>
                  <td>${t.kategori}</td>
                  <td>${t.keterangan}</td>
                  <td class="text-right ${t.tipe === 'pemasukan' ? 'badge-pemasukan' : 'badge-pengeluaran'}">
                    ${t.tipe === 'pemasukan' ? '+' : '-'} Rp ${t.jumlah.toLocaleString('id-ID')}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    win.document.write(printHTML);
    win.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* CSS Animasi Kedip 3 Kali */}
      <style>{`
        @keyframes blink-three-times {
          0%, 100% { opacity: 1; }
          16%, 50%, 83% { opacity: 0.15; }
          33%, 66% { opacity: 1; }
        }
        .animate-blink-3x {
          animation: blink-three-times 1.8s ease-in-out 1;
        }
      `}</style>

      {/* HEADER UTAMA APLIKASI */}
      <header className="bg-emerald-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-700/80 rounded-2xl border border-emerald-600 shadow-inner flex items-center justify-center">
                <ThumbsUp className="w-7 h-7 text-emerald-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-white">JIMPOL</h1>
                  <span className="bg-emerald-700/80 text-emerald-100 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-600">
                    RT 08 / RW 06, Karanganyar Gunung, SRG
                  </span>
                </div>
                <p className="text-xs text-emerald-200 font-medium">Sistem Pencatatan Jimpitan Warga secara Online</p>
              </div>
            </div>

            {/* BARIS KANAN HEADER */}
            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
              <div className="flex items-center gap-3">
                {/* TANGGAL SEKARANG (DIPINDAH KE SEBELAH KIRI JAM) */}
                <div className="bg-emerald-900/60 text-emerald-100 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-700/50 flex items-center gap-2 whitespace-nowrap">
                  <Calendar className="w-4 h-4 text-emerald-300" />
                  <span>{currentDateFormatted}</span>
                </div>

                {/* JAM DIGITAL DINAMIS REALTIME (DIPINDAH KE PALING POJOK KANAN) */}
                <div className="text-amber-300 text-lg sm:text-xl font-black tracking-widest flex items-center gap-1.5 drop-shadow-sm shrink-0">
                  <Clock className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
                  <span>{formattedTimeString}</span>
                </div>

                <button 
                  onClick={handleResetData}
                  title="Reset Semua Data ke Default"
                  className="p-2 hover:bg-emerald-700 text-emerald-200 hover:text-white rounded-xl transition-colors shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* TICKER PETUGAS RONDA BERKEDIP (POSISI DI BAWAH TANGGAL / KOTAK MERAH) */}
              <div className="bg-emerald-950/70 border border-emerald-600/70 rounded-xl px-3.5 py-1.5 flex items-center justify-start gap-2.5 w-full md:w-[360px] shadow-inner overflow-hidden">
                <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <div key={blinkKey} className="animate-blink-3x text-xs min-w-0 text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block leading-tight text-left">
                    {infoPetugasRotasi[petugasShiftIndex].label} ({infoPetugasRotasi[petugasShiftIndex].hari})
                  </span>
                  <span className="font-bold text-white text-xs truncate block text-left">
                    {infoPetugasRotasi[petugasShiftIndex].nama}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MENUS / TAB NAVIGATION */}
          <div className="mt-4 pt-2 border-t border-emerald-700/60 overflow-x-auto">
            <nav className="flex items-center justify-center gap-1.5 min-w-max mx-auto">
              {[
                { id: 'dashboard', label: '', icon: Home, tooltip: 'Dashboard' },
                { id: 'pencatatan', label: 'Penarikan Ronda', icon: Coins },
                { id: 'rekap_database', label: 'Rekap & Laporan', icon: PieChart },
                { id: 'warga', label: 'Data Warga', icon: Users },
                { id: 'laporan', label: 'Kas & Pengeluaran', icon: FileText },
              ].map(tab => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    title={tab.tooltip || tab.label}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-emerald-700 text-white shadow-sm border border-emerald-600' 
                        : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label && <span>{tab.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">

        {/* 1. DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* GRID STATISTIK RINGKAS SEJAJAR (SCAN JIMPOL & 2 KOTAK RINGKAS) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
              
              {/* TOMBOL SCAN JIMPOL IKONIK (SISI KIRI) */}
              <div 
                onClick={() => handleOpenDanaModal()}
                className="bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 rounded-2xl p-5 shadow-lg hover:shadow-sky-500/30 border border-sky-400/50 cursor-pointer transform hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[220px]"
              >
                <div className="absolute -right-4 -bottom-4 bg-white/10 w-28 h-28 rounded-full blur-xl group-hover:scale-150 transition-all pointer-events-none" />
                
                <div className="flex items-center justify-between">
                  <span className="bg-sky-950/40 text-sky-100 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-sky-300/30 tracking-wider uppercase">
                    PEMBAYARAN NON-TUNAI
                  </span>
                  <div className="p-1.5 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform">
                    <Scan className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="my-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    <QrCode className="w-8 h-8 text-sky-200" />
                    SCAN JIMPOL
                  </h3>
                  <p className="text-xs text-sky-100 mt-1 font-medium">
                    Bayar Jimpitan Instan via QRIS DANA RT 086
                  </p>
                </div>

                <div className="pt-2 border-t border-sky-400/30 flex items-center justify-between text-xs font-bold text-white">
                  <span>Klik untuk Scan QR Code</span>
                  <span className="bg-white text-sky-700 px-3 py-1 rounded-lg shadow-sm text-[11px] font-black group-hover:bg-sky-50">
                    SCAN NOW &rarr;
                  </span>
                </div>
              </div>

              {/* DUA KOTAK RINGKAS DI SISI KANAN (MENEMPATI KOTAK MERAH DAN BLUE) */}
              <div className="flex flex-col justify-between gap-4">
                
                {/* KOTAK MERAH: TOTAL KAS JIMPITAN */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex-1 flex flex-col justify-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">TOTAL KAS JIMPITAN</p>
                  <div className="flex items-baseline justify-between mt-1">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
                      Rp {totalKasJimpitan.toLocaleString('id-ID')}
                    </h3>
                    <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                      <TrendingUp className="w-3.5 h-3.5" /> Berjalan Bulanan
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Status Saldo Realtime Kas RT 86</p>
                </div>

                {/* KOTAK BIRU: TERKUMPUL HARI INI */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex-1 flex flex-col justify-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">TERKUMPUL HARI INI</p>
                  <div className="flex items-baseline justify-between mt-1">
                    <h3 className="text-2xl sm:text-3xl font-black text-emerald-600">
                      Rp {totalNominalHariIni.toLocaleString('id-ID')}
                    </h3>
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-lg text-xs">
                      {Math.round((totalSudahBayarHariIni / (wargaList.length || 1)) * 100)}% Terambil
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Terambil: <strong className="text-slate-800">{totalSudahBayarHariIni}</strong> dari {wargaList.length} Rumah</span>
                    <span className="text-emerald-700 font-bold">Hari Ini Active</span>
                  </div>
                </div>

              </div>

            </div>

            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
                  <ShieldCheck className="w-8 h-8 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Penarikan Jimpitan & Non-Tunai DANA</h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Warga dapat membayar jimpitan koin via Transfer QRIS DANA RT 08 / RW 06 Karanganyar Gunung, SRG atau petugas ronda mencatat langsung secara cepat.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenDanaModal()}
                  className="bg-sky-400 hover:bg-sky-300 text-sky-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all whitespace-nowrap"
                >
                  <Scan className="w-4 h-4" /> SCAN JIMPOL
                </button>
                <button
                  onClick={() => setActiveTab('pencatatan')}
                  className="bg-white hover:bg-slate-100 text-emerald-900 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all whitespace-nowrap"
                >
                  Mulai Tarik &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Partisipasi Jimpitan Per Wilayah (Bulan Ini)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Anyelir 1', 'Anyelir 2', 'Bougenville'].map(blokNama => {
                  const wargaBlok = wargaList.filter(w => w.blok === blokNama);
                  const sudah = wargaBlok.filter(w => w.statusHariIni).length;
                  const totalTerkumpulBlok = wargaBlok.reduce((acc, curr) => acc + curr.totalBulanIni, 0);

                  return (
                    <div key={blokNama} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 text-sm">{blokNama}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                          {wargaBlok.length} Rumah
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Terkumpul: <strong className="text-emerald-700">Rp {totalTerkumpulBlok.toLocaleString('id-ID')}</strong>
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Hari Ini: {sudah}/{wargaBlok.length} Rumah</span>
                        <span className="text-emerald-600 font-bold">
                          {Math.round((sudah / (wargaBlok.length || 1)) * 100)}% Terambil
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full" 
                          style={{ width: `${Math.round((sudah / (wargaBlok.length || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. TAB PENCATATAN PENARIKAN RONDA */}
        {activeTab === 'pencatatan' && (
          <div className="space-y-4">
            {/* ACCORDION JADWAL PETUGAS JIMPITAN */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all">
              <div 
                onClick={() => setIsJadwalOpen(!isJadwalOpen)}
                className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center justify-between cursor-pointer hover:bg-emerald-100/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-700 text-white rounded-xl shadow-sm">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-sm">Jadwal Petugas Pengambil Jimpitan (1 Minggu)</h3>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Jam 20.00 WIB
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">3 Petugas per hari • Penarikan serentak pukul 20.00 WIB</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 hidden sm:inline">
                    {isJadwalOpen ? 'Tutup Jadwal' : 'Lihat Jadwal'}
                  </span>
                  {isJadwalOpen ? (
                    <ChevronUp className="w-5 h-5 text-emerald-700" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-emerald-700" />
                  )}
                </div>
              </div>

              {isJadwalOpen && (
                <div className="p-4 border-t border-slate-200 bg-white animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(hari => {
                      const isToday = getTodayDayName() === hari;
                      const petugasList = jadwalPetugas[hari] || [];

                      return (
                        <div 
                          key={hari} 
                          className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                            isToday 
                              ? 'bg-emerald-500/10 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20' 
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-200">
                              <span className={`font-black text-xs ${isToday ? 'text-emerald-700' : 'text-slate-800'}`}>
                                {hari}
                              </span>
                              {isToday && (
                                <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">
                                  HARI INI
                                </span>
                              )}
                            </div>

                            <ul className="space-y-1.5 mb-3">
                              {petugasList.map((nama, idx) => (
                                <li key={idx} className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  <span className="truncate">{nama || '-'}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <button
                            onClick={() => handleOpenEditJadwal(hari)}
                            className="w-full py-1 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                          >
                            <Edit2 className="w-3 h-3 text-amber-600" /> Edit Petugas
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Pencatatan Penarikan Jimpitan</h2>
                <p className="text-xs text-slate-500">Ketik atau ubah isi nominal pada tiap rumah untuk mencatat jimpitan hari ini.</p>
              </div>

              {toastLog && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                  <div className={`transition-all duration-300 transform ${
                    toastLog.visible ? 'opacity-100 scale-100 translate-y-0 shadow-lg' : 'opacity-0 scale-90 translate-y-2'
                  }`}>
                    <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold whitespace-nowrap backdrop-blur-md ${
                      toastLog.type === 'success' ? 'bg-emerald-600/95 text-white border-emerald-500' : 'bg-slate-800/95 text-white border-slate-700'
                    }`}>
                      <CheckCircle2 className={`w-4 h-4 ${toastLog.type === 'success' ? 'text-emerald-200' : 'text-slate-300'}`} />
                      <span>{toastLog.message}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetHariIni}
                  title="Reset Semua Penarikan Hari Ini ke Rp 0"
                  className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all border border-rose-500"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowTopWargaTooltip(!showTopWargaTooltip)}
                    onMouseEnter={() => setShowTopWargaTooltip(true)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all border border-emerald-600"
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-200" />
                    <span>Grafik Jimpitan</span>
                    <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  </button>

                  {showTopWargaTooltip && (
                    <div 
                      onMouseLeave={() => setShowTopWargaTooltip(false)}
                      className="absolute right-0 top-full mt-2 w-72 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-400" />
                          <h4 className="font-bold text-xs text-slate-100 uppercase tracking-wider">Peringkat Wilayah Jimpitan</h4>
                        </div>
                        <button onClick={() => setShowTopWargaTooltip(false)} className="text-slate-400 hover:text-white font-bold text-xs">
                          ✕
                        </button>
                      </div>

                      <div className="space-y-2">
                        {rankingWilayah.map((item, index) => {
                          const rankColors = [
                            'bg-amber-500/10 border-amber-500/30 text-amber-300',
                            'bg-slate-400/10 border-slate-400/30 text-slate-300',
                            'bg-amber-700/10 border-amber-700/30 text-amber-500'
                          ];
                          const badges = ['🥇', '🥈', '🥉'];
                          return (
                            <div key={item.wilayah} className={`p-2.5 rounded-xl border flex items-center justify-between ${rankColors[index] || 'bg-slate-800 border-slate-700'}`}>
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-base">{badges[index] || `#${index+1}`}</span>
                                <div className="truncate">
                                  <p className="text-xs font-extrabold truncate text-slate-100">{item.wilayah}</p>
                                  <p className="text-[10px] text-slate-400 font-semibold">{item.jumlahRumah} Rumah • Hari ini: {item.sudahBayarToday}/{item.jumlahRumah}</p>
                                </div>
                              </div>
                              <span className="text-xs font-black text-emerald-400 ml-2 whitespace-nowrap">
                                Rp {item.totalNominal.toLocaleString('id-ID')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Cari nama warga atau no rumah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedBlok}
                  onChange={(e) => setSelectedBlok(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl focus:outline-none"
                >
                  <option value="Semua">Semua Wilayah</option>
                  <option value="Anyelir 1">Anyelir 1</option>
                  <option value="Anyelir 2">Anyelir 2</option>
                  <option value="Bougenville">Bougenville</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl focus:outline-none"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Sudah">Sudah Ditarik</option>
                  <option value="Belum">Belum Ditarik</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredWarga.map(warga => (
                <div 
                  key={warga.id} 
                  className={`p-4 rounded-2xl border transition-all ${
                    warga.statusHariIni ? 'bg-emerald-50/50 border-emerald-200 shadow-sm' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                      {warga.noRumah}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{warga.blok}</span>
                  </div>

                  <h4 className="font-bold text-slate-800 text-sm mt-2 line-clamp-1">{warga.nama}</h4>
                  
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 gap-2">
                    <div className="flex-1">
                      <span className="text-[10px] text-slate-400 block font-medium mb-0.5">Hari Ini (Rp):</span>
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus-within:border-emerald-500 focus-within:bg-white">
                        <span className="text-xs font-bold text-slate-400">Rp</span>
                        <input
                          type="number"
                          value={warga.nominalHariIni || ''}
                          placeholder="0"
                          onChange={(e) => handleNominalChange(warga.id, e.target.value)}
                          className="w-full bg-transparent text-xs font-black text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleJimpitan(warga.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-end ${
                        warga.statusHariIni ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {warga.statusHariIni ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ditarik
                        </>
                      ) : (
                        'Tarik'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. TAB REKAP & LAPORAN DATABASE HISTORI */}
        {activeTab === 'rekap_database' && (
          <div className="space-y-4">
            
            {/* SUB MENU NAVIGATION IN REKAP & LAPORAN */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 flex items-center gap-2">
              <button
                onClick={() => setRekapSubTab('histori')}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  rekapSubTab === 'histori'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <PieChart className="w-4 h-4" />
                Histori & Rekap Penarikan
              </button>
              <button
                onClick={() => setRekapSubTab('form_cetak')}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  rekapSubTab === 'form_cetak'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Form Laporan Cetak (3 Wilayah)
              </button>
            </div>

            {/* CONTENT SUB-TAB 1: HISTORI & REKAP DATABASE */}
            {rekapSubTab === 'histori' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-emerald-600" />
                      Rekap & Laporan Database Histori Penarikan
                    </h2>
                    <p className="text-xs text-slate-500">Laporan histori penarikan jimpitan harian, mingguan, maupun bulanan yang tersimpan di database.</p>
                  </div>

                  <button
                    onClick={handlePrintRekapPDF}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Download className="w-4 h-4" /> Unduh Laporan Rekap (.pdf)
                  </button>
                </div>

                {/* Filter Periode Rekap */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Filter className="w-4 h-4 text-emerald-600" /> Periode Laporan:
                    </span>
                    {[
                      { id: 'hari_ini', label: 'Hari Ini' },
                      { id: 'minggu_ini', label: 'Minggu Ini' },
                      { id: 'bulan_ini', label: 'Bulan Ini' },
                      { id: 'custom', label: 'Custom Rentang' },
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => setRekapPeriod(p.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          rekapPeriod === p.id 
                            ? 'bg-emerald-700 text-white shadow-sm' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {rekapPeriod === 'custom' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={rekapStartDate}
                        onChange={(e) => setRekapStartDate(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none"
                      />
                      <span className="text-xs text-slate-400 font-bold">s/d</span>
                      <input
                        type="date"
                        value={rekapEndDate}
                        onChange={(e) => setRekapEndDate(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Stat Ringkasan Rekap */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase">Total Transaksi Terverifikasi</p>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">
                      {filteredRekapLogs.length} Penarikan
                    </h3>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase">Total Nominal Terkumpul</p>
                    <h3 className="text-2xl font-black text-emerald-600 mt-1">
                      Rp {totalRekapNominal.toLocaleString('id-ID')}
                    </h3>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase">Rata-Rata Nominal Per Rumah</p>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">
                      Rp {filteredRekapLogs.length > 0 ? Math.round(totalRekapNominal / filteredRekapLogs.length).toLocaleString('id-ID') : 0}
                    </h3>
                  </div>
                </div>

                {/* Tabel Histori Penarikan */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm">Histori Catatan Transaksi Jimpitan</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5">TANGGAL</th>
                          <th className="p-3.5">NO. RUMAH</th>
                          <th className="p-3.5">NAMA WARGA</th>
                          <th className="p-3.5">WILAYAH / BLOK</th>
                          <th className="p-3.5 text-right">NOMINAL (RP)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {filteredRekapLogs.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="p-8 text-center text-slate-400 font-bold">
                              Belum ada catatan histori penarikan jimpitan pada periode ini.
                            </td>
                          </tr>
                        ) : (
                          filteredRekapLogs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50">
                              <td className="p-3.5 font-semibold text-slate-500">{log.tanggal}</td>
                              <td className="p-3.5 font-bold text-slate-800">{log.noRumah}</td>
                              <td className="p-3.5 font-semibold text-slate-900">{log.nama}</td>
                              <td className="p-3.5">
                                <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg">
                                  {log.blok}
                                </span>
                              </td>
                              <td className="p-3.5 text-right font-black text-emerald-700">
                                Rp {log.nominal.toLocaleString('id-ID')}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* CONTENT SUB-TAB 2: FORM LAPORAN CETAK FISIK */}
            {rekapSubTab === 'form_cetak' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Form Laporan Jimpitan Ronda (3 Wilayah)</h2>
                    <p className="text-xs text-slate-500">Menampilkan Form Laporan Cetak Fisik untuk Anyelir 1, Anyelir 2, dan Bougenville (RT 08 / RW 06).</p>
                  </div>

                  <button
                    onClick={handlePrintFormLaporanPDF}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Download className="w-4 h-4" /> Unduh Laporan
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-700">Pilih Tanggal Ronda:</span>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 px-3 py-1.5 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => changeSelectedDateByDays(-1)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                    >
                      &lt; Kemarin
                    </button>
                    <button
                      onClick={setTodaySelectedDate}
                      className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition-all"
                    >
                      Hari Ini
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {['Anyelir 1', 'Anyelir 2', 'Bougenville'].map((blokNama, idx) => {
                    const item = currentFormLaporan[blokNama];
                    const totalHasil = hitungHasilWilayah(blokNama);

                    return (
                      <div key={blokNama} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-300 relative">
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200 absolute top-4 left-6">
                          FORM #{idx + 1}
                        </span>

                        <div className="flex justify-between items-start border-b border-slate-300 pb-3 mb-4 mt-4">
                          <div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">FORM LAPORAN JIMPOL</h3>
                            <p className="text-xs font-bold text-slate-500">RT 08 / RW 06</p>
                          </div>
                          <div className="text-right">
                            <ThumbsUp className="w-7 h-7 text-emerald-600 mb-1 ml-auto" />
                            <span className="text-xs font-black bg-slate-100 border border-slate-300 text-slate-800 px-3 py-1 rounded-lg">
                              {blokNama.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 text-xs font-bold text-slate-700">
                          <div className="grid grid-cols-12 items-center">
                            <span className="col-span-4 sm:col-span-3 uppercase">HARI / TANGGAL</span>
                            <span className="col-span-1">:</span>
                            <span className="col-span-7 sm:col-span-8 text-slate-900">{formatDateToLaporan(selectedDate)}</span>
                          </div>

                          <div className="grid grid-cols-12 items-center">
                            <span className="col-span-4 sm:col-span-3 uppercase">HASIL JIMPITAN</span>
                            <span className="col-span-1">:</span>
                            <span className="col-span-7 sm:col-span-8 text-emerald-700 font-extrabold">
                              RP {totalHasil.toLocaleString('id-ID')}
                            </span>
                          </div>

                          <div className="grid grid-cols-12 items-center">
                            <span className="col-span-4 sm:col-span-3 uppercase">DAWIS</span>
                            <span className="col-span-1">:</span>
                            <span className="col-span-7 sm:col-span-8 uppercase text-slate-900">{blokNama}</span>
                          </div>

                          <div className="grid grid-cols-12 items-center">
                            <span className="col-span-4 sm:col-span-3 uppercase">DAFTAR HADIR</span>
                            <span className="col-span-1">:</span>
                            <input
                              type="text"
                              placeholder="Ketik nama-nama petugas yang hadir..."
                              value={item.daftarHadir}
                              onChange={(e) => handleUpdateLaporanField(blokNama, 'daftarHadir', e.target.value)}
                              className="col-span-7 sm:col-span-8 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div className="grid grid-cols-12 items-center">
                            <span className="col-span-4 sm:col-span-3 uppercase">KONDISI LINGKUNGAN</span>
                            <span className="col-span-1">:</span>
                            <input
                              type="text"
                              placeholder="Aman / Kondusif / Hujan..."
                              value={item.kondisiLingkungan}
                              onChange={(e) => handleUpdateLaporanField(blokNama, 'kondisiLingkungan', e.target.value)}
                              className="col-span-7 sm:col-span-8 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <div className="mt-8 pt-4 flex justify-between items-center text-center text-[11px] font-bold text-slate-700">
                          <div>
                            <p className="uppercase">SIE KEAMANAN & KETERTIBAN</p>
                            <input
                              type="text"
                              value={item.sieKeamanan}
                              onChange={(e) => handleUpdateLaporanField(blokNama, 'sieKeamanan', e.target.value)}
                              className="mt-6 text-center border-b border-slate-400 bg-transparent text-xs font-bold focus:outline-none focus:border-emerald-600 px-2"
                            />
                          </div>

                          <div>
                            <p className="uppercase">A.N PETUGAS JIMPITAN</p>
                            <input
                              type="text"
                              placeholder="( Nama Petugas )"
                              value={item.petugasJimpitan}
                              onChange={(e) => handleUpdateLaporanField(blokNama, 'petugasJimpitan', e.target.value)}
                              className="mt-6 text-center border-b border-slate-400 bg-transparent text-xs font-bold focus:outline-none focus:border-emerald-600 px-2"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* 5. DATA WARGA TAB */}
        {activeTab === 'warga' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Master Data Warga RT 86</h2>
                <p className="text-xs text-slate-500">Kelola informasi pemilik rumah dan riwayat kontribusi jimpitan.</p>
              </div>

              <button
                onClick={() => handleOpenAddWargaWithBlok('Anyelir 1')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <UserPlus className="w-4 h-4" /> Tambah Warga Baru
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">NO. RUMAH</th>
                      <th className="p-3.5">NAMA PEMILIK</th>
                      <th className="p-3.5">WILAYAH / BLOK</th>
                      <th className="p-3.5">STATUS HARI INI</th>
                      <th className="p-3.5">TOTAL BULAN INI</th>
                      <th className="p-3.5 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {wargaList.map(warga => (
                      <tr key={warga.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-800">{warga.noRumah}</td>
                        <td className="p-3.5 font-semibold text-slate-900">{warga.nama}</td>
                        <td className="p-3.5">
                          <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg">
                            {warga.blok}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {warga.statusHariIni ? (
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                              Lunas (Rp {warga.nominalHariIni.toLocaleString('id-ID')})
                            </span>
                          ) : (
                            <span className="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                              Belum Ditarik
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 font-bold text-emerald-700">
                          Rp {warga.totalBulanIni.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditWarga(warga)}
                              className="p-1.5 hover:bg-slate-100 text-amber-600 rounded-lg transition-colors"
                              title="Edit Data Warga"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(warga)}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                              title="Hapus Data Warga"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. TAB KAS & PENGELUARAN */}
        {activeTab === 'laporan' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">Total Pemasukan Kas</p>
                <h3 className="text-xl font-black text-emerald-600 mt-1">
                  Rp {transaksiList.filter(t => t.tipe === 'pemasukan').reduce((acc, curr) => acc + curr.jumlah, 0).toLocaleString('id-ID')}
                </h3>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">Total Pengeluaran Kas</p>
                <h3 className="text-xl font-black text-rose-600 mt-1">
                  Rp {transaksiList.filter(t => t.tipe === 'pengeluaran').reduce((acc, curr) => acc + curr.jumlah, 0).toLocaleString('id-ID')}
                </h3>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">Saldo Kas Bersih</p>
                <h3 className="text-xl font-black text-slate-800 mt-1">
                  Rp {totalKasJimpitan.toLocaleString('id-ID')}
                </h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 text-sm mb-3">Catat Transaksi Kas</h3>
              <form onSubmit={handleAddTransaksi} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="date"
                  value={newTrans.tanggal}
                  onChange={(e) => setNewTrans({ ...newTrans, tanggal: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
                />
                <select
                  value={newTrans.tipe}
                  onChange={(e) => setNewTrans({ ...newTrans, tipe: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl focus:outline-none"
                >
                  <option value="pengeluaran">Pengeluaran (-)</option>
                  <option value="pemasukan">Pemasukan (+)</option>
                </select>

                <input
                  type="text"
                  placeholder="Kategori"
                  value={newTrans.kategori}
                  onChange={(e) => setNewTrans({ ...newTrans, kategori: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 placeholder:text-slate-400 placeholder:font-normal"
                />

                <input
                  type="text"
                  placeholder="Keterangan transaksi..."
                  value={newTrans.keterangan}
                  onChange={(e) => setNewTrans({ ...newTrans, keterangan: e.target.value })}
                  className="flex-1 bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
                />

                <input
                  type="number"
                  placeholder="Jumlah (Rp)..."
                  value={newTrans.jumlah}
                  onChange={(e) => setNewTrans({ ...newTrans, jumlah: e.target.value })}
                  className="w-36 bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
                />

                <button
                  type="submit"
                  title="Simpan Transaksi Kas"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">Buku Kas & Pengeluaran Jimpitan</h3>
                <button
                  onClick={handlePrintBukuKasPDF}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh Buku Kas (.pdf)
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">TANGGAL</th>
                      <th className="p-3.5">TIPE</th>
                      <th className="p-3.5">KATEGORI</th>
                      <th className="p-3.5">KETERANGAN</th>
                      <th className="p-3.5 text-right">NOMINAL (RP)</th>
                      <th className="p-3.5 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {transaksiList.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-3.5 text-slate-500 font-semibold">{item.tanggal}</td>
                        <td className="p-3.5">
                          <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] uppercase ${
                            item.tipe === 'pemasukan' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {item.tipe}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-800">{item.kategori}</td>
                        <td className="p-3.5 text-slate-600">{item.keterangan}</td>
                        <td className={`p-3.5 text-right font-bold ${
                          item.tipe === 'pemasukan' ? 'text-emerald-700' : 'text-rose-600'
                        }`}>
                          {item.tipe === 'pemasukan' ? '+' : '-'} Rp {item.jumlah.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEditTransaksi(item)}
                              className="p-1 hover:bg-slate-100 text-amber-600 rounded-md transition-colors"
                              title="Edit Transaksi"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteTransaksi(item)}
                              className="p-1 hover:bg-rose-50 text-rose-600 rounded-md transition-colors"
                              title="Hapus Transaksi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL EDIT JADWAL PETUGAS */}
      {showEditJadwalModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Edit Petugas ({selectedDayToEdit})</h3>
              <span className="text-xs text-slate-500 font-bold">Jam 20.00 WIB</span>
            </div>
            
            <form onSubmit={handleSaveEditJadwal} className="space-y-3">
              {[0, 1, 2].map(index => (
                <div key={index}>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Petugas Ke-{index + 1}</label>
                  <input
                    type="text"
                    value={editPetugasForm[index] || ''}
                    onChange={(e) => {
                      const updated = [...editPetugasForm];
                      updated[index] = e.target.value;
                      setEditPetugasForm(updated);
                    }}
                    placeholder={`Nama Petugas ${index + 1}...`}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              ))}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditJadwalModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT WARGA */}
      {showEditWargaModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-100">
            <h3 className="font-bold text-slate-800 text-base mb-3">Edit Data Warga</h3>
            <form onSubmit={handleSaveEditWarga} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nama Pemilik Rumah</label>
                <input
                  type="text"
                  value={editWargaData.nama}
                  onChange={(e) => setEditWargaData({ ...editWargaData, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nomor Rumah</label>
                <input
                  type="text"
                  value={editWargaData.noRumah}
                  onChange={(e) => setEditWargaData({ ...editWargaData, noRumah: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Wilayah / Blok</label>
                <select
                  value={editWargaData.blok}
                  onChange={(e) => setEditWargaData({ ...editWargaData, blok: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="Anyelir 1">Anyelir 1</option>
                  <option value="Anyelir 2">Anyelir 2</option>
                  <option value="Bougenville">Bougenville</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditWargaModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS WARGA */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-100 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Hapus Data Warga?</h3>
            <p className="text-xs text-slate-500 mb-4">
              Apakah Anda yakin ingin menghapus data <strong>{wargaToDelete?.nama}</strong> ({wargaToDelete?.noRumah})?
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteWarga}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH WARGA */}
      {showAddWargaModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-100">
            <h3 className="font-bold text-slate-800 text-base mb-3">Tambah Warga Baru</h3>
            <form onSubmit={handleAddWarga} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nama Pemilik Rumah</label>
                <input
                  type="text"
                  placeholder="Contoh: Bpk. Bambang"
                  value={newWarga.nama}
                  onChange={(e) => setNewWarga({ ...newWarga, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nomor Rumah</label>
                <input
                  type="text"
                  placeholder="Contoh: A-04"
                  value={newWarga.noRumah}
                  onChange={(e) => setNewWarga({ ...newWarga, noRumah: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Wilayah / Blok</label>
                <select
                  value={newWarga.blok}
                  onChange={(e) => setNewWarga({ ...newWarga, blok: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="Anyelir 1">Anyelir 1</option>
                  <option value="Anyelir 2">Anyelir 2</option>
                  <option value="Bougenville">Bougenville</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWargaModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT TRANSAKSI KAS */}
      {showEditTransModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-100">
            <h3 className="font-bold text-slate-800 text-base mb-3">Edit Transaksi Kas</h3>
            <form onSubmit={handleSaveEditTransaksi} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Tanggal Transaksi</label>
                <input
                  type="date"
                  value={editTransData.tanggal}
                  onChange={(e) => setEditTransData({ ...editTransData, tanggal: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Tipe Transaksi</label>
                <select
                  value={editTransData.tipe}
                  onChange={(e) => setEditTransData({ ...editTransData, tipe: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="pengeluaran">Pengeluaran (-)</option>
                  <option value="pemasukan">Pemasukan (+)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Kategori</label>
                <input
                  type="text"
                  value={editTransData.kategori}
                  onChange={(e) => setEditTransData({ ...editTransData, kategori: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Keterangan</label>
                <input
                  type="text"
                  value={editTransData.keterangan}
                  onChange={(e) => setEditTransData({ ...editTransData, keterangan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Jumlah Nominal (Rp)</label>
                <input
                  type="number"
                  value={editTransData.jumlah}
                  onChange={(e) => setEditTransData({ ...editTransData, jumlah: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditTransModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS TRANSAKSI KAS */}
      {showDeleteTransModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-100 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Hapus Transaksi?</h3>
            <p className="text-xs text-slate-500 mb-4">
              Apakah Anda yakin transaksi "<strong>{transToDelete?.keterangan}</strong>" sebesar Rp {transToDelete?.jumlah?.toLocaleString('id-ID')} ini akan dihapus?
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setShowDeleteTransModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Tidak
              </button>
              <button
                onClick={handleConfirmDeleteTransaksi}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SCAN QRIS DANA */}
      {showQrisModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-100 text-center">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold bg-sky-100 text-sky-800 px-2.5 py-1 rounded-lg">
                QRIS DANA RT 086
              </span>
              <button onClick={() => setShowQrisModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-3">
              <div className="w-44 h-44 bg-white p-2 rounded-lg mx-auto shadow-inner flex items-center justify-center border border-slate-200 relative">
                {isScanning ? (
                  <div className="absolute inset-0 bg-sky-900/20 rounded-lg flex items-center justify-center">
                    <div className="w-full h-1 bg-sky-400 animate-pulse shadow-lg" />
                  </div>
                ) : scanSuccess ? (
                  <div className="text-emerald-600 flex flex-col items-center">
                    <CheckCircle2 className="w-12 h-12 mb-1" />
                    <span className="text-xs font-bold">Terverifikasi!</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <QrCode className="w-32 h-32 text-slate-800 mx-auto" />
                    <span className="text-[10px] text-slate-400 font-bold block mt-1">DANA MERCHANTS RT 86</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-left mb-4">
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Nominal Pembayaran (Rp)</label>
              <input
                type="number"
                value={danaAmount}
                onChange={(e) => setDanaAmount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              {!scanSuccess ? (
                <button
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Scan className="w-4 h-4" /> {isScanning ? 'Memindai Kode QR...' : 'Simulasi Scan QRIS DANA'}
                </button>
              ) : (
                <button
                  onClick={handleConfirmDanaPayment}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  Konfirmasi Pemasukan DANA
                </button>
              )}

              <button
                onClick={() => window.open("https://www.dana.id/", '_blank')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5 text-sky-600" /> Buka Aplikasi DANA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
