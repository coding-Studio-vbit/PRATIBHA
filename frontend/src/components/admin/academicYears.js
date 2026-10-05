import React, { useEffect, useState } from "react";
import Navbar from "../global_ui/navbar/navbar";
import Select from "react-select";
import Dialog from "../global_ui/dialog/dialog";
import { LoadingScreen } from "../global_ui/spinner/spinner";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc
} from "firebase/firestore";
import styles from "./academicYears.module.css";
import { useAuth } from "../context/AuthContext";

const COURSES = [
  { value: "BTech", label: "BTech (4 Years)" },
  { value: "MBA", label: "MBA (2 Years)" },
  { value: "MTech", label: "MTech (2 Years)" }
];

export default function AcademicYears() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [acadYears, setAcadYears] = useState([]);
  const [newAyInput, setNewAyInput] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);

  // Cohort assignments for selected course: { "1": "2025-26", "2": "2024-25", ... }
  const [cohortYears, setCohortYears] = useState({});

  // Dialog state
  const [dialogState, setDialogState] = useState(null); // { message, onConfirm, onCancel, twoButtons }

  // Load acadyears pool
  const fetchAcadYearsPool = async () => {
    try {
      const ref = doc(db, "adminData", "acadyears");
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().acadYears) {
        setAcadYears(snap.data().acadYears);
      } else {
        setAcadYears([]);
      }
    } catch (err) {
      console.error("Error fetching acadyears:", err);
      setDialogState({
        message: "Failed to load academic years pool: " + err.message,
        onOK: () => setDialogState(null)
      });
    }
  };

  // Load cohort assignments for selected course
  const fetchCohortsForCourse = async (courseName) => {
    try {
      const courseCollectionRef = collection(db, "adminData", "academic_year", courseName);
      const snap = await getDocs(courseCollectionRef);
      const data = {};
      snap.forEach((d) => {
        data[d.id] = d.data().ay || "";
      });
      setCohortYears(data);
    } catch (err) {
      console.error("Error fetching cohort years:", err);
      setDialogState({
        message: `Failed to load cohort academic years for ${courseName}: ` + err.message,
        onOK: () => setDialogState(null)
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchAcadYearsPool();
      await fetchCohortsForCourse(selectedCourse.value);
      setLoading(false);
    };
    init();
  }, [selectedCourse]);

  // Add new academic year to pool
  const handleAddAcadYear = async () => {
    const trimmed = newAyInput.trim();
    const regex = /^\d{4}-\d{2}$/;
    if (!regex.test(trimmed)) {
      setDialogState({
        message: "Please enter academic year in format YYYY-YY (e.g. 2026-27)",
        onOK: () => setDialogState(null)
      });
      return;
    }
    if (acadYears.includes(trimmed)) {
      setDialogState({
        message: `Academic year "${trimmed}" already exists in pool.`,
        onOK: () => setDialogState(null)
      });
      return;
    }

    try {
      setLoading(true);
      const updated = [...acadYears, trimmed];
      const ref = doc(db, "adminData", "acadyears");
      await setDoc(ref, { acadYears: updated }, { merge: true });
      setAcadYears(updated);
      setNewAyInput("");
      setLoading(false);
      setDialogState({
        message: `Academic year "${trimmed}" added successfully!`,
        onOK: () => setDialogState(null)
      });
    } catch (err) {
      setLoading(false);
      setDialogState({
        message: "Failed to add academic year: " + err.message,
        onOK: () => setDialogState(null)
      });
    }
  };

  // Delete academic year from pool
  const handleDeleteAcadYear = (ayToDelete) => {
    setDialogState({
      message: `Are you sure you want to delete "${ayToDelete}" from the academic year options?`,
      twoButtons: true,
      onConfirm: async () => {
        setDialogState(null);
        try {
          setLoading(true);
          const updated = acadYears.filter((item) => item !== ayToDelete);
          const ref = doc(db, "adminData", "acadyears");
          await setDoc(ref, { acadYears: updated }, { merge: true });
          setAcadYears(updated);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          setDialogState({
            message: "Failed to delete academic year: " + err.message,
            onOK: () => setDialogState(null)
          });
        }
      },
      onCancel: () => setDialogState(null)
    });
  };

  // Save Cohorts
  const handleSaveCohorts = async () => {
    try {
      setLoading(true);
      const maxYears = selectedCourse.value === "BTech" ? 4 : 2;
      for (let y = 1; y <= maxYears; y++) {
        const yearStr = String(y);
        const assignedAY = cohortYears[yearStr] || "";
        const ref = doc(db, "adminData", "academic_year", selectedCourse.value, yearStr);
        await setDoc(ref, { ay: assignedAY }, { merge: true });
      }
      setLoading(false);
      setDialogState({
        message: `Academic year cohorts for ${selectedCourse.value} updated successfully!`,
        onOK: () => setDialogState(null)
      });
    } catch (err) {
      setLoading(false);
      setDialogState({
        message: "Failed to update cohort academic years: " + err.message,
        onOK: () => setDialogState(null)
      });
    }
  };

  const getYearCount = () => (selectedCourse.value === "BTech" ? 4 : 2);

  const ayOptions = acadYears.map((ay) => ({ value: ay, label: ay }));

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className={styles.container}>
      <Navbar
        title="Academic Years Management"
        backURL={currentUser?.isCOE && !currentUser?.isAdmin ? "/faculty/coesearch" : "/faculty/admin"}
        logout={true}
      />

      {dialogState && (
        <Dialog
          message={dialogState.message}
          twoButtons={dialogState.twoButtons}
          onConfirm={dialogState.onConfirm}
          onCancel={dialogState.onCancel}
          onOK={dialogState.onOK}
        />
      )}

      <div className={styles.content}>
        {/* Section 1: Academic Years Range Pool */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Academic Years Pool (Ranges)</h2>
          <p className={styles.cardSubtitle}>
            These academic years (e.g. 2024-25, 2025-26) are available throughout the system for
            student enrollments, cohort mapping, and curriculum tracking.
          </p>

          <div className={styles.tagPool}>
            {acadYears.length === 0 ? (
              <span className={styles.emptyState}>No academic years configured yet.</span>
            ) : (
              acadYears.map((ay) => (
                <div key={ay} className={styles.tag}>
                  <span>{ay}</span>
                  <button
                    type="button"
                    title={`Delete ${ay}`}
                    className={styles.tagDeleteBtn}
                    onClick={() => handleDeleteAcadYear(ay)}
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>

          <div className={styles.addRow}>
            <input
              type="text"
              className={styles.textInput}
              placeholder="e.g. 2027-28"
              value={newAyInput}
              onChange={(e) => setNewAyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddAcadYear();
              }}
            />
            <button type="button" className={styles.primaryBtn} onClick={handleAddAcadYear}>
              + Add Year
            </button>
          </div>
        </div>

        {/* Section 2: Active Academic Year Cohort per Course & Year */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Current Academic Year Cohorts</h2>
          <p className={styles.cardSubtitle}>
            Specify which academic year batch is currently studying in each year (Years 1 to 4).
            Update this every academic year when batches advance.
          </p>

          <div className={styles.courseSelectRow}>
            <span style={{ fontWeight: 600, color: "#334155" }}>Course:</span>
            <div style={{ flex: 1 }}>
              <Select
                value={selectedCourse}
                onChange={(option) => setSelectedCourse(option)}
                options={COURSES}
                isSearchable={false}
              />
            </div>
          </div>

          <div className={styles.cohortGrid}>
            {Array.from({ length: getYearCount() }, (_, i) => i + 1).map((yr) => {
              const yrStr = String(yr);
              const currentVal = cohortYears[yrStr];
              const selectedOption = currentVal
                ? { value: currentVal, label: currentVal }
                : null;

              return (
                <div key={yrStr} className={styles.yearCard}>
                  <div className={styles.yearHeader}>
                    <span className={styles.yearTitle}>Year {yr}</span>
                    {currentVal && (
                      <span className={styles.currentBadge}>Current: {currentVal}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.3rem", display: "block" }}>
                      Assigned Academic Year:
                    </label>
                    <Select
                      placeholder="Select Academic Year"
                      value={selectedOption}
                      onChange={(opt) =>
                        setCohortYears((prev) => ({
                          ...prev,
                          [yrStr]: opt ? opt.value : ""
                        }))
                      }
                      options={ayOptions}
                      isClearable={true}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleSaveCohorts}
            >
              Save Cohort Academic Years
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
