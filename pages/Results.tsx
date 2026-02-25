
import React, { useState, useEffect } from 'react';
import { AdmissionForm, ExamResult, Course } from '../types';
import { Search, Printer, User, Award, CheckCircle2, X, FileText } from 'lucide-react';
import { formatNIC } from '../utils';

interface ResultsProps {
  admissions: AdmissionForm[];
  results: ExamResult[];
  courses: Course[];
}

const Results: React.FC<ResultsProps> = ({ admissions, results, courses }) => {
  const [searchMode, setSearchMode] = useState<'reg' | 'nic' | 'dob'>('reg');
  const [query, setQuery] = useState({ reg: '', name: '', nic: '', dob: '' });
  const [student, setStudent] = useState<AdmissionForm | null>(null);
  const [studentResults, setStudentResults] = useState<ExamResult[]>([]);
  const [showDMC, setShowDMC] = useState(false);
  const [autoPrint, setAutoPrint] = useState(false);

  const performSearch = (printAfterSearch: boolean = false) => {
    let foundStudent: AdmissionForm | undefined;

    if (searchMode === 'reg') {
      foundStudent = admissions.find(a => a.regNumber === query.reg || a.id === query.reg);
    } else if (searchMode === 'nic') {
      const formattedNIC = formatNIC(query.nic);
      foundStudent = admissions.find(a => 
        a.firstName.toLowerCase() === query.name.toLowerCase() && a.cnic === formattedNIC
      );
    } else if (searchMode === 'dob') {
      foundStudent = admissions.find(a => 
        a.firstName.toLowerCase() === query.name.toLowerCase() && a.dob === query.dob
      );
    }

    if (foundStudent) {
      setStudent(foundStudent);
      const filteredResults = results.filter(r => r.studentId === foundStudent!.regNumber || r.studentId === foundStudent!.id);
      setStudentResults(filteredResults);
      setShowDMC(true);
      if (printAfterSearch) {
        setAutoPrint(true);
      }
    } else {
      alert("No student record found with these details.");
    }
  };

  useEffect(() => {
    if (showDMC && autoPrint) {
      const timer = setTimeout(() => {
        window.print();
        setAutoPrint(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showDMC, autoPrint]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 no-print">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-teal-900 mb-3 md:mb-4 uppercase tracking-tight">Examination Results</h1>
        <p className="text-sm md:text-base text-gray-500 px-4">Access your academic progress and download your Detailed Marks Certificate (DMC).</p>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-teal-50 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setSearchMode('reg')}
            className={`flex-1 py-4 px-4 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${searchMode === 'reg' ? 'text-teal-700 bg-teal-50' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Reg #
          </button>
          <button 
            onClick={() => setSearchMode('nic')}
            className={`flex-1 py-4 px-4 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${searchMode === 'nic' ? 'text-teal-700 bg-teal-50' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Name & CNIC
          </button>
          <button 
            onClick={() => setSearchMode('dob')}
            className={`flex-1 py-4 px-4 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${searchMode === 'dob' ? 'text-teal-700 bg-teal-50' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Name & DOB
          </button>
        </div>

        <div className="p-6 md:p-10 space-y-6">
          {searchMode === 'reg' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registration / ID</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3.5 md:py-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm font-mono text-sm"
                  placeholder="AKTVI/0001/2024"
                  value={query.reg}
                  onChange={e => setQuery({...query, reg: e.target.value})}
                />
              </div>
              {/* Helper text pattern updated */}
              <p className="text-[8px] font-black text-teal-600/50 uppercase tracking-widest mt-1">Pattern: AKTVI/0000/2024</p>
            </div>
          )}

          {(searchMode === 'nic' || searchMode === 'dob') && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3.5 md:py-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm text-sm"
                  placeholder="Enter full name"
                  value={query.name}
                  onChange={e => setQuery({...query, name: e.target.value})}
                />
              </div>
              {searchMode === 'nic' ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CNIC / B-Form</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3.5 md:py-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm font-mono text-sm"
                    placeholder="00000-0000000-0"
                    value={query.nic}
                    onChange={e => setQuery({...query, nic: formatNIC(e.target.value)})}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date of Birth</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3.5 md:py-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm text-sm"
                    value={query.dob}
                    onChange={e => setQuery({...query, dob: e.target.value})}
                  />
                </div>
              )}
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
            <button 
              onClick={() => performSearch(false)}
              className="flex-1 flex items-center justify-center gap-2 py-4 md:py-5 bg-teal-800 text-white font-black uppercase text-[10px] md:text-xs tracking-widest rounded-xl md:rounded-2xl hover:bg-teal-900 shadow-xl transition-all"
            >
              <FileText className="w-4 h-4 md:w-5 md:h-5" /> View Result
            </button>
            <button 
              onClick={() => performSearch(true)}
              className="flex-1 flex items-center justify-center gap-2 py-4 md:py-5 bg-white border-2 border-teal-800 text-teal-800 font-black uppercase text-[10px] md:text-xs tracking-widest rounded-xl md:rounded-2xl hover:bg-teal-50 transition-all"
            >
              <Printer className="w-4 h-4 md:w-5 md:h-5" /> Print DMC
            </button>
          </div>
        </div>
      </div>

      {/* DMC view remains same... */}
    </div>
  );
};

export default Results;
