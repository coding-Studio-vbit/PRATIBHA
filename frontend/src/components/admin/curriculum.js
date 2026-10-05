import React, { useEffect, useState } from "react";
import Navbar from "../global_ui/navbar/navbar";
import Select from "react-select";
import Dialog from "../global_ui/dialog/dialog";
import { LoadingScreen } from "../global_ui/spinner/spinner";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import styles from "./curriculum.module.css";

const COURSES = [
  { value: "BTech", label: "BTech (4 Years)" },
  { value: "MBA", label: "MBA (2 Years)" },
  { value: "MTech", label: "MTech (2 Years)" }
];

export default function Curriculum() {
  const { currentUser } = useAuth();
  const userDept = currentUser?.department;

  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const [selectedYear, setSelectedYear] = useState({ value: "1", label: "Year 1" });

  // Departments for selected course & year
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [deptExistsInDb, setDeptExistsInDb] = useState(true);

  // Curriculum Data for selected department
  const [sections, setSections] = useState([]);
  const [subjectsSem1, setSubjectsSem1] = useState([]);
  const [subjectsSem2, setSubjectsSem2] = useState([]);
  const [OEs, setOEs] = useState([]);
  const [PEs, setPEs] = useState([]);
  const [OEs2, setOEs2] = useState([]);
  const [PEs2, setPEs2] = useState([]);

  // Inputs for adding items
  const [newSectionInput, setNewSectionInput] = useState("");
  const [newSubSem1Input, setNewSubSem1Input] = useState("");
  const [newSubSem2Input, setNewSubSem2Input] = useState("");
  const [newDeptInput, setNewDeptInput] = useState("");
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showElectives, setShowElectives] = useState(false);

  // Electives inputs
  const [newOEInput, setNewOEInput] = useState("");
  const [newPEInput, setNewPEInput] = useState("");
  const [newOE2Input, setNewOE2Input] = useState("");
  const [newPE2Input, setNewPE2Input] = useState("");

  // Dialog State
  const [dialogState, setDialogState] = useState(null);

  const getYearOptions = () => {
    const maxYears = selectedCourse.value === "BTech" ? 4 : 2;
    return Array.from({ length: maxYears }, (_, i) => ({
      value: String(i + 1),
      label: `Year ${i + 1}`
    }));
  };

  // 1. Fetch departments when course or year changes
  const fetchDepartments = async (course, year) => {
    try {
      setLoading(true);
      const q = query(collection(db, "curriculum", course, year));
      const snap = await getDocs(q);
      const allDepts = snap.docs.map((d) => ({ value: d.id, label: d.id }));

      if (userDept) {
        // Scoped to user's assigned department
        const targetOption = { value: userDept, label: `${userDept} (Your Department)` };
        setDepartments([targetOption]);
        setSelectedDept(targetOption);
        const exists = snap.docs.some((d) => d.id.toUpperCase() === userDept);
        setDeptExistsInDb(exists);
        if (exists) {
          await loadDeptCurriculum(course, year, userDept);
        } else {
          resetCurriculumState();
        }
      } else {
        // Superadmin mode - all departments
        setDeptExistsInDb(allDepts.length > 0);
        setDepartments(allDepts);
        if (allDepts.length > 0) {
          const exists = allDepts.find((d) => selectedDept && d.value === selectedDept.value);
          const nextDept = exists || allDepts[0];
          setSelectedDept(nextDept);
          await loadDeptCurriculum(course, year, nextDept.value);
        } else {
          setSelectedDept(null);
          resetCurriculumState();
        }
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setLoading(false);
      setDialogState({
        message: "Failed to load departments: " + err.message,
        onOK: () => setDialogState(null)
      });
    }
  };

  const handleInitializeDept = async (deptCode) => {
    try {
      setLoading(true);
      const docRef = doc(db, "curriculum", selectedCourse.value, selectedYear.value, deptCode);
      const initialPayload = {
        sections: ["A"],
        subjects: [],
        subjects2: []
      };
      await setDoc(docRef, initialPayload);
      setDeptExistsInDb(true);
      setSections(["A"]);
      setSubjectsSem1([]);
      setSubjectsSem2([]);
      setLoading(false);
      setDialogState({
        message: `Department ${deptCode} curriculum initialized successfully for ${selectedCourse.value} Year ${selectedYear.value}!`,
        onOK: () => setDialogState(null)
      });
    } catch (err) {
      setLoading(false);
      setDialogState({
        message: "Failed to initialize curriculum: " + err.message,
        onOK: () => setDialogState(null)
      });
    }
  };

  // 2. Load specific department curriculum
  const loadDeptCurriculum = async (course, year, deptName) => {
    try {
      const docRef = doc(db, "curriculum", course, year, deptName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSections(data.sections || []);
        setSubjectsSem1(data.subjects || []);
        setSubjectsSem2(data.subjects2 || []);
        setOEs(data.OEs || []);
        setPEs(data.PEs || []);
        setOEs2(data.OEs2 || []);
        setPEs2(data.PEs2 || []);
      } else {
        resetCurriculumState();
      }
    } catch (err) {
      console.error("Error loading department curriculum:", err);
      setDialogState({
        message: `Failed to load curriculum for ${deptName}: ` + err.message,
        onOK: () => setDialogState(null)
      });
    }
  };

  const resetCurriculumState = () => {
    setSections([]);
    setSubjectsSem1([]);
    setSubjectsSem2([]);
    setOEs([]);
    setPEs([]);
    setOEs2([]);
    setPEs2([]);
  };

  useEffect(() => {
    // When course changes, reset year to 1 if out of range
    const maxYears = selectedCourse.value === "BTech" ? 4 : 2;
    if (parseInt(selectedYear.value, 10) > maxYears) {
      setSelectedYear({ value: "1", label: "Year 1" });
    } else {
      fetchDepartments(selectedCourse.value, selectedYear.value);
    }
  }, [selectedCourse, selectedYear]);

  // Handle department switch
  const handleDeptChange = async (deptOption) => {
    setSelectedDept(deptOption);
    if (deptOption) {
      setLoading(true);
      await loadDeptCurriculum(selectedCourse.value, selectedYear.value, deptOption.value);
      setLoading(false);
    } else {
      resetCurriculumState();
    }
  };

  // Section handling
  const handleAddSection = () => {
    const trimmed = newSectionInput.trim().toUpperCase();
    if (!trimmed) return;
    if (sections.includes(trimmed)) {
      setDialogState({
        message: `Section "${trimmed}" already exists.`,
        onOK: () => setDialogState(null)
      });
      return;
    }
    setSections([...sections, trimmed]);
    setNewSectionInput("");
  };

  const handleDeleteSection = (sec) => {
    setSections(sections.filter((s) => s !== sec));
  };

  // Subject Sem 1 handling
  const handleAddSubSem1 = () => {
    const trimmed = newSubSem1Input.trim();
    if (!trimmed) return;
    if (subjectsSem1.some((s) => s.subject.toLowerCase() === trimmed.toLowerCase())) {
      setDialogState({
        message: `Subject "${trimmed}" already in Semester 1.`,
        onOK: () => setDialogState(null)
      });
      return;
    }
    setSubjectsSem1([...subjectsSem1, { subject: trimmed }]);
    setNewSubSem1Input("");
  };

  const handleEditSubSem1 = (index, newName) => {
    const updated = [...subjectsSem1];
    updated[index] = { ...updated[index], subject: newName };
    setSubjectsSem1(updated);
  };

  const handleDeleteSubSem1 = (index) => {
    setSubjectsSem1(subjectsSem1.filter((_, i) => i !== index));
  };

  // Subject Sem 2 handling
  const handleAddSubSem2 = () => {
    const trimmed = newSubSem2Input.trim();
    if (!trimmed) return;
    if (subjectsSem2.some((s) => s.subject.toLowerCase() === trimmed.toLowerCase())) {
      setDialogState({
        message: `Subject "${trimmed}" already in Semester 2.`,
        onOK: () => setDialogState(null)
      });
      return;
    }
    setSubjectsSem2([...subjectsSem2, { subject: trimmed }]);
    setNewSubSem2Input("");
  };

  const handleEditSubSem2 = (index, newName) => {
    const updated = [...subjectsSem2];
    updated[index] = { ...updated[index], subject: newName };
    setSubjectsSem2(updated);
  };

  const handleDeleteSubSem2 = (index) => {
    setSubjectsSem2(subjectsSem2.filter((_, i) => i !== index));
  };

  // Electives handling
  const handleAddOE = () => {
    const t = newOEInput.trim();
    if (!t) return;
    setOEs([...OEs, { subject: t }]);
    setNewOEInput("");
  };
  const handleDeleteOE = (idx) => setOEs(OEs.filter((_, i) => i !== idx));

  const handleAddPE = () => {
    const t = newPEInput.trim();
    if (!t) return;
    setPEs([...PEs, { subject: t }]);
    setNewPEInput("");
  };
  const handleDeletePE = (idx) => setPEs(PEs.filter((_, i) => i !== idx));

  const handleAddOE2 = () => {
    const t = newOE2Input.trim();
    if (!t) return;
    setOEs2([...OEs2, { subject: t }]);
    setNewOE2Input("");
  };
  const handleDeleteOE2 = (idx) => setOEs2(OEs2.filter((_, i) => i !== idx));

  const handleAddPE2 = () => {
    const t = newPE2Input.trim();
    if (!t) return;
    setPEs2([...PEs2, { subject: t }]);
    setNewPE2Input("");
  };
  const handleDeletePE2 = (idx) => setPEs2(PEs2.filter((_, i) => i !== idx));

  // Add New Department
  const handleCreateNewDept = async () => {
    if (userDept) {
      setDialogState({
        message: "Department administrators are restricted to managing their assigned department.",
        onOK: () => setDialogState(null)
      });
      return;
    }

    const deptCode = newDeptInput.trim().toUpperCase();
    if (!deptCode) {
      setDialogState({
        message: "Please enter a valid Department Code (e.g. AIDS)",
        onOK: () => setDialogState(null)
      });
      return;
    }

    if (departments.some((d) => d.value === deptCode)) {
      setDialogState({
        message: `Department "${deptCode}" already exists for ${selectedCourse.value} Year ${selectedYear.value}.`,
        onOK: () => setDialogState(null)
      });
      return;
    }

    try {
      setLoading(true);
      const docRef = doc(db, "curriculum", selectedCourse.value, selectedYear.value, deptCode);
      const initialPayload = {
        sections: ["A"],
        subjects: [],
        subjects2: []
      };
      await setDoc(docRef, initialPayload);
      setShowAddDeptModal(false);
      setNewDeptInput("");

      // Refresh dept list and select newly created dept
      const newOption = { value: deptCode, label: deptCode };
      const updatedList = [...departments, newOption].sort((a, b) => a.value.localeCompare(b.value));
      setDepartments(updatedList);
      setSelectedDept(newOption);
      setSections(["A"]);
      setSubjectsSem1([]);
      setSubjectsSem2([]);
      setLoading(false);

      setDialogState({
        message: `Department "${deptCode}" created successfully!`,
        onOK: () => setDialogState(null)
      });
    } catch (err) {
      setLoading(false);
      setDialogState({
        message: "Failed to create department: " + err.message,
        onOK: () => setDialogState(null)
      });
    }
  };

  // Save Curriculum to Firestore
  const handleSaveCurriculum = async () => {
    const targetDept = userDept || (selectedDept ? selectedDept.value : null);
    if (!targetDept) {
      setDialogState({
        message: "Please select a department first.",
        onOK: () => setDialogState(null)
      });
      return;
    }

    // Clean sections and empty subjects
    const cleanSections = sections.map((s) => (s || "").trim().toUpperCase()).filter(Boolean);

    const cleanSem1 = subjectsSem1
      .map((s) => ({ subject: (s.subject || "").trim() }))
      .filter((s) => s.subject.length > 0);

    const cleanSem2 = subjectsSem2
      .map((s) => ({ subject: (s.subject || "").trim() }))
      .filter((s) => s.subject.length > 0);

    const cleanOEs = OEs.map((s) => ({ subject: (s.subject || "").trim() })).filter((s) => s.subject.length > 0);
    const cleanPEs = PEs.map((s) => ({ subject: (s.subject || "").trim() })).filter((s) => s.subject.length > 0);
    const cleanOEs2 = OEs2.map((s) => ({ subject: (s.subject || "").trim() })).filter((s) => s.subject.length > 0);
    const cleanPEs2 = PEs2.map((s) => ({ subject: (s.subject || "").trim() })).filter((s) => s.subject.length > 0);

    const payload = {
      sections: cleanSections,
      subjects: cleanSem1,
      subjects2: cleanSem2
    };

    if (cleanOEs.length > 0) payload.OEs = cleanOEs;
    if (cleanPEs.length > 0) payload.PEs = cleanPEs;
    if (cleanOEs2.length > 0) payload.OEs2 = cleanOEs2;
    if (cleanPEs2.length > 0) payload.PEs2 = cleanPEs2;

    try {
      setLoading(true);
      const docRef = doc(db, "curriculum", selectedCourse.value, selectedYear.value, targetDept);
      await setDoc(docRef, payload);
      setSections(cleanSections);
      setSubjectsSem1(cleanSem1);
      setSubjectsSem2(cleanSem2);
      setLoading(false);
      setDialogState({
        message: `Curriculum for ${selectedCourse.value} - Year ${selectedYear.value} - ${targetDept} saved successfully!`,
        onOK: () => setDialogState(null)
      });
    } catch (err) {
      setLoading(false);
      setDialogState({
        message: "Failed to save curriculum: " + err.message,
        onOK: () => setDialogState(null)
      });
    }
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className={styles.container}>
      <Navbar title="Curriculum & Subjects Management" backURL="/faculty/admin" logout={true} />

      {dialogState && (
        <Dialog
          message={dialogState.message}
          twoButtons={dialogState.twoButtons}
          onConfirm={dialogState.onConfirm}
          onCancel={dialogState.onCancel}
          onOK={dialogState.onOK}
        />
      )}

      {/* Add Department Modal */}
      {showAddDeptModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "2rem",
            borderRadius: "12px",
            width: "360px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
          }}>
            <h3 style={{ marginTop: 0, color: "#14325a" }}>Add Department</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Enter department code for {selectedCourse.value} Year {selectedYear.value} (e.g. AIDS, CSBS):
            </p>
            <input
              type="text"
              autoFocus
              placeholder="e.g. AIDS"
              value={newDeptInput}
              onChange={(e) => setNewDeptInput(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                textTransform: "uppercase",
                boxSizing: "border-box",
                marginBottom: "1.25rem",
                fontSize: "1rem"
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateNewDept();
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => {
                  setShowAddDeptModal(false);
                  setNewDeptInput("");
                }}
                style={{
                  background: "#e2e8f0",
                  border: "none",
                  padding: "0.55rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                style={{ padding: "0.55rem 1.25rem" }}
                onClick={handleCreateNewDept}
              >
                Add Dept
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Curriculum Configuration</h2>
          <p className={styles.cardSubtitle}>
            Configure all 4 years and 2 semesters for each department (sections, semester subjects, and electives).
          </p>

          {userDept ? (
            <div className={styles.deptNotice}>
              <span>&#128274;</span>
              <span><strong>Department Scoped Access ({userDept}):</strong> You are managing curriculum and subjects for the {userDept} department.</span>
            </div>
          ) : (
            <div className={styles.superadminNotice}>
              <span>&#9881;</span>
              <span><strong>Superadmin Mode:</strong> You have unrestricted access to manage curriculum for all college departments.</span>
            </div>
          )}

          {/* Filter Row: Course, Year, Department */}
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Course</span>
              <Select
                value={selectedCourse}
                onChange={(opt) => setSelectedCourse(opt)}
                options={COURSES}
                isSearchable={false}
              />
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Study Year (1 to 4)</span>
              <Select
                value={selectedYear}
                onChange={(opt) => setSelectedYear(opt)}
                options={getYearOptions()}
                isSearchable={false}
              />
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Department</span>
              <Select
                placeholder="Select Department"
                value={selectedDept}
                onChange={handleDeptChange}
                options={departments}
                isDisabled={Boolean(userDept)}
                isSearchable={!userDept}
              />
            </div>

            {!userDept && (
              <div>
                <button
                  type="button"
                  className={styles.newDeptBtn}
                  onClick={() => setShowAddDeptModal(true)}
                >
                  + Add Department
                </button>
              </div>
            )}
          </div>

          {userDept && !deptExistsInDb ? (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem", background: "#f8fafc", borderRadius: "10px", border: "1px dashed #cbd5e1", margin: "1.5rem 0" }}>
              <p style={{ color: "#475569", fontSize: "1rem", marginBottom: "1rem" }}>
                Curriculum for <strong>{userDept}</strong> has not been initialized for {selectedCourse.value} Year {selectedYear.value}.
              </p>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => handleInitializeDept(userDept)}
              >
                + Initialize {userDept} for Year {selectedYear.value}
              </button>
            </div>
          ) : !selectedDept ? (
            <p className={styles.emptyState}>
              No department selected or available for {selectedCourse.value} Year {selectedYear.value}. Click "+ Add Department" to create one.
            </p>
          ) : (
            <>
              {/* Sections Manager */}
              <div className={styles.sectionRow}>
                <div className={styles.sectionHeader}>
                  Department Sections ({selectedDept.value}):
                </div>
                <div className={styles.sectionChips}>
                  {sections.map((sec) => (
                    <div key={sec} className={styles.chip}>
                      <span>Section {sec}</span>
                      <button
                        type="button"
                        className={styles.chipDeleteBtn}
                        onClick={() => handleDeleteSection(sec)}
                        title={`Remove section ${sec}`}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  <div className={styles.addChipBox}>
                    <input
                      type="text"
                      className={styles.chipInput}
                      placeholder="e.g. D"
                      maxLength={3}
                      value={newSectionInput}
                      onChange={(e) => setNewSectionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddSection();
                      }}
                    />
                    <button type="button" className={styles.chipAddBtn} onClick={handleAddSection}>
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* 2 Semesters Grid: Semester 1 & Semester 2 */}
              <div className={styles.semestersGrid}>
                {/* Semester 1 */}
                <div className={styles.semesterCol}>
                  <div className={styles.semHeader}>
                    <span className={styles.semTitle}>Semester 1 Subjects</span>
                    <span className={styles.subCount}>{subjectsSem1.length} Subjects</span>
                  </div>

                  <div className={styles.subjectList}>
                    {subjectsSem1.length === 0 ? (
                      <span className={styles.emptyState}>No subjects added yet.</span>
                    ) : (
                      subjectsSem1.map((item, index) => (
                        <div key={index} className={styles.subjectItem}>
                          <span className={styles.subjectNum}>{index + 1}.</span>
                          <input
                            type="text"
                            className={styles.subjectInput}
                            value={item.subject}
                            onChange={(e) => handleEditSubSem1(index, e.target.value)}
                          />
                          <button
                            type="button"
                            className={styles.subDeleteBtn}
                            onClick={() => handleDeleteSubSem1(index)}
                            title="Remove Subject"
                          >
                            &times;
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className={styles.addSubjectBox}>
                    <input
                      type="text"
                      className={styles.newSubjectInput}
                      placeholder="New subject name..."
                      value={newSubSem1Input}
                      onChange={(e) => setNewSubSem1Input(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddSubSem1();
                      }}
                    />
                    <button type="button" className={styles.addSubjectBtn} onClick={handleAddSubSem1}>
                      + Add
                    </button>
                  </div>
                </div>

                {/* Semester 2 */}
                <div className={styles.semesterCol}>
                  <div className={styles.semHeader}>
                    <span className={styles.semTitle}>Semester 2 Subjects</span>
                    <span className={styles.subCount}>{subjectsSem2.length} Subjects</span>
                  </div>

                  <div className={styles.subjectList}>
                    {subjectsSem2.length === 0 ? (
                      <span className={styles.emptyState}>No subjects added yet.</span>
                    ) : (
                      subjectsSem2.map((item, index) => (
                        <div key={index} className={styles.subjectItem}>
                          <span className={styles.subjectNum}>{index + 1}.</span>
                          <input
                            type="text"
                            className={styles.subjectInput}
                            value={item.subject}
                            onChange={(e) => handleEditSubSem2(index, e.target.value)}
                          />
                          <button
                            type="button"
                            className={styles.subDeleteBtn}
                            onClick={() => handleDeleteSubSem2(index)}
                            title="Remove Subject"
                          >
                            &times;
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className={styles.addSubjectBox}>
                    <input
                      type="text"
                      className={styles.newSubjectInput}
                      placeholder="New subject name..."
                      value={newSubSem2Input}
                      onChange={(e) => setNewSubSem2Input(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddSubSem2();
                      }}
                    />
                    <button type="button" className={styles.addSubjectBtn} onClick={handleAddSubSem2}>
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Electives Accordion */}
              <div className={styles.electivesBox}>
                <div className={styles.electivesHeader} onClick={() => setShowElectives(!showElectives)}>
                  <span className={styles.electivesTitle}>
                    Optional: Electives (OEs / PEs) {showElectives ? "▲" : "▼"}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Total: {OEs.length + PEs.length + OEs2.length + PEs2.length} configured
                  </span>
                </div>

                {showElectives && (
                  <div className={styles.electivesContent}>
                    {/* Sem 1 Electives */}
                    <div>
                      <h4 style={{ margin: "0 0 0.5rem 0", color: "#334155" }}>Sem 1 Electives</h4>
                      <div style={{ marginBottom: "0.75rem" }}>
                        <label style={{ fontSize: "0.8rem", color: "#64748b" }}>Open Electives (OEs)</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", margin: "0.4rem 0" }}>
                          {OEs.map((oe, i) => (
                            <span key={i} className={styles.chip}>
                              {oe.subject}
                              <button type="button" className={styles.chipDeleteBtn} onClick={() => handleDeleteOE(i)}>&times;</button>
                            </span>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <input
                            type="text"
                            placeholder="Add OE subject"
                            className={styles.newSubjectInput}
                            value={newOEInput}
                            onChange={(e) => setNewOEInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddOE()}
                          />
                          <button type="button" className={styles.chipAddBtn} onClick={handleAddOE}>+ Add</button>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "0.8rem", color: "#64748b" }}>Professional Electives (PEs)</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", margin: "0.4rem 0" }}>
                          {PEs.map((pe, i) => (
                            <span key={i} className={styles.chip}>
                              {pe.subject}
                              <button type="button" className={styles.chipDeleteBtn} onClick={() => handleDeletePE(i)}>&times;</button>
                            </span>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <input
                            type="text"
                            placeholder="Add PE subject"
                            className={styles.newSubjectInput}
                            value={newPEInput}
                            onChange={(e) => setNewPEInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddPE()}
                          />
                          <button type="button" className={styles.chipAddBtn} onClick={handleAddPE}>+ Add</button>
                        </div>
                      </div>
                    </div>

                    {/* Sem 2 Electives */}
                    <div>
                      <h4 style={{ margin: "0 0 0.5rem 0", color: "#334155" }}>Sem 2 Electives</h4>
                      <div style={{ marginBottom: "0.75rem" }}>
                        <label style={{ fontSize: "0.8rem", color: "#64748b" }}>Open Electives 2 (OEs2)</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", margin: "0.4rem 0" }}>
                          {OEs2.map((oe, i) => (
                            <span key={i} className={styles.chip}>
                              {oe.subject}
                              <button type="button" className={styles.chipDeleteBtn} onClick={() => handleDeleteOE2(i)}>&times;</button>
                            </span>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <input
                            type="text"
                            placeholder="Add OE2 subject"
                            className={styles.newSubjectInput}
                            value={newOE2Input}
                            onChange={(e) => setNewOE2Input(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddOE2()}
                          />
                          <button type="button" className={styles.chipAddBtn} onClick={handleAddOE2}>+ Add</button>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "0.8rem", color: "#64748b" }}>Professional Electives 2 (PEs2)</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", margin: "0.4rem 0" }}>
                          {PEs2.map((pe, i) => (
                            <span key={i} className={styles.chip}>
                              {pe.subject}
                              <button type="button" className={styles.chipDeleteBtn} onClick={() => handleDeletePE2(i)}>&times;</button>
                            </span>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <input
                            type="text"
                            placeholder="Add PE2 subject"
                            className={styles.newSubjectInput}
                            value={newPE2Input}
                            onChange={(e) => setNewPE2Input(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddPE2()}
                          />
                          <button type="button" className={styles.chipAddBtn} onClick={handleAddPE2}>+ Add</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Bar */}
              <div className={styles.saveBar}>
                <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
                  Editing: <strong>{selectedCourse.value}</strong> &bull; <strong>Year {selectedYear.value}</strong> &bull; <strong>{selectedDept.value}</strong>
                </span>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={handleSaveCurriculum}
                >
                  Save Curriculum
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
