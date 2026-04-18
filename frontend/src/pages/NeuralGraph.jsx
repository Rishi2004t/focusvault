import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Zap, X, ArrowRight, Activity, ShieldCheck, Brain } from 'lucide-react';

// ── Task Node (3D Sphere) ──────────────────────────────────────────────────
function TaskNode({ task, position, onClick, hovered, setHovered }) {
  const meshRef = useRef();
  const color = task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#6366f1' : '#10b981';

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + task._id.length) * 0.12;
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[0.3, 32, 32]}
        onClick={onClick}
        onPointerOver={() => setHovered(task._id)}
        onPointerOut={() => setHovered(null)}
      >
        <MeshDistortMaterial
          color={color}
          speed={2}
          distort={0.4}
          radius={0.3}
          emissive={color}
          emissiveIntensity={hovered === task._id ? 2.5 : 0.6}
          transparent
          opacity={0.85}
        />
      </Sphere>

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 0.65, 0]}
          fontSize={0.14}
          color="white"
          anchorX="center"
          anchorY="middle"
          visible={hovered === task._id}
          maxWidth={2}
        >
          {task.title}
        </Text>
      </Float>
    </group>
  );
}

// ── Connection Lines ───────────────────────────────────────────────────────
function Connections({ tasks, positions }) {
  const points = useMemo(() => {
    const lines = [];
    tasks.forEach((t1, i) => {
      tasks.forEach((t2, j) => {
        if (i < j && (t1.projectContext === t2.projectContext || t1.category === t2.category)) {
          lines.push(new THREE.Vector3(...positions[i]));
          lines.push(new THREE.Vector3(...positions[j]));
        }
      });
    });
    return lines;
  }, [tasks, positions]);

  if (points.length === 0) return null;

  return (
    <lineSegments>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(v => [v.x, v.y, v.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="#6366f1" opacity={0.15} transparent />
    </lineSegments>
  );
}

// ── Main Neural Graph Page ─────────────────────────────────────────────────
export default function NeuralGraph() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data || []);
      } catch (err) {
        console.error('Neural connection failure', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Stable random positions — regenerate only when task count changes
  const positions = useMemo(() => {
    return tasks.map(() => [
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 7,
      (Math.random() - 0.5) * 5
    ]);
  }, [tasks.length]);

  // ── Loading State ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center animate-pulse">
          <Brain size={24} className="text-indigo-400" />
        </div>
        <p className="text-indigo-400 font-bold tracking-[0.3em] uppercase text-xs">
          Synchronizing Neural Web...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-slate-950 relative overflow-hidden">

      {/* ── 3D Canvas — adaptive scaling ── */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 0, window.innerWidth < 768 ? 20 : 12], fov: 55 }}>
          <PerspectiveCamera 
            makeDefault 
            position={[0, 0, window.innerWidth < 768 ? 20 : 12]} 
          />
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <pointLight position={[-10, -10, -10]} color="#6366f1" intensity={0.8} />

          <group>
            {tasks.map((task, i) => (
              <TaskNode
                key={task._id}
                task={task}
                position={positions[i]}
                onClick={() => setSelectedTask(task)}
                hovered={hovered}
                setHovered={setHovered}
              />
            ))}
            <Connections tasks={tasks} positions={positions} />
          </group>

          <OrbitControls
            enableDamping
            dampingFactor={0.06}
            maxDistance={30}
            minDistance={4}
            enablePan={true}
            autoRotate={!selectedTask}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* ── Floating Header ── */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10 flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 backdrop-blur-md">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white italic">Neural Web</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Spatial Task Topography · {tasks.length} nodes
          </p>
        </div>
      </div>

      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 flex gap-2 sm:gap-3">
        <button
          onClick={() => navigate('/tasks')}
          className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md hover:bg-white/10 transition-all"
        >
          Planner
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md hover:bg-white/10 transition-all"
        >
          Exit
        </button>
      </div>

      {/* ── Empty State ── */}
      {tasks.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-6">
          <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Brain size={36} className="text-indigo-400 opacity-60" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-white italic mb-2">No Neural Nodes Detected</h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-6">
              Create tasks to populate the constellation
            </p>
            <button
              onClick={() => navigate('/tasks')}
              className="px-8 py-3 bg-indigo-600 rounded-2xl text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
            >
              <Zap size={14} /> Initialize Task Matrix
            </button>
          </div>
        </div>
      )}

      {/* ── Selected Task Side Panel ── */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0, y: window.innerWidth < 768 ? 100 : 0, x: window.innerWidth < 768 ? 0 : 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: window.innerWidth < 768 ? 100 : 0, x: window.innerWidth < 768 ? 0 : 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 right-0 top-auto lg:top-0 w-full lg:w-80 h-[60vh] lg:h-full bg-slate-900/90 backdrop-blur-2xl border-t lg:border-l border-white/5 p-6 sm:p-8 z-20 flex flex-col rounded-t-[2.5rem] lg:rounded-none shadow-2xl"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest">
                <Zap size={10} /> Neural Node Active
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-white transition-colors w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <h2 className="text-2xl font-black text-white italic leading-tight mb-3">
              {selectedTask.title}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {selectedTask.description || 'No neural briefing provided.'}
            </p>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Priority</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  selectedTask.priority === 'high' ? 'text-rose-400'
                  : selectedTask.priority === 'medium' ? 'text-indigo-400'
                  : 'text-emerald-400'
                }`}>{selectedTask.priority}</span>
              </div>
              {selectedTask.projectContext && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Project</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{selectedTask.projectContext}</span>
                </div>
              )}
              {selectedTask.category && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{selectedTask.category}</span>
                </div>
              )}
            </div>

            <div className="mt-auto space-y-3 pt-8">
              <button
                onClick={() => navigate(`/focus/${selectedTask._id}`)}
                className="w-full flex items-center justify-between px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all group"
              >
                Enter Focus Mode
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/tasks')}
                className="w-full px-6 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
              >
                View in Planner
              </button>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <Activity size={14} className="text-indigo-400 shrink-0" />
                <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed tracking-tight">
                  Node health optimal. No fragmentation detected.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Legend ── */}
      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-10 flex flex-wrap gap-3 sm:gap-5 p-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/5 max-w-[calc(100%-2rem)]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">Tactical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">Routine</span>
        </div>
      </div>

      {/* ── Controls Hint ── */}
      <div className="absolute bottom-6 right-6 z-10 text-right">
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Drag to orbit · Scroll to zoom</p>
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Click node to select</p>
      </div>

    </div>
  );
}
