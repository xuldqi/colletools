import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- Types & Constants ---
type View = 'home' | 'grade-calc' | 'email-gen' | 'citation' | 'deadlines' | 'pomodoro' | 'decision' | 'privacy' | 'terms';

interface ToolCardProps {
  title: string;
  desc: string;
  icon: string;
  onClick: () => void;
  color: string;
}

interface Assignment {
  id: number;
  title: string;
  date: string; // ISO string YYYY-MM-DD
  course: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
}

// --- Shared Components ---

const Header = ({ currentView, setView }: { currentView: View; setView: (v: View) => void }) => (
  <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div 
          className="flex items-center cursor-pointer group" 
          onClick={() => setView('home')}
        >
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white mr-2 group-hover:bg-primary-700 transition-colors">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">ColleTools</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          <button onClick={() => setView('grade-calc')} className={`hover:text-primary-600 ${currentView === 'grade-calc' ? 'text-primary-600' : 'text-gray-500'}`}>Academics</button>
          <button onClick={() => setView('email-gen')} className={`hover:text-primary-600 ${currentView === 'email-gen' ? 'text-primary-600' : 'text-gray-500'}`}>Campus Life</button>
          <button onClick={() => setView('deadlines')} className={`hover:text-primary-600 ${currentView === 'deadlines' ? 'text-primary-600' : 'text-gray-500'}`}>Productivity</button>
        </nav>
        <div className="flex items-center space-x-4">
           {/* Click search icon to go to Home where search bar is located */}
           <button onClick={() => setView('home')} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-magnifying-glass"></i></button>
        </div>
      </div>
    </div>
  </header>
);

const Footer = ({ setView }: { setView: (v: View) => void }) => (
  <footer className="bg-gray-50 border-t border-gray-200 mt-16 py-12 text-sm font-sans text-gray-600">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Brand Section */}
      <div className="flex flex-col">
        <div 
          className="flex items-center cursor-pointer group mb-4" 
          onClick={() => setView('home')}
        >
          <span className="font-bold text-lg text-gray-900">🎓 ColleTools</span>
        </div>
        <p className="text-gray-500 leading-relaxed">
          The essential digital toolkit for college students. Calculate grades, generate citations, and boost productivity.
        </p>
      </div>

      {/* Tools Links */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Tools</h3>
        <div className="flex flex-col space-y-2">
          <button onClick={() => setView('grade-calc')} className="text-left hover:text-primary-600 transition-colors">Final Grade Calculator</button>
          <button onClick={() => setView('email-gen')} className="text-left hover:text-primary-600 transition-colors">Email Templates</button>
          <button onClick={() => setView('citation')} className="text-left hover:text-primary-600 transition-colors">Citation Helper</button>
          <button onClick={() => setView('pomodoro')} className="text-left hover:text-primary-600 transition-colors">Study Room</button>
        </div>
      </div>

      {/* Legal Section */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Legal</h3>
        <div className="flex flex-col space-y-2 mb-4">
          <button onClick={() => setView('privacy')} className="text-left hover:text-primary-600 transition-colors">Privacy Policy</button>
          <button onClick={() => setView('terms')} className="text-left hover:text-primary-600 transition-colors">Terms of Service</button>
          <a href="mailto:novemeber11@gmail.com" className="hover:text-primary-600 transition-colors">Contact Us</a>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          <strong>Disclaimer:</strong> ColleTools is an educational tool. Results from calculators are estimates only. Please confirm official grades with your institution.
        </p>
      </div>
    </div>

    {/* Copyright */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-xs">
      &copy; 2025 ColleTools.com. All rights reserved. Made for students, by students.
    </div>
  </footer>
);

const SectionHeader = ({ title, subtitle, backAction }: { title: string; subtitle: string; backAction?: () => void }) => (
  <div className="mb-8">
    {backAction && (
      <button 
        onClick={backAction} 
        className="mb-4 text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
      >
        <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
      </button>
    )}
    <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-600 text-lg">{subtitle}</p>
  </div>
);

const SEOContent = ({ children }: { children?: React.ReactNode }) => (
  <article className="mt-16 prose prose-slate prose-lg mx-auto text-gray-600 max-w-3xl border-t pt-10">
    {children}
  </article>
);

const Card = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, children, variant = 'primary', className = "", disabled = false, loading = false }: any) => {
  const baseStyle = "px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500";
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-400",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:bg-gray-50",
    accent: "bg-accent text-white hover:bg-pink-500",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading} 
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {loading && <i className="fa-solid fa-circle-notch fa-spin"></i>}
      {children}
    </button>
  );
};

// --- FEATURE 1: Final Grade Calculator ---
const GradeCalculator = ({ goBack }: { goBack: () => void }) => {
  const [currentGrade, setCurrentGrade] = useState<string>('');
  const [desiredGrade, setDesiredGrade] = useState<string>('');
  const [finalWeight, setFinalWeight] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const c = parseFloat(currentGrade);
    const d = parseFloat(desiredGrade);
    const w = parseFloat(finalWeight);

    if (isNaN(c) || isNaN(d) || isNaN(w) || w <= 0) return;

    const weightDecimal = w / 100;
    const required = (d - c * (1 - weightDecimal)) / weightDecimal;
    setResult(required);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <SectionHeader 
        title="Final Grade Calculator" 
        subtitle="Don't panic. Let's figure out exactly what you need to score on the final." 
        backAction={goBack}
      />
      <Card>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Grade (%)</label>
            <div className="relative">
              <input 
                type="number" 
                value={currentGrade}
                onChange={(e) => setCurrentGrade(e.target.value)}
                placeholder="e.g., 85"
                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Grade (%)</label>
              <input 
                type="number" 
                value={desiredGrade}
                onChange={(e) => setDesiredGrade(e.target.value)}
                placeholder="e.g., 90"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Final Exam Weight (%)</label>
              <input 
                type="number" 
                value={finalWeight}
                onChange={(e) => setFinalWeight(e.target.value)}
                placeholder="e.g., 20"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
              />
            </div>
          </div>
          
          <Button onClick={calculate} className="w-full py-3 text-lg shadow-lg shadow-primary-500/30">
            Calculate Required Score
          </Button>

          {result !== null && (
            <div className={`mt-8 p-6 rounded-xl text-center border transform transition-all duration-500 ${result > 100 ? 'bg-red-50 border-red-100 text-red-800' : 'bg-green-50 border-green-100 text-green-800'}`}>
              <p className="text-xs uppercase tracking-wider font-bold opacity-70 mb-2">You need to score at least</p>
              <p className="text-6xl font-bold mb-3 tracking-tight">{result.toFixed(1)}%</p>
              <p className="text-base font-medium px-4">
                {result > 100 
                  ? "Impossible? Maybe. Ask for extra credit or check if the professor curves!" 
                  : result > 90
                    ? "It's going to be tough, but you can do it. Study hard!"
                    : result <= 0 
                      ? "You've already clinched your goal! You could literally score 0." 
                      : "Totally achievable. You got this!"}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* SEO Content Section */}
      <SEOContent>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">How to Use the Final Grade Calculator</h2>
        <p className="mb-4 leading-relaxed text-gray-600">
          Finals week is stressful enough without having to do complex algebra in your head. Our <strong>Final Grade Calculator</strong> is designed to answer the one question every college student asks at the end of the semester: <em>"What do I need to score on my final exam to get an A?"</em>
        </p>
        <p className="mb-4 leading-relaxed text-gray-600">Here is how to find out your required score in seconds:</p>
        <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-600">
          <li><strong>Current Grade (%):</strong> Enter your current grade in the class before the final exam. You can usually find this on Canvas, Blackboard, or your syllabus.</li>
          <li><strong>Target Grade (%):</strong> Enter the grade you <em>want</em> to end up with for the semester (e.g., 90% for an A, 80% for a B).</li>
          <li><strong>Final Exam Weight (%):</strong> Enter how much your final exam is worth. This is typically 15%, 20%, or sometimes up to 50% of your total grade.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">The Math Behind the Calculator</h2>
        <p className="mb-4 leading-relaxed text-gray-600">
          Curious about how the numbers work? If you want to calculate it manually, here is the formula we use:
        </p>
        <blockquote className="bg-gray-50 p-4 border-l-4 border-primary-500 font-mono text-sm text-gray-700 mb-6">
          Required Score = (Target Grade - (Current Grade × (100% - Final Weight))) / Final Weight
        </blockquote>
        <p className="mb-6 leading-relaxed text-gray-600">
          For example, if you have an <strong>85%</strong> average, you want a <strong>90%</strong> (A) in the class, and your final is worth <strong>20%</strong>, the calculation would show that you need an impossible <strong>110%</strong> on the final. Time to adjust that target grade to a B+!
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Common College Grading Scale (US)</h2>
        <p className="mb-4 leading-relaxed text-gray-600">
          While every professor and university is different, here is the standard grading scale used in most US colleges:
        </p>
        <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-600">
          <li><strong>A:</strong> 90% - 100% (4.0 GPA)</li>
          <li><strong>B:</strong> 80% - 89% (3.0 GPA)</li>
          <li><strong>C:</strong> 70% - 79% (2.0 GPA)</li>
          <li><strong>D:</strong> 60% - 69% (1.0 GPA)</li>
          <li><strong>F:</strong> 0% - 59% (0.0 GPA)</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Study Tips to Hit Your Target Grade</h2>
        <p className="mb-4 leading-relaxed text-gray-600">
          Now that you know the score you need, it's time to focus. Don't forget to check out our <span className="text-primary-600 underline cursor-pointer font-medium">Study Room</span> to use the Pomodoro timer with Lo-Fi music, or use our <span className="text-primary-600 underline cursor-pointer font-medium">Citation Helper</span> to finish those final papers faster.
        </p>
      </SEOContent>
    </div>
  );
};

// --- FEATURE 2: AI Email Generator ---
const EmailGenerator = ({ goBack }: { goBack: () => void }) => {
  const [details, setDetails] = useState({
    profName: '',
    studentName: '',
    type: 'extension',
    course: '',
    reason: ''
  });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateEmail = async () => {
    setLoading(true);
    setError('');
    setGeneratedEmail('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      let prompt = `Write a polite, professional email from a college student named "${details.studentName}" to Professor "${details.profName}" for the course "${details.course}". `;
      
      switch(details.type) {
        case 'extension':
          prompt += `The goal is to ask for an assignment extension. Reason: ${details.reason || 'personal emergency'}.`;
          break;
        case 'grade':
          prompt += `The goal is to respectfully ask for clarification on a recent grade or see if there's a chance for a regrade. Context: ${details.reason}.`;
          break;
        case 'missing':
          prompt += `The goal is to apologize for missing class and ask what was missed.`;
          break;
        case 'recommendation':
          prompt += `The goal is to ask for a letter of recommendation for a job/internship.`;
          break;
      }
      
      prompt += ` Keep the tone respectful and concise. Do not include subject line in the body, just the message body.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      setGeneratedEmail(response.text || "Could not generate email. Please try again.");
    } catch (err) {
      console.error(err);
      setError("Failed to generate email. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    alert("Copied to clipboard!");
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <SectionHeader 
        title="Email Generator" 
        subtitle="Stop overthinking. Generate a professional email in seconds." 
        backAction={goBack}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <Card>
             <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Type</label>
                  <select 
                    className="w-full p-2 border rounded bg-white"
                    value={details.type}
                    onChange={e => setDetails({...details, type: e.target.value})}
                  >
                    <option value="extension">Ask for Extension</option>
                    <option value="grade">Grade Inquiry</option>
                    <option value="missing">Missed Class</option>
                    <option value="recommendation">Recommendation Letter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Professor Name</label>
                  <input 
                    type="text" className="w-full p-2 border rounded" placeholder="Smith"
                    value={details.profName} onChange={e => setDetails({...details, profName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Name</label>
                  <input 
                    type="text" className="w-full p-2 border rounded" placeholder="John Doe"
                    value={details.studentName} onChange={e => setDetails({...details, studentName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course Name/ID</label>
                  <input 
                    type="text" className="w-full p-2 border rounded" placeholder="BIO 101"
                    value={details.course} onChange={e => setDetails({...details, course: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reason / Details</label>
                  <textarea 
                    className="w-full p-2 border rounded text-sm" rows={3} placeholder="I was sick..."
                    value={details.reason} onChange={e => setDetails({...details, reason: e.target.value})}
                  />
                </div>
                <Button onClick={generateEmail} loading={loading} className="w-full">Generate Draft</Button>
             </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-4 border-b">
              <h3 className="font-bold text-gray-700">Preview</h3>
              {generatedEmail && (
                <button onClick={copyToClipboard} className="text-primary-600 text-sm font-medium hover:underline">
                  <i className="fa-regular fa-copy mr-1"></i> Copy
                </button>
              )}
            </div>
            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}
            <div className="flex-grow bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800 whitespace-pre-wrap leading-relaxed overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <i className="fa-solid fa-wand-magic-sparkles fa-spin text-2xl mb-2"></i>
                  <p>Drafting your email...</p>
                </div>
              ) : generatedEmail ? generatedEmail : (
                <span className="text-gray-400 italic">Fill out the details on the left and hit Generate to see the magic happen.</span>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- FEATURE 3: Deadline Tracker ---
const DeadlineTracker = ({ goBack }: { goBack: () => void }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('colletools-assignments');
      if (saved) setAssignments(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load assignments", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('colletools-assignments', JSON.stringify(assignments));
  }, [assignments]);

  const addAssignment = () => {
    if (!newTitle || !newDate) return;
    const newItem: Assignment = {
      id: Date.now(),
      title: newTitle,
      date: newDate,
      course: newCourse,
      completed: false,
      priority: newPriority,
      notes: newNotes
    };
    setAssignments([...assignments, newItem].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewTitle('');
    setNewDate('');
    setNewCourse('');
    setNewPriority('medium');
    setNewNotes('');
  };

  const toggleComplete = (id: number) => {
    setAssignments(assignments.map(a => a.id === id ? {...a, completed: !a.completed} : a));
  };

  const deleteAssignment = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const getUrgencyColor = (dateStr: string, completed: boolean) => {
    if (completed) return 'border-green-500 bg-green-50 opacity-60';
    const daysLeft = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return 'border-gray-300 bg-gray-100';
    if (daysLeft <= 2) return 'border-red-500 bg-red-50';
    if (daysLeft <= 7) return 'border-yellow-500 bg-yellow-50';
    return 'border-primary-200 bg-white';
  };

  const getDaysText = (dateStr: string) => {
    const daysLeft = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return 'Overdue';
    if (daysLeft === 0) return 'Today';
    if (daysLeft === 1) return 'Tomorrow';
    return `${daysLeft} days left`;
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <SectionHeader title="Deadline Tracker" subtitle="Keep track of your assignments. Don't let them sneak up on you." backAction={goBack} />
      
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <label className="text-xs font-bold text-gray-500 uppercase">Assignment</label>
            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-2 border rounded" placeholder="Essay #1" />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-bold text-gray-500 uppercase">Course</label>
            <input type="text" value={newCourse} onChange={e => setNewCourse(e.target.value)} className="w-full p-2 border rounded" placeholder="HIST 202" />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-bold text-gray-500 uppercase">Due Date</label>
            <input 
              type="date" 
              lang="en-US"
              value={newDate} 
              onChange={e => setNewDate(e.target.value)} 
              className="w-full p-2 border rounded" 
            />
          </div>
           <div className="md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Priority</label>
            <select value={newPriority} onChange={e => setNewPriority(e.target.value as any)} className="w-full p-2 border rounded bg-white">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="md:col-span-10">
             <label className="text-xs font-bold text-gray-500 uppercase">Notes (Optional)</label>
             <input type="text" value={newNotes} onChange={e => setNewNotes(e.target.value)} className="w-full p-2 border rounded" placeholder="Details..." />
          </div>
          <div className="md:col-span-2">
            <Button onClick={addAssignment} className="w-full"><i className="fa-solid fa-plus"></i> Add</Button>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {assignments.length === 0 && <p className="text-center text-gray-400 py-10">No assignments yet. You're free!</p>}
        {assignments.map(a => (
          <div key={a.id} className={`border-l-4 p-4 rounded-r-lg shadow-sm flex justify-between items-center transition-all ${getUrgencyColor(a.date, a.completed)}`}>
            <div className="flex items-center gap-3 overflow-hidden flex-grow mr-4">
              <button onClick={() => toggleComplete(a.id)} className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${a.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400 text-transparent hover:border-green-500'}`}>
                <i className="fa-solid fa-check text-xs"></i>
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-bold text-gray-800 truncate ${a.completed ? 'line-through text-gray-500' : ''}`}>{a.title}</p>
                  {a.priority === 'high' && !a.completed && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 rounded uppercase">High</span>}
                </div>
                {/* Force US Locale for Date Display */}
                <p className="text-xs text-gray-600 truncate">{a.course} • {new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                {a.notes && <p className="text-xs text-gray-500 mt-1 truncate italic">{a.notes}</p>}
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              {!a.completed && (
                <span className={`text-xs font-bold px-2 py-1 rounded ${new Date(a.date) < new Date() ? 'text-red-600 bg-red-100' : 'text-primary-600 bg-primary-50'}`}>
                   {getDaysText(a.date)}
                </span>
              )}
              <button onClick={() => deleteAssignment(a.id)} className="text-gray-400 hover:text-red-500"><i className="fa-solid fa-trash"></i></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- FEATURE 4: Citation Helper ---
const CitationHelper = ({ goBack }: { goBack: () => void }) => {
  const [data, setData] = useState({
    authorLast: '', authorFirst: '', title: '', publisher: '', year: '', url: ''
  });
  const [format, setFormat] = useState<'apa' | 'mla'>('apa');

  const generate = () => {
    // Improved logic to handle empty fields smoothly without dangling punctuation
    const { authorLast, authorFirst, title, publisher, year, url } = data;
    
    const parts = [];

    if (format === 'apa') {
       // Author
       if (authorLast) {
         let authorPart = authorLast;
         if (authorFirst) authorPart += `, ${authorFirst[0]}.`;
         parts.push(authorPart);
       }
       
       // Year
       const yearPart = `(${year || 'n.d.'}).`;
       parts.push(yearPart);

       // Title
       if (title) parts.push(`${title}.`);

       // Publisher
       if (publisher) parts.push(`${publisher}.`);

       // URL
       if (url) parts.push(url);

       return parts.join(' ');

    } else {
      // MLA: Author. Title. Publisher, Year. URL.
      
      // Author
      if (authorLast) {
        let authorPart = authorLast;
        if (authorFirst) authorPart += `, ${authorFirst}.`;
        parts.push(authorPart);
      }

      // Title
      if (title) parts.push(`${title}.`);

      // Publisher & Year
      let pubYear = [];
      if (publisher) pubYear.push(publisher);
      if (year) pubYear.push(year);
      if (pubYear.length > 0) parts.push(`${pubYear.join(', ')}.`);

      // URL
      if (url) parts.push(url + ".");
      
      return parts.join(' ');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <SectionHeader title="Citation Helper" subtitle="Format references quickly without ads or popups." backAction={goBack} />
      <Card>
        <div className="flex gap-4 mb-6 border-b pb-4">
          <button onClick={() => setFormat('apa')} className={`px-4 py-1 rounded-full text-sm font-bold ${format === 'apa' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>APA 7</button>
          <button onClick={() => setFormat('mla')} className={`px-4 py-1 rounded-full text-sm font-bold ${format === 'mla' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>MLA 9</button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
           <input className="p-2 border rounded" placeholder="Last Name" value={data.authorLast} onChange={e => setData({...data, authorLast: e.target.value})} />
           <input className="p-2 border rounded" placeholder="First Name" value={data.authorFirst} onChange={e => setData({...data, authorFirst: e.target.value})} />
        </div>
        <input className="w-full p-2 border rounded mb-4" placeholder="Book/Article Title" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
        <div className="grid grid-cols-2 gap-4 mb-4">
           <input className="p-2 border rounded" placeholder="Publisher / Website Name" value={data.publisher} onChange={e => setData({...data, publisher: e.target.value})} />
           <input className="p-2 border rounded" placeholder="Year" value={data.year} onChange={e => setData({...data, year: e.target.value})} />
        </div>
        <input className="w-full p-2 border rounded mb-6" placeholder="URL (optional)" value={data.url} onChange={e => setData({...data, url: e.target.value})} />
        
        <div className="bg-gray-50 p-4 rounded border">
          <p className="text-xs text-gray-500 uppercase font-bold mb-2">Result</p>
          <p className="font-serif text-lg select-all break-words">
             {/* Show a placeholder if fields are mostly empty */}
             {(!data.authorLast && !data.title) ? <span className="text-gray-400 italic">Citation will appear here...</span> : generate()}
          </p>
        </div>
      </Card>
    </div>
  );
};

// --- FEATURE 5: Pomodoro & Lofi ---
const PomodoroTimer = ({ goBack }: { goBack: () => void }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            // Timer done
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.play();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'work' ? 25 : 5);
    setSeconds(0);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
       <SectionHeader title="Study Room" subtitle="Lo-fi beats and a timer. Pure focus." backAction={goBack} />
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <Card className="flex flex-col items-center justify-center py-12">
             <div className="flex gap-2 mb-8">
                <button onClick={() => {setMode('work'); setMinutes(25); setSeconds(0); setIsActive(false);}} className={`px-4 py-1 rounded-full text-sm font-bold ${mode === 'work' ? 'bg-primary-100 text-primary-700' : 'text-gray-500'}`}>Work (25m)</button>
                <button onClick={() => {setMode('break'); setMinutes(5); setSeconds(0); setIsActive(false);}} className={`px-4 py-1 rounded-full text-sm font-bold ${mode === 'break' ? 'bg-green-100 text-green-700' : 'text-gray-500'}`}>Break (5m)</button>
             </div>
             <div className="text-8xl font-bold text-gray-800 font-mono mb-8">
               {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
             </div>
             <div className="flex gap-4">
                <Button onClick={toggleTimer} className="w-32">{isActive ? 'Pause' : 'Start'}</Button>
                <Button onClick={resetTimer} variant="secondary" className="w-32">Reset</Button>
             </div>
          </Card>
          
          {/* Spotify Embed */}
          <div className="w-full">
             <iframe 
              style={{borderRadius: "12px"}} 
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0" 
              width="100%" 
              height="152" 
              frameBorder="0" 
              allowFullScreen={false} 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              title="Spotify Lofi Beats"
            >
            </iframe>
          </div>
       </div>
    </div>
  );
};

// --- FEATURE 6: Decision Maker ---
const DecisionMaker = ({ goBack }: { goBack: () => void }) => {
  const [options, setOptions] = useState<string[]>(['Library', 'Dorm', 'Coffee Shop']);
  const [newOption, setNewOption] = useState('');
  const [decision, setDecision] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const addOption = () => {
    if(newOption) {
       setOptions([...options, newOption]);
       setNewOption('');
    }
  };

  const decide = () => {
    if (options.length === 0) return;
    setIsSpinning(true);
    setDecision(null);
    setTimeout(() => {
      const random = options[Math.floor(Math.random() * options.length)];
      setDecision(random);
      setIsSpinning(false);
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
       <SectionHeader title="Decision Maker" subtitle="Can't decide where to eat or study? Let fate decide." backAction={goBack} />
       <Card>
          <div className="flex gap-2 mb-6">
             <input 
               className="flex-grow p-2 border rounded" 
               placeholder="Add option (e.g. Taco Bell)" 
               value={newOption} 
               onChange={e => setNewOption(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && addOption()}
             />
             <Button onClick={addOption}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
             {options.map((opt, i) => (
                <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {opt}
                  <button onClick={() => setOptions(options.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">&times;</button>
                </span>
             ))}
          </div>
          <Button onClick={decide} disabled={isSpinning} className="w-full py-4 text-lg" variant="accent">
             {isSpinning ? "Deciding..." : "Decide for Me"}
          </Button>
          {decision && !isSpinning && (
             <div className="mt-6 text-center animate-bounce">
                <p className="text-sm text-gray-500 uppercase">The universe says</p>
                <p className="text-4xl font-bold text-primary-600">{decision}</p>
             </div>
          )}
       </Card>
    </div>
  );
};

// --- LEGAL PAGES ---
const PrivacyPolicy = ({ goBack }: { goBack: () => void }) => (
  <div className="max-w-4xl mx-auto py-10 px-4">
    <SectionHeader title="Privacy Policy" subtitle="Your data stays yours." backAction={goBack} />
    <Card>
      <div className="prose prose-sm text-gray-600 max-w-none">
        <p><strong>Last Updated: 2025</strong></p>
        <p>At ColleTools, we value your privacy. This Privacy Policy explains how we handle your information.</p>
        
        <h3>1. Information We Collect</h3>
        <p>We use Google Analytics (GA4) to collect anonymous usage data (e.g., which pages are visited, how long users stay). This helps us improve the site. We do not collect personal identifiable information (PII) unless you voluntarily provide it (e.g., contacting us via email).</p>
        
        <h3>2. Local Storage</h3>
        <p>Tools like the "Assignment Tracker" save data locally on your device using your browser's LocalStorage. This data never leaves your computer and is not sent to our servers.</p>
        
        <h3>3. AI Services</h3>
        <p>Our Email Generator uses the Gemini API. The prompt text you enter is sent to Google for processing but is not stored by us.</p>
        
        <h3>4. Cookies</h3>
        <p>We use standard cookies for analytics purposes. You can disable cookies in your browser settings at any time.</p>
      </div>
    </Card>
  </div>
);

const TermsOfService = ({ goBack }: { goBack: () => void }) => (
  <div className="max-w-4xl mx-auto py-10 px-4">
    <SectionHeader title="Terms of Service" subtitle="The rules of the road." backAction={goBack} />
    <Card>
      <div className="prose prose-sm text-gray-600 max-w-none">
        <p><strong>Last Updated: 2025</strong></p>
        
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing ColleTools.com, you agree to be bound by these Terms of Service.</p>
        
        <h3>2. Educational Use Only</h3>
        <p>This website is for educational and informational purposes only. The tools provided (such as the Grade Calculator) are estimates. We are not responsible for any discrepancies between our calculations and your official academic records.</p>
        
        <h3>3. Limitation of Liability</h3>
        <p>ColleTools is provided "as is". We make no warranties regarding the accuracy or reliability of the site. We are not liable for any damages arising from the use of this site.</p>
      </div>
    </Card>
  </div>
);

// --- MAIN HOME PAGE ---
const Home = ({ setView }: { setView: (v: View) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    { id: 'grade-calc', title: "Final Grade Calculator", desc: "Calculate exactly what you need on your final to keep your A.", icon: "fa-calculator", color: "text-indigo-600 bg-indigo-50" },
    { id: 'email-gen', title: "Email Template Gen", desc: "Write professional emails to professors in seconds using AI.", icon: "fa-envelope", color: "text-violet-600 bg-violet-50" },
    { id: 'deadlines', title: "Assignment Tracker", desc: "Never miss a due date. Prioritizes tasks by urgency.", icon: "fa-clock", color: "text-pink-600 bg-pink-50" },
    { id: 'citation', title: "Citation Helper", desc: "Format APA & MLA citations instantly for your papers.", icon: "fa-quote-right", color: "text-blue-600 bg-blue-50" },
    { id: 'pomodoro', title: "Study Room", desc: "Pomodoro timer + Lofi beats to get you in the zone.", icon: "fa-headphones", color: "text-amber-600 bg-amber-50" },
    { id: 'decision', title: "Decision Maker", desc: "Can't decide where to eat? Let the wheel decide.", icon: "fa-location-arrow", color: "text-emerald-600 bg-emerald-50" },
  ];

  const filteredTools = tools.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Hero Section */}
      <div className="bg-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">College Life,</span>
            <span className="block text-primary-600">Simplified.</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Free tools to help you boost your GPA, write better emails, and manage your time. No sign-up required.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
             <div className="relative rounded-md shadow-sm w-full max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-search text-gray-400"></i>
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border" 
                  placeholder="Search tools..." 
                />
             </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool) => (
            <div 
              key={tool.id} 
              onClick={() => setView(tool.id as View)}
              className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 cursor-pointer"
            >
              <div>
                {/* Updated Icon Container: Fixed size square with slightly rounded corners */}
                <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ring-4 ring-white ${tool.color}`}>
                   <i className={`fa-solid ${tool.icon} text-2xl`}></i>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  {tool.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {tool.desc}
                </p>
              </div>
              <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </div>
          ))}
          
          {filteredTools.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No tools found matching "{searchQuery}".</p>
              <button onClick={() => setSearchQuery('')} className="mt-4 text-primary-600 font-medium hover:underline">Clear search</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const App = () => {
  const [currentView, setView] = useState<View>('home');

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const renderView = () => {
    switch(currentView) {
      case 'home': return <Home setView={setView} />;
      case 'grade-calc': return <GradeCalculator goBack={() => setView('home')} />;
      case 'email-gen': return <EmailGenerator goBack={() => setView('home')} />;
      case 'deadlines': return <DeadlineTracker goBack={() => setView('home')} />;
      case 'citation': return <CitationHelper goBack={() => setView('home')} />;
      case 'pomodoro': return <PomodoroTimer goBack={() => setView('home')} />;
      case 'decision': return <DecisionMaker goBack={() => setView('home')} />;
      case 'privacy': return <PrivacyPolicy goBack={() => setView('home')} />;
      case 'terms': return <TermsOfService goBack={() => setView('home')} />;
      default: return <Home setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header currentView={currentView} setView={setView} />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer setView={setView} />
    </div>
  );
};

export default App;