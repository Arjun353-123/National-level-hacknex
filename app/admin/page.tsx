"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PredictiveArcCanvas } from "@/components/three-ui/PredictiveArcCanvas";
import { GlowButton } from "@/components/GlowButton";
import { MedicalAnalysisStudio } from "@/components/MedicalAnalysisStudio";
import {
  Users,
  Activity,
  FileImage,
  TrendingUp,
  Shield,
  Home,
  LogOut,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  Dna
} from "lucide-react";
import Link from "next/link";
import { PatientRecord } from "@/app/api/patients/route";

export default function AdminDashboard() {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"patients" | "analysis">("patients");

  // CRUD Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<PatientRecord>>({
    name: "",
    age: 35,
    gender: "Male",
    bloodGroup: "O+",
    phone: "",
    email: "",
    condition: "",
    status: "Active",
    assignedDoctor: "Dr. Sarah Mitchell",
    primaryScan: "Chest X-Ray PA",
    notes: "",
  });

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patients");
      const json = await res.json();
      if (json.success) {
        setPatients(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.assignedDoctor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setPatients([json.data, ...patients]);
        setIsAddModalOpen(false);
        resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    try {
      const res = await fetch("/api/patients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedPatient.id, ...formData }),
      });
      const json = await res.json();
      if (json.success) {
        setPatients(patients.map((p) => (p.id === selectedPatient.id ? json.data : p)));
        setIsEditModalOpen(false);
        setSelectedPatient(null);
        resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (!confirm(`Are you sure you want to delete patient ${id}?`)) return;
    try {
      const res = await fetch(`/api/patients?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setPatients(patients.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setFormData(patient);
    setIsEditModalOpen(true);
  };

  const openViewModal = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age: 35,
      gender: "Male",
      bloodGroup: "O+",
      phone: "",
      email: "",
      condition: "",
      status: "Active",
      assignedDoctor: "Dr. Sarah Mitchell",
      primaryScan: "Chest X-Ray PA",
      notes: "",
    });
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* 3D PredictiveArc Background */}
      <div className="shader-frame">
        <PredictiveArcCanvas
          mode="dark"
          speed={1.00}
          hue={-113}
          saturation={1.44}
          brightness={1.37}
        />
      </div>



      <div className="relative z-10">
        {/* Navigation Bar */}
        <nav className="glass-effect border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-900 to-violet-900 text-violet-200 flex items-center justify-center shadow-lg shadow-purple-500/30 border border-purple-500/40">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold text-violet-200 tracking-tight">
                  Admin Dashboard
                </span>
                <span className="hidden sm:inline-block ml-3 text-xs font-mono font-semibold px-2 py-0.5 rounded bg-purple-900/50 text-violet-200 border border-purple-500/40">
                  Management Portal
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/">
                <motion.button whileHover={{ scale: 1.05 }} className="p-2.5 rounded-xl hover:bg-purple-900/30 text-purple-300 transition-colors border border-purple-500/20">
                  <Home className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button whileHover={{ scale: 1.05 }} className="p-2.5 rounded-xl hover:bg-purple-900/30 text-purple-300 transition-colors border border-purple-500/20">
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </div>
        </nav>

        {/* 3D Perspective Entrance Container */}
        <motion.div
          initial={{ opacity: 0, rotateX: 6, y: 30 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ perspective: 1200 }}
          className="max-w-7xl mx-auto px-6 py-8"
        >
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              {
                icon: <Users className="w-6 h-6 text-violet-400" />,
                label: "Total Patients Registered",
                value: patients.length,
                change: "+12% this week",
              },
              {
                icon: <Activity className="w-6 h-6 text-red-400" />,
                label: "Critical Condition Alerts",
                value: patients.filter((p) => p.status === "Critical").length,
                change: "Immediate review",
              },
              {
                icon: <FileImage className="w-6 h-6 text-purple-400" />,
                label: "Volumetric Scans Processed",
                value: patients.reduce((acc, p) => acc + (p.scansCount || 0), 0),
                change: "98.4% processed",
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
                label: "AI Diagnostic Concordance",
                value: "97.2%",
                change: "Pathology verified",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="medical-card p-6 rounded-3xl border border-purple-500/30 relative overflow-hidden group"
              >
                {/* Purple glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-violet-500/0 group-hover:from-purple-500/10 group-hover:via-purple-500/5 group-hover:to-violet-500/10 transition-all duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-purple-900/50 border border-violet-500/40">
                      {stat.icon}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-violet-200 bg-purple-900/50 px-2 py-0.5 rounded border border-violet-500/40">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-violet-200 tracking-tight">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tab Switcher: Patient Management vs AI Analysis Studio */}
          <div className="flex items-center gap-2 mb-6 p-1 bg-slate-800/50 border border-violet-500/30 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab("patients")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === "patients"
                  ? "bg-gradient-to-r from-purple-900 to-violet-900 text-violet-200 shadow-md border border-violet-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Patient Directory (CRUD)</span>
            </button>
            <button
              onClick={() => setActiveTab("analysis")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === "analysis"
                  ? "bg-gradient-to-r from-purple-900 to-violet-900 text-violet-200 shadow-md border border-violet-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Pattern Detection Studio</span>
            </button>
          </div>

          {/* TAB 1: PATIENT MANAGEMENT (CRUD OPERATIONS) */}
          {activeTab === "patients" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="medical-card p-6 md:p-8 rounded-3xl border border-violet-500/30"
            >
              {/* Table Controls Header: Search, Filter, Add Patient */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-violet-200 flex items-center gap-3">
                    <Users className="w-6 h-6 text-purple-400" />
                    Patient Records & Clinical Vitals
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Manage patient registrations, diagnostic statuses, vitals, and scan histories.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search ID, name, condition..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:bg-slate-900 transition-colors"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-800 border border-violet-500/30 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-violet-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Critical">Critical</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Completed">Completed</option>
                  </select>

                  {/* Add Patient Button */}
                  <GlowButton
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      resetForm();
                      setIsAddModalOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Patient
                  </GlowButton>
                </div>
              </div>

              {/* Patient Records Table */}
              <div className="overflow-x-auto rounded-2xl border border-violet-500/30 bg-slate-900/50">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-violet-500/30 bg-slate-800/50 text-xs font-mono uppercase text-slate-400 font-bold">
                      <th className="py-3.5 px-4">Patient ID</th>
                      <th className="py-3.5 px-4">Name & Demographics</th>
                      <th className="py-3.5 px-4">Primary Pathology</th>
                      <th className="py-3.5 px-4">Assigned Specialist</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Scans</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-violet-500/20">
                    {filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                          No matching patient records found.
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((p, i) => (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="hover:bg-violet-900/20 transition-colors"
                        >
                          <td className="py-4 px-4 font-mono font-bold text-violet-300">
                            {p.id}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-200">{p.name}</div>
                            <div className="text-xs text-slate-400">
                              {p.age} yrs • {p.gender} • Blood: {p.bloodGroup}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-slate-200 font-semibold">{p.condition}</div>
                            <div className="text-xs text-violet-400 font-medium">{p.primaryScan}</div>
                          </td>
                          <td className="py-4 px-4 text-xs font-medium text-slate-300">
                            {p.assignedDoctor}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
                                p.status === "Critical"
                                  ? "bg-red-900/50 text-red-300 border border-red-500/40"
                                  : p.status === "Active"
                                  ? "bg-emerald-900/50 text-emerald-300 border border-emerald-500/40"
                                  : p.status === "Under Review"
                                  ? "bg-amber-900/50 text-amber-300 border border-amber-500/40"
                                  : "bg-blue-900/50 text-blue-300 border border-blue-500/40"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center font-mono font-bold text-slate-300">
                            {p.scansCount}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openViewModal(p)}
                                title="View Patient Profile"
                                className="p-2 rounded-xl hover:bg-violet-900/30 text-violet-400 transition-colors border border-transparent hover:border-violet-500/40"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(p)}
                                title="Edit Patient Details"
                                className="p-2 rounded-xl hover:bg-purple-900/30 text-purple-400 transition-colors border border-transparent hover:border-purple-500/40"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePatient(p.id)}
                                title="Delete Patient Record"
                                className="p-2 rounded-xl hover:bg-red-900/30 text-red-400 transition-colors border border-transparent hover:border-red-500/40"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 2: MEDICAL PATTERN DETECTION STUDIO */}
          {activeTab === "analysis" && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <MedicalAnalysisStudio />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* MODAL 1: ADD PATIENT MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="medical-card p-6 md:p-8 rounded-3xl w-full max-w-2xl border border-violet-500/40 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-violet-500/30 mb-6">
                <h3 className="text-xl font-serif font-bold text-slate-200 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-violet-400" />
                  Register New Patient Record
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPatient} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Age</label>
                    <input
                      type="number"
                      required
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Blood Group</label>
                    <input
                      type="text"
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                      placeholder="O+, A+, B+, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                      placeholder="patient@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Primary Pathology / Diagnosis
                    </label>
                    <input
                      type="text"
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Critical">Critical</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Assigned Specialist</label>
                    <input
                      type="text"
                      value={formData.assignedDoctor}
                      onChange={(e) => setFormData({ ...formData, assignedDoctor: e.target.value })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Primary Scan Modality</label>
                    <input
                      type="text"
                      value={formData.primaryScan}
                      onChange={(e) => setFormData({ ...formData, primaryScan: e.target.value })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Clinical Notes</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-violet-500/30">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2 rounded-full text-sm font-semibold text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <GlowButton type="submit" variant="primary" size="md">
                    Register Patient
                  </GlowButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: EDIT PATIENT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="medical-card p-6 md:p-8 rounded-3xl w-full max-w-2xl border border-violet-500/40 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-violet-500/30 mb-6">
                <h3 className="text-xl font-serif font-bold text-slate-200 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-violet-400" />
                  Edit Patient: {selectedPatient.name} ({selectedPatient.id})
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdatePatient} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Age</label>
                    <input
                      type="number"
                      required
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Diagnostic Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Critical">Critical</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Condition</label>
                    <input
                      type="text"
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Assigned Doctor</label>
                    <input
                      type="text"
                      value={formData.assignedDoctor}
                      onChange={(e) => setFormData({ ...formData, assignedDoctor: e.target.value })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Doctor Notes</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-800 border border-violet-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-violet-500 focus:bg-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-violet-500/30">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2 rounded-full text-sm font-semibold text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <GlowButton type="submit" variant="primary" size="md">
                    Save Changes
                  </GlowButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: VIEW PATIENT DETAILS MODAL */}
      <AnimatePresence>
        {isViewModalOpen && selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="medical-card p-6 md:p-8 rounded-3xl w-full max-w-xl border border-violet-500/40 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-violet-500/30 mb-6">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-slate-200">
                    {selectedPatient.name}
                  </h3>
                  <p className="text-xs font-mono font-bold text-violet-300">
                    ID: {selectedPatient.id}
                  </p>
                </div>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-800/50 border border-violet-500/30">
                  <div>
                    <span className="text-slate-400 text-xs block font-bold">Age & Gender:</span>
                    <span className="text-slate-200 font-bold">
                      {selectedPatient.age} yrs • {selectedPatient.gender}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block font-bold">Blood Group:</span>
                    <span className="text-violet-300 font-bold">{selectedPatient.bloodGroup}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block font-bold">Phone Contact:</span>
                    <span className="text-slate-200">{selectedPatient.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block font-bold">Email Address:</span>
                    <span className="text-slate-200">{selectedPatient.email}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-900/30 border border-violet-500/40 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-violet-200 uppercase">Primary Diagnosis:</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        selectedPatient.status === "Critical"
                          ? "bg-red-900/50 text-red-300 border border-red-500/40"
                          : "bg-emerald-900/50 text-emerald-300 border border-emerald-500/40"
                      }`}
                    >
                      {selectedPatient.status}
                    </span>
                  </div>
                  <p className="text-slate-200 text-base font-bold">{selectedPatient.condition}</p>
                  <p className="text-xs text-slate-400 font-medium">
                    Modality: {selectedPatient.primaryScan} • Last Scan: {selectedPatient.lastScanDate}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/50 border border-violet-500/30">
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
                    Physician & Clinical Notes:
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed">{selectedPatient.notes}</p>
                  <p className="text-xs text-violet-300 mt-2 font-mono font-bold">
                    Signed by: {selectedPatient.assignedDoctor}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-violet-500/30 mt-6">
                <GlowButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setActiveTab("analysis");
                  }}
                >
                  Inspect in Analysis Studio →
                </GlowButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
