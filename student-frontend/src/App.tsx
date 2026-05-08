import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- TYPES ---
interface Student {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

interface Module {
    id: number;
    name: string;
    targetHoursPerWeek: number;
    actualHoursStudied: number;
}

interface StudySlot {
    id?: number;
    dayOfWeek: string;
    startTime: string;
    module: { name: string };
}

// --- MODAL COMPONENT ---
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, hours: number) => void;
}

const AddModuleModal = ({ isOpen, onClose, onSave }: ModalProps) => {
    const [name, setName] = useState('');
    const [hours, setHours] = useState(5);

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1e293b', marginBottom: '24px' }}>Add New Module</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="text" placeholder="Module Name"
                        style={{ width: '100%', padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none' }}
                        value={name} onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="number" placeholder="Weekly Target Hours"
                        style={{ width: '100%', padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none' }}
                        value={hours} onChange={(e) => setHours(Number(e.target.value))}
                    />
                </div>
                <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '16px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={() => { onSave(name, hours); setName(''); }} style={{ flex: 1, padding: '16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Save Module</button>
                </div>
            </div>
        </div>
    );
};

export default function App() {
    const [user, setUser] = useState<Student | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [authData, setAuthData] = useState({ firstName: '', lastName: '', email: '' });
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modules, setModules] = useState<Module[]>([]);
    const [schedule, setSchedule] = useState<StudySlot[]>([]);
    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00'];
    const BASE_URL = 'http://localhost:8081/api';

    // 1. Memoized Fetch Function to satisfy Linter
    const fetchData = useCallback(async () => {
        if (!user) return;
        try {
            const [modRes, schRes] = await Promise.all([
                axios.get(`${BASE_URL}/modules/student/${user.id}`),
                axios.get(`${BASE_URL}/schedule/student/${user.id}`)
            ]);
            setModules(modRes.data);
            setSchedule(schRes.data);
            if (modRes.data.length > 0 && !selectedModuleId) {
                setSelectedModuleId(modRes.data[0].id);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    }, [user, selectedModuleId]);

    // 2. Load User Session
    useEffect(() => {
        const savedUser = localStorage.getItem('studentUser');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    // 3. Trigger Data Fetch
    useEffect(() => {
        if (user) {
            void fetchData();
        }
    }, [user, fetchData]);

    // 4. Auth Actions
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/students/login`, { email: authData.email });
            setUser(res.data);
            localStorage.setItem('studentUser', JSON.stringify(res.data));
        } catch { alert("Login failed. Email not found."); }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/students/register`, authData);
            setUser(res.data);
            localStorage.setItem('studentUser', JSON.stringify(res.data));
        } catch { alert("Registration failed."); }
    };

    const handleLogout = () => {
        localStorage.removeItem('studentUser');
        setUser(null);
        setModules([]);
        setSchedule([]);
    };

    const handleAddModule = async (name: string, hours: number) => {
        if (!user) return;
        try {
            const res = await axios.post(`${BASE_URL}/modules/student/${user.id}`, {
                name, targetHoursPerWeek: hours
            });
            setModules(prev => [...prev, res.data]);
            setIsModalOpen(false);
        } catch (error) { console.error("Save Error:", error); }
    };

    const handleAddStudyHour = async (moduleId: number) => {
        try {
            await axios.patch(`${BASE_URL}/modules/${moduleId}/add-hours?hours=1`);
            void fetchData();
        } catch (error) { console.error("Update Error:", error); }
    };

    const handleCellClick = async (day: string, time: string) => {
        if (!user || !selectedModuleId) return alert("Select a module first!");
        try {
            const res = await axios.post(`${BASE_URL}/schedule/student/${user.id}/module/${selectedModuleId}`, {
                dayOfWeek: day, startTime: time
            });
            setSchedule(prev => [...prev, res.data]);
        } catch (error) { console.error("Pin Error:", error); }
    };

    if (!user) {
        return (
            <div style={{ backgroundColor: '#0A2647', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{ backgroundColor: 'white', padding: '48px', borderRadius: '32px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1e293b', marginBottom: '32px', textAlign: 'center' }}>
                        {isRegistering ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={isRegistering ? handleRegister : handleLogin}>
                        {isRegistering && (
                            <>
                                <input type="text" placeholder="First Name" style={{ width: '100%', padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none' }}
                                       onChange={e => setAuthData({...authData, firstName: e.target.value})} required />
                                <input type="text" placeholder="Last Name" style={{ width: '100%', padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none' }}
                                       onChange={e => setAuthData({...authData, lastName: e.target.value})} required />
                            </>
                        )}
                        <input type="email" placeholder="Email" style={{ width: '100%', padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none' }}
                               onChange={e => setAuthData({...authData, email: e.target.value})} required />
                        <button type="submit" style={{ width: '100%', padding: '18px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>
                            {isRegistering ? 'Register' : 'Login'}
                        </button>
                    </form>
                    <button onClick={() => setIsRegistering(!isRegistering)} style={{ width: '100%', marginTop: '20px', background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>
                        {isRegistering ? 'Already have an account? Login' : 'New student? Register here'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b' }}>
            <aside style={{ width: '280px', backgroundColor: '#0f172a', color: 'white', padding: '40px', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '48px' }}>🎓 SMS Portal</h2>
                <nav style={{ flex: 1 }}>
                    <div onClick={() => setActiveTab('dashboard')} style={{ padding: '14px 20px', backgroundColor: activeTab === 'dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '12px', marginBottom: '12px', fontWeight: 'bold', cursor: 'pointer' }}>📊 Dashboard</div>
                    <div onClick={() => setActiveTab('modules')} style={{ padding: '14px 20px', backgroundColor: activeTab === 'modules' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '12px', color: activeTab === 'modules' ? 'white' : '#94a3b8', cursor: 'pointer' }}>📚 My Modules</div>
                </nav>
                <button onClick={handleLogout} style={{ padding: '14px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
            </aside>

            <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '900' }}>Hi, {user.firstName}! 👋</h1>
                        <p style={{ color: '#64748b' }}>STU-{user.id} | Track your weekly progress</p>
                    </div>
                    {activeTab === 'dashboard' && (
                        <select value={selectedModuleId || ''} onChange={(e) => setSelectedModuleId(Number(e.target.value))} style={{ padding: '10px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', fontWeight: 'bold', color: '#2563eb', cursor: 'pointer' }}>
                            {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    )}
                </header>

                {activeTab === 'dashboard' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', fontWeight: 'bold' }}>Study Schedule</div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
                                    <thead style={{ backgroundColor: '#f8fafc' }}>
                                    <tr>
                                        <th style={{ padding: '20px', color: '#94a3b8', fontSize: '10px' }}>TIME</th>
                                        {days.map(d => <th key={d} style={{ padding: '15px', fontSize: '12px' }}>{d.substring(0, 3).toUpperCase()}</th>)}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {timeSlots.map(time => (
                                        <tr key={time} style={{ borderTop: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '20px', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>{time}</td>
                                            {days.map(day => {
                                                const slot = schedule.find(s => s.dayOfWeek === day && s.startTime === time);
                                                return (
                                                    <td key={day} onClick={() => handleCellClick(day, time)} style={{ padding: '8px', height: '80px', minWidth: '80px', cursor: 'pointer' }}>
                                                        {slot ? <div style={{ backgroundColor: '#2563eb', color: 'white', fontSize: '9px', padding: '8px', borderRadius: '10px', fontWeight: 'bold' }}>{slot.module.name}</div> : <div style={{ height: '100%', border: '2px dashed #f1f5f9', borderRadius: '10px' }}></div>}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ marginBottom: '24px', fontWeight: 'bold' }}>Overall Progress</h3>
                            {modules.map(mod => (
                                <div key={mod.id} style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}><span>{mod.name}</span><span>{mod.actualHoursStudied}/{mod.targetHoursPerWeek}h</span></div>
                                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}><div style={{ width: `${(mod.actualHoursStudied / mod.targetHoursPerWeek) * 100}%`, height: '100%', backgroundColor: '#2563eb' }}></div></div>
                                </div>
                            ))}
                            <button onClick={() => setIsModalOpen(true)} style={{ width: '100%', marginTop: '20px', padding: '15px', border: '2px dashed #cbd5e1', background: 'none', borderRadius: '12px', color: '#94a3b8', fontWeight: 'bold', cursor: 'pointer' }}>+ New Module</button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                        {modules.map(mod => (
                            <div key={mod.id} style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>{mod.name}</h3>
                                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>{mod.actualHoursStudied} hours logged this week.</p>
                                <button onClick={() => handleAddStudyHour(mod.id)} style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add 1 Hour</button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <AddModuleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddModule} />
        </div>
    );
}