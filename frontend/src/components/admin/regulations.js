import React, { useEffect, useState } from "react";
import Navbar from "../global_ui/navbar/navbar";
import Select from "react-select";
import Dialog from "../global_ui/dialog/dialog";
import { LoadingScreen } from "../global_ui/spinner/spinner";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import styles from "./regulations.module.css";
import { useAuth } from "../context/AuthContext";

const STUDY_YEARS = [
  { key: "1", label: "Year 1 (1st Year)" },
  { key: "2", label: "Year 2 (2nd Year)" },
  { key: "3", label: "Year 3 (3rd Year)" },
  { key: "4", label: "Year 4 (4th Year)" },
  { key: "5", label: "MBA / Postgrad" }
];

export default function Regulations() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [regArray, setRegArray] = useState([]);
  const [mapping, setMapping] = useState({});

  // Form for adding regulation
  const [regName, setRegName] = useState("");
  const [totalMarks, setTotalMarks] = useState(10);

  // Dialog state
  const [dialogState, setDialogState] = useState(null);

  const fetchRegulationsData = async () => {
    try {
      const ref = doc(db, "adminData", "regulations");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setRegArray(data.regarray || []);
        setMapping(data.mapping || {});
      } else {
        setRegArray([]);
        setMapping({});
      }
    } catch (err) {
      console.error("Error loading regulations:", err);
      setDialogState({
        message: "Failed to load regulations: " + err.message,
        onOK: () => setDialogState(null)
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchRegulationsData();
      setLoading(false);
    };
    init();
  }, []);

  // Add Regulation
  const handleAddRegulation = async (e) => {
    e.preventDefault();
    const trimmed = regName.trim().toUpperCase();
    if (!trimmed) {
      setDialogState({
        message: "Please enter a valid regulation code (e.g. R25)",
        onOK: () => setDialogState(null)
      });
      return;
    }

    const marksNum = parseInt(totalMarks, 10);
    if (isNaN(marksNum) || marksNum <= 0) {
      setDialogState({
        message: "Please enter valid total marks (e.g. 10)",
        onOK: () => setDialogState(null)
      });
      return;
    }

    // Check duplicate
    if (regArray.some((r) => r.regulation.toUpperCase() === trimmed)) {
      setDialogState({
        message: `Regulation "${trimmed}" already exists.`,
        onOK: () => setDialogState(null)
      });
      return;
    }

    const updatedRegArray = [...regArray, { regulation: trimmed, totalmarks: marksNum }];

    try {
      setLoading(true);
      const ref = doc(db, "adminData", "regulations");
      await setDoc(ref, { regarray: updatedRegArray }, { merge: true });
      setRegArray(updatedRegArray);
      setRegName("");
      setTotalMarks(10);
      setLoading(false);
      setDialogState({
        message: `Regulation "${trimmed}" added successfully!`,
        onOK: () => setDialogState(null)
      });
    } catch (err) {
      setLoading(false);
      setDialogState({
        message: "Failed to add regulation: " + err.message,
        onOK: () => setDialogState(null)
      });
    }
  };

  // Delete Regulation
  const handleDeleteRegulation = (regCode) => {
    setDialogState({
      message: `Are you sure you want to delete regulation "${regCode}"?`,
      twoButtons: true,
      onConfirm: async () => {
        setDialogState(null);
        try {
          setLoading(true);
          const updatedRegArray = regArray.filter((r) => r.regulation !== regCode);
          // If any mapping used this regulation, clear it
          const updatedMapping = { ...mapping };
          Object.keys(updatedMapping).forEach((yr) => {
            if (updatedMapping[yr] === regCode) {
              delete updatedMapping[yr];
            }
          });

          const ref = doc(db, "adminData", "regulations");
          await setDoc(ref, { regarray: updatedRegArray, mapping: updatedMapping }, { merge: true });
          setRegArray(updatedRegArray);
          setMapping(updatedMapping);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          setDialogState({
            message: "Failed to delete regulation: " + err.message,
            onOK: () => setDialogState(null)
          });
        }
      },
      onCancel: () => setDialogState(null)
    });
  };

  // Save Year-to-Regulation Mapping
  const handleSaveMapping = async () => {
    try {
      setLoading(true);
      const ref = doc(db, "adminData", "regulations");
      await setDoc(ref, { mapping: mapping }, { merge: true });
      setLoading(false);
      setDialogState({
        message: "Regulation mappings saved successfully!",
        onOK: () => setDialogState(null)
      });
    } catch (err) {
      setLoading(false);
      setDialogState({
        message: "Failed to save regulation mappings: " + err.message,
        onOK: () => setDialogState(null)
      });
    }
  };

  const regOptions = regArray.map((r) => ({
    value: r.regulation,
    label: `${r.regulation} (${r.totalmarks} Marks)`
  }));

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className={styles.container}>
      <Navbar
        title="Regulations Management"
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
        {/* Section 1: Regulations List */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Available Regulations</h2>
          <p className={styles.cardSubtitle}>
            Configure university curriculum regulations and their evaluation maximum PRA marks.
          </p>

          <div className={styles.tableContainer}>
            {regArray.length === 0 ? (
              <p style={{ color: "#94a3b8" }}>No regulations configured.</p>
            ) : (
              <table className={styles.regTable}>
                <thead>
                  <tr>
                    <th>Regulation</th>
                    <th>Total Marks</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {regArray.map((item) => (
                    <tr key={item.regulation}>
                      <td>
                        <span className={styles.badge}>{item.regulation}</span>
                      </td>
                      <td>{item.totalmarks} Marks</td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteRegulation(item.regulation)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Add Regulation Form */}
          <form className={styles.addForm} onSubmit={handleAddRegulation}>
            <div className={styles.formGroup}>
              <label>Regulation Code</label>
              <input
                type="text"
                placeholder="e.g. R26"
                className={styles.formInput}
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Total Marks</label>
              <input
                type="number"
                min="1"
                max="100"
                className={styles.formInput}
                style={{ width: "100px" }}
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.primaryBtn}>
              + Add Regulation
            </button>
          </form>
        </div>

        {/* Section 2: Year-to-Regulation Mapping */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Year-to-Regulation Mapping</h2>
          <p className={styles.cardSubtitle}>
            Assign which academic regulation applies to each study year cohort.
          </p>

          <div className={styles.mappingGrid}>
            {STUDY_YEARS.map((yr) => {
              const currentVal = mapping[yr.key];
              const selectedOption = currentVal
                ? regOptions.find((o) => o.value === currentVal) || { value: currentVal, label: currentVal }
                : null;

              return (
                <div key={yr.key} className={styles.mapCard}>
                  <span className={styles.mapTitle}>{yr.label}</span>
                  <div>
                    <label style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.3rem", display: "block" }}>
                      Active Regulation:
                    </label>
                    <Select
                      placeholder="Select Regulation"
                      value={selectedOption}
                      onChange={(opt) =>
                        setMapping((prev) => ({
                          ...prev,
                          [yr.key]: opt ? opt.value : ""
                        }))
                      }
                      options={regOptions}
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
              onClick={handleSaveMapping}
            >
              Save Regulation Mapping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
