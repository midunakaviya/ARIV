
// // src/pages/ExperimentFlowPage.jsx  ← FINAL VERSION (replace your current one)
// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { Trash2, GripVertical, Edit3, Plus } from "lucide-react";

// const API_BASE = "http://localhost:8000";

// function SortableStep({ id, title, subtitle, selected, onSelect, onDelete }) {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
//   const style = { transform: CSS.Transform.toString(transform), transition };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       className={`flex items-center gap-4 p-5 bg-white rounded-2xl border ${selected ? "border-indigo-500 ring-2 ring-indigo-100" : "border-gray-200"} shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group`}
//     >
//       <GripVertical className="w-5 h-5 text-gray-400" />
//       <div className="flex-1">
//         <h4 className="font-semibold text-lg">{title}</h4>
//         <p className="text-sm text-gray-600">{subtitle}</p>
//       </div>
//       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//         <button onClick={(e) => { e.stopPropagation(); onSelect(id); }} className="p-2 hover:bg-gray-100 rounded-lg">
//           <Edit3 className="w-4 h-4 text-gray-600" />
//         </button>
//         <button onClick={(e) => { e.stopPropagation(); onDelete(id); }} className="p-2 hover:bg-red-50 rounded-lg">
//           <Trash2 className="w-4 h-4 text-red-600" />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function ExperimentFlowPage() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const experimentId = searchParams.get("experimentId");
//   const token = localStorage.getItem("token");

//   const [steps, setSteps] = useState([]);
//   const [selectedId, setSelectedId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [editSubtitle, setEditSubtitle] = useState("");

//   const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

//   // Load real experiment
//   useEffect(() => {
//     if (!experimentId || experimentId === "new") return;
//     fetch(`${API_BASE}/experiments/${experimentId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(r => r.json())
//       .then(data => {
//         const loadedSteps = (data.steps || []).map((s, i) => ({
//           id: s.id || `step-${i}`,
//           title: s.title || "Untitled Step",
//           subtitle: s.subtitle || "",
//         }));
//         setSteps(loadedSteps.length > 0 ? loadedSteps : [
//           { id: "welcome", title: "Welcome Message", subtitle: "Greet participants" },
//           { id: "consent", title: "Consent Form", subtitle: "Get participant agreement" },
//         ]);
//       });
//   }, [experimentId, token]);

//   const selectedStep = useMemo(() => steps.find(s => s.id === selectedId), [steps, selectedId]);

//   useEffect(() => {
//     if (selectedStep) {
//       setEditTitle(selectedStep.title);
//       setEditSubtitle(selectedStep.subtitle);
//     }
//   }, [selectedStep]);

//   const saveFlow = async () => {
//     const payload = { steps: steps.map(s => ({ title: s.title, subtitle: s.subtitle })) };
//     await fetch(`${API_BASE}/experiments/${experimentId}`, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });
//     alert("Flow saved!");
//   };

//   const onDragEnd = (event) => {
//     const { active, over } = event;
//     if (!over || active.id === over.id) return;
//     setSteps(items => {
//       const oldIndex = items.findIndex(i => i.id === active.id);
//       const newIndex = items.findIndex(i => i.id === over.id);
//       return arrayMove(items, oldIndex, newIndex);
//     });
//   };

//   const applyEdit = () => {
//     setSteps(prev => prev.map(s => s.id === selectedId ? { ...s, title: editTitle, subtitle: editSubtitle } : s));
//     setSelectedId(null);
//   };

//   const deleteStep = (id) => {
//     setSteps(prev => prev.filter(s => s.id !== id));
//     if (selectedId === id) setSelectedId(null);
//   };

//   if (!token) { navigate("/auth"); return null; }
//   if (!experimentId) { navigate("/dashboard"); return null; }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
//         <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
//           <h1 className="text-3xl font-bold">Experiment Flow Editor</h1>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(`/surveys?experimentId=${experimentId}`)}
//               className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg flex items-center gap-2"
//             >
//               <Plus className="w-5 h-5" /> Add Survey
//             </button>
//             <button onClick={saveFlow} className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900">
//               Save Flow
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-12 gap-8">
//         <main className="col-span-8 space-y-6">
//           <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
//             <SortableContext items={steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
//               {steps.map((step) => (
//                 <SortableStep
//                   key={step.id}
//                   id={step.id}
//                   title={step.title}
//                   subtitle={step.subtitle}
//                   selected={selectedId === step.id}
//                   onSelect={setSelectedId}
//                   onDelete={deleteStep}
//                 />
//               ))}
//             </SortableContext>
//           </DndContext>
//         </main>

//         <aside className="col-span-4">
//           <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-24">
//             <h2 className="text-xl font-bold mb-4">Step Properties</h2>
//             {!selectedId ? (
//               <p className="text-gray-500">Click a step to edit</p>
//             ) : (
//               <div className="space-y-4">
//                 <input
//                   value={editTitle}
//                   onChange={e => setEditTitle(e.target.value)}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Title"
//                 />
//                 <textarea
//                   value={editSubtitle}
//                   onChange={e => setEditSubtitle(e.target.value)}
//                   rows={3}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Description"
//                 />
//                 <button onClick={applyEdit} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
//                   Apply Changes
//                 </button>
//               </div>
//             )}
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }

// src/pages/ExperimentFlowPage.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import axios from 'axios';

function SortableStep({ step }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-6 mb-4 rounded-lg shadow-lg cursor-move border border-gray-200 hover:border-gray-300 transition"
    >
      <div className="font-semibold text-lg">{step.name}</div>
      <div className="text-sm text-gray-500 mt-1">{step.type || 'Custom Step'}</div>
    </div>
  );
}

export default function ExperimentFlowPage() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const experimentId = params.get('experimentId');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load steps on mount
  useEffect(() => {
    if (!experimentId) {
      navigate('/experiments');
      return;
    }

    axios.get(`/api/experiments/${experimentId}`)
      .then(res => {
        setSteps(res.data.steps || []);
        setLoading(false);
      })
      .catch(() => {
        alert('Failed to load experiment');
        navigate('/experiments');
      });
  }, [experimentId, navigate]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSteps((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // This is the ONLY important part — talks exactly to your backend
  const saveOrder = async () => {
    try {
      const orderedStepIds = steps.map(step => step.id);

      await axios.put(`/api/experiments/${experimentId}/reorder_steps`, {
        steps: orderedStepIds
      });

      // Go back and refresh the experiment config page
      navigate(`/experiments/${experimentId}`, { replace: true });
      window.location.reload(); // ensures Flow tab shows new order immediately

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || 'Failed to save step order');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading steps...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reorder Experiment Steps</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>

      {steps.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No steps in this experiment yet.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {steps.map((step) => (
              <SortableStep key={step.id} step={step} />
            ))}
          </SortableContext>
        </DndContext>
      )}

      <div className="mt-10 flex justify-end gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button onClick={saveOrder} size="lg">
          Save New Order
        </Button>
      </div>
    </div>
  );
}