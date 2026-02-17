
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
                  placeholder="AK-2024-XXXX"
                  value={query.reg}
                  onChange={e => setQuery({...query, reg: e.target.value})}
                />
              </div>
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

      {showDMC && student && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDMC(false)}></div>
          <div className="relative bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-[2rem] md:rounded-[3rem] shadow-2xl p-4 md:p-12 scrollbar-hide">
            <button 
              onClick={() => setShowDMC(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-2 md:p-3 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-all no-print z-10"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div id="dmc-content" className="bg-white p-2 md:p-8">
              <div className="flex flex-col items-center text-center border-b-2 md:border-b-4 border-double border-teal-800 pb-6 md:pb-8 mb-6 md:mb-10">
                <div className="w-16 h-16 md:w-24 md:h-24 mb-4 md:mb-6 rounded-full border-2 border-teal-600 p-0.5 md:p-1 bg-white">
                  <img src="https://picsum.photos/seed/akbarlogo/200/200" alt="Logo" className="w-full h-full object-cover rounded-full" />
                </div>
                <h2 className="text-sm md:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2 leading-tight">Akbar Khan Technical and Vocational Institute (Regd. TTB).</h2>
                <div className="text-base md:text-2xl text-teal-700 leading-relaxed mb-3 md:mb-4">
                  <span className="text-[8px] md:text-sm font-black align-middle opacity-60">(REGD. TTB)</span>
                  <span className="font-urdu align-middle mr-2">اکبر خان ٹیکنیکل اینڈ ووکیشنل انسٹیٹیوٹ</span>
                </div>
                <div className="bg-teal-900 text-white px-6 md:px-8 py-1.5 md:py-2 rounded-full font-black text-[9px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.5em]">Marks Certificate</div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mb-8 md:mb-12 items-start justify-between">
                <div className="space-y-3 md:space-y-4 flex-grow w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 md:gap-y-4 text-[10px] md:text-sm">
                    <div className="flex border-b border-gray-100 pb-2 justify-between md:justify-start">
                      <span className="w-24 md:w-40 font-black text-gray-400 uppercase text-[8px] md:text-[10px]">Registration</span>
                      <span className="font-bold text-gray-900">{student.regNumber || student.id}</span>
                    </div>
                    <div className="flex border-b border-gray-100 pb-2 justify-between md:justify-start">
                      <span className="w-24 md:w-40 font-black text-gray-400 uppercase text-[8px] md:text-[10px]">Student Name</span>
                      <span className="font-bold text-gray-900 uppercase">{student.firstName} {student.lastName}</span>
                    </div>
                    <div className="flex border-b border-gray-100 pb-2 justify-between md:justify-start">
                      <span className="w-24 md:w-40 font-black text-gray-400 uppercase text-[8px] md:text-[10px]">Guardian</span>
                      <span className="font-bold text-gray-900 uppercase">{student.guardianName}</span>
                    </div>
                    <div className="flex border-b border-gray-100 pb-2 justify-between md:justify-start">
                      <span className="w-24 md:w-40 font-black text-gray-400 uppercase text-[8px] md:text-[10px]">Course</span>
                      <span className="font-bold text-teal-800 uppercase text-[9px] md:text-sm">{courses.find(c => c.id === student.courseId)?.name}</span>
                    </div>
                  </div>
                </div>
                <div className="w-24 h-32 md:w-32 md:h-40 border-2 md:border-4 border-gray-100 rounded-xl md:rounded-2xl overflow-hidden shadow-inner flex-shrink-0 bg-gray-50 mx-auto lg:mx-0">
                  {student.photo ? <img src={student.photo} className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-gray-200 mx-auto mt-10" />}
                </div>
              </div>

              <div className="overflow-x-auto mb-10 md:mb-16 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm">
                <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
                  <thead>
                    <tr className="bg-teal-900 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                      <th className="p-3 md:p-4">Exam Cycle</th>
                      <th className="p-3 md:p-4 border-l border-white/10 text-center" colSpan={2}>Paper</th>
                      <th className="p-3 md:p-4 border-l border-white/10 text-center" colSpan={2}>Practical</th>
                      <th className="p-3 md:p-4 border-l border-white/10 text-center" colSpan={2}>Asgn.</th>
                      <th className="p-3 md:p-4 border-l border-white/10">Percent</th>
                      <th className="p-3 md:p-4 border-l border-white/10">Pos.</th>
                      <th className="p-3 md:p-4 border-l border-white/10">Remarks</th>
                    </tr>
                    <tr className="bg-teal-800 text-white text-[7px] md:text-[8px] font-black uppercase">
                      <th className="p-1 md:p-2 border-t border-white/10"></th>
                      <th className="p-1 md:p-2 border-l border-t border-white/10 text-center">T</th>
                      <th className="p-1 md:p-2 border-l border-t border-white/10 text-center">O</th>
                      <th className="p-1 md:p-2 border-l border-t border-white/10 text-center">T</th>
                      <th className="p-1 md:p-2 border-l border-t border-white/10 text-center">O</th>
                      <th className="p-1 md:p-2 border-l border-t border-white/10 text-center">T</th>
                      <th className="p-1 md:p-2 border-l border-t border-white/10 text-center">O</th>
                      <th className="p-1 md:p-2 border-l border-t border-white/10"></th>
                      <th className="p-1 md:p-2 border-l border-t border-white/10"></th>
                      <th className="p-1 md:p-2 border-l border-t border-white/10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentResults.length > 0 ? studentResults.map((r, i) => {
                      const totalPossible = r.paperTotal + r.practicalTotal + r.assignmentTotal;
                      const totalObtained = r.paperObtained + r.practicalObtained + r.assignmentObtained;
                      const percentage = ((totalObtained / totalPossible) * 100).toFixed(1);
                      return (
                        <tr key={r.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-teal-50/20'} border-b border-gray-100 text-[9px] md:text-xs`}>
                          <td className="p-3 md:p-4 font-black text-gray-800">{r.examType}</td>
                          <td className="p-3 md:p-4 border-l border-gray-100 text-center">{r.paperTotal}</td>
                          <td className="p-3 md:p-4 border-l border-gray-100 text-center font-bold">{r.paperObtained}</td>
                          <td className="p-3 md:p-4 border-l border-gray-100 text-center">{r.practicalTotal}</td>
                          <td className="p-3 md:p-4 border-l border-gray-100 text-center font-bold">{r.practicalObtained}</td>
                          <td className="p-3 md:p-4 border-l border-gray-100 text-center">{r.assignmentTotal}</td>
                          <td className="p-3 md:p-4 border-l border-gray-100 text-center font-bold">{r.assignmentObtained}</td>
                          <td className="p-3 md:p-4 border-l border-gray-100 font-bold text-teal-700">{percentage}%</td>
                          <td className="p-3 md:p-4 border-l border-gray-100">{r.position}</td>
                          <td className="p-3 md:p-4 border-l border-gray-100 italic">{r.remarks}</td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={10} className="p-12 md:p-20 text-center text-gray-300 font-bold italic text-[10px] md:text-base">Examination records pending.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mt-12 md:mt-20 pt-8 md:pt-10 border-t border-gray-100 gap-10">
                <div className="text-center">
                  <div className="w-40 md:w-48 border-b-2 border-gray-300 mb-2"></div>
                  <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Office Assistant</p>
                </div>
                <div className="text-center">
                  <div className="w-48 h-24 md:h-32 relative mb-2 flex items-center justify-center">
                    <div className="absolute inset-0 border-2 md:border-4 border-teal-800/20 rounded-full rotate-12 flex items-center justify-center opacity-30">
                      <div className="text-[6px] md:text-[8px] font-black text-teal-800 text-center uppercase tracking-tighter">
                        AKBAR KHAN INSTITUTE<br/>MARDAN BRANCH<br/>VERIFIED
                      </div>
                    </div>
                    <div className="w-40 md:w-48 border-b-2 border-teal-800 absolute bottom-0"></div>
                  </div>
                  <p className="text-[8px] md:text-[10px] font-black text-teal-900 uppercase tracking-widest">MD Signature & Stamp</p>
                  <p className="text-[7px] md:text-[9px] text-gray-400 mt-1 italic">Hamza Bacha</p>
                </div>
              </div>
            </div>

            <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-3 md:gap-4 no-print border-t border-gray-100 pt-6 md:pt-8">
              <button 
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-teal-800 text-white font-black uppercase text-[10px] md:text-xs tracking-widest rounded-xl md:rounded-2xl hover:bg-teal-950 shadow-xl transition-all"
              >
                <Printer className="w-4 h-4 md:w-5 md:h-5" /> Print DMC (PDF)
              </button>
              <button 
                onClick={() => setShowDMC(false)}
                className="px-6 md:px-8 py-3.5 md:py-4 bg-gray-100 text-gray-600 font-black uppercase text-[10px] md:text-xs tracking-widest rounded-xl md:rounded-2xl hover:bg-gray-200"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
