// // src/pages/ExperimentFlowPage.jsx
// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { Button } from '@/components/ui/button';
// import axios from 'axios';

// function SortableStep({ step }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id: step.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       className="bg-white p-6 mb-4 rounded-lg shadow-lg cursor-move border border-gray-200 hover:border-gray-300 transition"
//     >
//       <div className="font-semibold text-lg">{step.name}</div>
//       <div className="text-sm text-gray-500 mt-1">{step.type || 'Custom Step'}</div>
//     </div>
//   );
// }

// export default function ExperimentFlowPage() {
//   const [steps, setSteps] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();
//   const { search } = useLocation();
//   const params = new URLSearchParams(search);
//   const experimentId = params.get('experimentId');

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   // Load steps on mount
//   useEffect(() => {
//     if (!experimentId) {
//       navigate('/experiments');
//       return;
//     }

//     axios.get(`/api/experiments/${experimentId}`)
//       .then(res => {
//         setSteps(res.data.steps || []);
//         setLoading(false);
//       })
//       .catch(() => {
//         alert('Failed to load experiment');
//         navigate('/experiments');
//       });
//   }, [experimentId, navigate]);

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (!over || active.id === over.id) return;

//     setSteps((items) => {
//       const oldIndex = items.findIndex((i) => i.id === active.id);
//       const newIndex = items.findIndex((i) => i.id === over.id);
//       return arrayMove(items, oldIndex, newIndex);
//     });
//   };

//   // This is the ONLY important part — talks exactly to your backend
//   const saveOrder = async () => {
//     try {
//       const orderedStepIds = steps.map(step => step.id);

//       await axios.put(`/api/experiments/${experimentId}/reorder_steps`, {
//         steps: orderedStepIds
//       });

//       // Go back and refresh the experiment config page
//       navigate(`/experiments/${experimentId}`, { replace: true });
//       window.location.reload(); // ensures Flow tab shows new order immediately

//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.detail || 'Failed to save step order');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div>Loading steps...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Reorder Experiment Steps</h1>
//         <Button variant="outline" onClick={() => navigate(-1)}>
//           Cancel
//         </Button>
//       </div>

//       {steps.length === 0 ? (
//         <p className="text-gray-500 text-center py-10">No steps in this experiment yet.</p>
//       ) : (
//         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//           <SortableContext items={steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
//             {steps.map((step) => (
//               <SortableStep key={step.id} step={step} />
//             ))}
//           </SortableContext>
//         </DndContext>
//       )}

//       <div className="mt-10 flex justify-end gap-4">
//         <Button variant="secondary" onClick={() => navigate(-1)}>
//           Cancel
//         </Button>
//         <Button onClick={saveOrder} size="lg">
//           Save New Order
//         </Button>
//       </div>
//     </div>
//   );
// }