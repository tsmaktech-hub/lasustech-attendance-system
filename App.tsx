
import React, { useState, useEffect, useRef } from 'react';
import { AppState, User, College, Department, Course, Student } from './types.ts';
import { COLLEGES } from './constants.ts';
import { generateStudents, generateCoursesForLevel, getAttendance, saveAttendance } from './services/dataService.ts';

// Standard University Logo Icon (SVG)
const UniversityIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Navigation stack
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Local transient states for forms
  const [username, setUsername] = useState(''); // This represents the Course Code
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [attendanceData, setAttendanceData] = useState<any>(getAttendance());

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inactivity Timeout Logic (1 minute)
  useEffect(() => {
    const INACTIVITY_LIMIT = 60 * 1000; // 1 minute in milliseconds

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (currentUser) {
        timeoutRef.current = setTimeout(() => {
          performLogout();
          alert("Session expired due to 1 minute of inactivity.");
        }, INACTIVITY_LIMIT);
      }
    };

    if (currentUser) {
      resetTimer();
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      events.forEach(event => document.addEventListener(event, resetTimer));
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        events.forEach(event => document.removeEventListener(event, resetTimer));
      };
    }
  }, [currentUser]);

  const handleSignup = () => {
    if (!username || !password || !fullName) {
      alert("Registration incomplete. Please provide your Full Name, the Course Code you are lecturing, and a Security Key.");
      return;
    }
    const user: User = { username: username.toUpperCase().trim(), fullName, password };
    localStorage.setItem('lasustech_user', JSON.stringify(user));
    setCurrentUser(user);
    setAppState(AppState.COLLEGES);
  };

  const handleLogin = () => {
    const stored = localStorage.getItem('lasustech_user');
    if (stored) {
      const user: User = JSON.parse(stored);
      if (user.username.toUpperCase().trim() === username.toUpperCase().trim() && user.password === password) {
        setCurrentUser(user);
        setAppState(AppState.COLLEGES);
      } else {
        alert("Authentication failed. Check the Course Code and Security Key.");
      }
    } else {
      alert("No registry found for this Course Code. Please use the Registration option.");
    }
  };

  const performLogout = () => {
    setCurrentUser(null);
    setAppState(AppState.LOGIN);
    setUsername('');
    setPassword('');
    setFullName('');
    setShowLogoutConfirm(false);
  };

  const goBack = () => {
    if (appState === AppState.ATTENDANCE) setAppState(AppState.COURSES);
    else if (appState === AppState.COURSES) setAppState(AppState.LEVELS);
    else if (appState === AppState.LEVELS) setAppState(AppState.DEPARTMENTS);
    else if (appState === AppState.DEPARTMENTS) setAppState(AppState.COLLEGES);
  };

  const renderHeader = () => (
    <nav className="bg-white shadow-lg border-b-4 border-[#0084CA] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-[#0084CA] p-2 rounded-xl text-white shadow-md">
          <UniversityIcon className="h-8 w-8" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-xl font-black text-[#003d5b] leading-tight">LASUSTECH</h1>
          <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em]">Excellence for Learning and Service</p>
        </div>
      </div>
      {currentUser && (
        <div className="flex items-center gap-4">
          <div className="text-right flex flex-col items-end">
            <span className="block text-[10px] font-black text-[#0084CA] uppercase tracking-widest leading-none mb-1">
              Lecturer Session: {currentUser.username}
            </span>
            <span className="text-sm font-black text-[#003d5b]">{currentUser.fullName}</span>
          </div>
          <button 
            onClick={() => setShowLogoutConfirm(true)} 
            className="p-2.5 bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"
            title="End Session"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </nav>
  );

  const renderFooter = () => (
    <footer className="mt-auto py-10 px-8 text-center border-t border-gray-200 bg-[#f9fbff]">
      <div className="flex justify-center gap-4 mb-6">
        <div className="w-8 h-1.5 bg-red-600 rounded-full"></div>
        <div className="w-8 h-1.5 bg-amber-400 rounded-full"></div>
        <div className="w-8 h-1.5 bg-blue-500 rounded-full"></div>
        <div className="w-8 h-1.5 bg-green-600 rounded-full"></div>
      </div>
      <div className="max-w-3xl mx-auto space-y-3 px-4 sm:px-0">
        <p className="text-[#003d5b] text-xs font-black uppercase tracking-[0.25em] leading-relaxed">
          Lagos State University of Science and Technology
        </p>
        <p className="text-sky-600 text-[10px] font-bold uppercase tracking-widest">
          Ikorodu, Lagos State, Nigeria
        </p>
        <p className="text-gray-400 text-[10px] italic pt-2">
          &copy; 2026 • Academic Registry Division • Digital Attendance System v2.1
        </p>
      </div>
    </footer>
  );

  const renderLogoutModal = () => (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#003d5b]/60 backdrop-blur-md transition-opacity duration-300 ${showLogoutConfirm ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white rounded-[3rem] shadow-2xl max-w-sm w-full p-10 border-t-[12px] border-amber-400 transform transition-all duration-300 ${showLogoutConfirm ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8 text-red-600 ring-8 ring-red-50/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-[#003d5b] mb-3">End Session?</h3>
          <p className="text-gray-500 font-semibold text-sm leading-relaxed mb-10">
            Confirming this will end your current lecturer session for <span className="text-sky-600 font-black">{currentUser?.username}</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button 
              onClick={() => setShowLogoutConfirm(false)}
              className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              onClick={performLogout}
              className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-xl shadow-red-100"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (appState === AppState.LOGIN || appState === AppState.SIGNUP) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f0f4f8]">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl w-full max-w-md border-2 border-sky-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full flex h-2.5">
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-amber-400"></div>
              <div className="flex-1 bg-[#0084CA]"></div>
              <div className="flex-1 bg-green-600"></div>
            </div>
            
            <div className="absolute -right-20 -bottom-20 opacity-[0.05] pointer-events-none text-[#003d5b]">
              <UniversityIcon className="h-80 w-80" />
            </div>

            <div className="flex flex-col items-center mb-6 sm:mb-12">
              <div className="bg-[#0084CA] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] mb-4 sm:mb-6 shadow-xl ring-4 sm:ring-8 ring-sky-50 text-white">
                {appState === AppState.LOGIN ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-16 sm:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.39.675 3 1.7m-3 9V3c0-1.105.895-2 2-2s2 .895 2 2v10c0 1.105-.895 2-2 2s-2-.895-2-2z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-16 sm:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#003d5b] tracking-tight text-center">Faculty Entrance</h2>
              <p className="text-amber-600 text-[10px] sm:text-xs font-black uppercase tracking-widest mt-1 sm:mt-2 italic">Attendance portal v2.1</p>
            </div>
            
            <div className="space-y-4 sm:space-y-6 relative z-10">
              {appState === AppState.SIGNUP && (
                <div className="group">
                  <label className="block text-[10px] font-black text-[#003d5b] uppercase tracking-widest mb-1 sm:mb-2 ml-1">Lecturer's Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4.5 rounded-[1.2rem] sm:rounded-[1.5rem] border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#0084CA] focus:ring-4 sm:ring-8 focus:ring-sky-50 outline-none transition-all font-bold text-[#003d5b]"
                      placeholder="e.g. Prof. Adebisi Folu"
                    />
                  </div>
                </div>
              )}
              <div className="group">
                <label className="block text-[10px] font-black text-[#003d5b] uppercase tracking-widest mb-1 sm:mb-2 ml-1">Assigned Course Code</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 font-black">#</span>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 sm:py-4.5 rounded-[1.2rem] sm:rounded-[1.5rem] border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#0084CA] focus:ring-4 sm:ring-8 focus:ring-sky-50 outline-none transition-all font-bold text-[#003d5b] uppercase"
                    placeholder="MTH201"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#003d5b] uppercase tracking-widest mb-1 sm:mb-2 ml-1">Security Key</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 sm:py-4.5 rounded-[1.2rem] sm:rounded-[1.5rem] border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#0084CA] focus:ring-4 sm:ring-8 focus:ring-sky-50 outline-none transition-all font-bold text-[#003d5b]"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button 
                onClick={appState === AppState.LOGIN ? handleLogin : handleSignup}
                className="w-full py-4 sm:py-5 bg-[#0084CA] text-white rounded-[1.2rem] sm:rounded-[1.5rem] font-black hover:bg-[#0073af] transition-all transform active:scale-95 shadow-2xl shadow-sky-200 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs sm:text-sm mt-4 border-b-4 border-[#005a8a]"
              >
                {appState === AppState.LOGIN ? "Authorize Access" : "Create New Registry"}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="text-center mt-6 sm:mt-10">
                <button 
                  onClick={() => {
                    setAppState(appState === AppState.LOGIN ? AppState.SIGNUP : AppState.LOGIN);
                    setUsername('');
                    setPassword('');
                    setFullName('');
                  }}
                  className="text-[10px] sm:text-xs text-[#0084CA] hover:text-amber-600 font-black transition uppercase tracking-widest border-b border-transparent hover:border-amber-600 pb-0.5"
                >
                  {appState === AppState.LOGIN ? "Register New Course Session" : "Return to Login Page"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {renderFooter()}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      {renderHeader()}
      {renderLogoutModal()}
      
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-l-[10px] border-amber-400 pl-8 py-4 bg-sky-50/20 rounded-r-[2rem]">
          <div>
            <div className="flex items-center gap-4 mb-4">
               {appState !== AppState.COLLEGES && (
                <button onClick={goBack} className="p-3 bg-white border border-sky-100 rounded-full text-[#0084CA] hover:bg-[#0084CA] hover:text-white transition-all shadow-md active:scale-90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              <span className="text-xs font-black text-[#0084CA] uppercase tracking-[0.25em]">
                {appState === AppState.COLLEGES && "University Academic Structure"}
                {appState === AppState.DEPARTMENTS && "College Administrative Units"}
                {appState === AppState.LEVELS && "Student Level Classification"}
                {appState === AppState.COURSES && "Course Registry Index"}
                {appState === AppState.ATTENDANCE && "Digital Attendance Ledger"}
              </span>
            </div>
            <h2 className="text-3xl font-black text-[#003d5b] tracking-tighter leading-none">
              {appState === AppState.COLLEGES && "Colleges"}
              {appState === AppState.DEPARTMENTS && selectedCollege?.name}
              {appState === AppState.LEVELS && selectedDept?.name}
              {appState === AppState.COURSES && `${selectedDept?.name} (${selectedLevel}L)`}
              {appState === AppState.ATTENDANCE && selectedCourse?.code}
            </h2>
          </div>
          {appState === AppState.ATTENDANCE && (
            <div className="flex items-center gap-4 bg-[#003d5b] px-6 py-4 rounded-[1.5rem] shadow-2xl border-b-[6px] border-amber-500">
               <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
               <span className="text-white text-xs font-black uppercase tracking-[0.2em]">Live Registry Session</span>
            </div>
          )}
        </div>

        {/* COLLEGES VIEW */}
        {appState === AppState.COLLEGES && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {COLLEGES.map(college => (
              <button 
                key={college.id}
                onClick={() => { setSelectedCollege(college); setAppState(AppState.DEPARTMENTS); }}
                className="group relative p-8 bg-white rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border-b-[8px] border-[#0084CA] text-left overflow-hidden ring-1 ring-black/5"
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.04] group-hover:opacity-[0.15] transition-opacity text-[#003d5b]">
                   <UniversityIcon className="h-28 w-28" />
                </div>
                <div className="h-16 w-16 bg-sky-50 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-[#0084CA] transition-all ring-4 ring-sky-50 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0084CA] group-hover:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-[#003d5b] leading-tight mb-2 pr-10">{college.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-full border border-amber-100 uppercase tracking-widest">
                    {college.departments.length} Units
                  </div>
                  <span className="text-[#0084CA] group-hover:translate-x-2 transition-transform font-black text-sm">&rarr;</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* DEPARTMENTS VIEW */}
        {appState === AppState.DEPARTMENTS && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {selectedCollege?.departments.map(dept => (
              <div key={dept.id} className="relative h-full">
                {dept.subDepartments ? (
                  <div className="bg-white p-6 rounded-[1.5rem] shadow-xl border-2 border-sky-50 h-full flex flex-col">
                    <h4 className="font-black text-[#003d5b] text-[10px] uppercase tracking-[0.2em] mb-4 border-b-2 border-amber-400 pb-2 inline-block self-start">
                      {dept.name}
                    </h4>
                    <div className="space-y-3 flex-1">
                      {dept.subDepartments.map(sub => (
                        <button 
                          key={sub.name}
                          onClick={() => { setSelectedDept({ ...dept, name: sub.name }); setAppState(AppState.LEVELS); }}
                          className="w-full text-left p-4 rounded-xl bg-sky-50/50 hover:bg-[#0084CA] hover:text-white hover:shadow-lg transition-all flex items-center justify-between group/sub active:scale-95"
                        >
                          <span className="font-bold text-[#003d5b] group-hover/sub:text-white transition-colors text-xs">{sub.name}</span>
                          <span className="text-amber-500 font-black group-hover/sub:text-white">&raquo;</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => { setSelectedDept(dept); setAppState(AppState.LEVELS); }}
                    className="w-full h-full p-8 bg-white rounded-[1.5rem] shadow-xl border-2 border-sky-50 hover:border-[#0084CA] hover:shadow-2xl transition-all flex flex-col justify-between items-start text-left group ring-1 ring-black/5 active:scale-95"
                  >
                    <span className="font-black text-[#003d5b] text-lg leading-tight">{dept.name}</span>
                    <div className="mt-6 flex items-center gap-2 text-[#0084CA] font-black text-[10px] uppercase tracking-widest group-hover:text-amber-600 transition-colors">
                      Select Unit <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* LEVELS VIEW - 2 PER ROW GRID WITH LARGE STANDARDIZED TYPOGRAPHY */}
        {appState === AppState.LEVELS && (
          <div className="grid grid-cols-2 gap-8 sm:gap-14 max-w-2xl mx-auto">
            {[100, 200, 300, 400, ...(selectedDept?.isEngineering ? [500] : [])].map(lvl => (
              <button 
                key={lvl}
                onClick={() => { setSelectedLevel(lvl); setAppState(AppState.COURSES); }}
                className="aspect-square flex flex-col items-center justify-center bg-white border-[6px] border-sky-50 rounded-[3rem] hover:border-[#0084CA] hover:bg-sky-50 transition-all shadow-2xl group overflow-hidden relative active:scale-95"
              >
                <div className="absolute top-0 w-full h-1/2 bg-sky-50/50 -z-10 group-hover:h-full transition-all duration-700"></div>
                <span className="text-6xl sm:text-8xl font-black text-[#003d5b] group-hover:text-[#0084CA] group-hover:scale-110 transition-transform tracking-tighter">
                  {lvl}
                </span>
                <span className="text-sm sm:text-lg text-amber-600 font-black uppercase tracking-[0.3em] mt-4 px-8 py-3 bg-white rounded-full shadow-lg border border-sky-50">
                  Level
                </span>
              </button>
            ))}
          </div>
        )}

        {/* COURSES VIEW */}
        {appState === AppState.COURSES && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {generateCoursesForLevel(selectedDept!, selectedLevel!).map(course => (
              <button 
                key={course.id}
                onClick={() => { setSelectedCourse(course); setAppState(AppState.ATTENDANCE); }}
                className="relative p-8 bg-white rounded-[2rem] border-2 border-sky-50 shadow-xl hover:border-[#0084CA] hover:shadow-2xl transition-all flex items-center gap-6 group overflow-hidden active:scale-95"
              >
                <div className="bg-[#003d5b] w-20 h-20 rounded-[1.5rem] flex items-center justify-center font-mono text-lg font-black text-amber-300 shadow-xl group-hover:rotate-[8deg] transition-transform flex-shrink-0 border-b-2 border-amber-500">
                  {course.code.substring(0, 3)}
                </div>
                <div className="flex-1">
                  <div className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em] mb-1">{course.code}</div>
                  <h4 className="font-black text-[#003d5b] text-lg leading-tight group-hover:text-[#0084CA] transition-colors">{course.name}</h4>
                  <div className="mt-3 flex gap-2">
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-[8px] font-black rounded-lg border border-green-100 uppercase tracking-[0.1em] shadow-sm">Semester 2</span>
                  </div>
                </div>
                <div className="absolute bottom-4 right-8 text-sky-50 font-black text-5xl opacity-0 group-hover:opacity-100 transition-all duration-500 select-none">
                  {course.code.slice(-3)}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ATTENDANCE VIEW */}
        {appState === AppState.ATTENDANCE && selectedCourse && (
          <AttendanceTable 
            course={selectedCourse} 
            dept={selectedDept!}
            onSave={() => setAttendanceData(getAttendance())}
          />
        )}
      </main>

      {renderFooter()}
    </div>
  );
}

const AttendanceTable: React.FC<{ 
  course: Course, 
  dept: Department, 
  onSave: () => void 
}> = ({ course, dept, onSave }) => {
  const [students] = useState<Student[]>(() => generateStudents(dept.id));
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const records = getAttendance();

  const handleToggle = (studentId: string) => {
    const next = new Set(marked);
    if (next.has(studentId)) next.delete(studentId);
    else next.add(studentId);
    setMarked(next);
  };

  const handleSaveAll = () => {
    setLoading(true);
    setTimeout(() => {
      students.forEach(s => {
        saveAttendance(course.id, s.id, marked.has(s.id));
      });
      setMarked(new Set()); 
      onSave(); 
      setLoading(false);
      alert("Weekly record successfully uploaded to central Registry system.");
    }, 1500);
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl border-2 border-sky-50 overflow-hidden mb-16 ring-1 ring-black/5">
      <div className="px-10 py-6 bg-[#003d5b] border-b-[8px] border-amber-400 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-sm shadow-inner text-amber-400">
             <UniversityIcon className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-white font-black text-xl tracking-tight">Academic Roster</h3>
            <p className="text-sky-300 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{students.length} Members</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-sky-800/50 rounded-xl border border-sky-700 shadow-inner">
           <div className="w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
           <span className="text-white text-[9px] font-black tracking-widest uppercase">Registry Online</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-sky-50/70 border-b-2 border-sky-100">
            <tr>
              <th className="px-10 py-6 text-[10px] font-black text-[#003d5b] uppercase tracking-[0.15em]">Name</th>
              <th className="px-10 py-6 text-[10px] font-black text-[#003d5b] uppercase tracking-[0.15em]">Identity (Matric)</th>
              <th className="px-10 py-6 text-[10px] font-black text-[#003d5b] uppercase tracking-[0.15em] text-center">Status</th>
              <th className="px-10 py-6 text-[10px] font-black text-[#003d5b] uppercase tracking-[0.15em] text-right">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-50/50">
            {students.map(student => {
              const attendedWeeks = (records[course.id]?.[student.id] || 0);
              const percentage = Math.round((attendedWeeks / 14) * 100);
              const isMarked = marked.has(student.id);

              return (
                <tr key={student.id} className={`hover:bg-sky-50/40 transition-all ${isMarked ? 'bg-amber-50/30' : ''}`}>
                  <td className="px-10 py-6">
                    <div className="font-black text-[#003d5b] text-base">{student.name}</div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="font-mono text-xs text-[#0084CA] font-black tracking-tighter bg-sky-50/50 px-3 py-1.5 rounded-lg border border-sky-100 shadow-sm">{student.matricNo}</span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => handleToggle(student.id)}
                        className={`w-14 h-8 rounded-full transition-all flex items-center p-1 border-2 shadow-inner ${isMarked ? 'bg-[#0084CA] border-[#0084CA]' : 'bg-gray-200 border-gray-200'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-all duration-300 ${isMarked ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <div className="w-32 bg-gray-100 rounded-full h-3 hidden lg:block border border-gray-200 overflow-hidden shadow-inner">
                        <div 
                          className={`h-full transition-all duration-1500 ease-out shadow-lg ${percentage >= 70 ? 'bg-green-600' : percentage >= 40 ? 'bg-amber-500' : 'bg-red-600'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className={`font-black text-[10px] px-3 py-1.5 rounded-lg shadow-sm ${percentage >= 70 ? 'text-green-700 bg-green-50' : percentage >= 40 ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'}`}>{percentage}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-10 bg-white/50 border-t-2 border-sky-50 flex justify-end sticky bottom-0 backdrop-blur-xl ring-1 ring-black/5">
        <button 
          onClick={handleSaveAll}
          disabled={loading}
          className="bg-[#003d5b] text-white px-16 py-5 rounded-[2rem] font-black shadow-2xl hover:bg-[#002b41] transition-all transform active:scale-95 flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs border-b-[4px] border-amber-500"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {loading ? "Syncing..." : "Sync Records"}
        </button>
      </div>
    </div>
  );
};
