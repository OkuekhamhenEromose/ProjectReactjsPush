// ==================== TASK MANAGER LOGIC EXPLANATION ====================
// 🏗️ App Structure Overview
// This app has 3 main sections:

// To Do - Tasks waiting to start

// In Progress - Tasks being worked on

// Done - Completed tasks

// 🧠 Core React Concepts Demonstrated
// 1. State Management - The Task Board's Memory
// jsx
// const [tasks, setTasks] = useState({
//   todo: [...],
//   inProgress: [...],
//   done: [...]
// });
// Simple Explanation:

// tasks is an object that holds ALL tasks organized by columns

// Each column (todo, inProgress, done) is an array of task objects

// When we update tasks, React automatically updates the display

// 2. Task Object Structure
// jsx
// {
//   id: 1,                    // Unique identifier
//   text: 'Design landing page', // What needs to be done
//   priority: 'high',         // Importance level
//   status: 'todo',           // Which column it's in
//   createdAt: new Date()     // When it was created
// }
// 🔄 Key Operations (CRUD)
// 1. Moving Tasks Between Columns
// jsx
// const moveTask = (taskId, fromColumn, toColumn) => {
//   setTasks(prev => {
//     // 1. Find the task to move
//     const task = prev[fromColumn].find(t => t.id === taskId);
    
//     // 2. Remove from original column
//     const newFromColumn = prev[fromColumn].filter(t => t.id !== taskId);
    
//     // 3. Add to new column
//     const newToColumn = [...prev[toColumn], {...task, status: toColumn}];
    
//     // 4. Return updated tasks object
//     return {
//       ...prev,
//       [fromColumn]: newFromColumn,
//       [toColumn]: newToColumn
//     };
//   });
// };
// Real-world analogy: Moving a sticky note from "To Do" to "In Progress" on a physical board.

// 2. Adding New Tasks
// jsx
// const addTask = () => {
//   const newTask = {
//     id: Date.now(),              // Simple unique ID
//     text: newTaskText,           // What user typed
//     priority: newTaskPriority,   // Selected priority
//     status: newTaskColumn,       // Which column to add to
//     createdAt: new Date()        // Timestamp
//   };
  
//   setTasks(prev => ({
//     ...prev,
//     [newTaskColumn]: [...prev[newTaskColumn], newTask]
//   }));
// };
// What's happening:

// Create new task object with all required data

// Add it to the selected column

// Keep all existing tasks

// 3. Deleting Tasks
// jsx
// const deleteTask = (taskId, column) => {
//   setTasks(prev => ({
//     ...prev,
//     [column]: prev[column].filter(t => t.id !== taskId)
//   }));
// };
// Simple explanation: Remove the task from its column by filtering it out.

// 🎨 UI Components Logic
// 1. Column Display System
// jsx
// const columns = [
//   { id: 'todo', title: 'To Do', color: 'bg-gray-100', icon: '📋' },
//   { id: 'inProgress', title: 'In Progress', color: 'bg-blue-100', icon: '⚡' },
//   { id: 'done', title: 'Done', color: 'bg-green-100', icon: '✅' }
// ];
// Why this is smart:

// Single source of truth for column data

// Easy to add new columns

// Consistent styling

// 2. Rendering Columns Dynamically
// jsx
// {columns.map(column => (
//   <div key={column.id}>
//     <h2>{column.title}</h2>
//     {tasks[column.id].map(task => (  // Show tasks for this column
//       <TaskCard key={task.id} task={task} />
//     ))}
//   </div>
// ))}
// Benefits:

// No duplicate code for each column

// Adding new columns is easy

// Consistent behavior

// 3. Priority System
// jsx
// const priorityColors = {
//   high: 'bg-red-100 text-red-700',
//   medium: 'bg-yellow-100 text-yellow-700', 
//   low: 'bg-green-100 text-green-700'
// };
// Usage: className={priorityColors[task.priority]}

// 🎯 Navigation Buttons Logic
// Movement Rules:
// jsx
// // In To Do column: Can only move → to In Progress
// {column.id !== 'done' && (
//   <button onClick={() => moveTask(task.id, column.id, 'inProgress')}>
//     →
//   </button>
// )}

// // In In Progress column: Can move ← to To Do OR → to Done  
// {column.id !== 'todo' && (← button)}
// {column.id !== 'done' && (→ button)}

// // In Done column: Can only move ← to In Progress
// {column.id !== 'todo' && (← button)}
// Smart conditional rendering shows only relevant movement options.

// 🔧 Add Task Modal System
// State for Modal:
// jsx
// const [showAddTask, setShowAddTask] = useState(false);        // Modal visibility
// const [newTaskText, setNewTaskText] = useState('');           // Task description
// const [newTaskColumn, setNewTaskColumn] = useState('todo');   // Which column
// const [newTaskPriority, setNewTaskPriority] = useState('medium'); // Priority
// Modal Flow:
// User clicks "Add Task" → setShowAddTask(true)

// User fills form → Updates state variables

// User clicks "Add" → addTask() creates task and closes modal

// User clicks "Cancel" → setShowAddTask(false) without saving

// 💡 Key React Patterns Demonstrated
// 1. Immutability in State Updates
// jsx
// // ✅ GOOD - Create new arrays/objects
// setTasks(prev => ({
//   ...prev,
//   [column]: [...prev[column], newTask]  // New array
// }));

// // ❌ BAD - Modifying existing array
// prev[column].push(newTask)  // DON'T DO THIS!
// 2. Functional Updates
// jsx
// // ✅ GOOD - When new state depends on old state
// setTasks(prev => {
//   // Use prev state to calculate new state
//   return updatedTasks;
// });

// // ❌ RISKY - Using current state directly
// setTasks({
//   ...tasks,  // Might be stale
//   [column]: [...tasks[column], newTask]
// });
// 3. Conditional Rendering
// jsx
// {showAddTask && <Modal />}                    // Show modal conditionally
// {tasks[column.id].length === 0 && <EmptyState />} // Show when no tasks
// {column.id !== 'todo' && <BackButton />}      // Conditional buttons
// 4. Array Methods for Data Manipulation
// jsx
// .filter()  // Remove items (delete task)
// .find()    // Find specific item
// .map()     // Transform arrays (render lists)
// 🔄 Data Flow Summary
// User adds task → addTask() → Updates tasks state → UI re-renders

// User moves task → moveTask() → Updates tasks state → UI re-renders

// User deletes task → deleteTask() → Updates tasks state → UI re-renders

// User opens modal → setShowAddTask(true) → Modal appears

// 🎯 Real-World Analogies
// State = The physical whiteboard with all sticky notes

// setTasks = Someone rearranging/moving sticky notes

// Components = Different sections of the whiteboard

// Props = Instructions like "show these tasks in this column"

// Events = Team members moving notes between columns

// This app perfectly demonstrates how React manages dynamic data and user interactions in a way that feels natural and intuitive - just like using a physical task board!

// The key insight: React automatically handles the UI updates whenever your data (state) changes. You just describe what you want it to look like, and React makes it happen!

import { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';

const TaskManagerApp = ({ onBackToHome }) => {
  const [tasks, setTasks] = useState({
    todo: [
      { id: 1, text: 'Design new landing page', priority: 'high', createdAt: new Date() },
      { id: 2, text: 'Review pull requests', priority: 'medium', createdAt: new Date() }
    ],
    inProgress: [
      { id: 3, text: 'Build authentication system', priority: 'high', createdAt: new Date() }
    ],
    done: [
      { id: 4, text: 'Setup project repository', priority: 'low', createdAt: new Date() }
    ]
  });

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskColumn, setNewTaskColumn] = useState('todo');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [showAddTask, setShowAddTask] = useState(false);

  const moveTask = (taskId, fromColumn, toColumn) => {
    setTasks(prev => {
      const task = prev[fromColumn].find(t => t.id === taskId);
      const newFromColumn = prev[fromColumn].filter(t => t.id !== taskId);
      const newToColumn = [...prev[toColumn], {...task, status: toColumn}];
      
      return {
        ...prev,
        [fromColumn]: newFromColumn,
        [toColumn]: newToColumn
      };
    });
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    
    const newTask = {
      id: Date.now(),
      text: newTaskText,
      priority: newTaskPriority,
      status: newTaskColumn,
      createdAt: new Date()
    };
    
    setTasks(prev => ({
      ...prev,
      [newTaskColumn]: [...prev[newTaskColumn], newTask]
    }));

    setNewTaskText('');
    setShowAddTask(false);
  };

  const deleteTask = (taskId, column) => {
    setTasks(prev => ({
      ...prev,
      [column]: prev[column].filter(t => t.id !== taskId)
    }));
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100', icon: '📋' },
    { id: 'inProgress', title: 'In Progress', color: 'bg-blue-100', icon: '⚡' },
    { id: 'done', title: 'Done', color: 'bg-green-100', icon: '✅' }
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    low: 'bg-green-100 text-green-700 border-green-300'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBackToHome}
              className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Projects</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">📝 Task Manager</h1>
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            + Add Task
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => (
            <div key={column.id} className="flex flex-col">
              <div className={`${column.color} rounded-t-lg p-4 border-b-4 border-gray-300`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <span>{column.icon}</span>
                    {column.title}
                  </h2>
                  <span className="bg-white px-2 py-1 rounded-full text-sm font-semibold">
                    {tasks[column.id].length}
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-b-lg p-4 min-h-96 space-y-3">
                {tasks[column.id].map(task => (
                  <div
                    key={task.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-move"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium text-gray-800 flex-1">
                        {task.text}
                      </p>
                      <button
                        onClick={() => deleteTask(task.id, column.id)}
                        className="text-gray-400 hover:text-red-600 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                      
                      <div className="flex gap-1">
                        {column.id !== 'todo' && (
                          <button
                            onClick={() => moveTask(task.id, column.id, column.id === 'inProgress' ? 'todo' : 'inProgress')}
                            className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                          >
                            ←
                          </button>
                        )}
                        {column.id !== 'done' && (
                          <button
                            onClick={() => moveTask(task.id, column.id, column.id === 'todo' ? 'inProgress' : 'done')}
                            className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {tasks[column.id].length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <p>No tasks yet</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Task</h3>
              <button onClick={() => setShowAddTask(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Task Description</label>
                <textarea
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Enter task description..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Column</label>
                <select
                  value={newTaskColumn}
                  onChange={(e) => setNewTaskColumn(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="todo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagerApp;