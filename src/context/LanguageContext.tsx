
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Available languages
export type Language = 'en' | 'ms' | 'zh' | 'ko';

// Language context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Translation data for each language
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Dashboard
    'dashboard': 'Dashboard',
    'english': 'English',
    'mathematics': 'Mathematics',
    'science': 'Science',
    'history': 'History',
    'bahasa': 'Bahasa Malaysia',
    'mandarin': 'Mandarin',
    'notes': 'Study Notes',
    'cefr_lms': 'CEFR Learning Management System',
    'track_progress': 'Track your progress towards C1 certification',
    'track_progress_in': 'Track your progress in',
    'take_assessment': 'Take Assessment Test',
    'your_cefr_level': 'Your CEFR Level Progress',
    'your_skill_level': 'Your Skill Level Progress',
    'your_standing': 'Your current standing across',
    'skills': 'skills',
    'to_c1': 'to C1',
    'proficiency': 'proficiency',
    'available_tests': 'Available Tests',
    'recent_results': 'Recent Results',
    'recommendations': 'Recommendations',
    'minutes': 'minutes',
    'start_test': 'Start Test',
    'completed_on': 'Completed on',
    'view_details': 'View Details',
    'view_resources': 'View Resources',
    // User profile
    'user_profile': 'User profile',
  },
  ms: {
    // Dashboard
    'dashboard': 'Papan Pemuka',
    'english': 'Bahasa Inggeris',
    'mathematics': 'Matematik',
    'science': 'Sains',
    'history': 'Sejarah',
    'bahasa': 'Bahasa Malaysia',
    'mandarin': 'Bahasa Mandarin',
    'notes': 'Nota Pembelajaran',
    'cefr_lms': 'Sistem Pengurusan Pembelajaran CEFR',
    'track_progress': 'Jejaki kemajuan anda ke arah sijil C1',
    'track_progress_in': 'Jejaki kemajuan anda dalam',
    'take_assessment': 'Ambil Ujian Penilaian',
    'your_cefr_level': 'Kemajuan Tahap CEFR Anda',
    'your_skill_level': 'Kemajuan Tahap Kemahiran Anda',
    'your_standing': 'Kedudukan semasa anda dalam kemahiran',
    'skills': 'kemahiran',
    'to_c1': 'ke C1',
    'proficiency': 'kemahiran',
    'available_tests': 'Ujian Tersedia',
    'recent_results': 'Keputusan Terkini',
    'recommendations': 'Cadangan',
    'minutes': 'minit',
    'start_test': 'Mula Ujian',
    'completed_on': 'Selesai pada',
    'view_details': 'Lihat Butiran',
    'view_resources': 'Lihat Sumber',
    // User profile
    'user_profile': 'Profil pengguna',
  },
  zh: {
    // Dashboard
    'dashboard': '仪表板',
    'english': '英语',
    'mathematics': '数学',
    'science': '科学',
    'history': '历史',
    'bahasa': '马来语',
    'mandarin': '中文',
    'notes': '学习笔记',
    'cefr_lms': 'CEFR学习管理系统',
    'track_progress': '追踪您获取C1认证的进度',
    'track_progress_in': '跟踪您在以下方面的进展',
    'take_assessment': '参加评估测试',
    'your_cefr_level': '您的CEFR水平进度',
    'your_skill_level': '您的技能水平进度',
    'your_standing': '您在以下技能中的当前表现',
    'skills': '技能',
    'to_c1': '距C1',
    'proficiency': '熟练度',
    'available_tests': '可用测试',
    'recent_results': '近期结果',
    'recommendations': '建议',
    'minutes': '分钟',
    'start_test': '开始测试',
    'completed_on': '完成于',
    'view_details': '查看详情',
    'view_resources': '查看资源',
    // User profile
    'user_profile': '用户资料',
  },
  ko: {
    // Dashboard
    'dashboard': '대시보드',
    'english': '영어',
    'mathematics': '수학',
    'science': '과학',
    'history': '역사',
    'bahasa': '말레이어',
    'mandarin': '중국어',
    'notes': '학습 노트',
    'cefr_lms': 'CEFR 학습 관리 시스템',
    'track_progress': 'C1 인증을 향한 진행 상황 추적',
    'track_progress_in': '다음 분야의 진행 상황 추적',
    'take_assessment': '평가 테스트 시작',
    'your_cefr_level': '귀하의 CEFR 레벨 진행 상황',
    'your_skill_level': '귀하의 기술 수준 진행 상황',
    'skills': '기술',
    'your_standing': '다음 기술의 현재 상태',
    'to_c1': 'C1까지',
    'proficiency': '능숙도',
    'available_tests': '이용 가능한 테스트',
    'recent_results': '최근 결과',
    'recommendations': '추천',
    'minutes': '분',
    'start_test': '테스트 시작',
    'completed_on': '완료일',
    'view_details': '자세히 보기',
    'view_resources': '자료 보기',
    // User profile
    'user_profile': '사용자 프로필',
  }
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get stored language or default to English
  const [language, setLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    return storedLanguage && ['en', 'ms', 'zh', 'ko'].includes(storedLanguage) 
      ? storedLanguage 
      : 'en';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update document language for accessibility
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using the language context
export const useLanguage = () => useContext(LanguageContext);
